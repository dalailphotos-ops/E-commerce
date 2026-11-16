import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DTF_PRINTS, GST_PERCENTAGE, WHATSAPP_NUMBER } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface CalculationParams {
  baseGarmentPrice: number;
  quantity: number;
  printSizeKey?: string;
  isEmbroidery?: boolean;
  embroideryStitches?: number;
  hasCustomNeckLabel?: boolean;
}

export function calculateApparelPrice({
  baseGarmentPrice,
  quantity,
  printSizeKey,
  isEmbroidery = false,
  embroideryStitches = 0,
  hasCustomNeckLabel = true,
}: CalculationParams) {
  // Determine if quantity qualifies for bulk print rate (>= 10 pcs)
  const isBulk = quantity >= 10;

  let printCostPerUnit = 0;
  if (printSizeKey && DTF_PRINTS[printSizeKey]) {
    printCostPerUnit = isBulk
      ? DTF_PRINTS[printSizeKey].bulk
      : DTF_PRINTS[printSizeKey].single;
  }

  let embroideryCostPerUnit = 0;
  if (isEmbroidery && embroideryStitches > 0) {
    const rate = isBulk ? 6 : 7;
    embroideryCostPerUnit = (embroideryStitches / 1000) * rate;
  }

  const unitNetPrice = baseGarmentPrice + printCostPerUnit + embroideryCostPerUnit;
  const subtotal = unitNetPrice * quantity;
  const gstAmount = Math.round((subtotal * GST_PERCENTAGE) / 100);
  const total = subtotal + gstAmount;

  return {
    unitNetPrice,
    printCostPerUnit,
    embroideryCostPerUnit,
    subtotal,
    gstAmount,
    total,
  };
}

export function generateWhatsAppQuoteMessage({
  productName,
  color,
  quantity,
  printType,
  printPlacement,
  estimatedTotal,
  customerName,
  designUrl,
}: {
  productName: string;
  color?: string;
  quantity: number;
  printType?: string;
  printPlacement?: string;
  estimatedTotal?: number;
  customerName?: string;
  designUrl?: string;
}): string {
  let msg = `*New Order / Quote Enquiry — Asson Clothing Brand*\n\n`;
  if (customerName) msg += `*Customer:* ${customerName}\n`;
  msg += `*Garment:* ${productName}\n`;
  if (color) msg += `*Colour:* ${color}\n`;
  msg += `*Quantity:* ${quantity} pcs\n`;
  if (printType) msg += `*Printing/Craft:* ${printType}\n`;
  if (printPlacement) msg += `*Print Placement/Size:* ${printPlacement}\n`;
  if (estimatedTotal) msg += `*Estimated Total:* ${formatINR(estimatedTotal)} (incl. 5% GST)\n`;
  if (designUrl) msg += `*Design Mockup:* ${designUrl}\n`;
  msg += `\nPlease confirm production turnaround time and payment link.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
