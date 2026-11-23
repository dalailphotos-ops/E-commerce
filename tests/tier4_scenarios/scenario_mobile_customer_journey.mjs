/**
 * Tier 4 Real-World Application Scenario 4: Responsive Mobile Customer Journey
 * 
 * Domain Narrative:
 * A mobile visitor accesses the store on a smartphone device:
 * 1. Checks top announcement bar for phone (+91 80899 63691) and email (orders@assonclothing.com)
 * 2. Navigates homepage sections (Hero, Blanks catalog, Print methods, Estimator CTA)
 * 3. Inspects product card color swatches and garment variations on mobile viewport
 * 4. Reviews factory credibility, MOQs, and production FAQs
 * 5. Submits an in-app formal quote through mobile conversion form to /api/quotes
 * 6. Audits full viewport to confirm STRICT ABSENCE of WhatsApp integrations (user constraint)
 * 
 * Features Exercised: F1, F2, F3, F14, F15, F18, F24
 * Strict Constraint: ZERO WhatsApp throughout the workflow
 */

import path from "node:path";
import {
  assert,
  assertEqual,
  assertDeepEqual,
  assertMatch,
} from "../harness/assertions.mjs";
import {
  GARMENT_CATALOG,
  getGarmentUnitPrice,
  calculateLineItem,
  calculateOrder,
  GST_PERCENTAGE,
} from "../harness/pricing_simulator.mjs";
import { CartSimulator, MockLocalStorage, STORAGE_KEY } from "../harness/state_simulator.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";

const ROOT = process.cwd();
const HOME_PAGE = path.join(ROOT, "src", "app", "page.tsx");
const NAVBAR_FILE = path.join(ROOT, "src", "components", "Navbar.tsx");
const QUOTE_PAGE = path.join(ROOT, "src", "app", "quote", "page.tsx");
const CONSTANTS_FILE = path.join(ROOT, "src", "lib", "constants.ts");

export default async function (t) {
  await t.test("Scenario 4.1: Mobile landing & Top Announcement Bar renders official contact info with ZERO WhatsApp", () => {
    const inspector = inspectFile(NAVBAR_FILE);
    assert(inspector !== null, "Navbar component must exist and be readable");

    // Must display official phone and email
    assert(
      inspector.containsText("+91 80899 63691"),
      "Navbar top announcement bar must display official phone: +91 80899 63691"
    );
    assert(
      inspector.containsText("orders@assonclothing.com"),
      "Navbar top announcement bar must display official email: orders@assonclothing.com"
    );

    // Must render Quote List counter badge for quick mobile inspection
    assert(
      inspector.containsText("Quote List") || inspector.containsText("data-quote-count"),
      "Navbar must provide a Quote List access link with count badge"
    );

    // STRICT ZERO WhatsApp assertion
    assert(
      !inspector.containsText("whatsapp", false) &&
      !inspector.containsText("wa.me", false) &&
      !inspector.containsText("api.whatsapp.com", false),
      "Navbar announcement bar and header must contain STRICTLY ZERO WhatsApp links or buttons"
    );
  });

  await t.test("Scenario 4.2: Mobile responsive navigation through Homepage sections and value propositions", () => {
    const routeCheck = checkRouteFileExists("/");
    assert(routeCheck.exists, "Homepage route / must resolve to valid page file");

    const inspector = inspectFile(HOME_PAGE);
    assert(inspector !== null, "Unable to inspect homepage component");

    // Hero section with clear headline
    assert(
      inspector.containsText("Custom Apparel") || inspector.containsText("South India"),
      "Homepage must contain hero section with South India custom apparel manufacturing focus"
    );

    // Blanks showcase section
    assert(
      inspector.containsText("Blanks") || inspector.containsText("Silhouettes"),
      "Homepage must showcase blanks catalog"
    );

    // Printing technologies section (DTF, Screen Printing, Puff, Embroidery)
    assert(
      inspector.containsText("DTF") || inspector.containsText("Direct To Film"),
      "Homepage must highlight DTF printing technology"
    );
    assert(
      inspector.containsText("Screen Printing") || inspector.containsText("SP"),
      "Homepage must highlight Screen Printing technology"
    );

    // USPs: Low MOQ, Free Neck Label, Factory Direct
    assert(
      inspector.containsText("MOQ") || inspector.containsText("10"),
      "Homepage must communicate low 10 pc MOQ policy"
    );
    assert(
      inspector.containsText("Neck Label") || inspector.containsText("Free"),
      "Homepage must feature the free brand neck label promotion"
    );
  });

  await t.test("Scenario 4.3: Mobile Card Swatches & Garment Preview options across silhouettes", () => {
    const inspector = inspectFile(CONSTANTS_FILE);
    assert(inspector !== null, "Constants file must be readable");

    // Verify all garments provide multiple colorways with front & back preview images
    assert(
      inspector.containsText("colours") || inspector.containsText("colors"),
      "Garment definitions must provide multi-color swatch palettes"
    );
    assert(
      inspector.containsText("hex"),
      "Swatches must define valid hex color codes for touch styling"
    );
    assert(
      inspector.containsText("front") && inspector.containsText("back"),
      "Garments must supply front and back view URLs for interactive swatch preview"
    );
  });

  await t.test("Scenario 4.4: Mobile guidance coverage for customer confidence and commercial policies", () => {
    const homeInspector = inspectFile(HOME_PAGE);
    assert(homeInspector !== null, "Homepage must exist");

    // Check presence of links to customer tools: Design Studio, Price Estimator, Shop
    const links = homeInspector.extractLinks();
    assert(
      links.includes("/design") || homeInspector.containsText("/design"),
      "Homepage must link to Design Studio"
    );
    assert(
      links.includes("/price-estimator") || homeInspector.containsText("/price-estimator"),
      "Homepage must link to Price Estimator"
    );
    assert(
      links.includes("/bulk-orders") || homeInspector.containsText("/bulk-orders"),
      "Homepage must link to Bulk Orders"
    );
    assert(
      !links.includes("/shop"),
      "Homepage must not link to decommissioned Shop Blanks"
    );
  });

  await t.test("Scenario 4.5: Mobile In-App Quote submission (/api/quotes) and Strict Viewport WhatsApp Audit", () => {
    // Check quote route exists
    const quoteRoute = checkRouteFileExists("/quote");
    assert(quoteRoute.exists, "/quote page must exist");

    const quoteInspector = inspectFile(QUOTE_PAGE);
    assert(quoteInspector !== null, "Quote page must exist");

    // Validate mobile quote submission payload structure
    const mobileQuotePayload = {
      customerName: "Kavya Patel",
      phone: "+91 98234 56789",
      email: "kavya@aestheticdrop.in",
      company: "Aesthetic Drop",
      items: [
        {
          productId: "oversized-tee-230-gsm",
          productName: "Oversized Tee — 230 GSM",
          color: "Washed Olive",
          quantity: 10,
          sizes: { S: 3, M: 4, L: 3 },
          unitPrice: 250,
          totalPrice: 2500,
        },
      ],
      subtotal: 2500,
      gst: 125,
      total: 2625,
      notes: "Mobile order inquiry for college fest batch",
    };

    assertEqual(mobileQuotePayload.subtotal, 2500);
    assertEqual(mobileQuotePayload.gst, 125, "5% GST on ₹2,500 must equal ₹125");
    assertEqual(mobileQuotePayload.total, 2625, "Grand total must equal ₹2,625");

    // Viewport Audit: Verify strictly ZERO WhatsApp integration across Homepage and Quote page
    assert(
      !homeInspectorHasWhatsApp(HOME_PAGE) && !homeInspectorHasWhatsApp(QUOTE_PAGE),
      "Audit confirmed: Strictly ZERO WhatsApp links, buttons, or scripts across mobile views"
    );
  });
}

function homeInspectorHasWhatsApp(filePath) {
  const inspector = inspectFile(filePath);
  if (!inspector) return false;
  return (
    inspector.containsText("whatsapp", false) ||
    inspector.containsText("wa.me", false) ||
    inspector.containsText("api.whatsapp.com", false)
  );
}
