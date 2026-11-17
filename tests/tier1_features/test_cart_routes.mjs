/**
 * Tier 1 Feature 7: Cart & Checkout Routes Parity
 * Validates that /cart and /checkout routes resolve cleanly without 404
 * and integrate seamlessly into the active customer quote and checkout flow.
 */

import path from "node:path";
import fs from "node:fs";
import { assert, assertEqual } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const CART_PAGE = path.join(ROOT, "src", "app", "cart", "page.tsx");
const CHECKOUT_PAGE = path.join(ROOT, "src", "app", "checkout", "page.tsx");

export default async function (t) {
  await t.test("Feature 7.1: /cart route page file exists on disk", () => {
    const routeStatus = checkRouteFileExists("/cart");
    assert(
      routeStatus.exists,
      `Route /cart must resolve to a valid page file at ${routeStatus.filePath}`
    );
  });

  await t.test("Feature 7.2: /cart route exports a default React page component", () => {
    const exportStatus = checkRouteExport("/cart", "default");
    assert(
      exportStatus.valid,
      `Route /cart must export default page component: ${exportStatus.reason}`
    );
  });

  await t.test("Feature 7.3: /checkout route page file exists on disk", () => {
    const routeStatus = checkRouteFileExists("/checkout");
    assert(
      routeStatus.exists,
      `Route /checkout must resolve to a valid page file at ${routeStatus.filePath}`
    );
  });

  await t.test("Feature 7.4: /checkout route exports a default React page component", () => {
    const exportStatus = checkRouteExport("/checkout", "default");
    assert(
      exportStatus.valid,
      `Route /checkout must export default page component: ${exportStatus.reason}`
    );
  });

  await t.test("Feature 7.5: /cart seamlessly connects to customer quote / cart review flow", () => {
    const inspector = inspectFile(CART_PAGE);
    assert(
      inspector !== null,
      `Cannot inspect /cart page file at ${CART_PAGE}`
    );
    // Should either render cart review or redirect/forward to /quote
    const integratesQuote =
      inspector.containsText("quote") ||
      inspector.containsText("CartContext") ||
      inspector.containsText("useCart") ||
      inspector.containsText("redirect");

    assert(
      integratesQuote,
      "/cart page must route into the active quote and checkout flow"
    );
  });

  await t.test("Feature 7.6: /checkout connects to order finalization and quote submission", () => {
    const inspector = inspectFile(CHECKOUT_PAGE);
    assert(
      inspector !== null,
      `Cannot inspect /checkout page file at ${CHECKOUT_PAGE}`
    );
    const integratesCheckout =
      inspector.containsText("quote") ||
      inspector.containsText("CartContext") ||
      inspector.containsText("checkout") ||
      inspector.containsText("redirect");

    assert(
      integratesCheckout,
      "/checkout page must provide checkout conversion or redirect to active quote list"
    );
  });
}
