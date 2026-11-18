import Link from "next/link";
import Image from "next/image";
import {
  Palette,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Shirt,
  ShieldCheck,
  Truck,
  Percent,
  Clock,
  Factory,
  ChevronDown,
  HelpCircle,
  Mail,
  Phone,
  Tag,
  Scissors,
  Printer,
} from "lucide-react";
import { REVERSE_ENGINEERED_PRODUCTS } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const bestsellers = REVERSE_ENGINEERED_PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-brand-900 via-brand-950 to-slate-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Badges, CTAs */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              {/* Primary Authoritative Hero Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-800/80 border border-brand-700 text-amber-300 text-xs font-semibold tracking-wide max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-bold">South India's Custom Apparel Hub</span>
                <span className="text-amber-400/60">•</span>
                <span className="text-amber-200 whitespace-nowrap">Low 10 pc MOQ</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Craft Custom Apparel. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                  From 10 to 10,000 Pieces.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Direct factory manufacturing for streetwear labels, colleges, creator drops,
                and corporate merchandise. Premium 250 GSM French Terry, vintage acid wash,
                and high-definition DTF printing shipped anywhere in India.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
                <Link
                  href="/design"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent to-amber-500 hover:from-accent-hover hover:to-amber-600 font-bold text-white shadow-xl shadow-orange-950/40 flex items-center justify-center gap-2 text-sm sm:text-base transition transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <Palette className="w-5 h-5 shrink-0" />
                  Launch Design Studio
                </Link>

                <Link
                  href="/price-estimator"
                  className="px-6 py-3.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-semibold border border-brand-700 shadow-md flex items-center justify-center gap-2 text-sm sm:text-base transition whitespace-nowrap"
                >
                  <Calculator className="w-5 h-5 shrink-0" />
                  Instant Price Estimator
                </Link>

                <Link
                  href="/shop"
                  className="px-6 py-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold border border-slate-700 text-sm sm:text-base transition text-center whitespace-nowrap"
                >
                  View Blanks
                </Link>
              </div>

              {/* Trust value points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-brand-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>MOQ 10 Pieces</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Brand Neck Label</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pan-India Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Preview Card */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none mt-8 lg:mt-0">
              <div className="bg-brand-800/50 backdrop-blur-md border border-brand-700/60 rounded-2xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-brand-700/60">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Factory Highlight
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    In Stock (Ready to Print)
                  </span>
                </div>

                <div className="py-6 flex flex-col items-center">
                  <div className="w-52 h-52 relative rounded-xl overflow-hidden shadow-inner bg-brand-900 border border-brand-700">
                    <img
                      src={REVERSE_ENGINEERED_PRODUCTS[0].colours[0].front}
                      alt="Oversized 250 GSM Tee"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="mt-4 font-bold text-lg text-white">
                    250 GSM Oversized French Terry
                  </h3>
                  <p className="text-xs text-brand-300 mt-1">
                    100% Super Combed Cotton · Double Needle Stitch
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-400">
                      ₹{REVERSE_ENGINEERED_PRODUCTS[0].basePrice}
                    </span>
                    <span className="text-xs text-slate-400">
                      / unit (at 100+ pcs)
                    </span>
                  </div>
                </div>

                <Link
                  href="/shop/oversized-tee-250-gsm-french-terry"
                  className="w-full py-2.5 rounded-lg bg-brand-700 hover:bg-brand-600 text-white font-medium text-xs flex items-center justify-center gap-2 transition"
                >
                  Explore Sizes & Colors <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bestsellers Carousel / Grid with Swatch Hover Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Direct From Loom · Bestsellers
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Popular Blanks for Customization
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Blanks built for brands. Hover swatches for instant garment preview, check
              tiered volume prices, or customize directly.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-accent hover:text-accent-hover flex items-center gap-1.5 transition"
          >
            View all 6 silhouettes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Bestsellers Grid with dynamic garment spec binding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              badge={idx === 0 ? "Bestseller" : idx === 1 ? "Trending" : undefined}
            />
          ))}
        </div>
      </section>

      {/* 3. Split Cards: Custom DTF Printing vs Plain Blanks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">
            Two Ways To Work With Us
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            One Piece or One Thousand
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Choose your fulfillment route: print-on-demand dropshipping or commercial wholesale blanks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Custom DTF Printing */}
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="p-8 sm:p-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                For Online Stores & Creators
              </div>
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-800 transition-colors">
                Custom DTF Printing & Dropshipping
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Zero minimum order. You create and sell, we print with ultra-HD stretchable
                DTF films, pack under your private label, and dispatch directly to your
                customer across India.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>No minimum order quantity (Start with 1 sample)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Blind dropshipping with custom packaging & neck tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Interactive 4-zone online design studio</span>
                </li>
              </ul>
            </div>
            <div className="p-8 pt-0">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/design"
                  className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                >
                  <Palette className="w-4 h-4" /> Launch Design Studio
                </Link>
                <Link
                  href="/dropshipping"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition"
                >
                  How Dropshipping Works <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Plain Blanks */}
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="p-8 sm:p-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wide">
                <Shirt className="w-3.5 h-3.5 text-slate-600" />
                For Brands, Events & Teams
              </div>
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-brand-800 transition-colors">
                Plain Blanks & Wholesale Bulk
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Start from just 10 pieces. Mix silhouettes, colours, and sizes with tiered
                factory pricing. Ideal for screen printers, apparel labels, university fests,
                and corporate uniform runs.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Transparent volume discounts from 10 to 1,000+ pieces</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Ready stock in 6 silhouettes and 10+ premium shades</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Free brand neck label branding on A2/A3/A4 prints</span>
                </li>
              </ul>
            </div>
            <div className="p-8 pt-0">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
                >
                  <Shirt className="w-4 h-4" /> Explore All Blanks
                </Link>
                <Link
                  href="/bulk-orders"
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition"
                >
                  Bulk Orders Form <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 5 Printing Methods Showcase */}
      <section className="bg-brand-950 text-white py-20 border-y border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Printing & Embellishment
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-1">
                Five Ways To Bring Your Design To Life
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl">
                We combine state-of-the-art Japanese digital printing, traditional textile screen presses,
                and computerized embroidery to match your artwork and volume.
              </p>
            </div>
            <Link
              href="/services"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition"
            >
              Compare techniques & specs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {/* Method 1: DTF Print */}
            <div className="p-6 rounded-2xl bg-brand-900/60 border border-brand-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-4">
                  DTF
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Direct To Film (DTF)</h3>
                </div>
                <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold mt-1">
                  No minimum
                </span>
                <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                  Full-color photo-realistic transfers with stretchable ink layers. Ideal for 1-50+ pieces
                  with micro fine details, gradients, and unlimited colors.
                </p>
              </div>
              <Link
                href="/services#dtf"
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-3 border-t border-brand-800"
              >
                Learn DTF specs <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Method 2: Screen Printing */}
            <div className="p-6 rounded-2xl bg-brand-900/60 border border-brand-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm mb-4">
                  SP
                </div>
                <h3 className="text-base font-bold text-white">Screen Printing</h3>
                <span className="inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-bold mt-1">
                  MOQ 60 pcs / design
                </span>
                <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                  The gold standard for bulk orders (60+ pcs). Plastisol and water-based inks
                  with vibrant Pantone color matching and 100+ wash durability.
                </p>
              </div>
              <Link
                href="/services#screen"
                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 pt-3 border-t border-brand-800"
              >
                Learn Screen specs <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Method 3: Puff 3D */}
            <div className="p-6 rounded-2xl bg-brand-900/60 border border-brand-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm mb-4">
                  3D
                </div>
                <h3 className="text-base font-bold text-white">HD Puff & 3D Print</h3>
                <span className="inline-block px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-bold mt-1">
                  MOQ 10 pcs / design
                </span>
                <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                  Raised 3D tactile effect popular in contemporary streetwear drops. Creates dramatic
                  depth and foam texture on chest, back, and sleeve graphics.
                </p>
              </div>
              <Link
                href="/services#puff"
                className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 pt-3 border-t border-brand-800"
              >
                Learn Puff specs <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Method 4: Computerized Embroidery */}
            <div className="p-6 rounded-2xl bg-brand-900/60 border border-brand-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
                  EM
                </div>
                <h3 className="text-base font-bold text-white">Computerized Embroidery</h3>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold mt-1">
                  No minimum
                </span>
                <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                  High-speed Japanese embroidery machines for clean chest crests, sleeve emblems,
                  and varsity lettering on heavyweight hoodies and tees.
                </p>
              </div>
              <Link
                href="/services#embroidery"
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-3 border-t border-brand-800"
              >
                Learn Embroidery specs <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Method 5: Relabeling & Custom Packaging */}
            <div className="p-6 rounded-2xl bg-brand-900/60 border border-brand-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm mb-4">
                  TAG
                </div>
                <h3 className="text-base font-bold text-white">Custom Relabeling</h3>
                <span className="inline-block px-2 py-0.5 rounded bg-orange-500/10 text-orange-300 text-[10px] font-bold mt-1">
                  Free with A2/A3/A4
                </span>
                <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                  Remove factory labels and print your own brand neck label, size tags, and woven
                  hem tags. Ship your products in retail-ready brand packaging.
                </p>
              </div>
              <Link
                href="/services#relabeling"
                className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 pt-3 border-t border-brand-800"
              >
                Learn Relabeling specs <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 10s Presets / Quick Quote Estimator Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-amber-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left pitch */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                Transparent Pricing
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Know Your Price in 10 Seconds
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Pick a garment, quantity, and print placements — our interactive price calculator
                estimates the per-piece rate, 5% GST, and grand total instantly.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/price-estimator"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 text-center text-sm shadow transition flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" /> Open Price Estimator
                </Link>
                <Link
                  href="/bulk-orders"
                  className="px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-600 font-medium text-white text-center text-sm transition"
                >
                  Bulk Orders Form
                </Link>
              </div>
            </div>

            {/* Right: 4 Real-time Presets (Calculated from 250 GSM French Terry at 10 pcs) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preset 1: Plain T-Shirt */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex flex-col justify-between hover:bg-white/15 transition">
                <div>
                  <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                    Plain Blank
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">Plain T-Shirt</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    250 GSM French Terry Blank (No print)
                  </p>
                </div>
                <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-white/10">
                  <span className="text-2xl font-black text-amber-400">₹265</span>
                  <span className="text-xs text-slate-300">per pc at 10 pcs</span>
                </div>
              </div>

              {/* Preset 2: A3 Back Print */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex flex-col justify-between hover:bg-white/15 transition">
                <div>
                  <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                    Single Location
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">A3 Back Print</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    250 GSM Blank + Large A3 Back DTF
                  </p>
                </div>
                <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-white/10">
                  <span className="text-2xl font-black text-amber-400">₹365</span>
                  <span className="text-xs text-slate-300">per pc at 10 pcs</span>
                </div>
              </div>

              {/* Preset 3: A3 Back + Chest Logo */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex flex-col justify-between hover:bg-white/15 transition">
                <div>
                  <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                    Dual Location
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">A3 Back + Chest Logo</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    250 GSM + A3 Back + A6 Pocket Logo
                  </p>
                </div>
                <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-white/10">
                  <span className="text-2xl font-black text-amber-400">₹375</span>
                  <span className="text-xs text-slate-300">per pc at 10 pcs</span>
                </div>
              </div>

              {/* Preset 4: A3 Back + A4 Chest */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex flex-col justify-between hover:bg-white/15 transition">
                <div>
                  <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                    Full Coverage
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">A3 Back + A4 Chest</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    250 GSM + A3 Back + Medium A4 Front
                  </p>
                </div>
                <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-white/10">
                  <span className="text-2xl font-black text-amber-400">₹435</span>
                  <span className="text-xs text-slate-300">per pc at 10 pcs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 4 USPs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">
            Why Asson
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            Made Properly. Priced Fairly.
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Engineered at our South India production hub with certified materials and transparent pricing.
          </p>
        </div>

        {/* 4 USPs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* USP 1: Factory Direct Pricing */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Factory Direct Pricing</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              No middleman markups. Shipped straight from our Tirupur textile hub with tiered volume
              discounts scaling from 10 to 10,000+ pieces.
            </p>
          </div>

          {/* USP 2: No Minimum Order */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Minimum Order</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Zero MOQ on custom DTF dropshipping for apparel brands and creator drops. Commercial
              wholesale production starting from a low 10 pc MOQ.
            </p>
          </div>

          {/* USP 3: 48h Turnaround */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">48h Turnaround</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              In-stock plain blanks dispatch within 48 hours. Express pan-India courier shipping via
              Delhivery, Blue Dart, and DTDC with active tracking.
            </p>
          </div>

          {/* USP 4: South India Cotton */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">South India Cotton</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              100% super combed bio-washed cotton (190 to 250 GSM) with double-needle stitching,
              shape-retaining Lycra ribs, and zero color bleeding.
            </p>
          </div>
        </div>

        {/* Made For audience bar */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-4">
            Custom Manufacturing Tailored For
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-700">
            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              👕 Streetwear Clothing Brands
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              🚀 Startups & Small Businesses
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              🎉 Events & Creator Drops
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              🎓 Colleges & Organisations
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              🏢 Retail Chains & Distributors
            </span>
          </div>
        </div>
      </section>

      {/* 7. FAQ Accordion with Responsive Collapse/Expand */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Heading & Contact CTA */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Good To Know
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Questions, Answered
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Can't find what you need? Our production team in Tirupur is ready to help you
              with fabric specs, artwork sizing, and commercial quotations.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-sm transition"
              >
                Contact us <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: FAQ Accordion Details List */}
          <div className="lg:col-span-8 space-y-4">
            <details className="group border border-slate-200 rounded-2xl bg-white p-5 open:bg-slate-50/50 transition">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-sm cursor-pointer list-none">
                <span>Is there a minimum order quantity?</span>
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-180 transition-transform">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                No minimum for dropshipping / print on demand — you can order a single piece.
                Bulk orders start from just 10 pieces. Screen printing requires 60 pieces per design,
                and HD puff printing requires 10 pieces per design.
              </p>
            </details>

            <details className="group border border-slate-200 rounded-2xl bg-white p-5 open:bg-slate-50/50 transition">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-sm cursor-pointer list-none">
                <span>Can I add my own brand label?</span>
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-180 transition-transform">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                Yes! Neck-label branding (your brand name printed inside the neck) is free with any
                A2, A3, or A4 print. Custom packaging, woven labels, and polybag stickers can also
                be added for retail-ready presentation.
              </p>
            </details>

            <details className="group border border-slate-200 rounded-2xl bg-white p-5 open:bg-slate-50/50 transition">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-sm cursor-pointer list-none">
                <span>Do you deliver outside South India?</span>
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-180 transition-transform">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                Yes — we deliver across all pin codes in India through trusted air and surface courier
                partners including Delhivery, Blue Dart, DTDC, and India Post. Full tracking details
                are shared immediately upon dispatch.
              </p>
            </details>

            <details className="group border border-slate-200 rounded-2xl bg-white p-5 open:bg-slate-50/50 transition">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-sm cursor-pointer list-none">
                <span>Are prices inclusive of GST?</span>
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-180 transition-transform">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                No. All catalog and customizer prices are quoted per piece, and 5% GST is computed
                transparently in your quote breakdown and checkout summary. Tax invoices with your
                GSTIN are generated automatically.
              </p>
            </details>

            <details className="group border border-slate-200 rounded-2xl bg-white p-5 open:bg-slate-50/50 transition">
              <summary className="flex items-center justify-between font-bold text-slate-900 text-sm cursor-pointer list-none">
                <span>Can you make colours or garments that are not listed?</span>
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-open:rotate-180 transition-transform">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </summary>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                Yes. Over 100+ custom pantone shades are available in production batches (MOQ 60 pcs),
                and our knitting unit can manufacture custom silhouettes, weights (e.g. 300+ GSM hoodies,
                acid wash treatments, and polo knits) to your exact tech pack.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 8. In-App / Email Conversion CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo-white.svg"
                  alt="Asson"
                  width={110}
                  height={36}
                  className="h-8 w-auto object-contain"
                />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Get In Touch
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Got an Idea? Let’s Make It Wearable.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Tell us what you need — style, colours, quantity, and print placements — and request
                an instant in-app quote or send an email to our Tirupur team.
              </p>
              {/* Direct In-App & Email Conversion Info */}
              <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-300">
                <a
                  href="tel:+918089963691"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>+91 80899 63691</span>
                </a>
                <a
                  href="mailto:orders@assonclothing.com"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>orders@assonclothing.com</span>
                </a>
              </div>
            </div>

            {/* Direct In-App & Email Conversion Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                href="/quote"
                className="px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-sm text-center shadow-lg transition flex items-center justify-center gap-2"
              >
                Request In-App Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/price-estimator"
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm text-center border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" /> Instant Price Estimator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
