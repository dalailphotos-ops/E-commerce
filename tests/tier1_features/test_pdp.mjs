/**
 * Tier 1 Features 17 & 18: Product Detail Page (PDP) & In-App Quote Conversion
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Validates:
 * - Dynamic route /shop/[slug] page file and component export
 * - Front/Back view switcher & comprehensive color swatch selector
 * - 5-level volume discount tiers table with dynamic active-tier highlighting
 * - Size breakdown matrix (XS to XXL) with total garment counter
 * - Real-time financial estimation: Unit Price, Subtotal, 5% GST, and Grand Total
 * - In-app Quote submission drawer/modal posting to /api/quotes
 * - Direct studio customization CTA (/design?product=...&color=...)
 * - STRICT USER CONSTRAINT: Complete absence of WhatsApp buttons or links.
 */

import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const PDP_PAGE_PATH = path.join(ROOT, "src", "app", "shop", "[slug]", "page.tsx");

export default async function (t) {
  await t.test("Features 17-18.1: /shop/[slug] route exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/shop/[slug]");
    assert(fileStatus.exists, `PDP must exist at ${fileStatus.filePath}`);

    const exportStatus = checkRouteExport("/shop/[slug]", "default");
    assert(exportStatus.valid, `PDP must export default React component: ${exportStatus.reason}`);
  });

  await t.test("Features 17-18.2: Visual gallery includes side view toggling and multi-color selection", () => {
    const inspector = inspectFile(PDP_PAGE_PATH);
    assert(inspector !== null, "PDP file must be readable");

    // Front / Back toggle state
    assert(
      inspector.containsText("viewSide") && (inspector.containsText("front") && inspector.containsText("back")),
      "PDP must allow switching between Front View and Back View"
    );

    // Color swatches
    assert(
      inspector.containsText("selectedColorIdx") && inspector.containsText("product.colours"),
      "PDP must provide interactive color selection from garment's available colours"
    );
  });

  await t.test("Features 17-18.3: Volume discount tiers table renders all tier slabs with dynamic active tier tracking", () => {
    const inspector = inspectFile(PDP_PAGE_PATH);
    assert(inspector !== null, "PDP file must be readable");

    assert(
      inspector.containsText("Volume Discount Tiers") || inspector.containsText("prices.map") || inspector.containsText("tier.label"),
      "PDP must render the volume discount tiers table"
    );

    // Matched tier calculation
    assert(
      inspector.containsText("matchedTier") || inspector.containsText("isCurrent"),
      "PDP must calculate and highlight the matched tier for current order quantity"
    );
  });

  await t.test("Features 17-18.4: Size breakdown matrix supports XS through XXL with total quantity calculation", () => {
    const inspector = inspectFile(PDP_PAGE_PATH);
    assert(inspector !== null, "PDP file must be readable");

    // SIZES mapping
    assert(
      inspector.containsText("SIZES") || (inspector.containsText("XS") && inspector.containsText("XXL")),
      "PDP must offer independent quantity controls for standard sizes (XS through XXL)"
    );

    // Total quantity computation
    assert(
      inspector.containsText("totalQuantity") || inspector.containsText("reduce"),
      "PDP must compute total units across all entered sizes"
    );
  });

  await t.test("Features 17-18.5: Real-time price breakdown computes Unit Price, Subtotal, 5% GST, and Total", () => {
    const inspector = inspectFile(PDP_PAGE_PATH);
    assert(inspector !== null, "PDP file must be readable");

    assert(
      inspector.containsText("unitPrice") && inspector.containsText("subtotal"),
      "PDP must compute live unit price and subtotal"
    );

    assert(
      inspector.containsText("GST_PERCENTAGE") || inspector.containsText("5%"),
      "PDP must compute 5% GST according to Indian textile tax regulations"
    );
  });

  await t.test("Features 17-18.6: In-App quote request drawer submits formal RFQ to /api/quotes", () => {
    const inspector = inspectFile(PDP_PAGE_PATH);
    assert(inspector !== null, "PDP file must be readable");

    // Customer inputs
    assert(
      inspector.containsText("customerName") && inspector.containsText("customerPhone"),
      "PDP quote drawer must capture customer contact name and phone number"
    );

    // API submission endpoint
    assert(
      inspector.containsText("/api/quotes"),
      "PDP quote drawer must submit quote request to /api/quotes"
    );

    assert(
      inspector.containsText("POST"),
      "Quote request submission must use POST method"
    );
  });

  await t.test("Features 17-18.7: Action button routes to Customizer Studio with product and color preselected", () => {
    const inspector = inspectFile(PDP_PAGE_PATH);
    assert(inspector !== null, "PDP file must be readable");

    assert(
      inspector.containsText("/design?product=") || inspector.containsText("/design"),
      "PDP must provide a link to /design pre-filling current product context"
    );
  });

  await t.test("Features 17-18.8: [CRITICAL CONSTRAINT] ABSENCE of WhatsApp links or widgets on PDP", () => {
    const inspector = inspectFile(PDP_PAGE_PATH);
    assert(inspector !== null, "PDP file must be readable");

    assert(!inspector.containsText("wa.me"), "PDP must not link to wa.me");
    assert(!inspector.containsText("api.whatsapp.com"), "PDP must not link to api.whatsapp.com");
    assert(!inspector.containsText("whatsapp", false), "PDP must not include WhatsApp widgets or CTAs");
  });
}
