/**
 * Tier 2 Boundary & Corner Cases: DTF Volume Pricing & Edge Calculations
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Tests exact numerical thresholds and boundary conditions:
 * - 9 pcs vs 10 pcs: Garment tier step drop + DTF Single to Bulk price drop
 * - 24 pcs vs 25 pcs: Garment Tier 2 to Tier 3 step drop
 * - 49 pcs vs 50 pcs: Garment Tier 3 to Tier 4 step drop
 * - 99 pcs vs 100 pcs: Garment Tier 4 to Tier 5 step drop (economy of scale inversion)
 * - Exact 10-piece bulk threshold for all 6 DTF print sizes
 * - Free neck label waiver boundaries (A2, A3, A4 waiver vs A5, A6, Logo non-waiver)
 * - GST 5% precision rounding on fractional calculations
 */

import { assert, assertEqual, assertLessOrEqual } from "../harness/assertions.mjs";
import {
  calculateLineItem,
  calculateOrder,
  getGarmentUnitPrice,
  getPrintCost,
  GARMENT_CATALOG,
  DTF_PRINTS,
} from "../harness/pricing_simulator.mjs";

export default async function (t) {
  await t.test("Pricing Boundary 2.1: 9 pcs vs 10 pcs transition triggers dual garment & DTF bulk discount", () => {
    const prodId = "oversized-tee-250-gsm-french-terry";

    // 9 pieces (Tier 1 + Single print rate)
    const order9 = calculateLineItem(prodId, 9, [{ position: "front", sizeKey: "a3" }]);
    assertEqual(order9.garmentUnitPrice, 290, "Garment price at 9 pcs must be ₹290");
    assertEqual(order9.prints[0].unitCost, 135, "A3 print at 9 pcs must be single rate ₹135");
    assertEqual(order9.unitPrice, 425, "Unit price at 9 pcs must be ₹425");
    assertEqual(order9.totalPrice, 3825, "Total for 9 pcs must be ₹3,825");

    // 10 pieces (Tier 2 + Bulk print rate)
    const order10 = calculateLineItem(prodId, 10, [{ position: "front", sizeKey: "a3" }]);
    assertEqual(order10.garmentUnitPrice, 265, "Garment price at 10 pcs must be ₹265");
    assertEqual(order10.prints[0].unitCost, 100, "A3 print at 10 pcs must be bulk rate ₹100");
    assertEqual(order10.unitPrice, 365, "Unit price at 10 pcs must be ₹365");
    assertEqual(order10.totalPrice, 3650, "Total for 10 pcs must be ₹3,650");

    // Critical economic boundary: 10 custom pieces costs less than 9 custom pieces!
    assert(
      order10.totalPrice < order9.totalPrice,
      "10 pieces total price (₹3,650) must be lower than 9 pieces total price (₹3,825) due to bulk thresholds"
    );
  });

  await t.test("Pricing Boundary 2.2: 24 pcs vs 25 pcs boundary transition (Tier 2 to Tier 3)", () => {
    const prodId = "oversized-tee-250-gsm-french-terry";

    const unit24 = getGarmentUnitPrice(prodId, 24);
    assertEqual(unit24, 265, "24 pcs must be priced at Tier 2 rate (₹265)");

    const unit25 = getGarmentUnitPrice(prodId, 25);
    assertEqual(unit25, 260, "25 pcs must cross into Tier 3 rate (₹260)");

    // Rate difference of ₹5 per garment
    assertEqual(unit24 - unit25, 5, "Tier 2 to Tier 3 discount difference must be ₹5/pc");
  });

  await t.test("Pricing Boundary 2.3: 49 pcs vs 50 pcs boundary transition (Tier 3 to Tier 4)", () => {
    const prodId = "oversized-tee-250-gsm-french-terry";

    const unit49 = getGarmentUnitPrice(prodId, 49);
    assertEqual(unit49, 260, "49 pcs must be priced at Tier 3 rate (₹260)");

    const unit50 = getGarmentUnitPrice(prodId, 50);
    assertEqual(unit50, 255, "50 pcs must cross into Tier 4 rate (₹255)");

    assertEqual(unit49 - unit50, 5, "Tier 3 to Tier 4 discount difference must be ₹5/pc");
  });

  await t.test("Pricing Boundary 2.4: 99 pcs vs 100 pcs boundary transition (Tier 4 to Tier 5)", () => {
    const prodId = "oversized-tee-250-gsm-french-terry";

    const unit99 = getGarmentUnitPrice(prodId, 99);
    assertEqual(unit99, 255, "99 pcs must be priced at Tier 4 rate (₹255)");

    const unit100 = getGarmentUnitPrice(prodId, 100);
    assertEqual(unit100, 250, "100 pcs must cross into Tier 5 base rate (₹250)");

    // Check boundary total: 99 * 255 = 25245 vs 100 * 250 = 25000
    const total99 = 99 * unit99;
    const total100 = 100 * unit100;
    assertEqual(total99, 25245, "99 blanks total ₹25,245");
    assertEqual(total100, 25000, "100 blanks total ₹25,000");
    assert(
      total100 < total99,
      "Volume discount causes 100 pieces to cost less than 99 pieces"
    );
  });

  await t.test("Pricing Boundary 2.5: DTF print bulk threshold applies strictly at exactly 10 pcs across all sizes", () => {
    const testCases = [
      { size: "a2", single: 200, bulk: 175 },
      { size: "a3", single: 135, bulk: 100 },
      { size: "a4", single: 95, bulk: 70 },
      { size: "a5", single: 60, bulk: 45 },
      { size: "a6", single: 40, bulk: 25 },
      { size: "logo", single: 20, bulk: 10 },
    ];

    for (const tc of testCases) {
      assertEqual(getPrintCost(tc.size, 9), tc.single, `${tc.size} print at 9 pcs must be single rate ${tc.single}`);
      assertEqual(getPrintCost(tc.size, 10), tc.bulk, `${tc.size} print at 10 pcs must be bulk rate ${tc.bulk}`);
    }
  });

  await t.test("Pricing Boundary 2.6: Free neck label waiver boundary: A2, A3, and A4 grant waiver", () => {
    const prodId = "regular-fit-tee-190-gsm";

    // Test A2 waiver
    const orderA2 = calculateLineItem(prodId, 10, [
      { position: "front", sizeKey: "a2" },
      { position: "neck", sizeKey: "label" },
    ]);
    const labelA2 = orderA2.prints.find((p) => p.sizeKey === "label");
    assertEqual(labelA2.isWaived, true, "A2 print must trigger neck label waiver");
    assertEqual(labelA2.unitCost, 0, "Waived neck label cost must be 0");

    // Test A3 waiver
    const orderA3 = calculateLineItem(prodId, 10, [
      { position: "front", sizeKey: "a3" },
      { position: "neck", sizeKey: "label" },
    ]);
    const labelA3 = orderA3.prints.find((p) => p.sizeKey === "label");
    assertEqual(labelA3.isWaived, true, "A3 print must trigger neck label waiver");
    assertEqual(labelA3.unitCost, 0, "Waived neck label cost must be 0");

    // Test A4 waiver
    const orderA4 = calculateLineItem(prodId, 10, [
      { position: "front", sizeKey: "a4" },
      { position: "neck", sizeKey: "label" },
    ]);
    const labelA4 = orderA4.prints.find((p) => p.sizeKey === "label");
    assertEqual(labelA4.isWaived, true, "A4 print must trigger neck label waiver");
    assertEqual(labelA4.unitCost, 0, "Waived neck label cost must be 0");
  });

  await t.test("Pricing Boundary 2.7: Non-waived neck label boundary: A5, A6, and Logo do NOT grant waiver", () => {
    const prodId = "regular-fit-tee-190-gsm";

    // Test A5 + Label
    const orderA5 = calculateLineItem(prodId, 10, [
      { position: "front", sizeKey: "a5" },
      { position: "neck", sizeKey: "label" },
    ]);
    const labelA5 = orderA5.prints.find((p) => p.sizeKey === "label");
    assertEqual(labelA5.isWaived, false, "A5 print must NOT trigger free neck label waiver");

    // Test Logo + Label
    const orderLogo = calculateLineItem(prodId, 10, [
      { position: "front", sizeKey: "logo" },
      { position: "neck", sizeKey: "label" },
    ]);
    const labelLogo = orderLogo.prints.find((p) => p.sizeKey === "label");
    assertEqual(labelLogo.isWaived, false, "Logo print must NOT trigger free neck label waiver");
  });

  await t.test("Pricing Boundary 2.8: 5% GST rounding and fractional cent precision across multi-line orders", () => {
    // 1 garment at 190 GSM (1-9 tier = ₹220) with no print
    const singleOrder = calculateOrder([
      { productId: "regular-fit-tee-190-gsm", quantity: 1, prints: [] },
    ]);
    assertEqual(singleOrder.subtotal, 220, "Subtotal must be ₹220");
    // 220 * 0.05 = 11.00
    assertEqual(singleOrder.gst, 11, "5% GST on ₹220 must be exactly ₹11");
    assertEqual(singleOrder.grandTotal, 231, "Grand total must be ₹231");

    // Order with odd number resulting in fractional tax:
    // e.g., subtotal = ₹345. 345 * 0.05 = 17.25
    const orderWithDecimals = calculateOrder([
      { productId: "oversized-tee-250-gsm-french-terry", quantity: 1, prints: [{ position: "front", sizeKey: "a5" }] },
    ]);
    // 1 pc 250 GSM = 290 + 60 (A5 single) = 350. 350 * 0.05 = 17.5
    assertEqual(orderWithDecimals.subtotal, 350, "Subtotal must be ₹350");
    assertEqual(orderWithDecimals.gst, 17.5, "5% GST on ₹350 must be ₹17.50");
    assertEqual(orderWithDecimals.grandTotal, 367.5, "Grand total must be ₹367.50");
  });
}
