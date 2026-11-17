/**
 * Tier 1 Features 19-22: Interactive Customizer Studio & DTF Canvas
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Validates:
 * - /design route and DesignStudioPage component
 * - Canvas print placement zones: Front, Back, and Sleeve zones
 * - Real inch dimensions matching authoritative DTF size classes (A2, A3, A4, A5, A6, Logo, Label)
 * - Multi-location print pricing math (Unit price = Base tier + print fees)
 * - Free neck label waiver rule for A2 / A3 / A4 prints
 * - Cloudinary image upload and custom typography additions
 * - Submission of design session to /api/designs and quote to /api/quotes
 * - STRICT USER CONSTRAINT: Absolute absence of WhatsApp links or widgets.
 */

import path from "node:path";
import { assert, assertEqual, assertMatch, assertGreaterOrEqual } from "../harness/assertions.mjs";
import { checkRouteFileExists, checkRouteExport } from "../harness/route_checker.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";
import {
  DTF_PRINTS,
  calculateLineItem,
  getGarmentUnitPrice,
  getPrintCost,
} from "../harness/pricing_simulator.mjs";

const ROOT = process.cwd();
const DESIGN_PAGE_PATH = path.join(ROOT, "src", "app", "design", "page.tsx");

export default async function (t) {
  await t.test("Features 19-22.1: /design route exists and exports default component", () => {
    const fileStatus = checkRouteFileExists("/design");
    assert(fileStatus.exists, `/design page must exist at ${fileStatus.filePath}`);

    const exportStatus = checkRouteExport("/design", "default");
    assert(exportStatus.valid, `/design must export default React component: ${exportStatus.reason}`);
  });

  await t.test("Features 19-22.2: Interactive canvas provides side switching (Front & Back) and placement boundary", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design page file must be readable");

    // Side switching state
    assert(
      inspector.containsText("activeSide") && (inspector.containsText("front") && inspector.containsText("back")),
      "Design studio must allow toggling active view between front and back"
    );

    // Print zone overlay
    assert(
      inspector.containsText("PRINT ZONE") || inspector.containsText("border-dashed"),
      "Canvas preview must render visual print boundary overlay for artwork placement"
    );
  });

  await t.test("Features 19-22.3: Real inch dimensions match DTF size classes across all standards", () => {
    // Authoritative verification against DTF_PRINTS
    assertEqual(DTF_PRINTS.a2.dimensions, '16" × 22"', "A2 print must measure 16x22 inches");
    assertEqual(DTF_PRINTS.a3.dimensions, '11" × 16"', "A3 print must measure 11x16 inches");
    assertEqual(DTF_PRINTS.a4.dimensions, '8" × 11"', "A4 print must measure 8x11 inches");
    assertEqual(DTF_PRINTS.a5.dimensions, '5.8" × 8.3"', "A5 print must measure 5.8x8.3 inches");
    assertEqual(DTF_PRINTS.a6.dimensions, '4.1" × 5.8"', "A6 print must measure 4.1x5.8 inches");
    assertEqual(DTF_PRINTS.logo.dimensions, '2.5" × 2.5"', "Logo print must measure 2.5x2.5 inches");

    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design page file must be readable");
    assert(
      inspector.containsText("DTF_PRINTS"),
      "Design studio must load DTF print dimensions from authoritative constants"
    );
  });

  await t.test("Features 19-22.4: Multi-location print pricing calculates base tier plus print fees", () => {
    // 25 pcs of oversized tee 250 GSM (tier 25-49 price = 260) + A3 print (bulk = 100) = 360
    const lineItem = calculateLineItem("oversized-tee-250-gsm-french-terry", 25, [
      { position: "front", sizeKey: "a3" },
    ]);

    assertEqual(lineItem.garmentUnitPrice, 260, "Garment unit price at 25 pcs must be ₹260");
    assertEqual(lineItem.totalPrintsUnitCost, 100, "A3 print bulk cost must be ₹100");
    assertEqual(lineItem.unitPrice, 360, "Total unit price must be ₹360");
    assertEqual(lineItem.totalPrice, 9000, "25 pcs * ₹360 must equal ₹9000");

    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(
      inspector.containsText("unitPrice = baseGarmentPrice + printUnitCost") ||
      inspector.containsText("baseGarmentPrice"),
      "Design studio must compute unit price combining base garment and print cost"
    );
  });

  await t.test("Features 19-22.5: Free neck label waiver rule applies when A2, A3, or A4 print is selected", () => {
    // Scenario 1: A3 print + neck label -> neck label should be waived (0)
    const lineWithLargePrint = calculateLineItem("oversized-tee-250-gsm-french-terry", 25, [
      { position: "front", sizeKey: "a3" },
      { position: "neck", sizeKey: "label" },
    ]);
    const labelPrint = lineWithLargePrint.prints.find((p) => p.sizeKey === "label");
    assertEqual(labelPrint.unitCost, 0, "Neck label unit cost must be waived (0) when A3 is ordered");
    assertEqual(labelPrint.isWaived, true, "Neck label must be marked as waived");

    // Scenario 2: Logo only + neck label -> neck label is not waived
    const lineWithSmallPrint = calculateLineItem("oversized-tee-250-gsm-french-terry", 5, [
      { position: "front", sizeKey: "logo" },
      { position: "neck", sizeKey: "label" },
    ]);
    const labelSmall = lineWithSmallPrint.prints.find((p) => p.sizeKey === "label");
    // Under single rate without large print, label is either free or standardFee, but not waived by A2/A3/A4
    assertEqual(labelSmall.isWaived, false, "Neck label is not waived by large print rule when only logo is present");

    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(
      inspector.containsText("FREE") || inspector.containsText("Neck Label"),
      "Design studio must include neck label branding options"
    );
  });

  await t.test("Features 19-22.6: Artwork upload and custom typography features are integrated", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design page file must be readable");

    // Cloudinary upload
    assert(
      inspector.containsText("/api/upload") || inspector.containsText("handleFileUpload"),
      "Design studio must support image uploading via API endpoint"
    );

    // Custom Typography
    assert(
      inspector.containsText("customText") && inspector.containsText("handleAddText"),
      "Design studio must provide custom text overlay tools"
    );
  });

  await t.test("Features 19-22.7: Design session saves to /api/designs and quote saves to /api/quotes", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design page file must be readable");

    assert(
      inspector.containsText("/api/designs"),
      "Design studio must save mockup design sessions to /api/designs"
    );
    assert(
      inspector.containsText("/api/quotes"),
      "Design studio must save order quotes to /api/quotes"
    );
  });

  await t.test("Features 19-22.8: [CRITICAL CONSTRAINT] ABSENCE of WhatsApp links or widgets in Customizer Studio", () => {
    const inspector = inspectFile(DESIGN_PAGE_PATH);
    assert(inspector !== null, "Design page file must be readable");

    assert(!inspector.containsText("wa.me"), "Design studio must not contain wa.me links");
    assert(!inspector.containsText("api.whatsapp.com"), "Design studio must not contain api.whatsapp.com links");
    assert(!inspector.containsText("whatsapp", false), "Design studio must not contain WhatsApp branding or actions");
  });
}
