import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function SizeGuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Link>
        <span className="text-xs font-bold text-accent uppercase tracking-widest block">
          Measurement Specs
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
          Apparel Size Chart & Fit Guide
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          All dimensions are in inches with a standard tolerance of ±0.5 inches.
          Pre-shrunk fabric.
        </p>
      </div>

      {/* Oversized Fit Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <div>
          <span className="px-2.5 py-1 rounded bg-brand-900 text-white text-[11px] font-bold">
            250 GSM & 230 GSM
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            Streetwear Oversized Fit (Dropped Shoulder)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Designed with wider chest, relaxed sleeves, and boxy silhouette.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Chest (Round)</th>
                <th className="py-3 px-4">Length</th>
                <th className="py-3 px-4">Shoulder Drop</th>
                <th className="py-3 px-4">Sleeve Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold">S</td>
                <td className="py-3 px-4">42"</td>
                <td className="py-3 px-4">28"</td>
                <td className="py-3 px-4">21"</td>
                <td className="py-3 px-4">9.0"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">M</td>
                <td className="py-3 px-4">44"</td>
                <td className="py-3 px-4">29"</td>
                <td className="py-3 px-4">22"</td>
                <td className="py-3 px-4">9.5"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">L</td>
                <td className="py-3 px-4">46"</td>
                <td className="py-3 px-4">30"</td>
                <td className="py-3 px-4">23"</td>
                <td className="py-3 px-4">10.0"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">XL</td>
                <td className="py-3 px-4">48"</td>
                <td className="py-3 px-4">31"</td>
                <td className="py-3 px-4">24"</td>
                <td className="py-3 px-4">10.5"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">XXL</td>
                <td className="py-3 px-4">50"</td>
                <td className="py-3 px-4">32"</td>
                <td className="py-3 px-4">25"</td>
                <td className="py-3 px-4">11.0"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Regular Fit Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <div>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-white text-[11px] font-bold">
            190 GSM
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            Classic Regular Fit (Tailored Everyday)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard regular fit for casual wear, college events, and promotional
            tees.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Chest (Round)</th>
                <th className="py-3 px-4">Length</th>
                <th className="py-3 px-4">Shoulder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold">S</td>
                <td className="py-3 px-4">38"</td>
                <td className="py-3 px-4">26"</td>
                <td className="py-3 px-4">16.5"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">M</td>
                <td className="py-3 px-4">40"</td>
                <td className="py-3 px-4">27"</td>
                <td className="py-3 px-4">17.5"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">L</td>
                <td className="py-3 px-4">42"</td>
                <td className="py-3 px-4">28"</td>
                <td className="py-3 px-4">18.5"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">XL</td>
                <td className="py-3 px-4">44"</td>
                <td className="py-3 px-4">29"</td>
                <td className="py-3 px-4">19.5"</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">XXL</td>
                <td className="py-3 px-4">46"</td>
                <td className="py-3 px-4">30"</td>
                <td className="py-3 px-4">20.5"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
