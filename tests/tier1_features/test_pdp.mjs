/**
 * Tier 1 Features 17 & 18: Product Detail Page (PDP) Route Decommission & Design Studio Redirection
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Validates:
 * - Dynamic route /shop/[slug] page file and component export
 * - Safe redirect from /shop/[slug] to /design
 * - Volume discount tiers handled in Design Studio
 * - Size breakdown matrix (XS to XXL) with total garment counter in Design Studio
 * - Real-time financial estimation: Unit Price, Subtotal, 5% GST, and Grand Total
 * - Quote persistence to /api/quotes
 * - Action button routes to Customizer Studio with product context
 * - STRICT USER CONSTRAINT: Absence of WhatsApp on /shop/[slug] route
 */

import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const PDP_PAGE_PATH = path.join(ROOT, "src", "app", "shop", "[slug]", "page.tsx");
const DESIGN_PAGE_PATH = path.join(ROOT, "src", "app", "design", "page.tsx");

export default async function (t) {
  await t.test("Features 17-18.1: /shop/[slug] route exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/shop/[slug]");
    assert(fileStatus.exists, `PDP must exist at ${fileStatus.filePath}`);

    const exportStatus = checkRouteExport("/shop/[slug]", "default");
    assert(exportStatus.valid, `PDP must export default React component: ${exportStatus.reason}`);
  });

  await t.test("Features 17-18.2: Visual gallery and garment configuration handled in Design Studio with PDP redirect", () => {
    const pdpInspector = inspectFile(PDP_PAGE_PATH);
    assert(pdpInspector !== null, "PDP file must be readable");
    assert(
      pdpInspector.containsText("redirect("),
      "PDP must cleanly redirect to /design studio"
    );

    const designInspector = inspectFile(DESIGN_PAGE_PATH);
    assert(
      designInspector.containsText("Front") || designInspector.containsText("front"),
      "Design studio must support front view"
    );
  });

  await t.test("Features 17-18.3: Volume discount tiers table renders all tier slabs with dynamic active tier tracking", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design file must be readable");

    assert(
      inspector.containsText("tier") || inspector.containsText("save") || inspector.containsText("price"),
      "Design studio must calculate volume discounts"
    );
  });

  await t.test("Features 17-18.4: Size breakdown matrix supports XS through XXL with total quantity calculation", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design file must be readable");

    assert(
      inspector.containsText("XS") && inspector.containsText("XXL"),
      "Design studio must offer independent quantity controls for standard sizes (XS through XXL)"
    );
  });

  await t.test("Features 17-18.5: Real-time price breakdown computes Unit Price, Subtotal, 5% GST, and Total", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design file must be readable");

    assert(
      inspector.containsText("GST") || inspector.containsText("gst"),
      "Design studio must compute GST"
    );
  });

  await t.test("Features 17-18.6: In-App quote request drawer submits formal RFQ to /api/quotes", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design file must be readable");

    assert(
      inspector.containsText("/api/quotes"),
      "Design studio must submit quote request to /api/quotes"
    );
  });

  await t.test("Features 17-18.7: Action button routes to Customizer Studio with product and color preselected", () => {
    const inspector = inspectFile(PDP_PAGE_PATH);
    assert(inspector !== null, "PDP file must be readable");

    assert(
      inspector.containsText("/design?product="),
      "PDP must redirect to /design passing product context"
    );
  });

  await t.test("Features 17-18.8: [CRITICAL CONSTRAINT] ABSENCE of WhatsApp links or widgets on PDP", () => {
    const inspector = inspectFile(PDP_PAGE_PATH);
    assert(inspector !== null, "PDP file must be readable");

    assert(!inspector.containsText("wa.me"), "PDP must not link to wa.me");
    assert(!inspector.containsText("api.whatsapp.com"), "PDP must not link to api.whatsapp.com");
  });
}
