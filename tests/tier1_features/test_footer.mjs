/**
 * Tier 1 Feature 3: Footer Reorganization
 * Validates 4-column footer, presence of all required page links (About, Contact, Dropshipping, Services, Legal),
 * absence of duplicate links, and corporate information.
 */

import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const FOOTER_FILE = path.join(ROOT, "src", "components", "Footer.tsx");

export default async function (t) {
  const footer = inspectFile(FOOTER_FILE);
  assert(footer !== null, `Footer component must exist at ${FOOTER_FILE}`);

  await t.test("Feature 3.1: 4-column responsive grid layout", () => {
    assert(
      footer.containsText("grid-cols-1") && footer.containsText("md:grid-cols-4"),
      "Footer must define a responsive 4-column grid (grid-cols-1 md:grid-cols-4)"
    );
  });

  await t.test("Feature 3.2: Company and supporting page links are present", () => {
    const links = footer.extractLinks();
    assert(links.includes("/about"), "Footer must include link to /about");
    assert(links.includes("/contact"), "Footer must include link to /contact");
    assert(links.includes("/dropshipping"), "Footer must include link to /dropshipping");
    assert(links.includes("/services"), "Footer must include link to /services");
  });

  await t.test("Feature 3.3: Legal policy links (Privacy Policy & Terms of Service) are present", () => {
    const links = footer.extractLinks();
    assert(links.includes("/privacy-policy"), "Footer must include link to /privacy-policy");
    assert(links.includes("/terms-of-service"), "Footer must include link to /terms-of-service");
  });

  await t.test("Feature 3.4: No duplicate links in footer navigation lists", () => {
    // Extract all links within <li> elements
    const liLinkRegex = /<li>\s*<Link[^>]+href=["']([^"']+)["']/g;
    const navLinks = [];
    let match;
    while ((match = liLinkRegex.exec(footer.content)) !== null) {
      navLinks.push(match[1]);
    }
    const seen = new Set();
    const duplicates = [];
    for (const l of navLinks) {
      if (seen.has(l)) {
        duplicates.push(l);
      }
      seen.add(l);
    }
    assertEqual(
      duplicates.length,
      0,
      `Footer navigation list must not contain duplicate links: ${duplicates.join(", ")}`
    );
  });

  await t.test("Feature 3.5: Contact channels, address, and GST note in footer", () => {
    assert(
      footer.containsText("+91 80899 63691") || footer.containsText("+918089963691"),
      "Footer must display contact phone +91 80899 63691"
    );
    assert(
      footer.containsText("South India") || footer.containsText("Manufacturing"),
      "Footer must reference South India manufacturing facilities"
    );
    assert(
      footer.containsText("GST: 5%") || footer.containsText("5%"),
      "Footer must note 5% GST applicability"
    );
  });
}
