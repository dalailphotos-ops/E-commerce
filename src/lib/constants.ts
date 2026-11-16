export interface PricingTier {
  min: number;
  label: string;
  price: number;
}

export interface GarmentColour {
  name: string;
  hex: string;
  front: string;
  back: string;
}

export interface GarmentProduct {
  id: string;
  name: string;
  slug: string;
  spec: string;
  gsm: string;
  fit: string;
  basePrice: number;
  prices: PricingTier[];
  colours: GarmentColour[];
  zones: {
    front: [number, number, number, number, number]; // x, y, width, height, angle
    back: [number, number, number, number, number];
  };
}

export const REVERSE_ENGINEERED_PRODUCTS: GarmentProduct[] = [
  {
    id: "oversized-tee-250-gsm-french-terry",
    name: "Oversized Tee — 250 GSM French Terry",
    slug: "oversized-tee-250-gsm-french-terry",
    spec: "250 GSM · 100% Super Combed Cotton French Terry",
    gsm: "250 GSM",
    fit: "Oversized Fit",
    basePrice: 250,
    prices: [
      { min: 1, label: "1 – 9 pcs", price: 290 },
      { min: 10, label: "10 – 24 pcs", price: 265 },
      { min: 25, label: "25 – 49 pcs", price: 260 },
      { min: 50, label: "50 – 99 pcs", price: 255 },
      { min: 100, label: "100+ pcs", price: 250 },
    ],
    colours: [
      {
        name: "Black",
        hex: "#131313",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#F2EAEA",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white-back.jpg?v=3.3.0",
      },
      {
        name: "Beige",
        hex: "#EBE6D4",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-beige.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-beige-back.jpg?v=3.3.0",
      },
      {
        name: "Navy Blue",
        hex: "#1F273A",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-navy-blue.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-navy-blue-back.jpg?v=3.3.0",
      },
      {
        name: "Royal Blue",
        hex: "#083D8A",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-royal-blue.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-royal-blue-back.jpg?v=3.3.0",
      },
      {
        name: "Lavender",
        hex: "#684BA2",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-lavender.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-lavender-back.jpg?v=3.3.0",
      },
      {
        name: "Red",
        hex: "#C52E2E",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-red.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-red-back.jpg?v=3.3.0",
      },
      {
        name: "Green",
        hex: "#24572A",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-green.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-green-back.jpg?v=3.3.0",
      },
      {
        name: "Brown",
        hex: "#79472D",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-brown.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-brown-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 375, 300, 420, 0],
      back: [300, 375, 300, 420, 0],
    },
  },
  {
    id: "acid-wash-oversized-tee-250-gsm",
    name: "Acid Wash Oversized Tee — 250 GSM",
    slug: "acid-wash-oversized-tee-250-gsm",
    spec: "250 GSM · Vintage Mineral/Acid Washed Cotton",
    gsm: "250 GSM",
    fit: "Oversized Fit",
    basePrice: 295,
    prices: [
      { min: 1, label: "1 – 9 pcs", price: 358 },
      { min: 10, label: "10 – 24 pcs", price: 310 },
      { min: 25, label: "25 – 49 pcs", price: 305 },
      { min: 50, label: "50 – 99 pcs", price: 300 },
      { min: 100, label: "100+ pcs", price: 295 },
    ],
    colours: [
      {
        name: "Washed Black",
        hex: "#2c2c2c",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-washed-black.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-washed-black-back.jpg?v=3.3.0",
      },
      {
        name: "Washed Blue",
        hex: "#3b4d61",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-washed-blue.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-washed-blue-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 375, 300, 420, 0],
      back: [300, 375, 300, 420, 0],
    },
  },
  {
    id: "full-sleeve-oversized-tee-250-gsm",
    name: "Full Sleeve Oversized Tee — 250 GSM",
    slug: "full-sleeve-oversized-tee-250-gsm",
    spec: "250 GSM · Heavyweight French Terry Long Sleeve",
    gsm: "250 GSM",
    fit: "Oversized Long Sleeve",
    basePrice: 335,
    prices: [
      { min: 1, label: "1 – 9 pcs", price: 388 },
      { min: 10, label: "10 – 24 pcs", price: 350 },
      { min: 25, label: "25 – 49 pcs", price: 345 },
      { min: 50, label: "50 – 99 pcs", price: 340 },
      { min: 100, label: "100+ pcs", price: 335 },
    ],
    colours: [
      {
        name: "Black",
        hex: "#131313",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 375, 300, 420, 0],
      back: [300, 375, 300, 420, 0],
    },
  },
  {
    id: "oversized-tee-230-gsm",
    name: "Oversized Tee — 230 GSM Single Jersey",
    slug: "oversized-tee-230-gsm",
    spec: "230 GSM · 100% Combed Cotton Single Jersey",
    gsm: "230 GSM",
    fit: "Oversized Fit",
    basePrice: 240,
    prices: [
      { min: 1, label: "1 – 9 pcs", price: 275 },
      { min: 10, label: "10 – 24 pcs", price: 250 },
      { min: 25, label: "25 – 49 pcs", price: 246 },
      { min: 50, label: "50 – 99 pcs", price: 242 },
      { min: 100, label: "100+ pcs", price: 240 },
    ],
    colours: [
      {
        name: "Black",
        hex: "#131313",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#F2EAEA",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 375, 300, 420, 0],
      back: [300, 375, 300, 420, 0],
    },
  },
  {
    id: "regular-fit-tee-190-gsm",
    name: "Regular Fit Tee — 190 GSM",
    slug: "regular-fit-tee-190-gsm",
    spec: "190 GSM · 100% Cotton Bio-Washed",
    gsm: "190 GSM",
    fit: "Regular Fit",
    basePrice: 192,
    prices: [
      { min: 1, label: "1 – 9 pcs", price: 220 },
      { min: 10, label: "10 – 24 pcs", price: 202 },
      { min: 25, label: "25 – 49 pcs", price: 198 },
      { min: 50, label: "50 – 99 pcs", price: 195 },
      { min: 100, label: "100+ pcs", price: 192 },
    ],
    colours: [
      {
        name: "Black",
        hex: "#131313",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#F2EAEA",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white-back.jpg?v=3.3.0",
      },
      {
        name: "Navy Blue",
        hex: "#1F273A",
        front: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-navy-blue.jpg?v=3.3.0",
        back: "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-navy-blue-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 375, 300, 420, 0],
      back: [300, 375, 300, 420, 0],
    },
  },
];

export const DTF_PRINTS: Record<
  string,
  { label: string; single: number; bulk: number; size: string }
> = {
  a2: { label: "A2 Size", single: 200, bulk: 175, size: '16" × 22"' },
  a3: { label: "A3 Size", single: 135, bulk: 100, size: '11" × 16"' },
  a4: { label: "A4 Size", single: 95, bulk: 70, size: '8" × 11"' },
  a5: { label: "A5 Size", single: 60, bulk: 45, size: '5.8" × 8.3"' },
  a6: { label: "A6 Size", single: 40, bulk: 25, size: '4.1" × 5.8"' },
  logo: { label: "Chest / Sleeve Logo", single: 20, bulk: 10, size: '2.5" × 2.5"' },
  label: { label: "Custom Neck Label", single: 0, bulk: 0, size: "Free branding" },
};

export const EMBROIDERY_RATES = [
  { min: 1, rate: 7 },
  { min: 10, rate: 6 },
  { min: 50, rate: 4 },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const GST_PERCENTAGE = 5;
export const BRAND_NAME = "Asson Clothing Brand";
export const BRAND_TAGLINE = "The Clothing Lab — Custom Apparel & Streetwear Drops";

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

