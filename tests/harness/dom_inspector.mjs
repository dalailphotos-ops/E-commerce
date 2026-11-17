/**
 * Static File and AST/Regex DOM Inspection Utility
 * Used for inspecting React components, styles, design tokens, links, and forms.
 */

import fs from "node:fs";
import path from "node:path";

export class DomInspector {
  constructor(content, filePath = "") {
    this.content = String(content || "");
    this.filePath = filePath;
  }

  /**
   * Checks if raw text exists in content (case-insensitive option).
   */
  containsText(text, caseSensitive = true) {
    if (caseSensitive) {
      return this.content.includes(text);
    }
    return this.content.toLowerCase().includes(text.toLowerCase());
  }

  /**
   * Checks if content matches a regular expression.
   */
  matchesRegex(regex) {
    return regex.test(this.content);
  }

  /**
   * Finds occurrences matching a regular expression and returns capture groups or matches.
   */
  findAll(regex) {
    const flags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
    const r = new RegExp(regex.source, flags);
    const results = [];
    let match;
    while ((match = r.exec(this.content)) !== null) {
      results.push(match);
    }
    return results;
  }

  /**
   * Extracts all href links (JSX Link href="..." or HTML <a href="...">).
   */
  extractLinks() {
    const linkRegex = /(?:href=["']([^"']+)["']|<Link[^>]+href=["']([^"']+)["'])/g;
    const links = [];
    let match;
    while ((match = linkRegex.exec(this.content)) !== null) {
      links.push(match[1] || match[2]);
    }
    return links;
  }

  /**
   * Extracts all CSS variables defined (e.g. --paper: #f6f5f1).
   */
  extractCssVariables() {
    const varRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;}\n]+)/g;
    const vars = {};
    let match;
    while ((match = varRegex.exec(this.content)) !== null) {
      vars[match[1]] = match[2].trim();
    }
    return vars;
  }

  /**
   * Checks for presence of specific CSS classes or class patterns in className strings.
   */
  hasClassName(classNameOrPattern) {
    if (classNameOrPattern instanceof RegExp) {
      return classNameOrPattern.test(this.content);
    }
    const classAttrRegex = /className=["'`]([^"'`]+)["'`]/g;
    let match;
    while ((match = classAttrRegex.exec(this.content)) !== null) {
      const classes = match[1].split(/\s+/);
      if (classes.includes(classNameOrPattern)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if an HTML or JSX tag is used (e.g. `<header`, `<footer`, `<form`).
   */
  hasElement(tagName) {
    const tagRegex = new RegExp(`<${tagName}[\\s>/]`, "i");
    return tagRegex.test(this.content);
  }

  /**
   * Checks if an attribute is set on any element (optionally with specific value).
   */
  hasAttribute(attrName, attrValue = null) {
    if (attrValue === null) {
      const regex = new RegExp(`\\b${attrName}(?:=|[\\s>])`, "i");
      return regex.test(this.content);
    }
    const regex = new RegExp(`\\b${attrName}=["'\`]?${attrValue}["'\`]?`, "i");
    return regex.test(this.content);
  }

  /**
   * Extracts imported modules and named imports.
   */
  extractImports() {
    const importRegex = /import\s+(?:(?:(\w+)|(?:\{([^}]+)\})|(?:\*\s+as\s+(\w+)))\s+from\s+)?["']([^"']+)["']/g;
    const imports = [];
    let match;
    while ((match = importRegex.exec(this.content)) !== null) {
      imports.push({
        defaultImport: match[1] || null,
        namedImports: match[2] ? match[2].split(",").map((s) => s.trim()) : [],
        namespaceImport: match[3] || null,
        from: match[4],
      });
    }
    return imports;
  }
}

/**
 * Creates a DomInspector from a file path. Returns null if file does not exist.
 */
export function inspectFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return new DomInspector(content, filePath);
}

/**
 * Creates a DomInspector from an in-memory string.
 */
export function inspectHtml(htmlString) {
  return new DomInspector(htmlString, "in-memory.html");
}

export default {
  DomInspector,
  inspectFile,
  inspectHtml,
};
