/**
 * Tier 1 Feature 14: Homepage 8-Section Layout
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Validates the complete reference homepage layout:
 * - Hero pill & headline ("South India's Custom Apparel Hub · Low 10 pc MOQ")
 * - Popular blanks / Bestsellers catalog preview
 * - Printing & craft technologies (DTF, Screen Printing, HD Puff, Computerized Embroidery)
 * - Quick price estimator / CTA banner
 * - 4 core USPs (MOQ 10 Pieces, Free Neck Label, Pan-India Delivery, 100% Combed Cotton)
 * - Direct conversion entrypoints to /design, /price-estimator, /shop
 * - CRITICAL USER CONSTRAINT: Absolute absence of WhatsApp links or widgets.
 */

import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const HOMEPAGE_PATH = path.join(ROOT, "src", "app", "page.tsx");

export default async function (t) {
  await t.test("Feature 14.1: Homepage route exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/");
    assert(fileStatus.exists, `Homepage must exist at ${fileStatus.filePath}`);

    const exportStatus = checkRouteExport("/", "default");
    assert(exportStatus.valid, `Homepage must export default React component: ${exportStatus.reason}`);
  });

  await t.test("Feature 14.2: Hero section contains authoritative hero pill, headline, and subcopy", () => {
    const inspector = inspectFile(HOMEPAGE_PATH);
    assert(inspector !== null, "Homepage file must exist and be readable");

    // Hero pill badge
    assert(
      inspector.containsText("South India's Custom Apparel Hub") ||
      inspector.containsText("Low 10 pc MOQ") ||
      inspector.containsText("10 pc MOQ"),
      "Hero section must include announcement pill badge for South India apparel hub / 10 pc MOQ"
    );

    // Headline
    assert(
      inspector.containsText("Craft Custom Apparel") || inspector.containsText("Custom Apparel"),
      "Hero section must include primary headline"
    );

    // Subcopy / Value statement
    assert(
      inspector.containsText("Direct factory manufacturing") ||
      inspector.containsText("French Terry") ||
      inspector.containsText("DTF"),
      "Hero section must feature value statement covering factory manufacturing or premium fabrics"
    );
  });

  await t.test("Feature 14.3: Popular Blanks / Bestsellers section displays product cards with specs and pricing", () => {
    const inspector = inspectFile(HOMEPAGE_PATH);
    assert(inspector !== null, "Homepage file must be readable");

    assert(
      inspector.containsText("Popular Blanks") ||
      inspector.containsText("Direct From Loom") ||
      inspector.containsText("Bestsellers"),
      "Homepage must contain Popular Blanks / Bestsellers section heading"
    );

    // Garment spec details & pricing
    assert(
      inspector.containsText("basePrice") ||
      inspector.containsText("gsm") ||
      inspector.containsText("fit"),
      "Product cards must bind to garment specs such as GSM and fit"
    );

    const links = inspector.extractLinks();
    assert(
      links.some((l) => l.startsWith("/shop")),
      "Homepage blanks section must link to /shop catalog or individual product slugs"
    );
  });

  await t.test("Feature 14.4: Printing Technologies section details DTF, Screen Printing, HD Puff, and Embroidery", () => {
    const inspector = inspectFile(HOMEPAGE_PATH);
    assert(inspector !== null, "Homepage file must be readable");

    assert(
      inspector.containsText("Direct To Film") || inspector.containsText("DTF"),
      "Printing section must detail Direct To Film (DTF)"
    );
    assert(
      inspector.containsText("Screen Printing"),
      "Printing section must detail Screen Printing"
    );
    assert(
      inspector.containsText("HD Puff") || inspector.containsText("Puff") || inspector.containsText("High Density"),
      "Printing section must detail HD Puff / 3D printing"
    );
    assert(
      inspector.containsText("Embroidery"),
      "Printing section must detail computerized Embroidery"
    );
  });

  await t.test("Feature 14.5: Instant Price Estimator CTA banner links to /price-estimator", () => {
    const inspector = inspectFile(HOMEPAGE_PATH);
    assert(inspector !== null, "Homepage file must be readable");

    assert(
      inspector.containsText("Instant Estimates") ||
      inspector.containsText("Price Estimator") ||
      inspector.containsText("price calculator"),
      "CTA banner must invite users to calculate instant estimates"
    );

    const links = inspector.extractLinks();
    assert(
      links.includes("/price-estimator"),
      "Homepage CTA banner must include a direct link to /price-estimator"
    );
  });

  await t.test("Feature 14.6: Core USPs highlight factory advantages (MOQ, Neck Labels, Delivery)", () => {
    const inspector = inspectFile(HOMEPAGE_PATH);
    assert(inspector !== null, "Homepage file must be readable");

    assert(
      inspector.containsText("MOQ 10 Pieces") || inspector.containsText("10 Pieces") || inspector.containsText("10 pc"),
      "Homepage must state low 10-piece MOQ advantage"
    );
    assert(
      inspector.containsText("Free Brand Neck Label") || inspector.containsText("Neck Label"),
      "Homepage must advertise Free Brand Neck Label incentive"
    );
    assert(
      inspector.containsText("Delivery") || inspector.containsText("Shipping") || inspector.containsText("Pan-India"),
      "Homepage must mention pan-India fulfillment / delivery"
    );
  });

  await t.test("Feature 14.7: Core action buttons provide seamless paths to Design Studio and Shop", () => {
    const inspector = inspectFile(HOMEPAGE_PATH);
    assert(inspector !== null, "Homepage file must be readable");

    const links = inspector.extractLinks();
    assert(
      links.includes("/design") || links.some((l) => l.startsWith("/design")),
      "Homepage must link to /design customizer studio"
    );
    assert(
      links.includes("/shop"),
      "Homepage must link to /shop catalog"
    );
  });

  await t.test("Feature 14.8: [CRITICAL CONSTRAINT] ABSENCE of WhatsApp links or widgets on Homepage", () => {
    const inspector = inspectFile(HOMEPAGE_PATH);
    assert(inspector !== null, "Homepage file must be readable");

    assert(
      !inspector.containsText("wa.me"),
      "Homepage must NOT contain any wa.me WhatsApp links"
    );
    assert(
      !inspector.containsText("api.whatsapp.com"),
      "Homepage must NOT contain any api.whatsapp.com links"
    );
    assert(
      !inspector.containsText("whatsapp", false),
      "Homepage must NOT contain WhatsApp branding, widgets, or action buttons"
    );
  });
}
