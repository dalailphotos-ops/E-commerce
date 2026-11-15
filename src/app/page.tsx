import Link from "next/link";
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
} from "lucide-react";
import { REVERSE_ENGINEERED_PRODUCTS } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-brand-900 via-brand-950 to-slate-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-800/80 border border-brand-700 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                South India's Custom Apparel Hub · Low 10 pc MOQ
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Craft Custom Apparel. <br />
                <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                  From 10 to 10,000 Pieces.
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Direct factory manufacturing for streetwear labels, colleges,
                creator drops, and corporate merchandise. Premium 250 GSM
                French Terry, vintage acid wash, and high-definition DTF
                printing.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/design"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent to-amber-500 hover:from-accent-hover hover:to-amber-600 font-bold text-white shadow-xl shadow-orange-950/40 flex items-center gap-2 text-base transition transform hover:-translate-y-0.5"
                >
                  <Palette className="w-5 h-5" />
                  Launch Design Studio
                </Link>

                <Link
                  href="/price-estimator"
                  className="px-6 py-3.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-semibold border border-brand-700 shadow-md flex items-center gap-2 text-base transition"
                >
                  <Calculator className="w-5 h-5" />
                  Instant Price Estimator
                </Link>

                <Link
                  href="/shop"
                  className="px-6 py-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold border border-slate-700 text-base transition"
                >
                  View Blanks
                </Link>
              </div>

              {/* Value points */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-800/80 text-xs text-slate-300">
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
            <div className="lg:col-span-5">
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
                      ₹250
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

      {/* Featured Products / Blanks Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Direct From Loom
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Popular Blanks for Customization
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Select any base garment, check tiered volume prices, or customize
              directly.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-accent hover:text-accent-hover flex items-center gap-1.5 transition"
          >
            View all 6 silhouettes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVERSE_ENGINEERED_PRODUCTS.slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col group"
            >
              <div className="h-72 bg-slate-100 overflow-hidden relative">
                <img
                  src={product.colours[0].front}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-brand-900/90 text-white text-[11px] font-bold tracking-wide">
                  {product.gsm}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/90 text-slate-800 text-[11px] font-medium shadow">
                  {product.colours.length} colors
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-accent uppercase">
                    {product.fit}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5 group-hover:text-brand-800 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {product.spec}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">From</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      ₹{product.basePrice}
                    </span>
                    <span className="text-[11px] text-slate-400"> / pc</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/design?product=${product.id}`}
                      className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition"
                    >
                      Design
                    </Link>
                    <Link
                      href={`/shop/${product.slug}`}
                      className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Printing & Craft Technologies */}
      <section className="bg-brand-950 text-white py-20 border-y border-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              State of the Art Printing Lab
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">
              High-Definition Apparel Printing
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              We employ automated digital and traditional textile print systems
              tailored to your art style and order volume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-brand-900/60 border border-brand-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                DTF
              </div>
              <h3 className="text-base font-bold text-white">
                Direct To Film (DTF)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-color photo-realistic transfers with stretchable ink layers.
                Ideal for 1-50+ pieces with fine details, gradients, and multiple
                colors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-900/60 border border-brand-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                SP
              </div>
              <h3 className="text-base font-bold text-white">
                Screen Printing
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The gold standard for bulk orders (50+ pcs). Plastisol and water-based
                inks with vibrant Pantone color matching and 100+ wash durability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-900/60 border border-brand-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                3D
              </div>
              <h3 className="text-base font-bold text-white">
                HD Puff & High Density
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Raised 3D tactile effect popular in contemporary streetwear drops.
                Creates dramatic depth on chest and back graphics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-brand-900/60 border border-brand-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                EM
              </div>
              <h3 className="text-base font-bold text-white">
                Computerized Embroidery
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Premium multi-thread Japanese embroidery machines for clean chest
                crests, sleeves, and varsity lettering on heavyweight hoodies and
                tees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Calculator CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-amber-950 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Instant Estimates
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Need Exact Per-Piece Pricing For Your Order?
            </h3>
            <p className="text-sm text-slate-300">
              Try our interactive price calculator. Adjust quantity, print
              dimensions (A4, A3, A2), fabric weights, and get a transparent
              quote in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/price-estimator"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-slate-950 text-center text-sm shadow transition"
            >
              Open Price Estimator
            </Link>
            <Link
              href="/bulk-orders"
              className="px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-600 font-medium text-white text-center text-sm transition"
            >
              Bulk Orders Form
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
