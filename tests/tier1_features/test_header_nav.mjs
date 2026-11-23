/**
 * Tier 1 Feature 2: Top Announcement Bar & Sticky Header
 * Validates top bar with official phone (+91 80899 63691), email/quote links, Quote List badge counter,
 * sticky scroll shadow, and main navigation links.
 * 
 * NOTE: Per strict user command ("i wont integrate whatsapp"), no WhatsApp integration is expected or asserted.
 */

import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const NAVBAR_FILE = path.join(ROOT, "src", "components", "Navbar.tsx");

export default async function (t) {
  const nav = inspectFile(NAVBAR_FILE);
  assert(nav !== null, `Navbar component must exist at ${NAVBAR_FILE}`);

  await t.test("Feature 2.1: Top Announcement Bar is rendered in header", () => {
    assert(
      nav.containsText("Top Announcement Bar") || nav.containsText("+91 80899 63691"),
      "Navbar must contain the top announcement bar with contact information"
    );
  });

  await t.test("Feature 2.2: Official phone number and tel: link are present", () => {
    assert(
      nav.containsText("+91 80899 63691") || nav.containsText("+918089963691"),
      "Navbar must display phone number +91 80899 63691"
    );
    assert(
      nav.containsText("tel:+918089963691") || nav.containsText("tel:+91 80899 63691"),
      "Navbar must provide a clickable tel: link for instant dialing"
    );
  });

  await t.test("Feature 2.3: In-app quotation and direct call conversion channels (Zero WhatsApp)", () => {
    // Assert in-app quotes and direct phone link instead of external third-party chat
    assert(
      nav.containsText("Get a Quote") || nav.containsText("/quote") || nav.containsText("Quote List"),
      "Navbar top bar must provide direct in-app quote actions"
    );
    assert(
      nav.containsText("tel:+918089963691") || nav.containsText("+91 80899 63691"),
      "Navbar must offer verified direct phone contact channel"
    );
  });

  await t.test("Feature 2.4: Quote List link and dynamic item count badge", () => {
    assert(
      nav.containsText("Quote List") || nav.containsText("/quote"),
      "Navbar must include link to /quote"
    );
    assert(
      nav.containsText("data-quote-count") || nav.containsText("rounded-full bg-accent"),
      "Navbar must render a quote counter badge pill"
    );
  });

  await t.test("Feature 2.5: Sticky positioning with scroll shadow behavior", () => {
    assert(
      nav.containsText("sticky top-0"),
      "Header element must have 'sticky top-0' CSS classes"
    );
    assert(
      nav.containsText("isScrolled") || nav.containsText("is-scrolled") || nav.containsText("shadow-"),
      "Header must implement dynamic scroll shadow state"
    );
  });

  await t.test("Feature 2.6: Essential store navigation links present", () => {
    const links = nav.extractLinks();
    assert(links.includes("/design"), "Navigation must link to /design");
    assert(links.includes("/bulk-orders"), "Navigation must link to /bulk-orders");
    assert(links.includes("/price-estimator"), "Navigation must link to /price-estimator");
    assert(links.includes("/contact"), "Navigation must link to /contact");
    assert(!links.includes("/shop"), "Navigation must not link to decommissioned /shop");
    assert(!links.includes("/dropshipping"), "Navigation must not link to decommissioned /dropshipping");
  });
}
