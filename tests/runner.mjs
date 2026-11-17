#!/usr/bin/env node
/**
 * Master Test Runner for E2E Test Suite
 * Asson Clothing Brand E-Commerce Platform
 * 
 * Supports dynamic suite discovery, CLI tier filtering, regex test filtering,
 * hierarchical colored reporting, and standard exit codes (0 for pass, 1 for fail).
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const TIERS = [
  { id: "tier1", dir: "tests/tier1_features", name: "Tier 1: Feature Coverage" },
  { id: "tier2", dir: "tests/tier2_boundaries", name: "Tier 2: Boundary & Corner Cases" },
  { id: "tier3", dir: "tests/tier3_cross_feature", name: "Tier 3: Cross-Feature Combinations" },
  { id: "tier4", dir: "tests/tier4_scenarios", name: "Tier 4: Real-World Scenarios" },
];

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

// Parse CLI flags
const args = process.argv.slice(2);
let tierFilter = null;
let nameFilter = null;
let bail = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "-h" || arg === "--help") {
    console.log(`
${COLORS.bold}Usage:${COLORS.reset} node tests/runner.mjs [options] [tier]

${COLORS.bold}Options:${COLORS.reset}
  --tier=<1|2|3|4>    Run only the specified tier (e.g., --tier=1)
  --filter=<string>   Filter test files or test names matching substring/regex
  --bail              Stop execution on the first test failure
  -h, --help          Show this help message

${COLORS.bold}Examples:${COLORS.reset}
  node tests/runner.mjs
  node tests/runner.mjs tier1
  node tests/runner.mjs --tier=1 --filter=tokens
`);
    process.exit(0);
  } else if (arg.startsWith("--tier=")) {
    tierFilter = arg.split("=")[1].toLowerCase().replace(/^tier/, "");
  } else if (arg.startsWith("--filter=")) {
    nameFilter = arg.split("=")[1];
  } else if (arg === "--bail") {
    bail = true;
  } else if (!arg.startsWith("-")) {
    // Positional argument for tier
    const norm = arg.toLowerCase().replace(/[^0-9a-z]/g, "");
    if (norm.includes("tier1") || norm === "1") tierFilter = "1";
    else if (norm.includes("tier2") || norm === "2") tierFilter = "2";
    else if (norm.includes("tier3") || norm === "3") tierFilter = "3";
    else if (norm.includes("tier4") || norm === "4") tierFilter = "4";
    else nameFilter = arg;
  }
}

/**
 * Main execution function
 */
async function main() {
  const startTime = Date.now();
  console.log(`\n${COLORS.bold}${COLORS.cyan}============================================================${COLORS.reset}`);
  console.log(`${COLORS.bold}${COLORS.cyan}  ASSON CLOTHING BRAND — E2E TEST RUNNER${COLORS.reset}`);
  console.log(`${COLORS.cyan}============================================================${COLORS.reset}\n`);

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    tiers: {},
  };

  const selectedTiers = TIERS.filter((tier) => {
    if (!tierFilter) return true;
    return tier.id.includes(tierFilter) || tier.name.toLowerCase().includes(tierFilter);
  });

  if (selectedTiers.length === 0) {
    console.log(`${COLORS.yellow}No tiers matched filter: ${tierFilter}${COLORS.reset}`);
    process.exit(0);
  }

  const rootDir = process.cwd();

  for (const tier of selectedTiers) {
    const tierDir = path.join(rootDir, tier.dir);
    results.tiers[tier.id] = { name: tier.name, total: 0, passed: 0, failed: 0, skipped: 0 };

    if (!fs.existsSync(tierDir)) {
      continue;
    }

    const testFiles = fs
      .readdirSync(tierDir)
      .filter((file) => file.endsWith(".mjs") || file.endsWith(".js"))
      .filter((file) => !nameFilter || file.toLowerCase().includes(nameFilter.toLowerCase()))
      .sort();

    if (testFiles.length === 0) {
      continue;
    }

    console.log(`${COLORS.bold}${COLORS.magenta}▶ ${tier.name}${COLORS.reset} ${COLORS.dim}(${tier.dir})${COLORS.reset}`);

    for (const testFile of testFiles) {
      const suitePath = path.join(tierDir, testFile);
      console.log(`\n  ${COLORS.bold}${COLORS.blue}● Suite: ${testFile}${COLORS.reset}`);

      let suiteModule;
      try {
        const fileUrl = pathToFileURL(suitePath).href;
        suiteModule = await import(fileUrl);
      } catch (err) {
        console.log(`    ${COLORS.red}✗ [ERROR] Failed to load suite: ${err.message}${COLORS.reset}`);
        if (err.stack) {
          console.log(`      ${COLORS.gray}${err.stack.split("\n").slice(0, 3).join("\n      ")}${COLORS.reset}`);
        }
        results.failed += 1;
        results.total += 1;
        results.tiers[tier.id].failed += 1;
        results.tiers[tier.id].total += 1;
        if (bail) break;
        continue;
      }

      const suiteFn = suiteModule.default || suiteModule.run;
      if (typeof suiteFn !== "function") {
        console.log(`    ${COLORS.yellow}⚠ Suite does not export a default function${COLORS.reset}`);
        continue;
      }

      // Context object for tests in this suite
      const suiteContext = {
        test: async (name, fn) => {
          if (nameFilter && !name.toLowerCase().includes(nameFilter.toLowerCase()) && !testFile.toLowerCase().includes(nameFilter.toLowerCase())) {
            results.skipped += 1;
            results.tiers[tier.id].skipped += 1;
            return;
          }

          results.total += 1;
          results.tiers[tier.id].total += 1;

          try {
            await fn();
            results.passed += 1;
            results.tiers[tier.id].passed += 1;
            console.log(`    ${COLORS.green}✓${COLORS.reset} ${name}`);
          } catch (err) {
            results.failed += 1;
            results.tiers[tier.id].failed += 1;
            console.log(`    ${COLORS.red}✗ [FAIL] ${name}${COLORS.reset}`);
            console.log(`      ${COLORS.red}Error: ${err.message}${COLORS.reset}`);
            if (err.expected !== undefined && err.actual !== undefined) {
              console.log(`      ${COLORS.dim}Expected: ${JSON.stringify(err.expected)}${COLORS.reset}`);
              console.log(`      ${COLORS.dim}Actual:   ${JSON.stringify(err.actual)}${COLORS.reset}`);
            }
            if (err.stack) {
              const relevantStack = err.stack
                .split("\n")
                .filter((line) => line.includes("tests/") || line.includes("AssertionError"))
                .slice(0, 3)
                .join("\n        ");
              if (relevantStack) {
                console.log(`      ${COLORS.gray}at ${relevantStack.trim()}${COLORS.reset}`);
              }
            }
            if (bail) {
              throw err;
            }
          }
        },
      };

      try {
        await suiteFn(suiteContext);
      } catch (err) {
        if (bail) break;
      }
    }

    const tRes = results.tiers[tier.id];
    console.log(
      `\n  ${COLORS.dim}Tier Summary: ${COLORS.green}${tRes.passed} passed${COLORS.reset}, ` +
      `${tRes.failed > 0 ? COLORS.red : COLORS.dim}${tRes.failed} failed${COLORS.reset}, ` +
      `${COLORS.dim}${tRes.total} total${COLORS.reset}\n`
    );

    if (bail && results.failed > 0) break;
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

  // Overall Summary Banner
  console.log(`${COLORS.bold}${COLORS.cyan}============================================================${COLORS.reset}`);
  console.log(`${COLORS.bold}TEST EXECUTION SUMMARY${COLORS.reset}`);
  console.log(`${COLORS.cyan}============================================================${COLORS.reset}`);
  for (const [tierId, tRes] of Object.entries(results.tiers)) {
    if (tRes.total > 0) {
      const statusColor = tRes.failed === 0 ? COLORS.green : COLORS.red;
      console.log(
        `  ${tRes.name.padEnd(35)}: ${statusColor}${tRes.passed} passed${COLORS.reset}, ` +
        `${tRes.failed > 0 ? COLORS.red : COLORS.dim}${tRes.failed} failed${COLORS.reset} / ${tRes.total} total`
      );
    }
  }
  console.log(`${COLORS.cyan}------------------------------------------------------------${COLORS.reset}`);
  const overallColor = results.failed === 0 ? COLORS.green : COLORS.red;
  console.log(
    `  ${COLORS.bold}TOTAL:${COLORS.reset} ${overallColor}${results.passed} passed${COLORS.reset}, ` +
    `${results.failed > 0 ? COLORS.red : COLORS.dim}${results.failed} failed${COLORS.reset}, ` +
    `${results.skipped > 0 ? COLORS.yellow + results.skipped + " skipped, " : ""}${results.total} total`
  );
  console.log(`  ${COLORS.bold}TIME:${COLORS.reset}  ${durationSec}s`);
  console.log(
    `  ${COLORS.bold}RESULT:${COLORS.reset} ${
      results.failed === 0
        ? `${COLORS.bold}${COLORS.green}PASSED (Exit 0)${COLORS.reset}`
        : `${COLORS.bold}${COLORS.red}FAILED (Exit 1) — ${results.failed} test(s) failed${COLORS.reset}`
    }`
  );
  console.log(`${COLORS.bold}${COLORS.cyan}============================================================${COLORS.reset}\n`);

  process.exit(results.failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Runner encountered fatal error:", err);
  process.exit(1);
});
