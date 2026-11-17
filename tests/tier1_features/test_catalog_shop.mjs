/**
 * Tier 1 Features 15 & 16: Catalog Shop Page & Swatch Preview
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Validates:
 * - Fit filter chips (All, Oversized, Regular fit)
 * - GSM / Fabric weight filter options
 * - Product cards rendering with interactive color swatches
 * - Dynamic photo updates on swatch interaction
 * - Pricing mini-table with 10-24 pcs and 100+ pcs tiers
 * - Direct navigation to /design and /shop/[slug]
 * - Factory ready-stock wholesale messaging
 * - Zero WhatsApp integration constraint
 */

import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const SHOP_PAGE_PATH = path.join(ROOT, "src", "app", "shop", "page.tsx");

export default async function (t) {
  await t.test("Features 15-16.1: /shop catalog page exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/shop");
    assert(fileStatus.exists, `/shop page must exist at ${fileStatus.filePath}`);

    const exportStatus = checkRouteExport("/shop", "default");
    assert(exportStatus.valid, `/shop page must export default component: ${exportStatus.reason}`);
  });

  await t.test("Features 15-16.2: Interactive fit filter chips provide filtering by All, Oversized, and Regular", () => {
    const inspector = inspectFile(SHOP_PAGE_PATH);
    assert(inspector !== null, "Shop page file must be readable");

    // Fit filter states and buttons
    assert(
      inspector.containsText("selectedFit") || inspector.containsText("setSelectedFit"),
      "Shop page must maintain state for selected garment fit"
    );

    assert(
      inspector.containsText("oversized") && inspector.containsText("regular"),
      "Shop page must provide filter options for both Oversized and Regular fits"
    );
  });

  await t.test("Features 15-16.3: Weight (GSM) filter chips allow narrowing by fabric density", () => {
    const inspector = inspectFile(SHOP_PAGE_PATH);
    assert(inspector !== null, "Shop page file must be readable");

    assert(
      inspector.containsText("selectedGsm") || inspector.containsText("setSelectedGsm") || inspector.containsText("gsm"),
      "Shop page must support filtering by garment fabric weight/GSM"
    );
    assert(
      inspector.containsText("250") && inspector.containsText("190"),
      "Shop page must support key GSM weights (e.g. 250 GSM French Terry, 190 GSM)"
    );
  });

  await t.test("Features 15-16.4: Product cards render color swatches and dynamically switch preview images", () => {
    const inspector = inspectFile(SHOP_PAGE_PATH);
    assert(inspector !== null, "Shop page file must be readable");

    // Color swatch selection state
    assert(
      inspector.containsText("selectedColorIdx") || inspector.containsText("currentColor"),
      "ProductCard component must track active color index for preview switching"
    );

    // Dynamic garment photo source
    assert(
      inspector.containsText("currentColor.front") || inspector.containsText("product.colours"),
      "ProductCard must dynamically bind garment image to the selected color swatch"
    );

    // Swatch buttons
    assert(
      inspector.containsText("backgroundColor: col.hex") || inspector.containsText("col.hex"),
      "Color swatches must render with appropriate background hex colors"
    );
  });

  await t.test("Features 15-16.5: Product cards display transparent volume tier pricing", () => {
    const inspector = inspectFile(SHOP_PAGE_PATH);
    assert(inspector !== null, "Shop page file must be readable");

    assert(
      inspector.containsText("basePrice") || inspector.containsText("100+ pcs"),
      "ProductCard must show volume tier baseline price (100+ pcs)"
    );
    assert(
      inspector.containsText("prices") || inspector.containsText("10–24 pcs") || inspector.containsText("10-24"),
      "ProductCard must indicate low-tier pricing for 10-24 pieces"
    );
  });

  await t.test("Features 15-16.6: Dual action buttons link to Customizer Studio and Product Detail Page", () => {
    const inspector = inspectFile(SHOP_PAGE_PATH);
    assert(inspector !== null, "Shop page file must be readable");

    assert(
      inspector.containsText("/design?product=") || inspector.containsText("/design"),
      "Product cards must provide a direct CTA button to /design passing product context"
    );
    assert(
      inspector.containsText("/shop/${product.slug}") || inspector.containsText("/shop/"),
      "Product cards must link directly to the product detail page"
    );
  });

  await t.test("Features 15-16.7: Ready-stock wholesale messaging present and ZERO WhatsApp integrations", () => {
    const inspector = inspectFile(SHOP_PAGE_PATH);
    assert(inspector !== null, "Shop page file must be readable");

    // Wholesale / ready stock messaging
    assert(
      inspector.containsText("Wholesale") || inspector.containsText("ready for immediate") || inspector.containsText("Blanks"),
      "Shop page must present wholesale / ready stock apparel messaging"
    );

    // Zero WhatsApp check
    assert(!inspector.containsText("wa.me"), "Shop page must not link to wa.me");
    assert(!inspector.containsText("api.whatsapp.com"), "Shop page must not link to api.whatsapp.com");
    assert(!inspector.containsText("whatsapp", false), "Shop page must not contain WhatsApp branding or actions");
  });
}
