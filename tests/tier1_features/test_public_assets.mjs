/**
 * Tier 1 Feature 5: Public Assets & Database Fallback URI
 * Validates public/ assets directory, favicon/icons, and MongoDB fallback URI pointing to asson_ecommerce.
 */

import fs from "node:fs";
import path from "node:path";
import { assert, assertEqual, assertMatch } from "../harness/assertions.mjs";
import { inspectFile } from "../harness/dom_inspector.mjs";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const MONGODB_FILE = path.join(ROOT, "src", "lib", "mongodb.ts");

export default async function (t) {
  await t.test("Feature 5.1: public/ directory exists in project root", () => {
    assert(
      fs.existsSync(PUBLIC_DIR),
      `public/ directory must exist at ${PUBLIC_DIR} for static assets`
    );
  });

  await t.test("Feature 5.2: Brand favicon or icon asset exists", () => {
    const faviconInPublic = path.join(PUBLIC_DIR, "favicon.ico");
    const faviconInApp = path.join(ROOT, "src", "app", "favicon.ico");
    const iconInPublic = path.join(PUBLIC_DIR, "icon.png");
    const iconInApp = path.join(ROOT, "src", "app", "icon.png");

    const hasFavicon =
      fs.existsSync(faviconInPublic) ||
      fs.existsSync(faviconInApp) ||
      fs.existsSync(iconInPublic) ||
      fs.existsSync(iconInApp);

    assert(
      hasFavicon,
      "A brand favicon or icon asset must be present in public/ or src/app/"
    );
  });

  await t.test("Feature 5.3: MongoDB client module exists and exports connectToDatabase", () => {
    assert(
      fs.existsSync(MONGODB_FILE),
      `MongoDB client must exist at ${MONGODB_FILE}`
    );
    const inspector = inspectFile(MONGODB_FILE);
    assert(
      inspector.containsText("connectToDatabase"),
      "src/lib/mongodb.ts must export connectToDatabase function"
    );
  });

  await t.test("Feature 5.4: MongoDB fallback URI uses asson_ecommerce database name", () => {
    const inspector = inspectFile(MONGODB_FILE);
    assert(inspector !== null, "mongodb.ts must exist");
    assert(
      inspector.containsText("asson_ecommerce"),
      "MongoDB fallback connection URI must use 'asson_ecommerce' instead of legacy 'looma_ecommerce'"
    );
    assert(
      !inspector.containsText("looma_ecommerce"),
      "MongoDB fallback connection string must not contain 'looma_ecommerce'"
    );
  });

  await t.test("Feature 5.5: Database client implements connection caching for Next.js App Router", () => {
    const inspector = inspectFile(MONGODB_FILE);
    assert(inspector !== null, "mongodb.ts must exist");
    assert(
      inspector.containsText("cached") || inspector.containsText("global"),
      "mongodb.ts must cache database connection across hot reloads in global scope"
    );
  });
}
