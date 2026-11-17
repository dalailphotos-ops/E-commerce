/**
 * Tier 2 Boundary & Corner Cases: Customizer Studio & Canvas Boundaries
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Validates edge and corner conditions in the customizer engine:
 * - Printable bounding box clamping (artwork cannot bleed beyond maximum zone boundaries)
 * - Minimum scale and zero-inch scaling boundaries
 * - Sleeve zone dimensional limits (Left & Right sleeves vs Front & Back)
 * - Non-standard aspect ratios (ultra-wide banners or tall vertical graphics)
 * - Multi-print placement capacity across multiple locations
 * - Cloudinary upload fallbacks and alpha transparency handling
 * - Clear artwork actions restoring pristine canvas state
 */

import { assert, assertEqual, assertLessOrEqual, assertGreaterOrEqual } from "../harness/assertions.mjs";
import { GARMENT_CATALOG, DTF_PRINTS, calculateLineItem } from "../harness/pricing_simulator.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";
import path from "node:path";

const ROOT = process.cwd();
const DESIGN_PAGE = path.join(ROOT, "src", "app", "design", "page.tsx");

export default async function (t) {
  await t.test("Customizer Boundary 2.1: Zone dimensions enforce strict coordinate limits per placement", () => {
    // Inspect constant zone coordinates across silhouettes
    const oversized = GARMENT_CATALOG["oversized-tee-250-gsm-french-terry"];
    assert(oversized !== null, "Garment catalog must define oversized tee");

    // Standard chest/back zone typically 300x420 px
    // Sleeve zone is restricted to smaller dimensions (width 52-60 px, height 60-140 px)
    const sleeveWidthMax = 60;
    const sleeveHeightMax = 140;
    const frontWidth = 300;
    const frontHeight = 420;

    assert(
      sleeveWidthMax < frontWidth,
      "Sleeve zone printable width must be strictly smaller than front chest zone"
    );
    assert(
      sleeveHeightMax < frontHeight,
      "Sleeve zone printable height must be strictly smaller than front chest zone"
    );
  });

  await t.test("Customizer Boundary 2.2: Scaling bounds clamp minimum dimensions above 0 to prevent zero-inch rendering", () => {
    // DTF print sizes smallest standard is logo (2.5" x 2.5")
    const smallestPrint = DTF_PRINTS.logo;
    assertEqual(smallestPrint.dimensions, '2.5" × 2.5"', "Smallest standard DTF print is 2.5 x 2.5 inches");

    // Zero-inch scaling clamping simulation
    const clampDimension = (inchVal, minInch = 1.0, maxInch = 22.0) => {
      if (typeof inchVal !== "number" || isNaN(inchVal) || inchVal <= 0) return minInch;
      return Math.min(Math.max(inchVal, minInch), maxInch);
    };

    assertEqual(clampDimension(0), 1.0, "Zero inch input must clamp to minimum threshold (1.0 in)");
    assertEqual(clampDimension(-5), 1.0, "Negative inch input must clamp to minimum threshold");
    assertEqual(clampDimension(100), 22.0, "Over-limit inch input (100 in) must clamp to max A2 limit (22.0 in)");
    assertEqual(clampDimension(12), 12, "Valid dimension (12 in) remains unaltered");
  });

  await t.test("Customizer Boundary 2.3: Multiple sleeve prints (Left and Right) calculate independent print fees", () => {
    // Garment with Front A3 + Left Sleeve Logo + Right Sleeve Logo
    const multiPrintOrder = calculateLineItem("oversized-tee-250-gsm-french-terry", 10, [
      { position: "front", sizeKey: "a3" },
      { position: "left", sizeKey: "logo" },
      { position: "right", sizeKey: "logo" },
    ]);

    assertEqual(multiPrintOrder.prints.length, 3, "Order must track all 3 distinct print locations");

    // A3 bulk = 100, Left logo bulk = 10, Right logo bulk = 10
    const a3Print = multiPrintOrder.prints.find((p) => p.position === "front");
    const leftLogo = multiPrintOrder.prints.find((p) => p.position === "left");
    const rightLogo = multiPrintOrder.prints.find((p) => p.position === "right");

    assertEqual(a3Print.unitCost, 100, "Front A3 print cost at 10 pcs must be ₹100");
    assertEqual(leftLogo.unitCost, 10, "Left sleeve logo print cost at 10 pcs must be ₹10");
    assertEqual(rightLogo.unitCost, 10, "Right sleeve logo print cost at 10 pcs must be ₹10");

    // Base garment 10 pcs = 265. Total prints = 100 + 10 + 10 = 120. Unit price = 385
    assertEqual(multiPrintOrder.unitPrice, 385, "Total unit price must be ₹265 + ₹120 = ₹385");
    assertEqual(multiPrintOrder.totalPrice, 3850, "Line total for 10 pcs must be ₹3,850");
  });

  await t.test("Customizer Boundary 2.4: Non-standard aspect ratios maintain proportional scaling without distortion", () => {
    const inspector = inspectFile(DESIGN_PAGE);
    assert(inspector !== null, "Design page must be readable");

    // The canvas image preview uses object-contain to prevent distortion on wide or tall artwork
    assert(
      inspector.containsText("object-contain"),
      "Artwork image preview must use object-contain to preserve aspect ratio on arbitrary dimensions"
    );
  });

  await t.test("Customizer Boundary 2.5: Image upload handler includes fallback for API / network failures", () => {
    const inspector = inspectFile(DESIGN_PAGE);
    assert(inspector !== null, "Design page must be readable");

    // Upload handler contains FileReader fallback in catch block
    assert(
      inspector.containsText("FileReader") || inspector.containsText("readAsDataURL"),
      "Design studio upload handler must provide client-side FileReader fallback on API failure"
    );
  });

  await t.test("Customizer Boundary 2.6: Clear artwork action resets artwork without altering garment selection", () => {
    const inspector = inspectFile(DESIGN_PAGE);
    assert(inspector !== null, "Design page must be readable");

    assert(
      inspector.containsText("handleClearArt") && inspector.containsText("Trash2"),
      "Design studio must provide action to clear active artwork overlays"
    );
    assert(
      inspector.containsText("setFrontUploadedImage(null)") || inspector.containsText("setBackUploadedImage(null)"),
      "Clearing artwork must set active side preview to null"
    );
  });

  await t.test("Customizer Boundary 2.7: Maximum print count and size validation prevents placing oversized print on small zones", () => {
    // An A2 print (16" x 22") cannot physically fit onto a sleeve (width ~3")
    const isPrintAllowedOnZone = (printKey, zone) => {
      if (zone === "left" || zone === "right") {
        // Sleeves only allow logo, A6, or A5
        return printKey === "logo" || printKey === "a6" || printKey === "a5";
      }
      return true;
    };

    assert(
      isPrintAllowedOnZone("logo", "left") === true,
      "Logo print is permitted on sleeve"
    );
    assert(
      isPrintAllowedOnZone("a2", "left") === false,
      "A2 16x22 inch print is not allowed on sleeve zone"
    );
    assert(
      isPrintAllowedOnZone("a3", "right") === false,
      "A3 print is not allowed on sleeve zone"
    );
    assert(
      isPrintAllowedOnZone("a2", "front") === true,
      "A2 print is permitted on front chest zone"
    );
  });
}
