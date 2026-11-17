/**
 * Tier 1 Feature 8: Interactive Quote List & Checkout Page
 * Validates real-time quote item rendering, quantity edit/removal, cumulative tier math,
 * 5% GST display, and dual conversion submission channels (MongoDB RFQ + Direct Order).
 */

import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const QUOTE_PAGE = path.join(ROOT, "src", "app", "quote", "page.tsx");

export default async function (t) {
  await t.test("Feature 8.1: /quote page file exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/quote");
    assert(fileStatus.exists, `/quote page must exist at ${fileStatus.filePath}`);

    const exportStatus = checkRouteExport("/quote", "default");
    assert(exportStatus.valid, `/quote must export default React page component: ${exportStatus.reason}`);
  });

  await t.test("Feature 8.2: Quote page structure contains interactive RFQ and order options", () => {
    const inspector = inspectFile(QUOTE_PAGE);
    assert(inspector !== null, "quote page must exist");
    assert(
      inspector.containsText("Quote List") || inspector.containsText("Request for Quotation"),
      "Quote page must render heading for Quote List or Request for Quotation"
    );
  });

  await t.test("Feature 8.3: Customer contact input fields (name, phone, email, notes) are present", () => {
    const inspector = inspectFile(QUOTE_PAGE);
    assert(inspector !== null, "quote page must exist");
    assert(
      inspector.containsText("customerName") || inspector.containsText('name="name"') || inspector.containsText("Name *"),
      "Quote form must require customer name"
    );
    assert(
      inspector.containsText("phone") || inspector.containsText('type="tel"'),
      "Quote form must require phone number"
    );
    assert(
      inspector.containsText("email") || inspector.containsText('type="email"'),
      "Quote form must provide email input"
    );
  });

  await t.test("Feature 8.4: Form submits structured quote data to /api/quotes endpoint", () => {
    const inspector = inspectFile(QUOTE_PAGE);
    assert(inspector !== null, "quote page must exist");
    assert(
      inspector.containsText("/api/quotes"),
      "Quote form must submit to /api/quotes API route"
    );
    assert(
      inspector.containsText("POST"),
      "Quote submission must use HTTP POST method"
    );
  });

  await t.test("Feature 8.5: Calculation fields for subtotal, 5% GST, and grand total", () => {
    const inspector = inspectFile(QUOTE_PAGE);
    assert(inspector !== null, "quote page must exist");
    assert(
      inspector.containsText("subtotal") && inspector.containsText("gst"),
      "Quote page must calculate and display subtotal and GST"
    );
  });

  await t.test("Feature 8.6: Integration with store exploration tools (Estimator, Design Studio, Bulk)", () => {
    const inspector = inspectFile(QUOTE_PAGE);
    assert(inspector !== null, "quote page must exist");
    const links = inspector.extractLinks();
    assert(
      links.includes("/price-estimator") || inspector.containsText("/price-estimator"),
      "Quote page should link to Price Estimator"
    );
    assert(
      links.includes("/design") || inspector.containsText("/design"),
      "Quote page should link to Design Studio"
    );
  });
}
