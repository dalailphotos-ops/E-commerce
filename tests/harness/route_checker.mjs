/**
 * Next.js App Router Route and Endpoint Validation Utility
 * Validates route files, component exports, and HTTP responses.
 */

import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = process.cwd();

/**
 * Resolves an App Router URL path to its corresponding file path.
 * Supports static pages, dynamic route brackets, and API route handlers.
 */
export function resolveRouteToFile(routePath) {
  const cleanPath = routePath.replace(/^\/+|\/+$/g, "");

  if (cleanPath === "") {
    return path.join(PROJECT_ROOT, "src", "app", "page.tsx");
  }

  // If it's an API route
  if (cleanPath.startsWith("api/")) {
    const apiTs = path.join(PROJECT_ROOT, "src", "app", ...cleanPath.split("/"), "route.ts");
    const apiJs = path.join(PROJECT_ROOT, "src", "app", ...cleanPath.split("/"), "route.js");
    if (fs.existsSync(apiTs)) return apiTs;
    if (fs.existsSync(apiJs)) return apiJs;
    return apiTs;
  }

  // Page routes: try page.tsx, page.jsx, page.js
  const segments = cleanPath.split("/");
  const candidateTsx = path.join(PROJECT_ROOT, "src", "app", ...segments, "page.tsx");
  const candidateJsx = path.join(PROJECT_ROOT, "src", "app", ...segments, "page.jsx");
  const candidateJs = path.join(PROJECT_ROOT, "src", "app", ...segments, "page.js");

  if (fs.existsSync(candidateTsx)) return candidateTsx;
  if (fs.existsSync(candidateJsx)) return candidateJsx;
  if (fs.existsSync(candidateJs)) return candidateJs;

  return candidateTsx;
}

/**
 * Checks if a route file exists on disk.
 */
export function checkRouteFileExists(routePath) {
  const filePath = resolveRouteToFile(routePath);
  const exists = fs.existsSync(filePath);
  return {
    routePath,
    filePath,
    exists,
  };
}

/**
 * Checks if a route file exports a default component or named API handler.
 */
export function checkRouteExport(routePath, expectedExport = "default") {
  const { exists, filePath } = checkRouteFileExists(routePath);
  if (!exists) {
    return {
      valid: false,
      filePath,
      reason: `Route file does not exist at ${filePath}`,
    };
  }

  const content = fs.readFileSync(filePath, "utf-8");
  if (expectedExport === "default") {
    const hasDefault = /export\s+default\s+(?:function|class|const|let|var|\w+)/.test(content) ||
                       /export\s*\{\s*[^}]*\bdefault\b[^}]*\}/.test(content);
    return {
      valid: hasDefault,
      filePath,
      reason: hasDefault ? null : `Missing "export default" in ${filePath}`,
    };
  }

  // Named export like GET, POST, DELETE
  const namedRegex = new RegExp(`export\\s+(?:async\\s+)?function\\s+${expectedExport}\\b|export\\s+const\\s+${expectedExport}\\b`);
  const hasNamed = namedRegex.test(content);
  return {
    valid: hasNamed,
    filePath,
    reason: hasNamed ? null : `Missing export "${expectedExport}" in ${filePath}`,
  };
}

/**
 * Validates a live HTTP endpoint if a dev or production server is active.
 * Gracefully returns available: false if server is unreachable.
 */
export async function checkLiveRoute(baseUrl, routePath, options = {}) {
  const fullUrl = new URL(routePath, baseUrl).toString();
  try {
    const res = await fetch(fullUrl, {
      method: options.method || "GET",
      headers: options.headers || {},
      signal: AbortSignal.timeout(options.timeoutMs || 2500),
    });
    return {
      available: true,
      status: res.status,
      ok: res.ok,
      headers: Object.fromEntries(res.headers.entries()),
    };
  } catch (err) {
    return {
      available: false,
      error: err.message,
    };
  }
}

export default {
  resolveRouteToFile,
  checkRouteFileExists,
  checkRouteExport,
  checkLiveRoute,
};
