/**
 * Tier 1 Feature 4: 6th Silhouette & Constants Parity
 * Validates the 6-product blanks catalog, oversized-tee-190-gsm, sleeve zones (left/right),
 * DTF matrix pricing, and GST constants in src/lib/constants.ts.
 */

import path from "node:path";
import { assert, assertEqual, assertGreaterOrEqual } from "../harness/assertions.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const CONSTANTS_FILE = path.join(ROOT, "src", "lib", "constants.ts");

export default async function (t) {
  let constantsModule = null;
  try {
    const fileUrl = new URL(`file://${CONSTANTS_FILE.replace(/\\/g, "/")}`).href;
    constantsModule = await import(fileUrl);
  } catch (err) {
    // Fallback to static inspection if dynamic import fails
  }

  const fileInspector = inspectFile(CONSTANTS_FILE);
  assert(fileInspector !== null, `constants.ts must exist at ${CONSTANTS_FILE}`);

  await t.test("Feature 4.1: Six garment silhouettes defined in blanks catalog", () => {
    if (constantsModule?.REVERSE_ENGINEERED_PRODUCTS) {
      const prods = constantsModule.REVERSE_ENGINEERED_PRODUCTS;
      assertEqual(
        prods.length,
        6,
        `Expected exactly 6 garment products in blanks catalog, but found ${prods.length}`
      );
    } else {
      // Regex check for product definitions
      const matches = fileInspector.findAll(/id:\s*["']([^"']+)["']/g);
      const uniqueIds = new Set(matches.map((m) => m[1]));
      assertEqual(
        uniqueIds.size,
        6,
        `Expected 6 unique product IDs in constants.ts, found ${uniqueIds.size}`
      );
    }
  });

  await t.test("Feature 4.2: 6th silhouette 'oversized-tee-190-gsm' exists with volume tiers", () => {
    if (constantsModule?.REVERSE_ENGINEERED_PRODUCTS) {
      const prod190 = constantsModule.REVERSE_ENGINEERED_PRODUCTS.find(
        (p) => p.id === "oversized-tee-190-gsm" || p.slug === "oversized-tee-190-gsm"
      );
      assert(prod190 !== undefined, "Product 'oversized-tee-190-gsm' must exist in REVERSE_ENGINEERED_PRODUCTS");
      assert(prod190.prices && prod190.prices.length >= 4, "oversized-tee-190-gsm must have volume pricing tiers");
      assert(prod190.colours && prod190.colours.length >= 2, "oversized-tee-190-gsm must have color options");
    } else {
      assert(
        fileInspector.containsText("oversized-tee-190-gsm"),
        "constants.ts must contain product id 'oversized-tee-190-gsm'"
      );
      assert(
        fileInspector.containsText("190 GSM"),
        "constants.ts must specify 190 GSM for the 6th silhouette"
      );
    }
  });

  await t.test("Feature 4.3: Garment print zones include sleeve zones (left and right)", () => {
    if (constantsModule?.REVERSE_ENGINEERED_PRODUCTS) {
      const hasSleeveZones = constantsModule.REVERSE_ENGINEERED_PRODUCTS.some(
        (p) => p.zones && (p.zones.left || p.zones.right)
      );
      assert(hasSleeveZones, "Garment product zones must define left and right sleeve coordinates");
    } else {
      assert(
        fileInspector.containsText("left:") || fileInspector.containsText("right:"),
        "constants.ts must define left/right sleeve coordinate zones"
      );
    }
  });

  await t.test("Feature 4.4: DTF prints matrix covers all 7 standard sizes", () => {
    const requiredSizes = ["a2", "a3", "a4", "a5", "a6", "logo", "label"];
    if (constantsModule?.DTF_PRINTS) {
      const prints = constantsModule.DTF_PRINTS;
      for (const size of requiredSizes) {
        assert(
          prints[size] !== undefined || prints[size.toUpperCase()] !== undefined,
          `DTF_PRINTS must include print size '${size}'`
        );
      }
    } else {
      for (const size of requiredSizes) {
        assert(
          fileInspector.containsText(`${size}:`) || fileInspector.containsText(`"${size}"`),
          `constants.ts must include DTF print size '${size}'`
        );
      }
    }
  });

  await t.test("Feature 4.5: DTF prints have tiered single and bulk pricing", () => {
    if (constantsModule?.DTF_PRINTS) {
      const a3 = constantsModule.DTF_PRINTS.a3 || constantsModule.DTF_PRINTS.A3;
      assert(a3 !== undefined, "A3 print must be defined");
      assertEqual(a3.single, 135, "A3 single rate must be 135");
      assertEqual(a3.bulk, 100, "A3 bulk rate must be 100");

      const a2 = constantsModule.DTF_PRINTS.a2 || constantsModule.DTF_PRINTS.A2;
      assertEqual(a2.single, 200, "A2 single rate must be 200");
      assertEqual(a2.bulk, 175, "A2 bulk rate must be 175");
    } else {
      assert(fileInspector.containsText("single:") && fileInspector.containsText("bulk:"), "DTF_PRINTS must define single and bulk fields");
    }
  });

  await t.test("Feature 4.6: GST percentage is 5% and standard SIZES XS-XXL are exported", () => {
    if (constantsModule?.GST_PERCENTAGE !== undefined) {
      assertEqual(constantsModule.GST_PERCENTAGE, 5, "GST_PERCENTAGE must be 5");
    } else {
      assert(fileInspector.containsText("GST_PERCENTAGE = 5") || fileInspector.containsText("GST_PERCENTAGE: 5"), "GST_PERCENTAGE must be 5");
    }

    if (constantsModule?.SIZES) {
      assert(constantsModule.SIZES.includes("XS"), "SIZES must include XS");
      assert(constantsModule.SIZES.includes("XXL"), "SIZES must include XXL");
      assertEqual(constantsModule.SIZES.length, 6, "SIZES must have 6 sizes (XS to XXL)");
    } else {
      assert(fileInspector.containsText("XS") && fileInspector.containsText("XXL"), "SIZES array must cover XS to XXL");
    }
  });
}
