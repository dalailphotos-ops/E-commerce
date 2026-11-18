"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Palette,
  CheckCircle2,
  ArrowRight,
  Layers,
  Shirt,
  Scissors,
  ShieldCheck,
  Calculator,
  Clock,
  Award,
  Droplets,
  Flame,
  Info,
  Check,
} from "lucide-react";
import { DTF_PRINTS } from "@/lib/constants";

type TechniqueFilter = "all" | "dtf" | "screen" | "embroidery";

interface PrintingSample {
  id: string;
  technique: "dtf" | "screen" | "embroidery";
  techniqueLabel: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  description: string;
  garment: string;
  placement: string;
  inkOrThread: string;
  colors: string;
  handFeel: string;
  durability: string;
  moq: string;
  turnaround: string;
  bgGradient: string;
  accentHex: string;
  mockupDetails: {
    graphicType: string;
    headline: string;
    tagline: string;
    accentStyle: string;
  };
  features: string[];
}

const SAMPLES: PrintingSample[] = [
  // DTF Samples
  {
    id: "sample-dtf-1",
    technique: "dtf",
    techniqueLabel: "DTF (Direct to Film)",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    title: "Cyberpunk Streetwear Oversized Graphic",
    subtitle: "High-definition photo transfer with micro-halftones",
    description:
      "Ultra-high-definition digital transfer on PET film with white ink underbase. Ideal for intricate streetwear graphics, gradients, photorealism, and complex multi-color designs with zero setup fees.",
    garment: "250 GSM Oversized French Terry (Washed Black)",
    placement: 'A3 Back (12" × 16") + Left Chest A6 Logo',
    inkOrThread: "OEKO-TEX Class 1 Multi-Head Pigment Inks",
    colors: "Unlimited Full-Color CMYK + White Underbase",
    handFeel: "Super-thin, stretchable elasticity with zero cracking",
    durability: "50+ commercial wash cycles at 40°C",
    moq: "1 Piece (Zero Minimum Order)",
    turnaround: "24 – 48 Hours Dispatch",
    bgGradient: "from-amber-950/60 via-brand-900 to-slate-900",
    accentHex: "#F59E0B",
    mockupDetails: {
      graphicType: "DTF Full-Color Digital Film",
      headline: "NEO TOKYO 2049",
      tagline: "Ultra-HD 2400 DPI Micro-Pigment Transfer",
      accentStyle: "bg-gradient-to-r from-amber-400 via-orange-500 to-purple-500",
    },
    features: [
      "Photo-realistic gradients and 0.15mm hairline details",
      "Elastic binder prevents cracking across rib and knit stretch",
      "No screen preparation costs — cost effective from 1 piece",
      "Free inside neck-label printing included with A3 size",
    ],
  },
  {
    id: "sample-dtf-2",
    technique: "dtf",
    techniqueLabel: "DTF (Direct to Film)",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    title: "Botanical Alchemy Fine-Line Illustration",
    subtitle: "Detailed botanical linework on natural raw cotton",
    description:
      "Delicate hand-drawn vector art transferred with precise microscopic drop control. Delivers crisp ink density even on unbleached raw ecru fabric without dye migration.",
    garment: "190 GSM Regular Fit Blank (Natural Ecru / Off-White)",
    placement: 'A4 Center Chest (8.3" × 11.7")',
    inkOrThread: "Water-based resin pigment emulsion",
    colors: "Terracotta, Sage Green & Charcoal Black",
    handFeel: "Featherweight, breathable zero-drag hand feel",
    durability: "50+ wash resistance with gentle cycle",
    moq: "1 Piece (Print-On-Demand Ready)",
    turnaround: "24 – 48 Hours Dispatch",
    bgGradient: "from-stone-900 via-brand-900 to-slate-950",
    accentHex: "#D97706",
    mockupDetails: {
      graphicType: "DTF Micro-Detail Line Art",
      headline: "BOTANICAL LAB",
      tagline: "Fine-Line Stippling & Vector Ink",
      accentStyle: "bg-gradient-to-r from-amber-300 to-emerald-400",
    },
    features: [
      "Sharp edge contouring without raster blurring",
      "Gentle heat-press adhesion preserves organic cotton fibers",
      "Ideal for creator apparel lines, capsule drops, and art prints",
      "Tested for skin compatibility and breathability",
    ],
  },

  // Screen Printing Samples
  {
    id: "sample-screen-1",
    technique: "screen",
    techniqueLabel: "Screen Printing",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    title: "Heritage Varsity Athletic Arch & Number",
    subtitle: "High-density opaque plastisol with razor-sharp stencil edges",
    description:
      "The traditional collegiate benchmark for volume runs. Heavy ink deposit formulation delivering bold opacity on deep dark fabric, perfectly matched to custom Pantone (PMS) standards.",
    garment: "210 GSM Heavyweight Regular Fit (Deep Navy Blue)",
    placement: 'A4 Chest Arch (10.5" × 4.5") + Right Sleeve Number',
    inkOrThread: "High-Opacity Industrial Plastisol Ink",
    colors: "2 Spot Colors: Sunburst Gold (PMS 123C) & Alpine White",
    handFeel: "Traditional athletic tactile raised ink deposit",
    durability: "100+ commercial wash longevity (Industry Gold Standard)",
    moq: "50 Pieces (Maximum Bulk Economy)",
    turnaround: "3 – 5 Business Days",
    bgGradient: "from-blue-950/70 via-brand-900 to-slate-950",
    accentHex: "#3B82F6",
    mockupDetails: {
      graphicType: "Industrial Screen Print (Plastisol)",
      headline: "ASSON ATHLETICS",
      tagline: "Pantone Matched 180-Mesh Spot Colors",
      accentStyle: "bg-gradient-to-r from-yellow-400 to-amber-500",
    },
    features: [
      "Lowest per-unit production cost for bulk wholesale runs",
      "Unmatched wash durability — zero fading after 100+ cycles",
      "High-tension Swiss mesh screens for razor-sharp typography",
      "Pantone Formula Guide color precision matching",
    ],
  },
  {
    id: "sample-screen-2",
    technique: "screen",
    techniqueLabel: "Screen Printing",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    title: "Motorsports Tour Water-Based Discharge Print",
    subtitle: "Zero-hand feel discharge ink that re-dyes raw cotton fibers",
    description:
      "Zinc-free water-based discharge chemistry that removes the dark dye from reactive-dyed cotton and replaces it with vibrant pigment, leaving zero heavy plastic film on the shirt.",
    garment: "250 GSM French Terry Crewneck (Vintage Charcoal)",
    placement: 'A3 Center Chest Graphic (11.5" × 14")',
    inkOrThread: "Water-Based Eco Discharge Emulsion",
    colors: "3 Spot Colors: Racing Red, Off-White & Gold",
    handFeel: "Zero-hand breathable texture — feels like the raw fabric",
    durability: "Indestructible — never cracks, peels, or wrinkles",
    moq: "60 Pieces (Discharge Tank Minimum)",
    turnaround: "4 – 6 Business Days",
    bgGradient: "from-slate-900 via-brand-950 to-neutral-900",
    accentHex: "#60A5FA",
    mockupDetails: {
      graphicType: "Water-Based Discharge Print",
      headline: "GRAND PRIX 1984",
      tagline: "Soft-Handle Fiber Dye Replacement",
      accentStyle: "bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300",
    },
    features: [
      "Completely breathable graphic that does not trap chest sweat",
      "Distressed vintage texture ideal for retro streetwear",
      "Iron-safe — can be ironed directly over the print surface",
      "Formulated with eco-safe organic pigments",
    ],
  },

  // Computerized Embroidery Samples
  {
    id: "sample-emb-1",
    technique: "embroidery",
    techniqueLabel: "Computerized Embroidery",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    title: "3D Puff & Satin Royal Crest Shield",
    subtitle: "14,800-stitch high-density embroidery with Madeira thread",
    description:
      "Sculpted 3D dimensional relief created by stitching over high-density EVA foam backing with dense Madeira Polyneon threads. Delivers high prestige luxury streetwear and corporate presence.",
    garment: "300 GSM Heavyweight Terry Hoodie (Asson Burgundy #3D0000)",
    placement: '3.5" × 3.5" Left-Chest Shield Badge',
    inkOrThread: "Madeira Polyneon 40wt Polyester + Metallic Luster",
    colors: "Champagne Gold, Crimson Maroon & Ivory White",
    handFeel: "Substantial 3D raised relief with silk-like sheen",
    durability: "Lifetime garment durability (heat, bleach & wash proof)",
    moq: "10 Pieces (Accessible Low MOQ)",
    turnaround: "3 – 5 Business Days",
    bgGradient: "from-brand-950 via-brand-900 to-red-950",
    accentHex: "#10B981",
    mockupDetails: {
      graphicType: "3D High-Density Embroidery",
      headline: "ASSON LAB CREST",
      tagline: "14,800 Stitches · 3D EVA Raised Foam",
      accentStyle: "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200",
    },
    features: [
      "14,800+ stitches for crisp high-density crest detail",
      "3D EVA foam underlay imparts tactile 3mm raised thickness",
      "Madeira polyester threads retain brilliant luster wash after wash",
      "Stitched on multi-head Barudan & Tajima industrial embroidery units",
    ],
  },
  {
    id: "sample-emb-2",
    technique: "embroidery",
    techniqueLabel: "Computerized Embroidery",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    title: "Executive Script Monogram & Neck Yoke",
    subtitle: "Clean flat satin stitching for premium polo and full sleeve drops",
    description:
      "High-precision computerized micro-stitching calibrated for corporate executive polos, golf shirts, and streetwear sleeve caps. Clean, subtle, and durable.",
    garment: "220 GSM Bio-Washed Pique Polo / Full Sleeve (Olive Green)",
    placement: 'Left Chest Script (3" × 1.2") + Back Neck Monogram',
    inkOrThread: "Madeira Classic 100% Viscose Rayon Thread",
    colors: "Matte Sand Gold & Muted White",
    handFeel: "Smooth, low-profile flexible satin stitch",
    durability: "Lifetime durability with tearaway soft backing",
    moq: "10 Pieces (Corporate & Hospitality Ready)",
    turnaround: "3 – 5 Business Days",
    bgGradient: "from-emerald-950/60 via-brand-900 to-slate-950",
    accentHex: "#34D399",
    mockupDetails: {
      graphicType: "Flat Satin Micro-Stitching",
      headline: "THE CLOTHING LAB",
      tagline: "7,400 Stitches · Zero-Pucker Stabilizer",
      accentStyle: "bg-gradient-to-r from-emerald-300 to-teal-400",
    },
    features: [
      "Soft tearaway backing prevents skin irritation on chest",
      "Zero puckering calibrated to fabric tension and stretch",
      "High luxury perception for uniform, golf, and boutique lines",
      "Digitized embroidery files (.DST / .EMB) archived for re-orders",
    ],
  },
];

export default function PrintingGuidePage() {
  const [activeFilter, setActiveFilter] = useState<TechniqueFilter>("all");
  const [selectedSample, setSelectedSample] = useState<PrintingSample | null>(null);

  const filteredSamples =
    activeFilter === "all"
      ? SAMPLES
      : SAMPLES.filter((s) => s.technique === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. Header Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-accent uppercase tracking-widest inline-flex items-center gap-1.5 bg-brand-100 text-brand-900 px-3.5 py-1.5 rounded-full border border-brand-200">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Textile Decoration Lab & Production Samples
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Printing Techniques & Real Garment Samples
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Inspect production-grade samples across our three core garment embellishment
          technologies: Direct-to-Film (DTF), Screen Printing, and Computerized Embroidery.
          Compare tactile hand-feel, wash durability, color gamut, and volume economics.
        </p>

        {/* Quick Jump Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              activeFilter === "all"
                ? "bg-brand-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            All Samples (6)
          </button>
          <button
            onClick={() => setActiveFilter("dtf")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
              activeFilter === "dtf"
                ? "bg-amber-500 text-slate-950"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            DTF (Direct to Film) (2)
          </button>
          <button
            onClick={() => setActiveFilter("screen")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
              activeFilter === "screen"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Screen Printing (2)
          </button>
          <button
            onClick={() => setActiveFilter("embroidery")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
              activeFilter === "embroidery"
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Computerized Embroidery (2)
          </button>
        </div>
      </div>

      {/* 2. Visual Production Samples Showcase */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Factory Proof Archive
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Production Samples & Tactile Proofs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-world execution specifications from our South India apparel lab.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/design"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5" />
              Design Studio
            </Link>
            <Link
              href="/price-estimator"
              className="px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              Price Estimator
            </Link>
          </div>
        </div>

        {/* Samples Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSamples.map((sample) => (
            <article
              key={sample.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Visual Mockup Card Container */}
              <div
                className={`relative h-64 sm:h-72 bg-gradient-to-br ${sample.bgGradient} p-6 flex flex-col justify-between overflow-hidden text-white`}
              >
                {/* Background Pattern Mesh */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />

                {/* Top Header inside Mockup */}
                <div className="relative z-10 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${sample.badgeColor}`}
                  >
                    {sample.techniqueLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    MOQ: {sample.moq.split(" ")[0]} {sample.moq.split(" ")[1]}
                  </span>
                </div>

                {/* Graphic Artwork Simulation */}
                <div className="relative z-10 my-auto text-center space-y-1 py-4">
                  <div className="inline-block px-3 py-1 rounded-md bg-black/40 backdrop-blur-sm border border-white/10 mb-2">
                    <span className="text-[10px] font-mono text-slate-300 tracking-widest uppercase">
                      {sample.mockupDetails.graphicType}
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
                    {sample.mockupDetails.headline}
                  </h4>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span
                      className={`h-1 w-12 rounded-full ${sample.mockupDetails.accentStyle}`}
                    />
                    <span className="text-[11px] font-semibold text-slate-300">
                      {sample.mockupDetails.tagline}
                    </span>
                    <span
                      className={`h-1 w-12 rounded-full ${sample.mockupDetails.accentStyle}`}
                    />
                  </div>
                </div>

                {/* Bottom Garment Spec Chip */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5 truncate">
                    <Shirt className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{sample.garment.split(" (")[0]}</span>
                  </span>
                  <span className="font-mono text-amber-300 shrink-0">
                    {sample.placement.split(" +")[0]}
                  </span>
                </div>
              </div>

              {/* Sample Details Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-900 transition-colors">
                      {sample.title}
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold mt-0.5">
                      {sample.subtitle}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sample.description}
                  </p>

                  {/* Micro Specs List */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 text-[11px]">Ink / Thread:</span>
                      <span className="font-semibold text-slate-800 text-right text-[11px]">
                        {sample.inkOrThread}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 text-[11px]">Placement:</span>
                      <span className="font-semibold text-slate-800 text-right text-[11px]">
                        {sample.placement}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 text-[11px]">Texture & Feel:</span>
                      <span className="font-semibold text-slate-800 text-right text-[11px]">
                        {sample.handFeel}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-500 text-[11px]">Durability:</span>
                      <span className="font-semibold text-emerald-700 text-right text-[11px]">
                        {sample.durability}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSample(sample)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition text-center flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" /> Full Specs
                  </button>
                  <Link
                    href={`/design?technique=${sample.technique}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold transition text-center flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Palette className="w-3.5 h-3.5" /> Customize
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Deep Side-by-Side Comparison Matrix */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">
            Decision Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Comparing DTF vs Screen Printing vs Embroidery
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose the right embellishment method based on your artwork complexity,
            garment density, and order volume.
          </p>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="py-3 px-4 font-bold rounded-l-xl">Feature / Spec</th>
                <th className="py-3 px-4 font-bold text-amber-700">DTF (Direct to Film)</th>
                <th className="py-3 px-4 font-bold text-blue-700">Screen Printing</th>
                <th className="py-3 px-4 font-bold text-emerald-700 rounded-r-xl">
                  Computerized Embroidery
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Minimum Order (MOQ)</td>
                <td className="py-3.5 px-4 font-semibold text-amber-600">1 Piece (Zero MOQ)</td>
                <td className="py-3.5 px-4">50 Pieces (Bulk runs)</td>
                <td className="py-3.5 px-4">10 Pieces</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Color Palette</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  Unlimited gradients & photorealism
                </td>
                <td className="py-3.5 px-4">1 to 6 Spot Colors (Pantone PMS)</td>
                <td className="py-3.5 px-4">Up to 12 Madeira thread colors</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Tactile Hand Feel</td>
                <td className="py-3.5 px-4">Soft stretchable elastic film</td>
                <td className="py-3.5 px-4">Matte opaque or zero-hand discharge</td>
                <td className="py-3.5 px-4 font-semibold text-emerald-700">
                  Sculpted 3D raised tactile relief
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Wash Durability</td>
                <td className="py-3.5 px-4">50+ Washes (No cracking)</td>
                <td className="py-3.5 px-4 font-bold text-blue-600">
                  100+ Washes (Gold standard)
                </td>
                <td className="py-3.5 px-4 font-bold text-emerald-600">
                  Lifetime Durability
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Setup Fees</td>
                <td className="py-3.5 px-4 text-emerald-600 font-bold">₹0 Free Digital Setup</td>
                <td className="py-3.5 px-4">Screen setup charges for &lt;50 pcs</td>
                <td className="py-3.5 px-4">One-time embroidery digitizing</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Best Applications</td>
                <td className="py-3.5 px-4">Dropshipping, Streetwear drops & art</td>
                <td className="py-3.5 px-4">College fests, wholesale brands, uniforms</td>
                <td className="py-3.5 px-4">Executive polos, heavyweight hoodies, crests</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900">Turnaround Time</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">24 – 48 Hours</td>
                <td className="py-3.5 px-4">3 – 5 Business Days</td>
                <td className="py-3.5 px-4">3 – 5 Business Days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. DTF Standard Size & Pricing Matrix */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              Calibrated Sheet Standards
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Direct To Film (DTF) Standard Sizes
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Industrial multi-head digital printer transfers with OEKO-TEX certified pigment inks.
            </p>
          </div>
          <Link
            href="/price-estimator"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            Calculate in Estimator <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(DTF_PRINTS).map(([key, item]) => (
            <div
              key={key}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-brand-300 transition"
            >
              <div>
                <span className="text-xs font-bold text-accent block uppercase">
                  {key}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  {item.label}
                </h3>
                <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                  Dimensions: {item.size}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">10+ pcs (Bulk):</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {item.bulk === 0 ? "FREE" : `+₹${item.bulk}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">1-9 pcs (Sample):</span>
                  <span className="font-semibold text-slate-700 text-sm">
                    {item.single === 0 ? "FREE" : `+₹${item.single}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Production Sample Details Modal */}
      {selectedSample && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${selectedSample.badgeColor}`}
                >
                  {selectedSample.techniqueLabel}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {selectedSample.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedSample.subtitle}
                </p>
              </div>
              <button
                onClick={() => setSelectedSample(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedSample.description}
              </p>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Garment Blank
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedSample.garment}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Print Placement
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedSample.placement}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Ink / Thread System
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedSample.inkOrThread}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Color Specification
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedSample.colors}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Texture & Hand Feel
                  </span>
                  <span className="font-semibold text-slate-900">
                    {selectedSample.handFeel}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Durability Rating
                  </span>
                  <span className="font-semibold text-emerald-600">
                    {selectedSample.durability}
                  </span>
                </div>
              </div>

              {/* Production Benefits */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-900 block">
                  Factory Proof Highlights
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedSample.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedSample(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
              >
                Close
              </button>
              <Link
                href={`/design?technique=${selectedSample.technique}`}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <Palette className="w-4 h-4" /> Open in Studio
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 6. Factory CTA Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-950 via-brand-900 to-slate-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Ready to Prototype?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Order Single Samples or Launch Bulk Production
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload your artwork into our 4-zone Design Studio, test sample sizing on
              real garments, or request custom screen formulations directly from our
              Tirupur manufacturing floor.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/design"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs text-center shadow-lg transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Palette className="w-4 h-4" /> Launch Design Studio
            </Link>
            <Link
              href="/bulk-orders"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center border border-slate-700 transition flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Bulk Inquiry Form <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
