/**
 * Asson Clothing — Price Estimator Calculation Engine
 * 
 * Implements:
 * - Product silhouette quantity pooling across lines for garment tier pricing
 * - Whole-order quantity pooling for DTF 10+ bulk rates and Embroidery rates
 * - Free neck label waiver when front or back print is A2, A3, or A4
 * - 5% Indian textile GST computation
 * - Next-tier discount drop algorithm (nextDrop)
 * - Plain-text quote generation & pre-filled WhatsApp link generation
 */

import {
  REVERSE_ENGINEERED_PRODUCTS,
  DTF_PRINTS,
  EMBROIDERY_RATES,
  SIZES,
  GST_PERCENTAGE,
  BRAND_NAME,
  ORDERS_EMAIL,
  WHATSAPP_NUMBER,
} from "./constants";

export interface EstimatorPrintConfig {
  type: string; // 'none' | 'logo' | 'a6' | 'a5' | 'a4' | 'a3' | 'a2' | 'emb'
  stitches?: number;
}

export interface EstimatorLine {
  id: string;
  productId: string;
  colorName: string;
  sizes: Record<string, number>;
  frontPrint: EstimatorPrintConfig;
  backPrint: EstimatorPrintConfig;
  collapsed?: boolean;
}

export interface LineCalculationResult {
  lineId: string;
  productId: string;
  productName: string;
  productSpec: string;
  colorName: string;
  colorHex: string;
  photoUrl: string;
  totalQuantity: number;
  garmentUnitPrice: number;
  frontPrintCost: number;
  backPrintCost: number;
  unitPrice: number;
  lineSubtotal: number;
  hasFreeNeckLabel: boolean;
  dominantSize: string;
}

export interface EstimatorCalculationResult {
  lines: LineCalculationResult[];
  totalQuantity: number;
  subtotal: number;
  gst: number;
  grandTotal: number;
  averagePerPiece: number;
  embroideryRate: number;
  isDtfBulk: boolean;
}

export interface NextTierDrop {
  lineIndex: number;
  lineId: string;
  productName: string;
  addQuantity: number;
  targetSize: string;
  currentPerPiece: number;
  newPerPiece: number;
  orderSavings: number;
}

export interface PrintOptionMetadata {
  key: string;
  label: string;
  sub: string;
}

export const ESTIMATOR_PRINTS: PrintOptionMetadata[] = [
  { key: "none", label: "None", sub: "" },
  { key: "logo", label: "Logo", sub: '2.5" × 2.5"' },
  { key: "a6", label: "A6", sub: '4.1" × 5.8"' },
  { key: "a5", label: "A5", sub: '5.8" × 8.3"' },
  { key: "a4", label: "A4", sub: '8" × 11"' },
  { key: "a3", label: "A3", sub: '11" × 16"' },
  { key: "a2", label: "A2", sub: '16" × 22"' },
  { key: "emb", label: "Embroidery", sub: "by stitches" },
];

/**
 * Find product definition from catalog
 */
export function getProductById(id: string) {
  return (
    REVERSE_ENGINEERED_PRODUCTS.find((p) => p.id === id) ||
    REVERSE_ENGINEERED_PRODUCTS[0]
  );
}

/**
 * Get garment color info
 */
export function getProductColor(productId: string, colorName: string) {
  const prod = getProductById(productId);
  const color =
    prod.colors.find(
      (c) => c.name.toLowerCase() === colorName.toLowerCase()
    ) || prod.colors[0];
  return color;
}

/**
 * Calculate total quantity of a line
 */
export function getLineQuantity(line: EstimatorLine): number {
  return SIZES.reduce((sum, size) => sum + (line.sizes[size] || 0), 0);
}

/**
 * Get garment unit tier price based on silhouette total quantity
 */
export function getGarmentTierPrice(productId: string, silhouetteQty: number): number {
  const prod = getProductById(productId);
  const tier = [...prod.prices]
    .sort((a, b) => b.min - a.min)
    .find((t) => silhouetteQty >= t.min);
  return tier ? tier.price : prod.basePrice;
}

/**
 * Get print cost for a given configuration under current order context
 */
export function calculatePrintCost(
  print: EstimatorPrintConfig | undefined,
  orderTotalQty: number,
  embroideryRate: number
): number {
  if (!print || print.type === "none" || !print.type) {
    return 0;
  }
  if (print.type === "emb") {
    const stitches = Math.max(0, print.stitches || 0);
    return Math.round((stitches / 1000) * embroideryRate);
  }
  const isBulk = orderTotalQty >= 10;
  const dtf = DTF_PRINTS[print.type];
  if (!dtf) return 0;
  return isBulk ? dtf.bulk : dtf.single;
}

/**
 * Check if free neck label is granted
 */
export function checkFreeNeckLabel(frontType?: string, backType?: string): boolean {
  const isA234 = (t?: string) => /^a[234]$/i.test(t || "");
  return isA234(frontType) || isA234(backType);
}

/**
 * Compute full order calculation results across all lines
 */
export function computeEstimatorTotals(lines: EstimatorLine[]): EstimatorCalculationResult {
  // 1. Calculate silhouette totals and order total quantity
  let orderTotalQty = 0;
  const perProductQty: Record<string, number> = {};

  lines.forEach((line) => {
    const qty = getLineQuantity(line);
    orderTotalQty += qty;
    perProductQty[line.productId] = (perProductQty[line.productId] || 0) + qty;
  });

  // 2. Determine embroidery rate from order-wide volume
  let embroideryRate = EMBROIDERY_RATES[0].rate;
  EMBROIDERY_RATES.forEach((r) => {
    if (orderTotalQty >= r.min) {
      embroideryRate = r.rate;
    }
  });

  const isDtfBulk = orderTotalQty >= 10;

  // 3. Compute per-line results
  let subtotal = 0;
  const lineResults: LineCalculationResult[] = lines.map((line) => {
    const prod = getProductById(line.productId);
    const color = getProductColor(line.productId, line.colorName);
    const qty = getLineQuantity(line);
    const garmentPrice = getGarmentTierPrice(
      line.productId,
      perProductQty[line.productId] || 0
    );

    const frontCost = calculatePrintCost(
      line.frontPrint,
      orderTotalQty,
      embroideryRate
    );
    const backCost = calculatePrintCost(
      line.backPrint,
      orderTotalQty,
      embroideryRate
    );

    const unitPrice = garmentPrice + frontCost + backCost;
    const lineSubtotal = unitPrice * qty;
    subtotal += lineSubtotal;

    // Find dominant size (size with largest quantity, default to 'M')
    const dominantSize = SIZES.reduce(
      (dominant, sz) =>
        (line.sizes[sz] || 0) > (line.sizes[dominant] || 0) ? sz : dominant,
      "M"
    );

    const hasFreeNeckLabel = checkFreeNeckLabel(
      line.frontPrint?.type,
      line.backPrint?.type
    );

    return {
      lineId: line.id,
      productId: line.productId,
      productName: prod.name,
      productSpec: prod.spec,
      colorName: color.name,
      colorHex: color.hex,
      photoUrl: color.photoFront || color.front || "",
      totalQuantity: qty,
      garmentUnitPrice: garmentPrice,
      frontPrintCost: frontCost,
      backPrintCost: backCost,
      unitPrice,
      lineSubtotal,
      hasFreeNeckLabel,
      dominantSize,
    };
  });

  // 4. Compute 5% GST & totals
  const gst = Math.round(subtotal * (GST_PERCENTAGE / 100) * 100) / 100;
  const grandTotal = subtotal + gst;
  const averagePerPiece =
    orderTotalQty > 0 ? Math.round(grandTotal / orderTotalQty) : 0;

  return {
    lines: lineResults,
    totalQuantity: orderTotalQty,
    subtotal,
    gst,
    grandTotal,
    averagePerPiece,
    embroideryRate,
    isDtfBulk,
  };
}

/**
 * Calculate the next drop incentive for a single line
 */
export function getLineNextDrop(
  line: EstimatorLine,
  allLines: EstimatorLine[],
  currentResult: EstimatorCalculationResult
): NextTierDrop | null {
  const lineResult = currentResult.lines.find((r) => r.lineId === line.id);
  if (!lineResult || lineResult.totalQuantity === 0) return null;

  const prod = getProductById(line.productId);
  const silhouetteQty = allLines
    .filter((l) => l.productId === line.productId)
    .reduce((s, l) => s + getLineQuantity(l), 0);

  const candidateAdds: Record<number, boolean> = {};

  // Silhouette tier thresholds
  prod.prices.forEach((t) => {
    if (t.min > silhouetteQty) {
      candidateAdds[t.min - silhouetteQty] = true;
    }
  });

  // Embroidery bulk threshold
  EMBROIDERY_RATES.forEach((e) => {
    if (e.min > currentResult.totalQuantity) {
      candidateAdds[e.min - currentResult.totalQuantity] = true;
    }
  });

  // DTF 10+ bulk threshold
  if (currentResult.totalQuantity < 10) {
    candidateAdds[10 - currentResult.totalQuantity] = true;
  }

  const targetSize = lineResult.dominantSize;
  const adds = Object.keys(candidateAdds)
    .map(Number)
    .sort((a, b) => a - b);

  for (const add of adds) {
    // Clone and simulate addition
    const simulatedLines = allLines.map((l) => {
      if (l.id === line.id) {
        return {
          ...l,
          sizes: {
            ...l.sizes,
            [targetSize]: (l.sizes[targetSize] || 0) + add,
          },
        };
      }
      return l;
    });

    const simulatedResult = computeEstimatorTotals(simulatedLines);
    const simLineRes = simulatedResult.lines.find((r) => r.lineId === line.id);

    if (simLineRes && simLineRes.unitPrice < lineResult.unitPrice) {
      const beforeSub = currentResult.subtotal;
      const afterSubOnOldPieces = simulatedResult.subtotal - simLineRes.unitPrice * add;
      const orderSavings = Math.max(0, beforeSub - afterSubOnOldPieces);

      const lineIndex = allLines.findIndex((l) => l.id === line.id);
      return {
        lineIndex,
        lineId: line.id,
        productName: prod.name,
        addQuantity: add,
        targetSize,
        currentPerPiece: lineResult.unitPrice,
        newPerPiece: simLineRes.unitPrice,
        orderSavings,
      };
    }
  }

  return null;
}

/**
 * Calculate best next tier drop for the whole order summary tip box
 */
export function calculateNextTierDrop(
  lines: EstimatorLine[],
  result: EstimatorCalculationResult
): NextTierDrop | null {
  let bestDrop: NextTierDrop | null = null;

  lines.forEach((line) => {
    const drop = getLineNextDrop(line, lines, result);
    if (drop) {
      if (!bestDrop || drop.addQuantity < bestDrop.addQuantity) {
        bestDrop = drop;
      }
    }
  });

  return bestDrop;
}

/**
 * Print label formatter
 */
export function formatPrintLabel(print?: EstimatorPrintConfig): string {
  if (!print || print.type === "none" || !print.type) return "None";
  if (print.type === "emb") {
    return `Embroidery (${(print.stitches || 0).toLocaleString("en-IN")} stitches)`;
  }
  const opt = ESTIMATOR_PRINTS.find((o) => o.key === print.type);
  if (!opt) return print.type.toUpperCase();
  return `${opt.label} DTF (${opt.sub})`;
}

/**
 * Size breakdown text formatter
 */
export function formatSizeBreakdown(sizes: Record<string, number>): string {
  const parts = SIZES.filter((sz) => (sizes[sz] || 0) > 0).map(
    (sz) => `${sz}×${sizes[sz]}`
  );
  return parts.length > 0 ? parts.join(", ") : "—";
}

/**
 * Format structured plain-text quote for clipboard copy, email, and WhatsApp
 */
export function formatQuoteSummaryText(
  lines: EstimatorLine[],
  result: EstimatorCalculationResult
): string {
  const out: string[] = [];
  out.push(`Price Estimator Quote — ${BRAND_NAME}`);
  out.push("");

  result.lines.forEach((r, idx) => {
    const line = lines.find((l) => l.id === r.lineId) || lines[idx];
    out.push(`Item ${idx + 1}: ${r.productName} (${r.productSpec}) — ${r.colorName}`);
    out.push(`· Quantity: ${r.totalQuantity} pcs`);
    out.push(`· Sizes: ${formatSizeBreakdown(line.sizes)}`);
    out.push(`· Front Print: ${formatPrintLabel(line.frontPrint)}`);
    out.push(`· Back Print: ${formatPrintLabel(line.backPrint)}${r.hasFreeNeckLabel ? " (Free neck label included)" : ""}`);
    out.push(`· Unit Price: ₹${r.unitPrice.toLocaleString("en-IN")} / pc`);
    out.push(`· Subtotal: ₹${r.lineSubtotal.toLocaleString("en-IN")}`);
    out.push("");
  });

  out.push(`Total Units: ${result.totalQuantity} pcs`);
  out.push(`Subtotal: ₹${result.subtotal.toLocaleString("en-IN")}`);
  out.push(`GST (5%): ₹${result.gst.toLocaleString("en-IN")}`);
  out.push(`Grand Total: ₹${result.grandTotal.toLocaleString("en-IN")}`);
  out.push(`Estimated total: ₹${result.grandTotal.toLocaleString("en-IN")}`);
  out.push("Shipping charges extra (calculated on actual weight & location at dispatch).");
  out.push("");
  out.push(`Contact: ${ORDERS_EMAIL} | ${WHATSAPP_NUMBER}`);
  out.push("Please confirm bulk production timeline.");

  return out.join("\n");
}

/**
 * Format pre-filled WhatsApp URL with encoded quote text
 */
export function formatWhatsAppQuoteUrl(
  lines: EstimatorLine[],
  result: EstimatorCalculationResult,
  phone: string = "919072997950"
): string {
  const text = formatQuoteSummaryText(lines, result);
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const intro = `Hi ${BRAND_NAME}, I would like a quote for this order:\n\n`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(intro + text)}`;
}
