declare global {
  interface Number {
    includes(search: string): boolean;
  }
}

if (typeof Number !== "undefined" && !Number.prototype.includes) {
  Number.prototype.includes = function (this: number, search: string): boolean {
    return this.toString().includes(search);
  };
}

export interface PricingTier {
  min: number;
  max?: number;
  label: string;
  price: number;
}

export interface GarmentColour {
  name: string;
  hex: string;
  front: string;
  back: string;
  photoFront?: string;
  photoBack?: string;
}

export interface GarmentProduct {
  id: string;
  name: string;
  slug: string;
  spec: string;
  description: string;
  fit: "Oversized" | "Regular" | string;
  gsm: number;
  fabric: string;
  basePrice: number;
  tiers: Array<{ min: number; max: number; price: number; label: string }>;
  prices: PricingTier[];
  colors: Array<{
    name: string;
    hex: string;
    photoFront: string;
    photoBack: string;
    front?: string;
    back?: string;
  }>;
  colours: GarmentColour[];
  zones: {
    front: [number, number, number, number, number]; // [cx, cy, w, h, rot]
    back: [number, number, number, number, number];
    right?: [number, number, number, number, number];
    left?: [number, number, number, number, number];
  };
}

export const REVERSE_ENGINEERED_PRODUCTS: GarmentProduct[] = [
  {
    id: "oversized-tee-250-gsm-french-terry",
    name: "Oversized Tee — 250 GSM French Terry",
    slug: "oversized-tee-250-gsm-french-terry",
    spec: "250 GSM · 100% Super Combed Cotton French Terry",
    description:
      "Heavyweight luxury streetwear blank crafted from 250 GSM French Terry cotton. Features relaxed drop shoulders, thick ribbed collar, and pre-shrunk bio-washed finish.",
    gsm: 250,
    fit: "Oversized",
    fabric: "100% Super Combed Cotton French Terry, Bio-Washed",
    basePrice: 250,
    tiers: [
      { min: 1, max: 9, price: 290, label: "1–9 pcs" },
      { min: 10, max: 24, price: 265, label: "10–24 pcs" },
      { min: 25, max: 49, price: 260, label: "25–49 pcs" },
      { min: 50, max: 99, price: 255, label: "50–99 pcs" },
      { min: 100, max: 9999, price: 250, label: "100+ pcs" },
    ],
    prices: [
      { min: 1, max: 9, label: "1 – 9 pcs", price: 290 },
      { min: 10, max: 24, label: "10 – 24 pcs", price: 265 },
      { min: 25, max: 49, label: "25 – 49 pcs", price: 260 },
      { min: 50, max: 99, label: "50 – 99 pcs", price: 255 },
      { min: 100, max: 9999, label: "100+ pcs", price: 250 },
    ],
    colors: [
      {
        name: "Black",
        hex: "#131313",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#F2EAEA",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white-back.jpg?v=3.3.0",
      },
      {
        name: "Beige",
        hex: "#EBE6D4",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-beige.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-beige-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-beige.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-beige-back.jpg?v=3.3.0",
      },
      {
        name: "Navy Blue",
        hex: "#1F273A",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-navy-blue.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-navy-blue-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-navy-blue.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-navy-blue-back.jpg?v=3.3.0",
      },
      {
        name: "Royal Blue",
        hex: "#083D8A",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-royal-blue.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-royal-blue-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-royal-blue.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-royal-blue-back.jpg?v=3.3.0",
      },
      {
        name: "Lavender",
        hex: "#684BA2",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-lavender.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-lavender-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-lavender.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-lavender-back.jpg?v=3.3.0",
      },
      {
        name: "Red",
        hex: "#C52E2E",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-red.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-red-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-red.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-red-back.jpg?v=3.3.0",
      },
      {
        name: "Green",
        hex: "#24572A",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-green.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-green-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-green.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-green-back.jpg?v=3.3.0",
      },
      {
        name: "Brown",
        hex: "#79472D",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-brown.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-brown-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-brown.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-brown-back.jpg?v=3.3.0",
      },
    ],
    colours: [
      {
        name: "Black",
        hex: "#131313",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#F2EAEA",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-white-back.jpg?v=3.3.0",
      },
      {
        name: "Beige",
        hex: "#EBE6D4",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-beige.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-beige-back.jpg?v=3.3.0",
      },
      {
        name: "Navy Blue",
        hex: "#1F273A",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-navy-blue.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-navy-blue-back.jpg?v=3.3.0",
      },
      {
        name: "Royal Blue",
        hex: "#083D8A",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-royal-blue.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-royal-blue-back.jpg?v=3.3.0",
      },
      {
        name: "Lavender",
        hex: "#684BA2",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-lavender.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-lavender-back.jpg?v=3.3.0",
      },
      {
        name: "Red",
        hex: "#C52E2E",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-red.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-red-back.jpg?v=3.3.0",
      },
      {
        name: "Green",
        hex: "#24572A",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-green.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-green-back.jpg?v=3.3.0",
      },
      {
        name: "Brown",
        hex: "#79472D",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-brown.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-250-gsm-french-terry-brown-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 375, 300, 420, 0],
      back: [300, 357, 300, 450, 0],
      right: [100, 258, 72, 72, 24],
      left: [500, 258, 72, 72, -24],
    },
  },
  {
    id: "acid-wash-oversized-tee-250-gsm",
    name: "Acid Wash Oversized Tee — 250 GSM",
    slug: "acid-wash-oversized-tee-250-gsm",
    spec: "250 GSM · Vintage Mineral/Acid Washed Cotton",
    description:
      "Vintage mineral acid-washed streetwear t-shirt with unique individual wash patterns on every single piece. Premium heavy hand-feel with soft combed yarns.",
    gsm: 250,
    fit: "Oversized",
    fabric: "100% Cotton French Terry, Mineral Acid Washed",
    basePrice: 295,
    tiers: [
      { min: 1, max: 9, price: 358, label: "1–9 pcs" },
      { min: 10, max: 24, price: 310, label: "10–24 pcs" },
      { min: 25, max: 49, price: 305, label: "25–49 pcs" },
      { min: 50, max: 99, price: 300, label: "50–99 pcs" },
      { min: 100, max: 9999, price: 295, label: "100+ pcs" },
    ],
    prices: [
      { min: 1, max: 9, label: "1 – 9 pcs", price: 358 },
      { min: 10, max: 24, label: "10 – 24 pcs", price: 310 },
      { min: 25, max: 49, label: "25 – 49 pcs", price: 305 },
      { min: 50, max: 99, label: "50 – 99 pcs", price: 300 },
      { min: 100, max: 9999, label: "100+ pcs", price: 295 },
    ],
    colors: [
      {
        name: "Black",
        hex: "#313131",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-black.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-black-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-black-back.jpg?v=3.3.0",
      },
      {
        name: "Green",
        hex: "#24572A",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-green.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-green-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-green.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-green-back.jpg?v=3.3.0",
      },
      {
        name: "Royal Blue",
        hex: "#083D8A",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-royal-blue.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-royal-blue-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-royal-blue.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-royal-blue-back.jpg?v=3.3.0",
      },
    ],
    colours: [
      {
        name: "Black",
        hex: "#313131",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-black-back.jpg?v=3.3.0",
      },
      {
        name: "Green",
        hex: "#24572A",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-green.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-green-back.jpg?v=3.3.0",
      },
      {
        name: "Royal Blue",
        hex: "#083D8A",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-royal-blue.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/acid-wash-oversized-tee-250-gsm-royal-blue-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 378, 300, 420, 0],
      back: [300, 357, 300, 450, 0],
      right: [98, 258, 72, 72, 24],
      left: [502, 258, 72, 72, -24],
    },
  },
  {
    id: "full-sleeve-oversized-tee-250-gsm",
    name: "Full Sleeve Oversized Tee — 250 GSM",
    slug: "full-sleeve-oversized-tee-250-gsm",
    spec: "250 GSM · Heavyweight French Terry Long Sleeve",
    description:
      "Heavyweight long-sleeve oversized tee engineered for winter drops and layered aesthetics. Ribbed cuffs and dropped shoulder seam for authentic street silhouette.",
    gsm: 250,
    fit: "Oversized",
    fabric: "100% Super Combed Cotton French Terry, Bio-Washed",
    basePrice: 335,
    tiers: [
      { min: 1, max: 9, price: 388, label: "1–9 pcs" },
      { min: 10, max: 24, price: 350, label: "10–24 pcs" },
      { min: 25, max: 49, price: 345, label: "25–49 pcs" },
      { min: 50, max: 99, price: 340, label: "50–99 pcs" },
      { min: 100, max: 9999, price: 335, label: "100+ pcs" },
    ],
    prices: [
      { min: 1, max: 9, label: "1 – 9 pcs", price: 388 },
      { min: 10, max: 24, label: "10 – 24 pcs", price: 350 },
      { min: 25, max: 49, label: "25 – 49 pcs", price: 345 },
      { min: 50, max: 99, label: "50 – 99 pcs", price: 340 },
      { min: 100, max: 9999, label: "100+ pcs", price: 335 },
    ],
    colors: [
      {
        name: "Black",
        hex: "#131313",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/full-sleeve-oversized-tee-250-gsm-black.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/full-sleeve-oversized-tee-250-gsm-black-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/full-sleeve-oversized-tee-250-gsm-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/full-sleeve-oversized-tee-250-gsm-black-back.jpg?v=3.3.0",
      },
    ],
    colours: [
      {
        name: "Black",
        hex: "#131313",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/full-sleeve-oversized-tee-250-gsm-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/full-sleeve-oversized-tee-250-gsm-black-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 375, 300, 420, 0],
      back: [300, 357, 300, 450, 0],
      right: [110, 290, 52, 140, 10],
      left: [490, 290, 52, 140, -10],
    },
  },
  {
    id: "oversized-tee-230-gsm",
    name: "Oversized Tee — 230 GSM Single Jersey",
    slug: "oversized-tee-230-gsm",
    spec: "230 GSM · Single Jersey",
    description:
      "The quintessential heavyweight streetwear blank. 230 GSM combed cotton single jersey offering substantial drape without French Terry loopback bulk.",
    gsm: 230,
    fit: "Oversized",
    fabric: "100% Combed Cotton Single Jersey, Bio-Washed",
    basePrice: 240,
    tiers: [
      { min: 1, max: 9, price: 275, label: "1–9 pcs" },
      { min: 10, max: 24, price: 255, label: "10–24 pcs" },
      { min: 25, max: 49, price: 250, label: "25–49 pcs" },
      { min: 50, max: 99, price: 245, label: "50–99 pcs" },
      { min: 100, max: 9999, price: 240, label: "100+ pcs" },
    ],
    prices: [
      { min: 1, max: 9, label: "1 – 9 pcs", price: 275 },
      { min: 10, max: 24, label: "10 – 24 pcs", price: 255 },
      { min: 25, max: 49, label: "25 – 49 pcs", price: 250 },
      { min: 50, max: 99, label: "50 – 99 pcs", price: 245 },
      { min: 100, max: 9999, label: "100+ pcs", price: 240 },
    ],
    colors: [
      {
        name: "Black",
        hex: "#131313",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-black.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-black-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#F2EAEA",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-white.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-white-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-white.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-white-back.jpg?v=3.3.0",
      },
    ],
    colours: [
      {
        name: "Black",
        hex: "#131313",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#F2EAEA",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-white.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-230-gsm-white-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 375, 300, 420, 0],
      back: [300, 357, 300, 450, 0],
      right: [100, 258, 72, 72, 24],
      left: [500, 258, 72, 72, -24],
    },
  },
  {
    id: "oversized-tee-190-gsm",
    name: "Oversized Tee — 190 GSM Single Jersey",
    slug: "oversized-tee-190-gsm",
    spec: "190 GSM · Single Jersey",
    description:
      "Lightweight, breathable oversized streetwear silhouette in 100% super combed single jersey cotton. Ideal for summer drops and everyday layering.",
    fit: "Oversized",
    gsm: 190,
    fabric: "100% Super Combed Cotton Single Jersey, Bio-Washed",
    basePrice: 220,
    tiers: [
      { min: 1, max: 9, price: 245, label: "1–9 pcs" },
      { min: 10, max: 24, price: 230, label: "10–24 pcs" },
      { min: 25, max: 99, price: 225, label: "25–99 pcs" },
      { min: 100, max: 9999, price: 220, label: "100+ pcs" },
    ],
    prices: [
      { min: 1, max: 9, label: "1 – 9 pcs", price: 245 },
      { min: 10, max: 24, label: "10 – 24 pcs", price: 230 },
      { min: 25, max: 99, label: "25 – 99 pcs", price: 225 },
      { min: 100, max: 9999, label: "100+ pcs", price: 220 },
    ],
    colors: [
      {
        name: "Black",
        hex: "#131313",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm/front-black.png",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm/back-black.png",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#F2EAEA",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm/front-white.png",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm/back-white.png",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm-white.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm-white-back.jpg?v=3.3.0",
      },
    ],
    colours: [
      {
        name: "Black",
        hex: "#131313",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#F2EAEA",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm-white.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/oversized-tee-190-gsm-white-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 375, 300, 420, 0],
      back: [300, 357, 300, 450, 0],
      right: [100, 258, 72, 72, 24],
      left: [500, 258, 72, 72, -24],
    },
  },
  {
    id: "regular-fit-tee-190-gsm",
    name: "Regular Fit Tee — 190 GSM",
    slug: "regular-fit-tee-190-gsm",
    spec: "190 GSM · Single Jersey",
    description:
      "Classic tailored regular fit blank made with 190 GSM 100% bio-washed cotton. Fitted shoulders and timeless silhouette perfect for brand merchandise and uniform drops.",
    fit: "Regular",
    gsm: 190,
    fabric: "100% Cotton Bio-Washed Single Jersey",
    basePrice: 192,
    tiers: [
      { min: 1, max: 9, price: 210, label: "1–9 pcs" },
      { min: 10, max: 49, price: 198, label: "10–49 pcs" },
      { min: 50, max: 9999, price: 192, label: "50+ pcs" },
    ],
    prices: [
      { min: 1, max: 9, label: "1 – 9 pcs", price: 210 },
      { min: 10, max: 49, label: "10 – 49 pcs", price: 198 },
      { min: 50, max: 9999, label: "50+ pcs", price: 192 },
    ],
    colors: [
      {
        name: "Black",
        hex: "#000000",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-black.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-black-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#FFFFFF",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-white.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-white-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-white.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-white-back.jpg?v=3.3.0",
      },
      {
        name: "Red",
        hex: "#DB0C0C",
        photoFront:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-red.jpg?v=3.3.0",
        photoBack:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-red-back.jpg?v=3.3.0",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-red.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-red-back.jpg?v=3.3.0",
      },
    ],
    colours: [
      {
        name: "Black",
        hex: "#000000",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-black.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-black-back.jpg?v=3.3.0",
      },
      {
        name: "White",
        hex: "#FFFFFF",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-white.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-white-back.jpg?v=3.3.0",
      },
      {
        name: "Red",
        hex: "#DB0C0C",
        front:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-red.jpg?v=3.3.0",
        back:
          "https://loomaapparels.com/wp-content/themes/looma-apparels/assets/img/products/regular-fit-tee-190-gsm-red-back.jpg?v=3.3.0",
      },
    ],
    zones: {
      front: [300, 372, 290, 415, 0],
      back: [300, 350, 290, 445, 0],
      right: [98, 228, 60, 60, 28],
      left: [502, 228, 60, 60, -28],
    },
  },
];

export const DTF_PRINTS: Record<
  string,
  { label: string; single: number; bulk: number; size: string; dimensions?: string }
> = {
  a2: { label: "A2 Size", single: 200, bulk: 175, size: '16" × 22"', dimensions: '16" × 22"' },
  a3: { label: "A3 Size", single: 135, bulk: 100, size: '11" × 16"', dimensions: '11" × 16"' },
  a4: { label: "A4 Size", single: 95, bulk: 70, size: '8" × 11"', dimensions: '8" × 11"' },
  a5: { label: "A5 Size", single: 60, bulk: 45, size: '5.8" × 8.3"', dimensions: '5.8" × 8.3"' },
  a6: { label: "A6 Size", single: 40, bulk: 25, size: '4.1" × 5.8"', dimensions: '4.1" × 5.8"' },
  logo: { label: "Chest / Sleeve Logo", single: 20, bulk: 10, size: '2.5" × 2.5"', dimensions: '2.5" × 2.5"' },
  label: { label: "Custom Neck Label", single: 0, bulk: 0, size: "Free branding", dimensions: "Free branding" },
};

export const EMBROIDERY_RATES = [
  { min: 1, rate: 7 },
  { min: 10, rate: 6 },
  { min: 50, rate: 4 },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const GST_PERCENTAGE = 5;
export const BRAND_NAME = "ASSON Clothing";
export const BRAND_TAGLINE = "Streetwear, made different";
export const BUSINESS_PHONE = "+91 90729 97950";
export const WHATSAPP_NUMBER = "+91 90729 97950";
export const WHATSAPP_LINK = "https://wa.me/919072997950";
export const SUPPORT_EMAIL = "assonclothingbrand@gmail.com";
export const ORDERS_EMAIL = "orders@assonclothing.com";
export const BUSINESS_LOCATION = "Calicut, Kerala, India";
export const INSTAGRAM_HANDLE = "asson_clothing";
export const INSTAGRAM_LINK = "https://instagram.com/asson_clothing";

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
