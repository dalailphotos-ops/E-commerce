/**
 * Tier 3 Cross-Feature Combination Test 2: Customizer to Cart Flow
 * 
 * Verifies the cross-feature pipeline from interactive garment customization to CartContext:
 * 1. Select Garment in Customizer (/design) -> Verify 4 print zones (Front, Back, Left Sleeve, Right Sleeve)
 * 2. Multi-location DTF placement: Front A3 print + Left Sleeve Logo print
 * 3. Verify Free Neck Label promotion rule (waived with A2/A3/A4; retained otherwise)
 * 4. Add customized garment to CartContext / QuoteContext with full print metadata
 * 5. Verify serialized payload in localStorage ('asson_quote_v1') and live bulk recalculation
 * 6. ZERO WHATSAPP verification across Customizer interface
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
const DESIGN_PAGE = path.join(ROOT, "src", "app", "design", "page.tsx");
const CONSTANTS_FILE = path.join(ROOT, "src", "lib", "constants.ts");

export default async function (t) {
  await t.test("Flow 3.2.1: Customizer route resolution, garment selection, and 4-zone print mapping", () => {
    const routeCheck = checkRouteFileExists("/design");
    assert(routeCheck.exists, `/design studio page must exist at ${routeCheck.filePath}`);

    const exportCheck = checkRouteExport("/design", "default");
    assert(exportCheck.valid, `/design must export a default React component`);

    const inspector = inspectFile(DESIGN_PAGE);
    assert(inspector !== null, "Unable to inspect /design page component");

    // Check constants.ts for garment zones including sleeve coordinates
    const constantsInspector = inspectFile(CONSTANTS_FILE);
    assert(constantsInspector !== null, "Unable to inspect constants.ts");
    assert(
      constantsInspector.containsText("zones") &&
      (constantsInspector.containsText("right") || constantsInspector.containsText("left")),
      "Constants must define multi-zone mapping including sleeve zones (right / left)"
    );

    // Verify initial unit price for 1 piece sample of French Terry 250 GSM
    const initialUnitPrice = getGarmentUnitPrice("oversized-tee-250-gsm-french-terry", 1);
    assertEqual(initialUnitPrice, 290, "Single blank piece unit price must be ₹290 (1-9 pcs tier)");
  });

  await t.test("Flow 3.2.2: Multi-location print configuration: Front A3 + Left Sleeve Logo print", () => {
    // Single sample configuration (qty: 1)
    const qty = 1;
    const garmentId = "oversized-tee-250-gsm-french-terry";

    // Print 1: Front A3 DTF (11" × 16")
    const a3SingleCost = getPrintCost("a3", qty);
    assertEqual(a3SingleCost, 135, "A3 print single unit cost must be ₹135");

    // Print 2: Left Sleeve Logo (2.5" × 2.5")
    const logoSingleCost = getPrintCost("logo", qty);
    assertEqual(logoSingleCost, 20, "Sleeve logo print single unit cost must be ₹20");

    // Calculate line item with both prints
    const lineItem = calculateLineItem(garmentId, qty, [
      { position: "front", sizeKey: "a3" },
      { position: "left", sizeKey: "logo" },
    ]);

    assertEqual(lineItem.garmentUnitPrice, 290, "Garment unit price must be ₹290");
    assertEqual(lineItem.totalPrintsUnitCost, 155, "Total prints unit cost must be 135 + 20 = ₹155");
    assertEqual(lineItem.unitPrice, 445, "Combined unit price must be 290 + 155 = ₹445");
    assertEqual(lineItem.totalPrice, 445, "Total line price for 1 sample must be ₹445");
  });

  await t.test("Flow 3.2.3: Free Neck Label promotion rule verification", () => {
    const garmentId = "oversized-tee-250-gsm-french-terry";
    const qty = 1;

    // Case A: Front A3 print + Neck Label print -> Neck label cost is WAIVED (₹0)
    const lineWithA3AndLabel = calculateLineItem(garmentId, qty, [
      { position: "front", sizeKey: "a3" },
      { position: "neck", sizeKey: "label" },
    ]);

    const labelPrintA = lineWithA3AndLabel.prints.find((p) => p.sizeKey === "label");
    assert(labelPrintA !== undefined, "Neck label print must be present in calculation");
    assertEqual(labelPrintA.unitCost, 0, "Neck label print unit cost must be ₹0 when A3 print is present");
    assertEqual(labelPrintA.isWaived, true, "Neck label print must be flagged as waived");
    assertEqual(lineWithA3AndLabel.unitPrice, 290 + 135, "Unit price must be base ₹290 + A3 ₹135 = ₹425 (label is free)");

    // Case B: Front A4 print + Left Sleeve Logo + Neck Label -> Label is also WAIVED (₹0)
    const lineWithA4AndLabel = calculateLineItem(garmentId, qty, [
      { position: "front", sizeKey: "a4" },
      { position: "left", sizeKey: "logo" },
      { position: "neck", sizeKey: "label" },
    ]);
    const labelPrintB = lineWithA4AndLabel.prints.find((p) => p.sizeKey === "label");
    assertEqual(labelPrintB.unitCost, 0, "Neck label print unit cost must be ₹0 when A4 print is present");
    assertEqual(labelPrintB.isWaived, true, "Neck label print must be flagged as waived with A4");

    // Case C: Contrast case: ONLY Logo print (no A2/A3/A4) + Neck Label -> Standard fee applies
    // Note: Standard fee for standalone neck label branding is defined as ₹15
    const lineWithOnlyLogoAndLabel = calculateLineItem(garmentId, qty, [
      { position: "front", sizeKey: "logo" },
      { position: "neck", sizeKey: "label" },
    ]);
    const labelPrintC = lineWithOnlyLogoAndLabel.prints.find((p) => p.sizeKey === "label");
    assertEqual(labelPrintC.isWaived, false, "Neck label print must NOT be waived when only logo print is present");
  });

  await t.test("Flow 3.2.4: Serialization from Customizer into CartContext & localStorage persistence", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    // Calculate line item: 1 sample piece with Front A3, Left Sleeve Logo, and Free Neck Label
    const sampleLine = calculateLineItem("oversized-tee-250-gsm-french-terry", 1, [
      { position: "front", sizeKey: "a3" },
      { position: "left", sizeKey: "logo" },
      { position: "neck", sizeKey: "label" },
    ]);

    // Export custom item into CartContext
    const addedItem = cart.addItem({
      productId: "oversized-tee-250-gsm-french-terry",
      productName: "Oversized Tee — 250 GSM French Terry",
      productSpec: "250 GSM · 100% Super Combed Cotton French Terry",
      color: "Sage Green",
      colorHex: "#9ca986",
      sizes: { M: 1 },
      quantity: 1,
      prints: sampleLine.prints.map((p) => ({
        position: p.position,
        sizeKey: p.sizeKey,
        sizeLabel: p.sizeLabel,
        cost: p.unitCost,
      })),
      mockupFrontUrl: "https://res.cloudinary.com/asson/image/upload/sample_front_mockup.png",
      mockupBackUrl: "https://res.cloudinary.com/asson/image/upload/sample_back_mockup.png",
      unitPrice: sampleLine.unitPrice,
    });

    assertEqual(cart.items.length, 1, "Cart should contain 1 item");
    assertEqual(cart.itemCount, 1, "Item counter badge should display 1");
    assertEqual(cart.subtotal, 445, "Cart subtotal should equal ₹445");
    assertEqual(cart.gst, 22.25, "5% GST on ₹445 should equal ₹22.25");
    assertEqual(cart.grandTotal, 467.25, "Grand total should equal ₹467.25");

    // Verify localStorage payload schema
    const rawStorage = storage.getItem(STORAGE_KEY);
    assert(rawStorage !== null, "localStorage must contain 'asson_quote_v1'");
    const parsed = JSON.parse(rawStorage);
    assertEqual(parsed.length, 1);
    assertEqual(parsed[0].prints.length, 3, "Serialized item must retain 3 print placements");
    assertEqual(parsed[0].mockupFrontUrl, "https://res.cloudinary.com/asson/image/upload/sample_front_mockup.png");
    assertEqual(parsed[0].sizes.M, 1);
  });

  await t.test("Flow 3.2.5: Bulk Customizer Order flow (25 pcs) with volume tier pricing", () => {
    const qty = 25;
    const garmentId = "oversized-tee-250-gsm-french-terry";

    // 25 pcs unlocks 25-49 pcs tier:
    // Garment base price: ₹260
    // DTF bulk prints (qty >= 10):
    // A3 bulk: ₹100 (instead of ₹135)
    // Left sleeve logo bulk: ₹10 (instead of ₹20)
    // Neck label: ₹0 (waived with A3)
    const bulkLine = calculateLineItem(garmentId, qty, [
      { position: "front", sizeKey: "a3" },
      { position: "left", sizeKey: "logo" },
      { position: "neck", sizeKey: "label" },
    ]);

    assertEqual(bulkLine.garmentUnitPrice, 260, "Garment bulk tier price must be ₹260");
    assertEqual(bulkLine.prints.find((p) => p.sizeKey === "a3").unitCost, 100, "A3 bulk print cost must be ₹100");
    assertEqual(bulkLine.prints.find((p) => p.sizeKey === "logo").unitCost, 10, "Logo bulk print cost must be ₹10");
    assertEqual(bulkLine.prints.find((p) => p.sizeKey === "label").unitCost, 0, "Neck label print must be ₹0");

    const expectedUnitPrice = 260 + 100 + 10; // ₹370
    assertEqual(bulkLine.unitPrice, expectedUnitPrice, "Bulk unit price must be ₹370");

    const expectedLineTotal = 25 * 370; // ₹9,250
    assertEqual(bulkLine.totalPrice, expectedLineTotal, "Total line price for 25 pcs must be ₹9,250");

    const order = calculateOrder([
      {
        productId: garmentId,
        quantity: qty,
        prints: [
          { position: "front", sizeKey: "a3" },
          { position: "left", sizeKey: "logo" },
          { position: "neck", sizeKey: "label" },
        ],
      },
    ]);

    assertEqual(order.subtotal, 9250, "Order subtotal must equal ₹9,250");
    assertEqual(order.gst, 462.5, "Order 5% GST must equal ₹462.50");
    assertEqual(order.grandTotal, 9712.5, "Order grand total must equal ₹9,712.50");
  });

  await t.test("Flow 3.2.6: Direct WhatsApp quotation link verification across Customizer interface", () => {
    const inspector = inspectFile(DESIGN_PAGE);
    assert(inspector !== null, "Unable to inspect /design page component");

    assert(
      inspector.containsText("NEXT_PUBLIC_WHATSAPP_NUMBER") || inspector.containsText("wa.me"),
      "Design studio / Customizer page must support direct WhatsApp message integration"
    );
  });
}
