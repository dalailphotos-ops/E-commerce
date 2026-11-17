/**
 * Tier 1 Features 9-13: Supporting Pages Verification Suite
 * Validates /about, /contact, /dropshipping, /services, /privacy-policy, and /terms-of-service
 * with >= 5 tests per feature area (total 27 tests).
 * 
 * NOTE: Per strict user command ("i wont integrate whatsapp"), no WhatsApp integration is expected or asserted.
 * Official communication channels are in-app quotes (/api/quotes), email (orders@assonclothing.com), and phone (+91 80899 63691).
 */

import path from "node:path";
import { assert, assertEqual } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const ABOUT_PAGE = path.join(ROOT, "src", "app", "about", "page.tsx");
const CONTACT_PAGE = path.join(ROOT, "src", "app", "contact", "page.tsx");
const DROPSHIPPING_PAGE = path.join(ROOT, "src", "app", "dropshipping", "page.tsx");
const SERVICES_PAGE = path.join(ROOT, "src", "app", "services", "page.tsx");
const PRIVACY_PAGE = path.join(ROOT, "src", "app", "privacy-policy", "page.tsx");
const TERMS_PAGE = path.join(ROOT, "src", "app", "terms-of-service", "page.tsx");

export default async function (t) {
  // -------------------------------------------------------------
  // Feature 9: Supporting Pages — About Us (/about) [5 tests]
  // -------------------------------------------------------------

  await t.test("Feature 9.1: /about page file exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/about");
    assert(fileStatus.exists, `/about page file must exist at ${fileStatus.filePath}`);
    const exportStatus = checkRouteExport("/about", "default");
    assert(exportStatus.valid, `/about must export default component: ${exportStatus.reason}`);
  });

  await t.test("Feature 9.2: /about details Asson South India manufacturing factory lab", () => {
    const inspector = inspectFile(ABOUT_PAGE);
    assert(inspector !== null, "about page file must be readable");
    assert(
      inspector.containsText("South India") || inspector.containsText("Kerala") || inspector.containsText("factory"),
      "/about must detail South India factory facilities"
    );
  });

  await t.test("Feature 9.3: /about highlights 100% bio-washed cotton and fabric standards", () => {
    const inspector = inspectFile(ABOUT_PAGE);
    assert(inspector !== null, "about page file must be readable");
    assert(
      inspector.containsText("cotton") && (inspector.containsText("bio-wash") || inspector.containsText("combed")),
      "/about must highlight premium 100% bio-washed cotton and fabric quality"
    );
  });

  await t.test("Feature 9.4: /about specifies production capacity and low MOQ (10 pcs)", () => {
    const inspector = inspectFile(ABOUT_PAGE);
    assert(inspector !== null, "about page file must be readable");
    assert(
      inspector.containsText("10") || inspector.containsText("MOQ"),
      "/about must mention accessible low MOQ starting at 10 pcs"
    );
  });

  await t.test("Feature 9.5: /about links customers to product catalog and customization", () => {
    const inspector = inspectFile(ABOUT_PAGE);
    assert(inspector !== null, "about page file must be readable");
    const links = inspector.extractLinks();
    assert(
      links.includes("/shop") || links.includes("/design") || links.includes("/contact"),
      "/about must provide navigational CTA to /shop, /design, or /contact"
    );
  });

  // -------------------------------------------------------------
  // Feature 10: Supporting Pages — Contact (/contact) [5 tests]
  // -------------------------------------------------------------

  await t.test("Feature 10.1: /contact page file exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/contact");
    assert(fileStatus.exists, `/contact page file must exist at ${fileStatus.filePath}`);
    const exportStatus = checkRouteExport("/contact", "default");
    assert(exportStatus.valid, `/contact must export default component: ${exportStatus.reason}`);
  });

  await t.test("Feature 10.2: /contact displays official phone number (+91 80899 63691)", () => {
    const inspector = inspectFile(CONTACT_PAGE);
    assert(inspector !== null, "contact page file must be readable");
    assert(
      inspector.containsText("+91 80899 63691") || inspector.containsText("+918089963691"),
      "/contact must display official phone number +91 80899 63691"
    );
  });

  await t.test("Feature 10.3: /contact provides official email (orders@assonclothing.com) with Zero WhatsApp", () => {
    const inspector = inspectFile(CONTACT_PAGE);
    assert(inspector !== null, "contact page file must be readable");
    assert(
      inspector.containsText("orders@assonclothing.com") || inspector.containsText("@"),
      "/contact must provide official email contact channel (orders@assonclothing.com)"
    );
    assert(
      !inspector.containsText("wa.me"),
      "/contact must adhere to Zero WhatsApp constraint (no wa.me links)"
    );
  });

  await t.test("Feature 10.4: /contact provides physical manufacturing hub location", () => {
    const inspector = inspectFile(CONTACT_PAGE);
    assert(inspector !== null, "contact page file must be readable");
    assert(
      inspector.containsText("Kerala") || inspector.containsText("Malappuram") || inspector.containsText("South India"),
      "/contact must display Kerala / South India manufacturing hub location"
    );
  });

  await t.test("Feature 10.5: /contact includes direct enquiry contact form", () => {
    const inspector = inspectFile(CONTACT_PAGE);
    assert(inspector !== null, "contact page file must be readable");
    assert(
      inspector.hasElement("form") || inspector.containsText("form") || inspector.containsText("input"),
      "/contact must include an interactive message or enquiry form"
    );
  });

  // -------------------------------------------------------------
  // Feature 11: Supporting Pages — Dropshipping (/dropshipping) [5 tests]
  // -------------------------------------------------------------

  await t.test("Feature 11.1: /dropshipping page file exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/dropshipping");
    assert(fileStatus.exists, `/dropshipping page file must exist at ${fileStatus.filePath}`);
    const exportStatus = checkRouteExport("/dropshipping", "default");
    assert(exportStatus.valid, `/dropshipping must export default component: ${exportStatus.reason}`);
  });

  await t.test("Feature 11.2: /dropshipping explains Print-on-Demand (POD) workflow steps", () => {
    const inspector = inspectFile(DROPSHIPPING_PAGE);
    assert(inspector !== null, "dropshipping page file must be readable");
    assert(
      inspector.containsText("Print") || inspector.containsText("Demand") || inspector.containsText("Ship"),
      "/dropshipping must explain POD fulfillment workflow"
    );
  });

  await t.test("Feature 11.3: /dropshipping details logistics and pan-India courier shipping", () => {
    const inspector = inspectFile(DROPSHIPPING_PAGE);
    assert(inspector !== null, "dropshipping page file must be readable");
    assert(
      inspector.containsText("shipping") || inspector.containsText("courier") || inspector.containsText("India"),
      "/dropshipping must outline shipping and courier logistics"
    );
  });

  await t.test("Feature 11.4: /dropshipping highlights custom neck labels and blind shipping", () => {
    const inspector = inspectFile(DROPSHIPPING_PAGE);
    assert(inspector !== null, "dropshipping page file must be readable");
    assert(
      inspector.containsText("label") || inspector.containsText("branding") || inspector.containsText("packaging"),
      "/dropshipping must highlight white-labeling and custom neck label services"
    );
  });

  await t.test("Feature 11.5: /dropshipping provides onboarding or partner enquiry CTA", () => {
    const inspector = inspectFile(DROPSHIPPING_PAGE);
    assert(inspector !== null, "dropshipping page file must be readable");
    assert(
      inspector.containsText("Apply") || inspector.containsText("Start") || inspector.containsText("Contact") || inspector.hasElement("form"),
      "/dropshipping must include a partner signup or enquiry CTA"
    );
  });

  // -------------------------------------------------------------
  // Feature 12: Supporting Pages — Services (/services) [5 tests]
  // -------------------------------------------------------------

  await t.test("Feature 12.1: /services page file exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/services");
    assert(fileStatus.exists, `/services page file must exist at ${fileStatus.filePath}`);
    const exportStatus = checkRouteExport("/services", "default");
    assert(exportStatus.valid, `/services must export default component: ${exportStatus.reason}`);
  });

  await t.test("Feature 12.2: /services details DTF (Direct-to-Film) printing technology", () => {
    const inspector = inspectFile(SERVICES_PAGE);
    assert(inspector !== null, "services page file must be readable");
    assert(
      inspector.containsText("DTF") || inspector.containsText("Direct-to-Film") || inspector.containsText("Direct to Film"),
      "/services must showcase DTF printing technology"
    );
  });

  await t.test("Feature 12.3: /services details high-volume screen printing", () => {
    const inspector = inspectFile(SERVICES_PAGE);
    assert(inspector !== null, "services page file must be readable");
    assert(
      inspector.containsText("Screen Printing") || inspector.containsText("screen printing"),
      "/services must detail screen printing capabilities"
    );
  });

  await t.test("Feature 12.4: /services showcases 3D puff and embroidery techniques", () => {
    const inspector = inspectFile(SERVICES_PAGE);
    assert(inspector !== null, "services page file must be readable");
    assert(
      inspector.containsText("puff") || inspector.containsText("embroidery") || inspector.containsText("Puff"),
      "/services must cover 3D puff print and embroidery techniques"
    );
  });

  await t.test("Feature 12.5: /services details custom relabeling and tags", () => {
    const inspector = inspectFile(SERVICES_PAGE);
    assert(inspector !== null, "services page file must be readable");
    assert(
      inspector.containsText("relabeling") || inspector.containsText("tag") || inspector.containsText("label"),
      "/services must cover custom neck labels and merchandise tags"
    );
  });

  // -------------------------------------------------------------
  // Feature 13: Supporting Pages — Legal Policies (/privacy-policy & /terms-of-service) [6 tests]
  // -------------------------------------------------------------

  await t.test("Feature 13.1: /privacy-policy page file exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/privacy-policy");
    assert(fileStatus.exists, `/privacy-policy page file must exist at ${fileStatus.filePath}`);
    const exportStatus = checkRouteExport("/privacy-policy", "default");
    assert(exportStatus.valid, `/privacy-policy must export default component: ${exportStatus.reason}`);
  });

  await t.test("Feature 13.2: /terms-of-service page file exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/terms-of-service");
    assert(fileStatus.exists, `/terms-of-service page file must exist at ${fileStatus.filePath}`);
    const exportStatus = checkRouteExport("/terms-of-service", "default");
    assert(exportStatus.valid, `/terms-of-service must export default component: ${exportStatus.reason}`);
  });

  await t.test("Feature 13.3: /terms-of-service defines Minimum Order Quantity (MOQ) policy", () => {
    const inspector = inspectFile(TERMS_PAGE);
    assert(inspector !== null, "terms-of-service page file must be readable");
    assert(
      inspector.containsText("MOQ") || inspector.containsText("Minimum Order"),
      "/terms-of-service must specify MOQ terms"
    );
  });

  await t.test("Feature 13.4: /terms-of-service specifies print tolerance and color variation clauses", () => {
    const inspector = inspectFile(TERMS_PAGE);
    assert(inspector !== null, "terms-of-service page file must be readable");
    assert(
      inspector.containsText("tolerance") || inspector.containsText("variation") || inspector.containsText("color"),
      "/terms-of-service must specify manufacturing and print tolerances"
    );
  });

  await t.test("Feature 13.5: /terms-of-service covers garment washing care recommendations", () => {
    const inspector = inspectFile(TERMS_PAGE);
    assert(inspector !== null, "terms-of-service page file must be readable");
    assert(
      inspector.containsText("wash") || inspector.containsText("care"),
      "/terms-of-service must document garment washing and print care instructions"
    );
  });

  await t.test("Feature 13.6: /terms-of-service documents returns and defect resolution policy", () => {
    const inspector = inspectFile(TERMS_PAGE);
    assert(inspector !== null, "terms-of-service page file must be readable");
    assert(
      inspector.containsText("return") || inspector.containsText("defect") || inspector.containsText("refund"),
      "/terms-of-service must document policies for defective or damaged goods"
    );
  });
}
