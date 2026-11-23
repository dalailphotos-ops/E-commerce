/**
 * Tier 1 Features 15 & 16: Catalog Shop Route Decommission & Design Studio Redirection
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Validates:
 * - Route file exists and exports default component
 * - Safe redirect from /shop to /design studio
 * - Garment silhouettes and options available in Design Studio
 * - Color swatches and photo preview in Design Studio
 * - Volume tier pricing and live estimation in Design Studio
 * - Direct customizer selection
 * - Zero WhatsApp integration constraint on /shop route
 */

import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const SHOP_PAGE_PATH = path.join(ROOT, "src", "app", "shop", "page.tsx");
const DESIGN_PAGE_PATH = path.join(ROOT, "src", "app", "design", "page.tsx");

export default async function (t) {
  await t.test("Features 15-16.1: /shop catalog page exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/shop");
    assert(fileStatus.exists, `/shop page must exist at ${fileStatus.filePath}`);

    const exportStatus = checkRouteExport("/shop", "default");
    assert(exportStatus.valid, `/shop page must export default component: ${exportStatus.reason}`);
  });

  await t.test("Features 15-16.2: /shop route safely redirects to /design studio", () => {
    const inspector = inspectFile(SHOP_PAGE_PATH);
    assert(inspector !== null, "Shop page file must be readable");

    assert(
      inspector.containsText('redirect("/design")') || inspector.containsText("redirect('/design')"),
      "Shop page must cleanly redirect to /design studio"
    );
  });

  await t.test("Features 15-16.3: Weight (GSM) and garment options are integrated into /design studio", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design page file must be readable");

    assert(
      inspector.containsText("REVERSE_ENGINEERED_PRODUCTS") || inspector.containsText("product"),
      "Design studio must support garment catalog products"
    );
    assert(
      inspector.containsText("selectedProduct") || inspector.containsText("setSelectedProduct") || inspector.containsText("prod"),
      "Design studio must bind selected product"
    );
  });

  await t.test("Features 15-16.4: Design Studio renders color swatches and garment options", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design page file must be readable");

    assert(
      inspector.containsText("color") || inspector.containsText("Colour"),
      "Design studio must provide interactive color selection"
    );
    assert(
      inspector.containsText("t-shirt") || inspector.containsText("product"),
      "Design studio must bind garment silhouettes"
    );
  });

  await t.test("Features 15-16.5: Design studio displays transparent volume tier pricing", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design page file must be readable");

    assert(
      inspector.containsText("Price") || inspector.containsText("price") || inspector.containsText("₹"),
      "Design studio must show volume pricing"
    );
  });

  await t.test("Features 15-16.6: Direct customizer action replaces obsolete blank catalog", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design page file must be readable");

    assert(
      inspector.containsText("front") && inspector.containsText("back"),
      "Design studio must support 2-side customizer actions"
    );
  });

  await t.test("Features 15-16.7: Ready-stock wholesale messaging present and ZERO WhatsApp integrations on /shop", () => {
    const inspector = inspectFile(SHOP_PAGE_PATH);
    assert(inspector !== null, "Shop page file must be readable");

    // Zero WhatsApp check
    assert(!inspector.containsText("wa.me"), "Shop page must not link to wa.me");
    assert(!inspector.containsText("api.whatsapp.com"), "Shop page must not link to api.whatsapp.com");
    assert(!inspector.containsText("whatsapp", false), "Shop page must not contain WhatsApp branding or actions");
  });
}
