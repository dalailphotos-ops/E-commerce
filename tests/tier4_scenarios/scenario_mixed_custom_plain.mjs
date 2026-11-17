/**
 * Tier 4 Real-World Application Scenario 3: Mixed Order of Plain Blanks + Custom DTF Tees
 * 
 * Domain Narrative:
 * A boutique retail shop orders a mixed batch containing both unprinted plain blanks
 * and fully customized DTF printed apparel:
 * - Line 1: 15 pcs of Acid Wash Oversized Tee (250 GSM) as plain blanks (@ 10-24 tier)
 * - Line 2: 10 pcs of Full Sleeve Oversized Tee (250 GSM) with Back A3 print + Right Sleeve Logo (@ 10-24 tier)
 * Tests multi-item cart accumulation, live tier upgrading when modifying quantities,
 * exact 5% GST computation, and conversion via /api/quotes with ZERO WhatsApp.
 * 
 * Features Exercised: F4, F6, F7, F8, F16, F18, F21
 * Strict Constraint: ZERO WhatsApp throughout the workflow
 */

import path from "node:path";
import {
  assert,
  assertEqual,
  assertDeepEqual,
  assertGreaterOrEqual,
} from "../harness/assertions.mjs";
import {
  GARMENT_CATALOG,
  DTF_PRINTS,
  getGarmentUnitPrice,
  getPrintCost,
  calculateLineItem,
  calculateOrder,
  GST_PERCENTAGE,
} from "../harness/pricing_simulator.mjs";
import { CartSimulator, MockLocalStorage, STORAGE_KEY } from "../harness/state_simulator.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";

const ROOT = process.cwd();
const SHOP_PAGE = path.join(ROOT, "src", "app", "shop", "page.tsx");
const DESIGN_PAGE = path.join(ROOT, "src", "app", "design", "page.tsx");
const QUOTE_PAGE = path.join(ROOT, "src", "app", "quote", "page.tsx");

export default async function (t) {
  await t.test("Scenario 3.1: Selection of 15 plain blanks from /shop catalog unlocking 10-24 pcs tier", () => {
    const garmentId = "acid-wash-oversized-tee-250-gsm";
    const qty = 15;
    const sizes = { M: 8, L: 7 };
    const totalSizes = Object.values(sizes).reduce((a, b) => a + b, 0);
    assertEqual(totalSizes, 15, "Size breakdown must sum to 15 pcs");

    // 15 pcs falls into 10-24 tier: ₹310/pc (vs ₹358 for 1-9 pcs)
    const unitPrice = getGarmentUnitPrice(garmentId, qty);
    assertEqual(unitPrice, 310, "15 pcs of Acid Wash must resolve to 10-24 tier at ₹310/pc");

    const lineItem = calculateLineItem(garmentId, qty, []);
    assertEqual(lineItem.garmentUnitPrice, 310);
    assertEqual(lineItem.totalPrintsUnitCost, 0, "Plain blanks have 0 print costs");
    assertEqual(lineItem.unitPrice, 310);
    assertEqual(lineItem.totalPrice, 4650, "Line 1 total: 15 * 310 = ₹4,650");
  });

  await t.test("Scenario 3.2: Configuration of 10 custom full-sleeve tees in /design with Back A3 and Right Sleeve Logo", () => {
    const garmentId = "full-sleeve-oversized-tee-250-gsm";
    const qty = 10;
    const sizes = { L: 6, XL: 4 };
    const totalSizes = Object.values(sizes).reduce((a, b) => a + b, 0);
    assertEqual(totalSizes, 10, "Size breakdown must sum to 10 pcs");

    // 10 pcs falls into 10-24 tier: base ₹350/pc (vs ₹388 for 1-9 pcs)
    const basePrice = getGarmentUnitPrice(garmentId, qty);
    assertEqual(basePrice, 350, "10 pcs of Full Sleeve must resolve to ₹350/pc");

    // DTF bulk prints (qty >= 10):
    // Back A3: bulk rate ₹100
    // Right sleeve logo: bulk rate ₹10
    const a3Bulk = getPrintCost("a3", qty);
    const logoBulk = getPrintCost("logo", qty);
    assertEqual(a3Bulk, 100, "Bulk A3 rate must be ₹100");
    assertEqual(logoBulk, 10, "Bulk sleeve logo rate must be ₹10");

    const lineItem = calculateLineItem(garmentId, qty, [
      { position: "back", sizeKey: "a3" },
      { position: "right", sizeKey: "logo" },
    ]);

    assertEqual(lineItem.totalPrintsUnitCost, 110, "Prints unit cost: 100 + 10 = ₹110");
    assertEqual(lineItem.unitPrice, 460, "Combined unit price: 350 + 110 = ₹460");
    assertEqual(lineItem.totalPrice, 4600, "Line 2 total: 10 * 460 = ₹4,600");
  });

  await t.test("Scenario 3.3: Cart aggregation of mixed order, verifying items count, subtotal, and 5% GST", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    // Add Line 1 (Plain Blanks)
    const item1 = cart.addItem({
      productId: "acid-wash-oversized-tee-250-gsm",
      productName: "Acid Wash Oversized Tee — 250 GSM",
      color: "Charcoal Acid Wash",
      sizes: { M: 8, L: 7 },
      quantity: 15,
      unitPrice: 310,
      prints: [],
    });

    // Add Line 2 (Custom Printed)
    const item2 = cart.addItem({
      productId: "full-sleeve-oversized-tee-250-gsm",
      productName: "Full Sleeve Oversized Tee — 250 GSM",
      color: "Off-White",
      sizes: { L: 6, XL: 4 },
      quantity: 10,
      unitPrice: 460,
      prints: [
        { position: "back", sizeKey: "a3", sizeLabel: "A3 Size", cost: 100 },
        { position: "right", sizeKey: "logo", sizeLabel: "Right Sleeve Logo", cost: 10 },
      ],
    });

    assertEqual(cart.items.length, 2, "Cart must contain 2 line items");
    assertEqual(cart.itemCount, 25, "Total garment count: 15 + 10 = 25");

    // Subtotal: 4,650 + 4,600 = 9,250
    assertEqual(cart.subtotal, 9250, "Subtotal must equal ₹9,250");

    // 5% GST: 9,250 * 0.05 = 462.50
    assertEqual(cart.gst, 462.5, "5% GST must equal ₹462.50");

    // Grand total: 9,250 + 462.50 = 9,712.50
    assertEqual(cart.grandTotal, 9712.5, "Grand total must equal ₹9,712.50");
  });

  await t.test("Scenario 3.4: Order modification triggers dynamic tier upgrade and recalculates totals", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    const item1 = cart.addItem({
      productId: "acid-wash-oversized-tee-250-gsm",
      sizes: { M: 8, L: 7 },
      quantity: 15,
      unitPrice: 310,
    });
    const item2 = cart.addItem({
      productId: "full-sleeve-oversized-tee-250-gsm",
      sizes: { L: 6, XL: 4 },
      quantity: 10,
      unitPrice: 460,
    });

    // Customer upgrades plain blanks quantity from 15 to 25 pcs
    // 25 pcs unlocks 25-49 tier: ₹305/pc (saving ₹5/pc)
    const upgradedTierPrice = getGarmentUnitPrice("acid-wash-oversized-tee-250-gsm", 25);
    assertEqual(upgradedTierPrice, 305, "25 pcs must unlock ₹305 tier");

    cart.updateItem(item1.id, {
      sizes: { M: 15, L: 10 },
      quantity: 25,
      unitPrice: upgradedTierPrice,
    });

    assertEqual(cart.itemCount, 35, "New total count must be 25 + 10 = 35");

    // Line 1: 25 * 305 = 7,625
    // Line 2: 10 * 460 = 4,600
    // Subtotal: 7,625 + 4,600 = 12,225
    assertEqual(cart.subtotal, 12225, "New subtotal must equal ₹12,225");

    // GST (5%): 12,225 * 0.05 = 611.25
    assertEqual(cart.gst, 611.25, "New GST must equal ₹611.25");

    // Grand Total: 12,225 + 611.25 = 12,836.25
    assertEqual(cart.grandTotal, 12836.25, "New grand total must equal ₹12,836.25");
  });

  await t.test("Scenario 3.5: Conversion through /quote and checkout submission with ZERO WhatsApp", () => {
    const quoteRoute = checkRouteFileExists("/quote");
    assert(quoteRoute.exists, "/quote page must exist");

    const inspector = inspectFile(QUOTE_PAGE);
    assert(inspector !== null, "Unable to inspect /quote page");

    // Assert form submission to /api/quotes
    assert(
      inspector.containsText("/api/quotes"),
      "Quote page must submit to /api/quotes"
    );

    // Verify ZERO WhatsApp references in mixed checkout journey
    assert(
      !inspector.containsText("whatsapp", false) &&
      !inspector.containsText("wa.me", false),
      "Checkout flow must contain ZERO WhatsApp channels"
    );
  });
}
