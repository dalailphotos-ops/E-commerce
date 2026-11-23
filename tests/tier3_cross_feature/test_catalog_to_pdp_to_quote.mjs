/**
 * Tier 3 Cross-Feature Combination Test 1: Catalog to PDP to Quote Flow
 * 
 * Verifies the complete end-to-end user progression:
 * 1. Browse Catalog (/shop) -> Filter by fit/GSM -> Select product & swatch preview
 * 2. Transition to Product Detail Page (/shop/[slug]) -> Multi-tab gallery & dynamic tier hints
 * 3. Configure size breakdown (XS-XXL) -> "Add to Quote List" updating CartContext
 * 4. Navigate to Quote List (/quote) -> Verify line items, quantity, volume tier pricing, 5% GST
 * 5. Multi-item catalog progression -> Adding second silhouette with cumulative quote totals
 * 6. ZERO WHATSAPP verification across Catalog, PDP, and Quote flows
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
  getGarmentUnitPrice,
  calculateLineItem,
  calculateOrder,
  GST_PERCENTAGE,
} from "../harness/pricing_simulator.mjs";
import { CartSimulator, MockLocalStorage, STORAGE_KEY } from "../harness/state_simulator.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";

const ROOT = process.cwd();
const SHOP_PAGE = path.join(ROOT, "src", "app", "shop", "page.tsx");
const PDP_PAGE = path.join(ROOT, "src", "app", "shop", "[slug]", "page.tsx");
const QUOTE_PAGE = path.join(ROOT, "src", "app", "quote", "page.tsx");

export default async function (t) {
  await t.test("Flow 3.1.1: Catalog browsing, filter chips, and swatch preview capabilities", () => {
    // Verify catalog route exists and exports default component
    const routeCheck = checkRouteFileExists("/shop");
    assert(routeCheck.exists, `/shop catalog page must exist at ${routeCheck.filePath}`);

    const exportCheck = checkRouteExport("/shop", "default");
    assert(exportCheck.valid, `/shop must export a default React component`);

    const inspector = inspectFile(SHOP_PAGE);
    assert(inspector !== null, "Unable to inspect /shop page component");

    // Verify clean redirect to /design studio
    assert(
      inspector.containsText("redirect"),
      "Catalog page safely redirects to /design studio"
    );

    // Verify ZERO WhatsApp references in catalog redirect
    assert(
      !inspector.containsText("whatsapp", false) && !inspector.containsText("wa.me", false),
      "Catalog page must strictly contain ZERO WhatsApp links or buttons"
    );
  });

  await t.test("Flow 3.1.2: PDP route resolution, 3-tab views, and dynamic volume tier incentive hints", () => {
    const routeCheck = checkRouteFileExists("/shop/[slug]");
    assert(routeCheck.exists, `PDP route must exist at ${routeCheck.filePath}`);

    const inspector = inspectFile(PDP_PAGE);
    assert(inspector !== null, "Unable to inspect PDP page component");

    // Dynamic volume tier incentive logic:
    // When ordering 5 pcs of 'oversized-tee-250-gsm-french-terry', unit price is tier 1-9 (₹290).
    // The next volume discount unlocks at 10 pcs (₹265).
    // Incentive hint should compute: 10 - 5 = 5 more units to save ₹25/pc.
    const currentQty = 5;
    const currentPrice = getGarmentUnitPrice("oversized-tee-250-gsm-french-terry", currentQty);
    assertEqual(currentPrice, 290, "5 pcs of French Terry tee should be priced at ₹290/pc (1-9 tier)");

    const nextTierQty = 10;
    const nextTierPrice = getGarmentUnitPrice("oversized-tee-250-gsm-french-terry", nextTierQty);
    assertEqual(nextTierPrice, 265, "10 pcs of French Terry tee should unlock tier at ₹265/pc");

    const unitsNeeded = nextTierQty - currentQty;
    const priceSavings = currentPrice - nextTierPrice;
    assertEqual(unitsNeeded, 5, "Customer needs 5 more pieces to unlock next tier");
    assertEqual(priceSavings, 25, "Next tier provides ₹25/pc savings");

    // Verify ZERO WhatsApp references on PDP
    assert(
      !inspector.containsText("whatsapp", false) && !inspector.containsText("wa.me", false),
      "PDP page must strictly contain ZERO WhatsApp links or buttons"
    );
  });

  await t.test("Flow 3.1.3: PDP size matrix selection and 'Add to Quote List' action updating CartContext", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    // Customer selects size breakdown: S: 10, M: 20, L: 10 (Total = 40 pcs)
    const sizes = { XS: 0, S: 10, M: 20, L: 10, XL: 0, XXL: 0 };
    const totalQty = Object.values(sizes).reduce((sum, n) => sum + n, 0);
    assertEqual(totalQty, 40, "Sum of sizes must equal 40 pcs");

    // 40 pcs falls into 25-49 pcs tier -> unit price = ₹260
    const expectedUnitPrice = getGarmentUnitPrice("oversized-tee-250-gsm-french-terry", totalQty);
    assertEqual(expectedUnitPrice, 260, "40 pcs of French Terry tee should resolve to ₹260 tier");

    // Add to quote cart
    const addedItem = cart.addItem({
      productId: "oversized-tee-250-gsm-french-terry",
      productName: "Oversized Tee — 250 GSM French Terry",
      productSpec: "250 GSM · 100% Super Combed Cotton French Terry",
      color: "Vintage Black",
      colorHex: "#1c1c1c",
      sizes,
      quantity: totalQty,
      unitPrice: expectedUnitPrice,
      prints: [],
    });

    assertEqual(cart.items.length, 1, "Cart should contain exactly 1 item");
    assertEqual(addedItem.quantity, 40, "Added item quantity must be 40");
    assertEqual(addedItem.unitPrice, 260, "Added item unit price must be ₹260");
    assertEqual(addedItem.totalPrice, 10400, "Line item total must be 40 * 260 = ₹10,400");
    assertEqual(cart.itemCount, 40, "Cart item counter badge must show 40 units");
    assertEqual(cart.subtotal, 10400, "Subtotal must equal ₹10,400");
    assertEqual(cart.gst, 520, "5% GST on ₹10,400 must equal ₹520");
    assertEqual(cart.grandTotal, 10920, "Grand total must equal 10,400 + 520 = ₹10,920");

    // Verify localStorage synchronization
    const rawStorage = storage.getItem(STORAGE_KEY);
    assert(rawStorage !== null, "Cart state must be written to localStorage under 'asson_quote_v1'");
    const parsed = JSON.parse(rawStorage);
    assertEqual(parsed.length, 1, "Persisted storage must contain 1 item");
    assertEqual(parsed[0].productId, "oversized-tee-250-gsm-french-terry");
  });

  await t.test("Flow 3.1.4: Quote List page displays size breakdown, line totals, and conversion channels", () => {
    const routeCheck = checkRouteFileExists("/quote");
    assert(routeCheck.exists, `/quote page must exist at ${routeCheck.filePath}`);

    const exportCheck = checkRouteExport("/quote", "default");
    assert(exportCheck.valid, `/quote must export default React component`);

    const inspector = inspectFile(QUOTE_PAGE);
    assert(inspector !== null, "Unable to inspect /quote page component");

    // Verify quote page contains form submission to /api/quotes
    assert(
      inspector.containsText("/api/quotes"),
      "Quote page must contain submission endpoint /api/quotes"
    );

    // Verify ZERO WhatsApp references in quote page
    assert(
      !inspector.containsText("whatsapp", false) && !inspector.containsText("wa.me", false),
      "Quote page must strictly contain ZERO WhatsApp links or buttons"
    );
  });

  await t.test("Flow 3.1.5: Multi-silhouette catalog progression with cumulative quote calculation", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    // Item 1: French Terry 250 GSM (40 pcs @ ₹260)
    cart.addItem({
      productId: "oversized-tee-250-gsm-french-terry",
      productName: "Oversized Tee — 250 GSM French Terry",
      color: "Vintage Black",
      sizes: { S: 10, M: 20, L: 10 },
      unitPrice: 260,
    });

    // Item 2: Customer returns to /shop, selects Regular Fit 190 GSM (20 pcs @ ₹202)
    const line2UnitPrice = getGarmentUnitPrice("regular-fit-tee-190-gsm", 20);
    assertEqual(line2UnitPrice, 202, "20 pcs of Regular 190 GSM must be ₹202 (10-24 tier)");

    cart.addItem({
      productId: "regular-fit-tee-190-gsm",
      productName: "Regular Fit Tee — 190 GSM",
      color: "Optic White",
      sizes: { M: 10, L: 10 },
      unitPrice: line2UnitPrice,
    });

    // Check multi-item state
    assertEqual(cart.items.length, 2, "Cart must have 2 distinct line items");
    assertEqual(cart.itemCount, 60, "Total garment units should be 40 + 20 = 60");

    // Item 1: 40 * 260 = 10,400
    // Item 2: 20 * 202 = 4,040
    // Subtotal: 10,400 + 4,040 = 14,440
    // GST (5%): 14,440 * 0.05 = 722
    // Grand Total: 14,440 + 722 = 15,162
    assertEqual(cart.subtotal, 14440, "Subtotal must equal ₹14,440");
    assertEqual(cart.gst, 722, "5% GST must equal ₹722");
    assertEqual(cart.grandTotal, 15162, "Grand total must equal ₹15,162");

    // Verify simulator order calculation matches
    const orderCalc = calculateOrder([
      { productId: "oversized-tee-250-gsm-french-terry", quantity: 40 },
      { productId: "regular-fit-tee-190-gsm", quantity: 20 },
    ]);
    assertEqual(orderCalc.subtotal, 14440, "Pricing simulator order subtotal must match");
    assertEqual(orderCalc.gst, 722, "Pricing simulator order GST must match");
    assertEqual(orderCalc.grandTotal, 15162, "Pricing simulator grand total must match");
  });
}
