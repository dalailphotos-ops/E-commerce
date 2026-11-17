/**
 * Tier 1 Feature 1: Reference Design System & Tokens
 * Validates warm organic canvas theme, color tokens, Archivo/Inter typography, and 18px card radiuses.
 */

import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const GLOBALS_CSS = path.join(ROOT, "src", "app", "globals.css");
const TAILWIND_CONFIG = path.join(ROOT, "tailwind.config.ts");
const ROOT_LAYOUT = path.join(ROOT, "src", "app", "layout.tsx");

export default async function (t) {
  await t.test("Feature 1.1: Root CSS variable --paper is defined with #f6f5f1", () => {
    const inspector = inspectFile(GLOBALS_CSS);
    assert(inspector !== null, `globals.css must exist at ${GLOBALS_CSS}`);
    const vars = inspector.extractCssVariables();
    assert(vars["--paper"] !== undefined, "CSS variable --paper must be defined in :root");
    assertEqual(
      vars["--paper"].toLowerCase(),
      "#f6f5f1",
      "CSS variable --paper must match warm organic background #f6f5f1"
    );
  });

  await t.test("Feature 1.2: Root CSS variables --line and --card are defined", () => {
    const inspector = inspectFile(GLOBALS_CSS);
    assert(inspector !== null, `globals.css must exist at ${GLOBALS_CSS}`);
    const vars = inspector.extractCssVariables();
    assert(vars["--line"] !== undefined, "CSS variable --line must be defined");
    assertEqual(
      vars["--line"].toLowerCase(),
      "#e2dfd8",
      "CSS variable --line must match divider border #e2dfd8"
    );
    assert(vars["--card"] !== undefined, "CSS variable --card must be defined");
    assertEqual(
      vars["--card"].toLowerCase(),
      "#ffffff",
      "CSS variable --card must match card background #ffffff"
    );
  });

  await t.test("Feature 1.3: Brand accent (#e8542b) and WhatsApp (#1fa855) tokens defined", () => {
    const cssInspector = inspectFile(GLOBALS_CSS);
    assert(cssInspector !== null, "globals.css must exist");
    const vars = cssInspector.extractCssVariables();
    assertEqual(
      vars["--accent"]?.toLowerCase(),
      "#e8542b",
      "CSS variable --accent must be #e8542b"
    );
    assertEqual(
      vars["--wa"]?.toLowerCase(),
      "#1fa855",
      "CSS variable --wa must be #1fa855"
    );

    const twInspector = inspectFile(TAILWIND_CONFIG);
    assert(twInspector !== null, "tailwind.config.ts must exist");
    assert(
      twInspector.containsText("paper:") && twInspector.containsText("#f6f5f1"),
      "tailwind.config.ts must extend theme colors with paper #f6f5f1"
    );
    assert(
      twInspector.containsText("wa:") && twInspector.containsText("#1fa855"),
      "tailwind.config.ts must extend theme colors with wa #1fa855"
    );
  });

  await t.test("Feature 1.4: Archivo (headings) and Inter (body) typography configured", () => {
    const layoutInspector = inspectFile(ROOT_LAYOUT);
    assert(layoutInspector !== null, `layout.tsx must exist at ${ROOT_LAYOUT}`);
    assert(
      layoutInspector.containsText("Archivo") && layoutInspector.containsText("Inter"),
      "Root layout must import and configure both Archivo and Inter Google fonts"
    );
    assert(
      layoutInspector.containsText("--font-archivo") && layoutInspector.containsText("--font-inter"),
      "Root layout must configure CSS variables --font-archivo and --font-inter"
    );

    const twInspector = inspectFile(TAILWIND_CONFIG);
    assert(twInspector !== null, "tailwind.config.ts must exist");
    assert(
      twInspector.containsText("fontFamily") &&
        twInspector.containsText("var(--font-archivo)") &&
        twInspector.containsText("var(--font-inter)"),
      "Tailwind configuration must map head and body fonts to font variables"
    );
  });

  await t.test("Feature 1.5: Card border radius token defined as 18px", () => {
    const cssInspector = inspectFile(GLOBALS_CSS);
    assert(cssInspector !== null, "globals.css must exist");
    const vars = cssInspector.extractCssVariables();
    assertEqual(vars["--r"], "18px", "--r CSS variable must equal 18px");

    const twInspector = inspectFile(TAILWIND_CONFIG);
    assert(twInspector !== null, "tailwind.config.ts must exist");
    assert(
      twInspector.containsText("card:") && twInspector.containsText("18px"),
      "tailwind.config.ts borderRadius must define card: 18px"
    );
  });

  await t.test("Feature 1.6: Body background style is bound to warm paper token", () => {
    const cssInspector = inspectFile(GLOBALS_CSS);
    assert(cssInspector !== null, "globals.css must exist");
    assertMatch(
      cssInspector.content,
      /body\s*\{[^}]*background-color:\s*var\(--paper\)/s,
      "globals.css body rule must set background-color: var(--paper)"
    );
  });
}
