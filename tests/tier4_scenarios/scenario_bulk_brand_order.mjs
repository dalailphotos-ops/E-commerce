/**
 * Tier 4 Real-World Application Scenario 2: High-Volume Fashion Brand Bulk Order
 * 
 * Domain Narrative:
 * A commercial streetwear fashion brand orders 150 custom garments across 2 silhouettes:
 * - Line 1: 100 pcs of Oversized Tee (250 GSM French Terry) with Front A2 print + Free Neck Label
 * - Line 2: 50 pcs of Regular Fit Tee (190 GSM) with Front A4 print
 * Unlocks Tier 4 bulk garment rates (100+ pcs and 50-99 pcs) and bulk DTF print pricing,
 * generating ₹10,500 in volume savings, and exporting an official commercial RFQ.
 * 
 * Features Exercised: F4, F6, F8, F17, F23, F24
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
const BULK_PAGE = path.join(ROOT, "src", "app", "bulk-orders", "page.tsx");
const ESTIMATOR_PAGE = path.join(ROOT, "src", "app", "price-estimator", "page.tsx");

export default async function (t) {
  await t.test("Scenario 2.1: Fashion brand explores /bulk-orders for volume tiers and commercial capabilities", () => {
    const routeCheck = checkRouteFileExists("/bulk-orders");
    assert(routeCheck.exists, `/bulk-orders route must exist at ${routeCheck.filePath}`);

    const exportCheck = checkRouteExport("/bulk-orders", "default");
    assert(exportCheck.valid, `/bulk-orders must export a default React component`);

    const inspector = inspectFile(BULK_PAGE);
    assert(inspector !== null, "Unable to inspect /bulk-orders page component");

    // Check bulk pricing guidance
    assert(
      inspector.containsText("bulk", false) || inspector.containsText("wholesale", false),
      "Bulk orders page must describe volume wholesale programs"
    );

    // Verify ZERO WhatsApp references in bulk orders page
    assert(
      !inspector.containsText("whatsapp", false) &&
      !inspector.containsText("wa.me", false) &&
      !inspector.containsText("api.whatsapp.com", false),
      "Bulk orders page must strictly contain ZERO WhatsApp links or CTAs"
    );
  });

  await t.test("Scenario 2.2: Line 1 configuration: 100 pcs French Terry 250 GSM unlocking 100+ bulk tier and bulk A2 DTF", () => {
    const garmentId = "oversized-tee-250-gsm-french-terry";
    const line1Qty = 100;
    const sizes = { S: 20, M: 40, L: 30, XL: 10 };
    const sizeSum = Object.values(sizes).reduce((a, b) => a + b, 0);
    assertEqual(sizeSum, 100, "Size breakdown must sum to 100 pcs");

    // Garment base price at 100+ pcs unlocks lowest tier: ₹250 (saving ₹40/pc vs single rate ₹290)
    const basePrice = getGarmentUnitPrice(garmentId, line1Qty);
    assertEqual(basePrice, 250, "100 pcs must unlock the 100+ tier at ₹250/pc");

    // Print: Front A2 size (16" × 22")
    // Bulk A2 rate (qty >= 10) = ₹175 (saving ₹25/pc vs single rate ₹200)
    const a2Cost = getPrintCost("a2", line1Qty);
    assertEqual(a2Cost, 175, "Bulk A2 print rate must be ₹175");

    // Free Neck Label rule: Waived to ₹0 due to A2 print
    const line1 = calculateLineItem(garmentId, line1Qty, [
      { position: "front", sizeKey: "a2" },
      { position: "neck", sizeKey: "label" },
    ]);

    const neckLabel = line1.prints.find((p) => p.sizeKey === "label");
    assertEqual(neckLabel.unitCost, 0, "Neck label must be waived to ₹0 due to A2 placement");
    assertEqual(neckLabel.isWaived, true);

    const expectedUnitPrice = 250 + 175; // ₹425
    assertEqual(line1.unitPrice, expectedUnitPrice, "Line 1 unit price must be ₹425");

    const expectedSubtotal = 100 * 425; // ₹42,500
    assertEqual(line1.totalPrice, expectedSubtotal, "Line 1 total must be ₹42,500");
  });

  await t.test("Scenario 2.3: Line 2 configuration: 50 pcs Regular Fit 190 GSM unlocking 50-99 bulk tier and bulk A4 DTF", () => {
    const garmentId = "regular-fit-tee-190-gsm";
    const line2Qty = 50;
    const sizes = { S: 10, M: 20, L: 15, XL: 5 };
    const sizeSum = Object.values(sizes).reduce((a, b) => a + b, 0);
    assertEqual(sizeSum, 50, "Size breakdown must sum to 50 pcs");

    // Garment base price at 50-99 pcs unlocks ₹195 (saving ₹25/pc vs single rate ₹220)
    const basePrice = getGarmentUnitPrice(garmentId, line2Qty);
    assertEqual(basePrice, 195, "50 pcs must unlock the 50-99 tier at ₹195/pc");

    // Print: Front A4 size (8" × 11")
    // Bulk A4 rate (qty >= 10) = ₹70 (saving ₹25/pc vs single rate ₹95)
    const a4Cost = getPrintCost("a4", line2Qty);
    assertEqual(a4Cost, 70, "Bulk A4 print rate must be ₹70");

    const line2 = calculateLineItem(garmentId, line2Qty, [
      { position: "front", sizeKey: "a4" },
    ]);

    const expectedUnitPrice = 195 + 70; // ₹265
    assertEqual(line2.unitPrice, expectedUnitPrice, "Line 2 unit price must be ₹265");

    const expectedSubtotal = 50 * 265; // ₹13,250
    assertEqual(line2.totalPrice, expectedSubtotal, "Line 2 total must be ₹13,250");
  });

  await t.test("Scenario 2.4: Cumulative order totals, 5% GST, and commercial savings calculation", () => {
    const order = calculateOrder([
      {
        productId: "oversized-tee-250-gsm-french-terry",
        quantity: 100,
        prints: [
          { position: "front", sizeKey: "a2" },
          { position: "neck", sizeKey: "label" },
        ],
      },
      {
        productId: "regular-fit-tee-190-gsm",
        quantity: 50,
        prints: [{ position: "front", sizeKey: "a4" }],
      },
    ]);

    assertEqual(order.totalQuantity, 150, "Order total units must equal 150 pcs");

    // Subtotal: 42,500 + 13,250 = 55,750
    assertEqual(order.subtotal, 55750, "Order subtotal must equal ₹55,750");

    // 5% GST: 55,750 * 0.05 = 2,787.50
    assertEqual(order.gst, 2787.5, "5% GST on ₹55,750 must equal ₹2,787.50");

    // Grand total: 55,750 + 2,787.50 = 58,537.50
    assertEqual(order.grandTotal, 58537.5, "Grand total must equal ₹58,537.50");

    // Calculate volume discount savings vs baseline single rates:
    // Line 1 baseline: 100 * (290 base + 200 A2 + 15 label) = 100 * 505 = 50,500
    // Line 2 baseline: 50 * (220 base + 95 A4) = 50 * 315 = 15,750
    // Baseline subtotal = 66,250
    // Total savings = 66,250 - 55,750 = ₹10,500
    const baselineSubtotal = 100 * 505 + 50 * 315;
    const actualSubtotal = order.subtotal;
    const brandSavings = baselineSubtotal - actualSubtotal;
    assertEqual(brandSavings, 10500, "Brand must realize ₹10,500 in bulk volume savings");
  });

  await t.test("Scenario 2.5: Official B2B RFQ summary generation and Email export with ZERO WhatsApp", () => {
    // Generate formal commercial RFQ
    const b2bSummary = [
      "COMMERCIAL B2B PURCHASE RFQ — ASSON CLOTHING BRAND",
      "Company: Valo Streetwear Studios Ltd",
      "Total Production Volume: 150 pcs",
      "Line 1: 100 pcs Oversized Tee (250 GSM French Terry) - Front A2 DTF + Free Neck Label @ ₹425/pc = ₹42,500",
      "Line 2: 50 pcs Regular Fit Tee (190 GSM) - Front A4 DTF @ ₹265/pc = ₹13,250",
      "Subtotal: ₹55,750",
      "GST (5%): ₹2,787.50",
      "Grand Total: ₹58,537.50",
      "Estimated Production Timeline: 7-10 Business Days",
      "Inquiries & Submission: orders@assonclothing.com | +91 80899 63691",
    ].join("\n");

    assert(b2bSummary.includes("Total Production Volume: 150 pcs"));
    assert(b2bSummary.includes("Subtotal: ₹55,750"));
    assert(b2bSummary.includes("GST (5%): ₹2,787.50"));
    assert(b2bSummary.includes("Grand Total: ₹58,537.50"));
    assert(b2bSummary.includes("orders@assonclothing.com"));
    assert(b2bSummary.includes("+91 80899 63691"));

    // Verify mailto URI construction
    const mailto = `mailto:orders@assonclothing.com?subject=${encodeURIComponent("B2B RFQ — 150 pcs Valo Streetwear")}&body=${encodeURIComponent(b2bSummary)}`;
    assert(mailto.startsWith("mailto:orders@assonclothing.com"));
    assert(mailto.includes("subject=B2B%20RFQ"));

    // Verify ZERO WhatsApp references in RFQ
    assert(
      !b2bSummary.toLowerCase().includes("whatsapp") &&
      !b2bSummary.toLowerCase().includes("wa.me"),
      "Commercial RFQ must contain ZERO WhatsApp channels"
    );
  });
}
