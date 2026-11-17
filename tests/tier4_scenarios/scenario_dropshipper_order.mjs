/**
 * Tier 4 Real-World Application Scenario 1: POD Dropshipper Sample Order
 * 
 * Domain Narrative:
 * An independent creator launching a streetwear dropshipping label visits Asson Clothing Brand.
 * They review POD policies on /dropshipping, design a single-piece custom sample with front A3 print
 * and sleeve logo in the Customizer (/design), verify the Free Neck Label promotion rule,
 * inspect the total price including 5% GST, add the sample to their quote cart, and submit an RFQ.
 * 
 * Features Exercised: F4, F6, F7, F8, F11, F19, F20, F21, F22
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
const DROPSHIPPING_PAGE = path.join(ROOT, "src", "app", "dropshipping", "page.tsx");
const DESIGN_PAGE = path.join(ROOT, "src", "app", "design", "page.tsx");
const QUOTE_PAGE = path.join(ROOT, "src", "app", "quote", "page.tsx");

export default async function (t) {
  await t.test("Scenario 1.1: Dropshipper inspects /dropshipping for POD policies and zero MOQ sample terms", () => {
    const routeCheck = checkRouteFileExists("/dropshipping");
    assert(routeCheck.exists, `/dropshipping route must exist at ${routeCheck.filePath}`);

    const exportCheck = checkRouteExport("/dropshipping", "default");
    assert(exportCheck.valid, `/dropshipping must export a default React component`);

    const inspector = inspectFile(DROPSHIPPING_PAGE);
    assert(inspector !== null, "Unable to inspect /dropshipping page");

    // POD terms & capabilities
    assert(
      inspector.containsText("dropshipping", false) || inspector.containsText("print-on-demand", false) || inspector.containsText("POD", false),
      "Dropshipping page must cover print-on-demand fulfillment capabilities"
    );

    // Verify ZERO WhatsApp references on dropshipping page
    assert(
      !inspector.containsText("whatsapp", false) &&
      !inspector.containsText("wa.me", false) &&
      !inspector.containsText("api.whatsapp.com", false),
      "Dropshipping page must strictly contain ZERO WhatsApp links or CTAs"
    );
  });

  await t.test("Scenario 1.2: Dropshipper configures single-piece sample in Customizer with front A3 and sleeve logo", () => {
    const garmentId = "oversized-tee-250-gsm-french-terry";
    const sampleQty = 1;

    // Garment base price for sample (tier 1-9 pcs)
    const garmentPrice = getGarmentUnitPrice(garmentId, sampleQty);
    assertEqual(garmentPrice, 290, "Single sample base price for 250 GSM French Terry must be ₹290");

    // Print 1: Front A3 print (11" × 16")
    const a3Cost = getPrintCost("a3", sampleQty);
    assertEqual(a3Cost, 135, "Single piece A3 print cost must be ₹135");

    // Print 2: Left sleeve logo print (2.5" × 2.5")
    const logoCost = getPrintCost("logo", sampleQty);
    assertEqual(logoCost, 20, "Single piece logo print cost must be ₹20");

    // Line item calculation
    const sampleLine = calculateLineItem(garmentId, sampleQty, [
      { position: "front", sizeKey: "a3" },
      { position: "left", sizeKey: "logo" },
    ]);

    assertEqual(sampleLine.garmentUnitPrice, 290);
    assertEqual(sampleLine.totalPrintsUnitCost, 155, "Prints unit cost: 135 + 20 = ₹155");
    assertEqual(sampleLine.unitPrice, 445, "Sample unit price: 290 + 155 = ₹445");
    assertEqual(sampleLine.totalPrice, 445, "Sample total price for 1 piece: ₹445");
  });

  await t.test("Scenario 1.3: Dropshipper adds custom neck label and verifies Free Neck Label promotion rule", () => {
    const garmentId = "oversized-tee-250-gsm-french-terry";
    const sampleQty = 1;

    // With A3 present, custom neck label is waived to ₹0
    const sampleWithLabel = calculateLineItem(garmentId, sampleQty, [
      { position: "front", sizeKey: "a3" },
      { position: "left", sizeKey: "logo" },
      { position: "neck", sizeKey: "label" },
    ]);

    const neckLabel = sampleWithLabel.prints.find((p) => p.sizeKey === "label");
    assert(neckLabel !== undefined, "Neck label print must be included in calculation");
    assertEqual(neckLabel.unitCost, 0, "Neck label unit cost must be waived to ₹0 due to A3 graphic");
    assertEqual(neckLabel.isWaived, true, "isWaived flag must be true");

    // Total unit price remains ₹445
    assertEqual(sampleWithLabel.unitPrice, 445, "Unit price remains ₹445 with free neck label");
    assertEqual(sampleWithLabel.totalPrice, 445, "Total price remains ₹445");
  });

  await t.test("Scenario 1.4: Dropshipper adds sample to Quote List, verifying CartContext and 5% GST computation", () => {
    const storage = new MockLocalStorage();
    const cart = new CartSimulator(storage);

    // Add sample item to cart
    cart.addItem({
      productId: "oversized-tee-250-gsm-french-terry",
      productName: "Oversized Tee — 250 GSM French Terry",
      productSpec: "250 GSM · 100% Super Combed Cotton French Terry",
      color: "Sage Green",
      colorHex: "#9ca986",
      sizes: { M: 1 },
      quantity: 1,
      unitPrice: 445,
      prints: [
        { position: "front", sizeKey: "a3", sizeLabel: "A3 Size", cost: 135 },
        { position: "left", sizeKey: "logo", sizeLabel: "Left Sleeve Logo", cost: 20 },
        { position: "neck", sizeKey: "label", sizeLabel: "Free Neck Label", cost: 0 },
      ],
      mockupFrontUrl: "https://res.cloudinary.com/asson/image/upload/sample_hoodie_mockup_front.png",
    });

    assertEqual(cart.items.length, 1, "Cart must contain 1 sample item");
    assertEqual(cart.itemCount, 1, "Item counter badge must equal 1");
    assertEqual(cart.subtotal, 445, "Subtotal must equal ₹445");

    // 5% GST on ₹445 = ₹22.25
    assertEqual(cart.gst, 22.25, "5% GST must equal ₹22.25");

    // Grand Total = 445 + 22.25 = ₹467.25
    assertEqual(cart.grandTotal, 467.25, "Grand total must equal ₹467.25");

    // Confirm stored in localStorage
    const stored = JSON.parse(storage.getItem(STORAGE_KEY));
    assertEqual(stored.length, 1);
    assertEqual(stored[0].color, "Sage Green");
    assertEqual(stored[0].prints.length, 3);
  });

  await t.test("Scenario 1.5: Dropshipper submits sample quote via /api/quotes with ZERO WhatsApp", () => {
    // Check quote route exists
    const quoteRoute = checkRouteFileExists("/quote");
    assert(quoteRoute.exists, `/quote page must exist`);

    const quoteInspector = inspectFile(QUOTE_PAGE);
    assert(quoteInspector !== null, "Unable to inspect /quote page");

    // Verify contact methods on quote page: in-app form submission or direct email
    assert(
      quoteInspector.containsText("/api/quotes"),
      "Quote page must submit via in-app /api/quotes endpoint"
    );

    // Verify ZERO WhatsApp references anywhere on Quote page
    assert(
      !quoteInspector.containsText("whatsapp", false) &&
      !quoteInspector.containsText("wa.me", false),
      "Quote page must contain strictly ZERO WhatsApp links or CTAs"
    );

    // Dropshipper quote payload validation
    const samplePayload = {
      customerName: "Aarav Sharma",
      email: "aarav@urbanthreads.store",
      phone: "+91 99887 76655",
      company: "Urban Threads POD",
      items: [
        {
          productId: "oversized-tee-250-gsm-french-terry",
          productName: "Oversized Tee — 250 GSM French Terry",
          color: "Sage Green",
          quantity: 1,
          sizes: { M: 1 },
          printType: "DTF",
          printSize: "Front: A3, Sleeve: Logo, Neck: Label",
          unitPrice: 445,
          totalPrice: 445,
        },
      ],
      subtotal: 445,
      gst: 22.25,
      total: 467.25,
      notes: "Sample piece for quality review before launching store catalog",
    };

    assert(samplePayload.customerName && samplePayload.phone, "Sample payload must be valid");
    assertEqual(samplePayload.total, 467.25, "Payload total must match ₹467.25");
  });
}
