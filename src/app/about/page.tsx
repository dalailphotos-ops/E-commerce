import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Factory, Sparkles, Award } from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";

export const metadata = {
  title: "About Us | Asson Clothing Brand — The Clothing Lab",
  description: "Learn about Asson Clothing Brand, South India's premium custom apparel manufacturing factory lab in Malappuram, Kerala. High-grade 100% bio-washed cotton, low MOQ, and print-on-demand.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center mb-1">
          <Image
            src="/logo.svg"
            alt={BRAND_NAME}
            width={160}
            height={52}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
        <span className="text-xs font-bold text-accent uppercase tracking-widest inline-flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          <Factory className="w-3.5 h-3.5 text-accent" /> Asson Factory & Textile Lab
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Ideas into Apparel. The South India Manufacturing Lab.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Asson Clothing Brand operates a dedicated apparel manufacturing factory lab in Malappuram, Kerala, rooted in the renowned South India and Tirupur textile production corridors. We engineer high-grade blanks and precision-printed apparel for ambitious streetwear labels, D2C startups, and corporate organizations across India.
        </p>
      </div>

      {/* Production Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-brand-900 text-white rounded-3xl p-8 shadow-sm">
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-amber-400">50K+</div>
          <div className="text-xs text-brand-200">Monthly Garment Capacity</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-amber-400">10 Pcs</div>
          <div className="text-xs text-brand-200">Accessible Low Bulk MOQ</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-amber-400">100+</div>
          <div className="text-xs text-brand-200">Lab-Dipped Color Shades</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-amber-400">1 Pc</div>
          <div className="text-xs text-brand-200">Print-On-Demand Sample MOQ</div>
        </div>
      </div>

      {/* Fabric Standards & Lab Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <span className="text-xs font-bold text-accent uppercase tracking-wider">Uncompromising Material Quality</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            100% Combed Bio-Washed Cotton Fabric Standards
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every t-shirt crafted at Asson starts with 100% super-combed bio-washed cotton, spun from compact long-staple fibers. Our enzyme bio-wash bath removes surface fuzz and micro-fibers, yielding an ultra-soft handle, deep dye luster, and zero pilling wash after wash.
          </p>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Pre-Shrunk Dimensional Stability:</strong> Maximum fabric relaxation ensures under 2% shrinkage over lifetime use.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Reactive Eco-Dyeing:</strong> Colorfast OEKO-TEX standard dyes that prevent bleeding and color fading in tropical washes.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Precision Construction:</strong> 2.5 cm lycra-reinforced neck rib, twin-needle hem stitching, and neck-tape seam bindings.</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" /> Why Brands Build with Asson
          </h3>
          <div className="space-y-4 text-xs text-slate-600">
            <div className="border-b border-slate-200 pb-3">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Factory-Direct Pricing</h4>
              <p>Transparent volume price breaks with no middleman margins, starting at ₹192 per t-shirt.</p>
            </div>
            <div className="border-b border-slate-200 pb-3">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Private Labeling & Blind Shipping</h4>
              <p>We print your custom inside neck labels, attach branded merchandise tags, and blind-ship directly to end customers.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">South India Manufacturing Heritage</h4>
              <p>State-of-the-art facility at Watani Complex, Manjeri Rd, Kizhisseri, Malappuram, Kerala 673641.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigational CTAs */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black">Ready to Manufacture Your Collection?</h2>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Explore our ready-stock blank silhouettes, customize prints in our studio, or visit our Malappuram factory lab.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition flex items-center gap-2 shadow-md"
          >
            Explore Product Catalog <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/design"
            className="px-6 py-3 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-semibold text-sm transition border border-brand-700 flex items-center gap-2"
          >
            Launch Design Studio <Sparkles className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-transparent hover:bg-white/10 text-slate-200 font-semibold text-sm transition border border-white/20"
          >
            Contact Factory Lab
          </Link>
        </div>
      </div>
    </div>
  );
}
