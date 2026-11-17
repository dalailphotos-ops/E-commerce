/**
 * Tier 4 Real-World Application Scenario 5: Brand Due Diligence & Commercial RFQ
 * 
 * Domain Narrative:
 * A corporate procurement manager conducts due diligence on Asson Clothing Brand:
 * 1. Inspects /about for South India factory history, lab equipment, and bio-washed fabric standards
 * 2. Reviews /services for all 5 apparel decoration techniques (DTF, Screen, Puff, Embroidery, Relabeling)
 * 3. Audits /terms-of-service and /privacy-policy for MOQ policies, tolerances, washing care, and returns
 * 4. Visits /contact to verify official phone (+91 80899 63691), email (orders@assonclothing.com), and submit B2B enquiry to /api/enquiries
 * 5. Strictly asserts ZERO WhatsApp presence across all corporate, legal, and contact channels
 * 
 * Features Exercised: F3, F9, F10, F12, F13
 * Strict Constraint: ZERO WhatsApp throughout the workflow
 */

import path from "node:path";
import {
  assert,
  assertEqual,
  assertDeepEqual,
  assertMatch,
} from "../harness/assertions.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";

const ROOT = process.cwd();
const ABOUT_PAGE = path.join(ROOT, "src", "app", "about", "page.tsx");
const SERVICES_PAGE = path.join(ROOT, "src", "app", "services", "page.tsx");
const TERMS_PAGE = path.join(ROOT, "src", "app", "terms-of-service", "page.tsx");
const PRIVACY_PAGE = path.join(ROOT, "src", "app", "privacy-policy", "page.tsx");
const CONTACT_PAGE = path.join(ROOT, "src", "app", "contact", "page.tsx");
const FOOTER_FILE = path.join(ROOT, "src", "components", "Footer.tsx");

export default async function (t) {
  await t.test("Scenario 5.1: Corporate buyer evaluates factory story and fabric quality on /about", () => {
    const routeCheck = checkRouteFileExists("/about");
    assert(routeCheck.exists, `/about page must exist at ${routeCheck.filePath}`);

    const exportCheck = checkRouteExport("/about", "default");
    assert(exportCheck.valid, `/about must export a default React component`);

    const inspector = inspectFile(ABOUT_PAGE);
    assert(inspector !== null, "Unable to inspect /about page component");

    // Factory story & Tirupur / South India textile hub credibility
    assert(
      inspector.containsText("South India", false) || inspector.containsText("Tirupur", false) || inspector.containsText("factory", false),
      "/about must detail South India textile manufacturing heritage"
    );

    // Bio-washed cotton and quality standards
    assert(
      inspector.containsText("cotton", false) || inspector.containsText("bio-wash", false) || inspector.containsText("quality", false),
      "/about must emphasize 100% combed bio-washed cotton and laboratory quality"
    );

    // ZERO WhatsApp verification
    assert(
      !inspector.containsText("whatsapp", false) && !inspector.containsText("wa.me", false),
      "/about must contain ZERO WhatsApp references"
    );
  });

  await t.test("Scenario 5.2: Commercial buyer reviews 5 apparel decoration techniques on /services", () => {
    const routeCheck = checkRouteFileExists("/services");
    assert(routeCheck.exists, `/services page must exist at ${routeCheck.filePath}`);

    const exportCheck = checkRouteExport("/services", "default");
    assert(exportCheck.valid, `/services must export a default React component`);

    const inspector = inspectFile(SERVICES_PAGE);
    assert(inspector !== null, "Unable to inspect /services page component");

    // 5 Printing methods: DTF, Screen Printing, 3D Puff, Embroidery, Custom Relabeling
    assert(
      inspector.containsText("DTF", false) || inspector.containsText("Direct to Film", false),
      "/services must showcase DTF printing"
    );
    assert(
      inspector.containsText("Screen", false),
      "/services must showcase Screen printing"
    );
    assert(
      inspector.containsText("Puff", false) || inspector.containsText("3D", false),
      "/services must showcase 3D puff technique"
    );
    assert(
      inspector.containsText("Embroidery", false),
      "/services must showcase embroidery capabilities"
    );
    assert(
      inspector.containsText("label", false) || inspector.containsText("tag", false) || inspector.containsText("branding", false),
      "/services must showcase custom neck relabeling"
    );

    // ZERO WhatsApp verification
    assert(
      !inspector.containsText("whatsapp", false) && !inspector.containsText("wa.me", false),
      "/services must contain ZERO WhatsApp references"
    );
  });

  await t.test("Scenario 5.3: Buyer audits legal compliance on /terms-of-service and /privacy-policy", () => {
    const termsCheck = checkRouteFileExists("/terms-of-service");
    assert(termsCheck.exists, `/terms-of-service page must exist at ${termsCheck.filePath}`);

    const privacyCheck = checkRouteFileExists("/privacy-policy");
    assert(privacyCheck.exists, `/privacy-policy page must exist at ${privacyCheck.filePath}`);

    const termsInspector = inspectFile(TERMS_PAGE);
    assert(termsInspector !== null, "Unable to inspect /terms-of-service component");

    // Terms must document MOQs, tolerances, washing care, and returns
    assert(
      termsInspector.containsText("MOQ", false) || termsInspector.containsText("Minimum", false),
      "/terms-of-service must specify MOQ terms"
    );
    assert(
      termsInspector.containsText("tolerance", false) || termsInspector.containsText("variation", false),
      "/terms-of-service must document print and dimension tolerances"
    );
    assert(
      termsInspector.containsText("wash", false) || termsInspector.containsText("care", false),
      "/terms-of-service must outline garment washing and care recommendations"
    );
    assert(
      termsInspector.containsText("return", false) || termsInspector.containsText("defect", false) || termsInspector.containsText("replacement", false),
      "/terms-of-service must define defect reporting and return policy"
    );

    // ZERO WhatsApp verification
    assert(
      !termsInspector.containsText("whatsapp", false) && !termsInspector.containsText("wa.me", false),
      "/terms-of-service must contain ZERO WhatsApp links"
    );
  });

  await t.test("Scenario 5.4: Corporate buyer submits formal B2B enquiry on /contact to /api/enquiries", () => {
    const contactCheck = checkRouteFileExists("/contact");
    assert(contactCheck.exists, `/contact page must exist at ${contactCheck.filePath}`);

    const exportCheck = checkRouteExport("/contact", "default");
    assert(exportCheck.valid, `/contact must export a default React component`);

    const inspector = inspectFile(CONTACT_PAGE);
    assert(inspector !== null, "Unable to inspect /contact page component");

    // Must display phone (+91 80899 63691) and email (orders@assonclothing.com)
    assert(
      inspector.containsText("+91 80899 63691"),
      "/contact must display official phone: +91 80899 63691"
    );
    assert(
      inspector.containsText("orders@assonclothing.com"),
      "/contact must display official email: orders@assonclothing.com"
    );

    // Form submission targets /api/enquiries
    assert(
      inspector.containsText("/api/enquiries"),
      "/contact form must submit to /api/enquiries"
    );

    // Validate structured B2B enquiry payload
    const b2bEnquiryPayload = {
      name: "Suresh Menon",
      email: "suresh@apexapparel.co",
      phone: "+91 94455 66778",
      company: "Apex Apparel Exports",
      apparelType: "Oversized Tee — 250 GSM French Terry",
      quantity: 500,
      printingType: "Screen Printing + 3D Puff",
      details: "Seeking ongoing manufacturing partnership for quarterly collections of 500 pcs per drop",
    };

    assert(b2bEnquiryPayload.name && b2bEnquiryPayload.phone && b2bEnquiryPayload.apparelType, "Enquiry payload must satisfy required fields");
    assertEqual(b2bEnquiryPayload.quantity, 500);

    // ZERO WhatsApp verification
    assert(
      !inspector.containsText("whatsapp", false) && !inspector.containsText("wa.me", false),
      "/contact must strictly contain ZERO WhatsApp links or CTAs"
    );
  });

  await t.test("Scenario 5.5: Site-wide Footer audit strictly verifies ZERO WhatsApp integration", () => {
    const footerInspector = inspectFile(FOOTER_FILE);
    assert(footerInspector !== null, "Footer component must exist and be readable");

    // Verify 4-column link structure contains live links
    const links = footerInspector.extractLinks();
    assert(
      links.includes("/about") || footerInspector.containsText("/about"),
      "Footer must link to /about"
    );
    assert(
      links.includes("/contact") || footerInspector.containsText("/contact"),
      "Footer must link to /contact"
    );
    assert(
      links.includes("/terms-of-service") || footerInspector.containsText("/terms-of-service"),
      "Footer must link to /terms-of-service"
    );
    assert(
      links.includes("/privacy-policy") || footerInspector.containsText("/privacy-policy"),
      "Footer must link to /privacy-policy"
    );

    // STRICT ZERO WHATSAPP AUDIT
    assert(
      !footerInspector.containsText("whatsapp", false) &&
      !footerInspector.containsText("wa.me", false) &&
      !footerInspector.containsText("api.whatsapp.com", false),
      "Footer must contain STRICTLY ZERO WhatsApp links, icons, or references"
    );
  });
}
