import Link from "next/link";
import { Sparkles, Palette, CheckCircle2, ArrowRight } from "lucide-react";
import { DTF_PRINTS } from "@/lib/constants";

export default function PrintingGuidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-accent uppercase tracking-widest">
          Textile Decoration Lab
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
          Printing Techniques & Sizing
        </h1>
        <p className="text-sm text-slate-600">
          From micro-details to vintage textures, we match the best printing method
          for your design, fabric, and volume.
        </p>
      </div>

      {/* DTF Dimension Pricing Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Direct To Film (DTF) Standard Sizes
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Industrial multi-head digital printer transfers with OEKO-TEX
              certified pigment inks.
            </p>
          </div>
          <Link
            href="/price-estimator"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
          >
            Calculate in Estimator <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(DTF_PRINTS).map(([key, item]) => (
            <div
              key={key}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
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
                  <span className="text-slate-400 block text-[10px]">
                    10+ pcs (Bulk):
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {item.bulk === 0 ? "FREE" : `+₹${item.bulk}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    1-9 pcs (Sample):
                  </span>
                  <span className="font-semibold text-slate-700 text-sm">
                    {item.single === 0 ? "FREE" : `+₹${item.single}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center">
            01
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            DTF (Direct to Film)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Best for full-color art, gradient designs, photo-prints, and small to
            medium batches. Super soft touch, high stretch resistance without
            cracking.
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
            <li>✓ Unlimited color palette</li>
            <li>✓ MOQ: 1 piece</li>
            <li>✓ Sharp fine line reproduction</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
            02
          </div>
          <h3 className="text-lg font-bold text-slate-900">Screen Printing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The traditional standard for high volume orders (50+ pcs). Cost
            effective for 1-4 spot colors, offering maximum wash longevity and
            Pantone matching.
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
            <li>✓ Lowest per-unit cost in bulk</li>
            <li>✓ Plastisol & water-based discharge</li>
            <li>✓ 100+ wash durability</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
            03
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Computerized Embroidery
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Classic 3D textured stitching on left-chest, sleeve caps, and back
            yokes. Gives an elevated premium look to corporate and varsity
            apparel.
          </p>
          <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
            <li>✓ Premium tactile thread texture</li>
            <li>✓ Perfect for heavyweight French Terry</li>
            <li>✓ High prestige brand perception</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
