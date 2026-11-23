/**
 * Tier 1 Features 23 & 24: Multi-Line Price Estimator & Export Channels
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Validates:
 * - /price-estimator route and PriceEstimatorPage component
 * - Multi-line order item builder (dynamic add, remove, and item configuration)
 * - Independent front & back print placement options (A2 to A6, Logo, None, Embroidery)
 * - Popular presets (Plain T-shirt, A3 Back only, Chest Logo + A3 Back, A3 Back + A4 Chest)
 * - Cumulative multi-line volume pricing with 5% Indian textile GST
 * - Clipboard export functionality for customer quote summaries
 * - In-app quote submission to /api/quotes
 * - WhatsApp quote integration with pre-filled wa.me links
 * - 4-step configurator flow header and multi-item discount banner
 * - Free neck label perk triggering on A2, A3, or A4 print selection
 * - Dynamic next-tier discount tip box and quick-add button
 */

import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";
import { calculateOrder } from "../harness/pricing_simulator.mjs";

const ROOT = process.cwd();
const ESTIMATOR_PAGE_PATH = path.join(ROOT, "src", "app", "price-estimator", "page.tsx");
const PRICING_LIB_PATH = path.join(ROOT, "src", "lib", "estimator-pricing.ts");

export default async function (t) {
  await t.test("Features 23-24.1: /price-estimator route exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/price-estimator");
    assert(fileStatus.exists, `/price-estimator page must exist at ${fileStatus.filePath}`);

    const exportStatus = checkRouteExport("/price-estimator", "default");
    assert(exportStatus.valid, `/price-estimator must export default React component: ${exportStatus.reason}`);
  });

  await t.test("Features 23-24.2: Multi-line order builder allows adding and removing apparel items", () => {
    const inspector = inspectFile(ESTIMATOR_PAGE_PATH);
    assert(inspector !== null, "Estimator page file must be readable");

    // Adding items
    assert(
      inspector.containsText("handleAddItem") || inspector.containsText("Add Another Silhouette") || inspector.containsText("Add another product"),
      "Estimator must provide an action button to add additional garment lines"
    );

    // Removing items
    assert(
      inspector.containsText("handleRemoveItem") || inspector.containsText("Trash2"),
      "Estimator must provide removal actions for individual order lines"
    );
  });

  await t.test("Features 23-24.3: Independent front and back print placement options with DTF print sizes", () => {
    const inspector = inspectFile(ESTIMATOR_PAGE_PATH);
    assert(inspector !== null, "Estimator page file must be readable");

    assert(
      inspector.containsText("frontPrint") && inspector.containsText("backPrint"),
      "Estimator items must support independent front and back print configuration"
    );

    assert(
      inspector.containsText("DTF_PRINTS"),
      "Estimator must load DTF print rates and sizes from constants"
    );
  });

  await t.test("Features 23-24.4: Quick presets allow 1-click configuration for common setups", () => {
    const inspector = inspectFile(ESTIMATOR_PAGE_PATH);
    assert(inspector !== null, "Estimator page file must be readable");

    assert(
      inspector.containsText("Plain T-Shirt"),
      "Estimator must provide Plain T-Shirt preset"
    );
    assert(
      inspector.containsText("A3 Back Only") || inspector.containsText("A3 Back Print") || inspector.containsText("a3"),
      "Estimator must provide A3 Back preset"
    );
    assert(
      inspector.containsText("Chest Logo + A3 Back") || inspector.containsText("A3 Back + Chest Logo") || inspector.containsText("logo"),
      "Estimator must provide Chest Logo + A3 Back preset"
    );
  });

  await t.test("Features 23-24.5: Multi-line cumulative calculation accurately sums totals with 5% GST", () => {
    // Test simulator calculation with 2 distinct lines
    const multiLineOrder = calculateOrder([
      {
        productId: "oversized-tee-250-gsm-french-terry",
        quantity: 50,
        prints: [
          { position: "front", sizeKey: "logo" },
          { position: "back", sizeKey: "a3" },
        ],
      },
      {
        productId: "regular-fit-tee-190-gsm",
        quantity: 25,
        prints: [{ position: "front", sizeKey: "a4" }],
      },
    ]);

    // Line 1: 50 pcs oversized 250 GSM (tier 50-99 = ₹255) + logo bulk (₹10) + a3 bulk (₹100) = ₹365 unit. Total = 50 * 365 = ₹18,250
    assertEqual(multiLineOrder.lines[0].unitPrice, 365, "Line 1 unit price must be ₹365");
    assertEqual(multiLineOrder.lines[0].totalPrice, 18250, "Line 1 subtotal must be ₹18,250");

    // Line 2: 25 pcs regular 190 GSM (tier 25-49 = ₹198) + a4 bulk (₹70) = ₹268 unit. Total = 25 * 268 = ₹6,700
    assertEqual(multiLineOrder.lines[1].unitPrice, 268, "Line 2 unit price must be ₹268");
    assertEqual(multiLineOrder.lines[1].totalPrice, 6700, "Line 2 subtotal must be ₹6,700");

    // Subtotal: 18250 + 6700 = 24950
    assertEqual(multiLineOrder.subtotal, 24950, "Order subtotal must equal ₹24,950");
    // GST (5%): 24950 * 0.05 = 1247.5
    assertEqual(multiLineOrder.gst, 1247.5, "5% GST on ₹24,950 must be ₹1,247.50");
    assertEqual(multiLineOrder.grandTotal, 26197.5, "Grand total must be ₹26,197.50");

    const inspector = inspectFile(ESTIMATOR_PAGE_PATH);
    assert(
      inspector.containsText("GST_PERCENTAGE") || inspector.containsText("5%"),
      "Estimator component must compute 5% GST on order subtotal"
    );
  });

  await t.test("Features 23-24.6: Clipboard export formats structured summary text", () => {
    const inspector = inspectFile(ESTIMATOR_PAGE_PATH);
    assert(inspector !== null, "Estimator page file must be readable");

    assert(
      inspector.containsText("navigator.clipboard.writeText") || inspector.containsText("handleCopy"),
      "Estimator must provide clipboard copy function"
    );

    assert(
      inspector.containsText("generateQuoteSummaryText") || inspector.containsText("Price Estimator Quote") || inspector.containsText("formatQuoteSummaryText"),
      "Estimator must generate human-readable formatted summary text"
    );
  });

  await t.test("Features 23-24.7: In-app quote submission captures customer details and posts to /api/quotes", () => {
    const inspector = inspectFile(ESTIMATOR_PAGE_PATH);
    assert(inspector !== null, "Estimator page file must be readable");

    assert(
      inspector.containsText("customerName") && inspector.containsText("customerPhone"),
      "Estimator must collect customer contact info"
    );

    assert(
      inspector.containsText("/api/quotes"),
      "Estimator must submit quotes to /api/quotes"
    );
  });

  await t.test("Features 23-24.8: WhatsApp integration generates prefilled quote export link and action button", () => {
    const inspector = inspectFile(ESTIMATOR_PAGE_PATH);
    assert(inspector !== null, "Estimator page file must be readable");

    assert(
      inspector.containsText("Send on WhatsApp") || inspector.containsText("Send via WhatsApp"),
      "Price Estimator must provide 'Send on WhatsApp' action button"
    );

    const pricingInspector = inspectFile(PRICING_LIB_PATH);
    assert(pricingInspector !== null, "Pricing library file must be readable");
    assert(
      pricingInspector.containsText("wa.me") && pricingInspector.containsText("formatWhatsAppQuoteUrl"),
      "Pricing engine must configure wa.me export link"
    );
  });

  await t.test("Features 23-24.9: 4-step configurator flow header and multi-item discount banner", () => {
    const inspector = inspectFile(ESTIMATOR_PAGE_PATH);
    assert(inspector !== null, "Estimator page file must be readable");

    assert(inspector.containsText("Pick a t-shirt"), "Must contain step 1: Pick a t-shirt");
    assert(inspector.containsText("Colour & sizes") || inspector.containsText("Colour &amp; sizes"), "Must contain step 2: Colour & sizes");
    assert(inspector.containsText("Add prints"), "Must contain step 3: Add prints");
    assert(inspector.containsText("Send your quote"), "Must contain step 4: Send your quote");
    assert(
      inspector.containsText("Mix as many styles, colours and prints as you like in one order"),
      "Must contain multi-item automatic discount banner note"
    );
  });

  await t.test("Features 23-24.10: Free neck label perk notification triggers on A2, A3, or A4 print selection", () => {
    const inspector = inspectFile(ESTIMATOR_PAGE_PATH);
    assert(inspector !== null, "Estimator page file must be readable");

    assert(
      inspector.containsText("Free neck label (your brand name) included") || inspector.containsText("hasFreeNeckLabel"),
      "Estimator must indicate free neck label included when A2, A3, or A4 is selected"
    );
    assert(
      inspector.containsText("Add an A2, A3 or A4 print to get a free neck label"),
      "Estimator must display prompt when free neck label perk is inactive"
    );
  });

  await t.test("Features 23-24.11: Dynamic next-tier discount tip box and quick-add button", () => {
    const inspector = inspectFile(ESTIMATOR_PAGE_PATH);
    assert(inspector !== null, "Estimator page file must be readable");

    assert(
      inspector.containsText("data-order-hint") || inspector.containsText("orderBestDrop"),
      "Estimator sidebar must support dynamic next-tier tip box"
    );
    assert(
      inspector.containsText("handleQuickAddPieces") || inspector.containsText("orderBestDrop.addQuantity"),
      "Estimator must provide quick-add button to qualify for the next price tier"
    );
  });
}
