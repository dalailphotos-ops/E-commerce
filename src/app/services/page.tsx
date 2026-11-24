import Link from "next/link";
import { ArrowRight, Layers, Tag, CheckCircle2, Calculator } from "lucide-react";
import { DTF_PRINTS } from "@/lib/constants";

export const metadata = {
  title: "Apparel Decoration Services | Asson Clothing Brand",
  description: "Explore our textile manufacturing services: DTF printing, high-volume screen printing, 3D puff print, computerized embroidery, and custom neck relabeling.",
};

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-accent uppercase tracking-widest">Technical Apparel Capabilities</span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Apparel Decoration Services</h1>
        <p className="text-sm text-slate-600">
          Our Malappuram manufacturing lab unites precision digital printing, traditional craft, and industrial high-volume finishing.
        </p>
      </div>

      {/* 5 Core Techniques Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 1. DTF */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              01
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">DTF (Direct-to-Film) Printing</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Industrial multi-head digital roll printer technology transferring microscopic pigment inks directly onto PET film. Offers photorealistic color gradients, fine text lines, and vivid saturation without expensive screen setup fees.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited color palette & gradients</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Minimum Order Quantity: 1 piece (POD ready)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> OEKO-TEX certified skin-friendly inks</li>
            </ul>
          </div>
          <Link href="/price-estimator" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 pt-4">
            Calculate in Estimator <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2. Screen Printing */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
              02
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">High-Volume Screen Printing</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The benchmark standard for high-volume wholesale runs (50+ to 50,000+ pieces). Delivers maximum wash longevity, opacity on dark fabrics, and exact Pantone (PMS) spot-color ink formulations using plastisol or discharge inks.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lowest per-unit production cost in bulk</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100+ wash durability with zero crack</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Discharge & plastisol formulations</li>
            </ul>
          </div>
          <Link href="/contact" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-4">
            Request Bulk Quotation <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3. 3D Puff Printing */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xl">
              03
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">3D Puff Print Techniques</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Specialized high-density foaming additives that expand under controlled tunnel dryer heat. Creates a raised, three-dimensional tactile typography and rounded graphic relief that gives streetwear collections high-end boutique impact.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3D dimensional raised tactile texture</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Ideal for bold typography & streetwear logos</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Super soft marshmallow or matte finish</li>
            </ul>
          </div>
          <Link href="/contact" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 pt-4">
            Inquire About 3D Puff <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4. Computerized Embroidery */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              04
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Computerized Embroidery</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-head computerized embroidery machines stitching dense Madeira polyester threads for left-chest badges, sleeve logos, and back neck yokes. Imparts a luxurious, textured finish on heavyweight French Terry and fleece hoodies.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> High prestige varsity and corporate finish</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-color thread stitching up to 10×10 in</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unmatched physical wash durability</li>
            </ul>
          </div>
          <Link href="/design" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 pt-4">
            Explore in Studio <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 5. Custom Relabeling */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-5 flex flex-col justify-between shadow-sm md:col-span-2 lg:col-span-2">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
              05
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Custom Relabeling, Woven Tags & Packaging</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete private label white-glove finishing. We de-brand factory labels and apply your custom satin woven neck tags, tagless heat-seal interior neck prints, barcode hangtags, and individual folding into branded polybags.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free heat-seal neck label on A2/A3/A4 prints</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Custom woven satin damask neck labels</li>
              </ul>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Die-cut swing tags & size stickers</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Retail-ready barcode & polybag finishing</li>
              </ul>
            </div>
          </div>
          <Link href="/contact" className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 pt-4">
            Inquire About Private Label Packaging <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* DTF Dimension & Price Reference Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">DTF Print Size & Dimension Standards</h3>
            <p className="text-xs text-slate-500 mt-1">Industrial pigment ink transfers calibrated to standard sheet dimensions.</p>
          </div>
          <Link
            href="/price-estimator"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shrink-0"
          >
            Open Price Estimator <Calculator className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(DTF_PRINTS).map(([key, item]) => (
            <div key={key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-accent uppercase">{key}</span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{item.label}</h4>
                <span className="text-xs font-mono text-slate-500 block mt-0.5">{item.size}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Sample (1-9 pcs)</span>
                  <span className="font-bold text-slate-800">{item.single === 0 ? "FREE" : `₹${item.single}`}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Bulk (10+ pcs)</span>
                  <span className="font-extrabold text-emerald-600">{item.bulk === 0 ? "FREE" : `₹${item.bulk}`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
