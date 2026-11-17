/**
 * Standalone DTF Pricing & Volume Tier Simulator
 * Adheres strictly to src/lib/constants.ts and PROJECT.md interface contracts.
 */

export const GST_PERCENTAGE = 5;

export const VOLUME_TIERS = [
  { min: 1, max: 9, label: "1 – 9 pcs" },
  { min: 10, max: 24, label: "10 – 24 pcs" },
  { min: 25, max: 49, label: "25 – 49 pcs" },
  { min: 50, max: 99, label: "50 – 99 pcs" },
  { min: 100, max: Infinity, label: "100+ pcs" },
];

export const DTF_PRINTS = {
  a2: { label: "A2 Size", dimensions: '16" × 22"', single: 200, bulk: 175 },
  a3: { label: "A3 Size", dimensions: '11" × 16"', single: 135, bulk: 100 },
  a4: { label: "A4 Size", dimensions: '8" × 11"', single: 95, bulk: 70 },
  a5: { label: "A5 Size", dimensions: '5.8" × 8.3"', single: 60, bulk: 45 },
  a6: { label: "A6 Size", dimensions: '4.1" × 5.8"', single: 40, bulk: 25 },
  logo: { label: "Chest / Sleeve Logo", dimensions: '2.5" × 2.5"', single: 20, bulk: 10 },
  label: { label: "Custom Neck Label", dimensions: "Free branding", single: 0, bulk: 0, standardFee: 15 },
};

export const GARMENT_CATALOG = {
  "oversized-tee-250-gsm-french-terry": {
    name: "Oversized Tee — 250 GSM French Terry",
    fit: "Oversized",
    gsm: 250,
    basePrice: 250,
    tiers: [
      { min: 1, max: 9, price: 290 },
      { min: 10, max: 24, price: 265 },
      { min: 25, max: 49, price: 260 },
      { min: 50, max: 99, price: 255 },
      { min: 100, max: Infinity, price: 250 },
    ],
  },
  "acid-wash-oversized-tee-250-gsm": {
    name: "Acid Wash Oversized Tee — 250 GSM",
    fit: "Oversized",
    gsm: 250,
    basePrice: 295,
    tiers: [
      { min: 1, max: 9, price: 358 },
      { min: 10, max: 24, price: 310 },
      { min: 25, max: 49, price: 305 },
      { min: 50, max: 99, price: 300 },
      { min: 100, max: Infinity, price: 295 },
    ],
  },
  "full-sleeve-oversized-tee-250-gsm": {
    name: "Full Sleeve Oversized Tee — 250 GSM",
    fit: "Oversized",
    gsm: 250,
    basePrice: 335,
    tiers: [
      { min: 1, max: 9, price: 388 },
      { min: 10, max: 24, price: 350 },
      { min: 25, max: 49, price: 345 },
      { min: 50, max: 99, price: 340 },
      { min: 100, max: Infinity, price: 335 },
    ],
  },
  "oversized-tee-230-gsm": {
    name: "Oversized Tee — 230 GSM Single Jersey",
    fit: "Oversized",
    gsm: 230,
    basePrice: 240,
    tiers: [
      { min: 1, max: 9, price: 275 },
      { min: 10, max: 24, price: 250 },
      { min: 25, max: 49, price: 246 },
      { min: 50, max: 99, price: 242 },
      { min: 100, max: Infinity, price: 240 },
    ],
  },
  "regular-fit-tee-190-gsm": {
    name: "Regular Fit Tee — 190 GSM",
    fit: "Regular",
    gsm: 190,
    basePrice: 192,
    tiers: [
      { min: 1, max: 9, price: 220 },
      { min: 10, max: 24, price: 202 },
      { min: 25, max: 49, price: 198 },
      { min: 50, max: 99, price: 195 },
      { min: 100, max: Infinity, price: 192 },
    ],
  },
  "oversized-tee-190-gsm": {
    name: "Oversized Tee — 190 GSM",
    fit: "Oversized",
    gsm: 190,
    basePrice: 210,
    tiers: [
      { min: 1, max: 9, price: 245 },
      { min: 10, max: 24, price: 230 },
      { min: 25, max: 49, price: 225 },
      { min: 50, max: 99, price: 220 },
      { min: 100, max: Infinity, price: 210 },
    ],
  },
};

/**
 * Returns the unit price for a garment based on order quantity.
 */
export function getGarmentUnitPrice(productId, quantity) {
  const garment = GARMENT_CATALOG[productId];
  if (!garment) {
    throw new Error(`Unknown garment product ID: ${productId}`);
  }
  const qty = Math.max(1, Number(quantity) || 1);
  const tier = garment.tiers.find((t) => qty >= t.min && qty <= t.max);
  return tier ? tier.price : garment.basePrice;
}

/**
 * Calculates print unit cost depending on line quantity (single vs bulk at 10+).
 */
export function getPrintCost(sizeKey, quantity) {
  const printDef = DTF_PRINTS[sizeKey.toLowerCase()];
  if (!printDef) {
    throw new Error(`Unknown DTF print sizeKey: ${sizeKey}`);
  }
  const qty = Math.max(1, Number(quantity) || 1);
  return qty >= 10 ? printDef.bulk : printDef.single;
}

/**
 * Calculates a complete line item with prints and free neck label rule.
 * Free neck label rule: Neck label cost is waived (0) if A2, A3, or A4 print is placed on that line.
 * 
 * @param {string} productId
 * @param {number} quantity
 * @param {Array<{ position: string, sizeKey: string }>} prints
 */
export function calculateLineItem(productId, quantity, prints = []) {
  const qty = Math.max(1, Number(quantity) || 1);
  const garmentUnitPrice = getGarmentUnitPrice(productId, qty);

  // Check if A2, A3, or A4 print is present on this garment line
  const hasLargePrint = prints.some((p) => {
    const key = p.sizeKey.toLowerCase();
    return key === "a2" || key === "a3" || key === "a4";
  });

  const printDetails = prints.map((p) => {
    const key = p.sizeKey.toLowerCase();
    const printDef = DTF_PRINTS[key];
    if (!printDef) {
      throw new Error(`Unknown print size: ${p.sizeKey}`);
    }

    let unitCost = qty >= 10 ? printDef.bulk : printDef.single;

    // Free neck label waiver check
    let isWaived = false;
    if (key === "label" && hasLargePrint) {
      unitCost = 0;
      isWaived = true;
    }

    return {
      position: p.position,
      sizeKey: key,
      sizeLabel: printDef.label,
      unitCost,
      isWaived,
      totalCost: unitCost * qty,
    };
  });

  const totalPrintsUnitCost = printDetails.reduce((sum, p) => sum + p.unitCost, 0);
  const totalUnitPrice = garmentUnitPrice + totalPrintsUnitCost;
  const totalPrice = totalUnitPrice * qty;

  return {
    productId,
    quantity: qty,
    garmentUnitPrice,
    prints: printDetails,
    totalPrintsUnitCost,
    unitPrice: totalUnitPrice,
    totalPrice,
  };
}

/**
 * Computes grand totals across multiple lines with 5% GST.
 * 
 * @param {Array<{ productId: string, quantity: number, prints?: Array }>} lines
 */
export function calculateOrder(lines) {
  const lineResults = lines.map((line) =>
    calculateLineItem(line.productId, line.quantity, line.prints || [])
  );

  const subtotal = lineResults.reduce((sum, item) => sum + item.totalPrice, 0);
  const gst = Math.round(subtotal * (GST_PERCENTAGE / 100) * 100) / 100;
  const grandTotal = Math.round((subtotal + gst) * 100) / 100;
  const totalQuantity = lineResults.reduce((sum, item) => sum + item.quantity, 0);

  return {
    lines: lineResults,
    totalQuantity,
    subtotal,
    gst,
    grandTotal,
  };
}

export default {
  GST_PERCENTAGE,
  VOLUME_TIERS,
  DTF_PRINTS,
  GARMENT_CATALOG,
  getGarmentUnitPrice,
  getPrintCost,
  calculateLineItem,
  calculateOrder,
};
