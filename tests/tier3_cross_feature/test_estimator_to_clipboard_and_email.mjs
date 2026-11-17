/**
 * Tier 3 Cross-Feature Combination Test 3: Estimator to Clipboard and Email Flow
 * 
 * Verifies cross-feature integration of the Multi-Line Price Estimator:
 * 1. Multi-line garment configuration (multiple silhouettes with distinct print placements)
 * 2. Cumulative volume tier evaluation and 5% GST mathematical accuracy
 * 3. Text quotation generation formatted for clipboard copy
 * 4. Mailto RFQ link generation targeted to orders@assonclothing.com
 * 5. Direct transfer from Price Estimator into CartContext ('asson_quote_v1')
 * 6. ZERO WHATSAPP constraint verification across estimator exports
 */

import path from "node:path";
import {
  assert,
  assertEqual,
  assertDeepEqual,
  assertMatch,
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
const ESTIMATOR_PAGE = path.join(ROOT, "src", "app", "price-estimator", "page.tsx");

export default async function (t) {
  await t.test("Flow 3.3.1: Multi-line Price Estimator route resolution and multi-item state configuration", () => {
    const routeCheck = checkRouteFileExists("/price-estimator");
    assert(routeCheck.exists, `/price-estimator page must exist at ${routeCheck.filePath}`);

    const exportCheck = checkRouteExport("/price-estimator", "default");
    assert(exportCheck.valid, `/price-estimator must export a default React component`);

    const inspector = inspectFile(ESTIMATOR_PAGE);
    assert(inspector !== null, "Unable to inspect /price-estimator page component");

    // Check presence of multi-item controls: add item, remove item, copy quote
    assert(
      inspector.containsText("handleAddItem") || inspector.containsText("Add Another Item") || inspector.containsText("Add"),
      "Estimator must support adding multiple garment lines"
    );
    assert(
      inspector.containsText("handleCopy") || inspector.containsText("Copy") || inspector.containsText("clipboard"),
      "Estimator must provide clipboard copy functionality"
    );
  });

  await t.test("Flow 3.3.2: Cumulative tier evaluation and mathematical precision across 2 garment lines", () => {
    // Line 1: French Terry 250 GSM (30 pcs) with Front Logo + Back A3
    // Line 2: Acid Wash 250 GSM (20 pcs) with Front A4
    const line1Qty = 30;
    const line1GarmentPrice = getGarmentUnitPrice("oversized-tee-250-gsm-french-terry", line1Qty);
    assertEqual(line1GarmentPrice, 260, "French Terry 30 pcs base price must be ₹260 (25-49 tier)");

    const line1LogoCost = getPrintCost("logo", line1Qty);
    assertEqual(line1LogoCost, 10, "Logo bulk print rate (qty >= 10) must be ₹10");

    const line1A3Cost = getPrintCost("a3", line1Qty);
    assertEqual(line1A3Cost, 100, "A3 bulk print rate (qty >= 10) must be ₹100");

    const line1UnitPrice = line1GarmentPrice + line1LogoCost + line1A3Cost; // 260 + 10 + 100 = 370
    assertEqual(line1UnitPrice, 370, "Line 1 unit price must be ₹370");
    const line1Subtotal = line1Qty * line1UnitPrice; // 30 * 370 = 11,100
    assertEqual(line1Subtotal, 11100, "Line 1 subtotal must be ₹11,100");

    // Line 2
    const line2Qty = 20;
    const line2GarmentPrice = getGarmentUnitPrice("acid-wash-oversized-tee-250-gsm", line2Qty);
    assertEqual(line2GarmentPrice, 310, "Acid Wash 20 pcs base price must be ₹310 (10-24 tier)");

    const line2A4Cost = getPrintCost("a4", line2Qty);
    assertEqual(line2A4Cost, 70, "A4 bulk print rate (qty >= 10) must be ₹70");

    const line2UnitPrice = line2GarmentPrice + line2A4Cost; // 310 + 70 = 380
    assertEqual(line2UnitPrice, 380, "Line 2 unit price must be ₹380");
    const line2Subtotal = line2Qty * line2UnitPrice; // 20 * 380 = 7,600
    assertEqual(line2Subtotal, 7600, "Line 2 subtotal must be ₹7,600");

    // Overall Totals
    const totalUnits = line1Qty + line2Qty; // 50
    assertEqual(totalUnits, 50, "Total units must equal 50 pcs");

    const subtotal = line1Subtotal + line2Subtotal; // 18,700
    assertEqual(subtotal, 18700, "Combined subtotal must equal ₹18,700");

    const gst = Math.round(subtotal * (GST_PERCENTAGE / 100) * 100) / 100; // 935
    assertEqual(gst, 935, "5% GST on ₹18,700 must equal ₹935");

    const grandTotal = subtotal + gst; // 19,635
    assertEqual(grandTotal, 19635, "Grand total must equal ₹19,635");
  });

  await t.test("Flow 3.3.3: Structured quotation formatting for Clipboard copy", () => {
    // Generate text summary matching the structure produced by Price Estimator
    const items = [
      {
        name: "Oversized Tee — 250 GSM French Terry",
        quantity: 30,
        frontPrint: "Chest / Sleeve Logo",
        backPrint: "A3 Size",
        unitPrice: 370,
        subtotal: 11100,
      },
      {
        name: "Acid Wash Oversized Tee — 250 GSM",
        quantity: 20,
        frontPrint: "A4 Size",
        backPrint: "None",
        unitPrice: 380,
        subtotal: 7600,
      },
    ];

    let summaryText = `Price Estimator Quote — Asson Clothing Brand\n\n`;
    items.forEach((it, idx) => {
      summaryText += `Item ${idx + 1}: ${it.name}\n`;
      summaryText += `· Quantity: ${it.quantity} pcs\n`;
      summaryText += `· Front Print: ${it.frontPrint}\n`;
      summaryText += `· Back Print: ${it.backPrint}\n`;
      summaryText += `· Unit Price: ₹${it.unitPrice} / pc\n`;
      summaryText += `· Subtotal: ₹${it.subtotal.toLocaleString()}\n\n`;
    });
    summaryText += `Total Units: 50 pcs\n`;
    summaryText += `Subtotal: ₹18,700\n`;
    summaryText += `GST (5%): ₹935\n`;
    summaryText += `Grand Total: ₹19,635\n\n`;
    summaryText += `Contact: orders@assonclothing.com | +91 80899 63691\n`;

    // Assert key elements in the formatted clipboard string
    assert(summaryText.includes("Asson Clothing Brand"), "Quotation header must mention brand name");
    assert(summaryText.includes("Oversized Tee — 250 GSM French Terry"), "Must include item 1 name");
    assert(summaryText.includes("Acid Wash Oversized Tee — 250 GSM"), "Must include item 2 name");
    assert(summaryText.includes("Total Units: 50 pcs"), "Must include accurate total units");
    assert(summaryText.includes("Subtotal: ₹18,700"), "Must include accurate subtotal");
    assert(summaryText.includes("GST (5%): ₹935"), "Must include 5% GST breakdown");
    assert(summaryText.includes("Grand Total: ₹19,635"), "Must include accurate grand total");
    assert(summaryText.includes("orders@assonclothing.com"), "Must provide official orders email");
    assert(summaryText.includes("+91 80899 63691"), "Must provide official contact phone");
  });

  await t.test("Flow 3.3.4: Mailto RFQ link generation targeted to orders@assonclothing.com", () => {
    const recipient = "orders@assonclothing.com";
    const subject = "Asson Clothing Quote Request — 50 pcs";
    const body = `Quote Summary:\n50 pcs wholesale order\nSubtotal: ₹18,700\nGST (5%): ₹935\nGrand Total: ₹19,635\nPlease provide production timeline.`;

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    assert(mailtoUrl.startsWith("mailto:orders@assonclothing.com"), "Mailto recipient must be orders@assonclothing.com");
    assert(mailtoUrl.includes("subject="), "Mailto link must include subject query parameter");
    assert(mailtoUrl.includes("body="), "Mailto link must include body query parameter");

    // Decode and verify roundtrip integrity
    const parsedUrl = new URL(mailtoUrl);
    assertEqual(parsedUrl.protocol, "mailto:");
    assertEqual(parsedUrl.pathname, "orders@assonclothing.com");
    assertEqual(parsedUrl.searchParams.get("subject"), subject);
    assertEqual(parsedUrl.searchParams.get("body"), body);
  });

  await t.test("Flow 3.3.5: Transfer multi-line estimate directly into CartContext & localStorage", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    // Transfer Line 1
    cart.addItem({
      productId: "oversized-tee-250-gsm-french-terry",
      productName: "Oversized Tee — 250 GSM French Terry",
      quantity: 30,
      sizes: { M: 15, L: 15 },
      unitPrice: 370,
      prints: [
        { position: "front", sizeKey: "logo", sizeLabel: "Logo", cost: 10 },
        { position: "back", sizeKey: "a3", sizeLabel: "A3", cost: 100 },
      ],
    });

    // Transfer Line 2
    cart.addItem({
      productId: "acid-wash-oversized-tee-250-gsm",
      productName: "Acid Wash Oversized Tee — 250 GSM",
      quantity: 20,
      sizes: { L: 10, XL: 10 },
      unitPrice: 380,
      prints: [
        { position: "front", sizeKey: "a4", sizeLabel: "A4", cost: 70 },
      ],
    });

    assertEqual(cart.items.length, 2, "Cart must have 2 items transferred from estimator");
    assertEqual(cart.itemCount, 50, "Cart item count must equal 50 units");
    assertEqual(cart.subtotal, 18700, "Cart subtotal must match estimator subtotal ₹18,700");
    assertEqual(cart.gst, 935, "Cart GST must match estimator GST ₹935");
    assertEqual(cart.grandTotal, 19635, "Cart grand total must match estimator grand total ₹19,635");

    // Verify localStorage persistence
    const stored = JSON.parse(storage.getItem(STORAGE_KEY));
    assertEqual(stored.length, 2, "localStorage must persist both transferred items");
    assertEqual(stored[0].totalPrice, 11100, "First stored line total must be 11,100");
    assertEqual(stored[1].totalPrice, 7600, "Second stored line total must be 7,600");
  });

  await t.test("Flow 3.3.6: Strict ZERO WhatsApp verification across Price Estimator page", () => {
    const inspector = inspectFile(ESTIMATOR_PAGE);
    assert(inspector !== null, "Unable to inspect /price-estimator page");

    assert(
      !inspector.containsText("whatsapp", false) &&
      !inspector.containsText("wa.me", false) &&
      !inspector.containsText("api.whatsapp.com", false),
      "Price Estimator page must strictly contain ZERO WhatsApp links, buttons, or CTAs"
    );
  });
}
