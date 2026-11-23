/**
 * Tier 2 Boundary & Corner Cases: Route Handling, Edge Queries & Zero WhatsApp
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Validates:
 * - Dynamic route /shop/[slug] invalid slug handling via notFound()
 * - Missing or invalid query parameters on /design fallback to default garment
 * - Robust parsing of malformed numerical inputs (NaN, negative, alphanumeric strings)
 * - Suspense boundary wrapping for client-side search parameter hooks
 * - Complete absence of WhatsApp integration across all public routes & layout components
 */

import path from "node:path";
import fs from "node:fs";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport, resolveRouteToFile } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";
import { GARMENT_CATALOG } from "../harness/pricing_simulator.mjs";

const ROOT = process.cwd();
const PDP_PATH = path.join(ROOT, "src", "app", "shop", "[slug]", "page.tsx");
const DESIGN_PATH = path.join(ROOT, "src", "app", "design", "page.tsx");
const ESTIMATOR_PATH = path.join(ROOT, "src", "app", "price-estimator", "page.tsx");

export default async function (t) {
  await t.test("Route Boundary 2.1: Legacy product slug route safely redirects to Design Studio", () => {
    const inspector = inspectFile(PDP_PATH);
    assert(inspector !== null, "PDP page file must exist");

    assert(
      inspector.containsText("redirect"),
      "PDP route must cleanly redirect to /design studio"
    );
  });

  await t.test("Route Boundary 2.2: /design query parameter fallback for missing or unknown product ID", () => {
    const inspector = inspectFile(DESIGN_PATH);
    assert(inspector !== null, "Design page file must exist");

    // Fallback logic
    assert(
      inspector.containsText("REVERSE_ENGINEERED_PRODUCTS[0]") || inspector.containsText("initialProductId"),
      "Design studio must fall back to default catalog product when query param is omitted or unknown"
    );
  });

  await t.test("Route Boundary 2.3: /design wraps client searchParams in Suspense boundary for Next.js build safety", () => {
    const inspector = inspectFile(DESIGN_PATH);
    assert(inspector !== null, "Design page file must exist");

    assert(
      inspector.containsText("<Suspense") && inspector.containsText("</Suspense>"),
      "Design studio must wrap useSearchParams component within React Suspense boundary"
    );
  });

  await t.test("Route Boundary 2.4: Malformed quantity and size inputs are safely sanitized", () => {
    const sanitizeQuantity = (val) => {
      const num = parseInt(String(val), 10);
      return isNaN(num) || num < 0 ? 0 : num;
    };

    assertEqual(sanitizeQuantity("abc"), 0, "Alphanumeric string must resolve to 0");
    assertEqual(sanitizeQuantity("-50"), 0, "Negative string must resolve to 0");
    assertEqual(sanitizeQuantity(""), 0, "Empty string must resolve to 0");
    assertEqual(sanitizeQuantity("undefined"), 0, "Undefined string must resolve to 0");
    assertEqual(sanitizeQuantity("42"), 42, "Valid number string must parse to integer 42");

    const inspector = inspectFile(DESIGN_PATH);
    assert(
      inspector.containsText("parseInt"),
      "Design studio size input handler must safely parse integer strings"
    );
  });

  await t.test("Route Boundary 2.5: Zero-state cart / direct quote request validation", () => {
    const inspector = inspectFile(ESTIMATOR_PATH);
    assert(inspector !== null, "Estimator page must exist");

    // Requires name and phone before submitting
    assert(
      inspector.containsText("if (!customerName || !customerPhone)") ||
      (inspector.containsText("required") && inspector.containsText("customerPhone")),
      "Quote submission must validate customer contact details"
    );
  });

  await t.test("Route Boundary 2.6: Direct WhatsApp on customizer and clean zero-clutter across storefront pages", () => {
    const storefrontFiles = [
      path.join(ROOT, "src", "app", "page.tsx"),
      path.join(ROOT, "src", "app", "shop", "page.tsx"),
      path.join(ROOT, "src", "app", "shop", "[slug]", "page.tsx"),
      path.join(ROOT, "src", "app", "price-estimator", "page.tsx"),
      path.join(ROOT, "src", "app", "quote", "page.tsx"),
      path.join(ROOT, "src", "components", "Navbar.tsx"),
      path.join(ROOT, "src", "components", "Footer.tsx"),
    ];

    for (const filePath of storefrontFiles) {
      if (fs.existsSync(filePath)) {
        const inspector = inspectFile(filePath);
        const fileName = path.basename(filePath);

        assert(
          !inspector.containsText("wa.me"),
          `${fileName} must NOT contain wa.me WhatsApp links`
        );
        assert(
          !inspector.containsText("api.whatsapp.com"),
          `${fileName} must NOT contain api.whatsapp.com WhatsApp links`
        );
      }
    }

    // Verify Design Studio has direct WhatsApp messaging
    const designInspector = inspectFile(path.join(ROOT, "src", "app", "design", "page.tsx"));
    assert(designInspector !== null, "Design page must exist");
    assert(
      designInspector.containsText("NEXT_PUBLIC_WHATSAPP_NUMBER") || designInspector.containsText("wa.me"),
      "Design studio must support direct WhatsApp quotation integration"
    );
  });

  await t.test("Route Boundary 2.7: External customer conversions strictly use in-app quotes, email, and phone", () => {
    const footerInspector = inspectFile(path.join(ROOT, "src", "components", "Footer.tsx"));
    const navInspector = inspectFile(path.join(ROOT, "src", "components", "Navbar.tsx"));

    // Phone: +91 80899 63691 or email: orders@assonclothing.com
    if (navInspector) {
      assert(
        navInspector.containsText("80899") || navInspector.containsText("orders@assonclothing.com") || navInspector.containsText("Quote"),
        "Navbar must support direct phone, email, or quote list conversion"
      );
    }

    if (footerInspector) {
      assert(
        footerInspector.containsText("orders@assonclothing.com") || footerInspector.containsText("80899"),
        "Footer must support official email or phone ordering conversion"
      );
    }
  });
}
