import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Factory, Sparkles, Award } from "lucide-react";
import { BRAND_NAME, BRAND_TAGLINE, BUSINESS_LOCATION } from "@/lib/constants";

export const metadata = {
  title: `About Us | ${BRAND_NAME} — ${BRAND_TAGLINE}`,
  description: `Learn about ${BRAND_NAME}, South India's premium custom streetwear manufacturing lab in ${BUSINESS_LOCATION}. High-grade 100% bio-washed cotton, low MOQ, and print-on-demand.`,
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center mb-1">
          <Image
            src="/logo.svg"
            alt={BRAND_NAME}
            width={160}
            height={52}
            className="h-10 sm:h-12 w-auto object-contain"
            priority
          />
        </div>
        <span className="text-xs font-mono font-bold text-neutral-600 uppercase tracking-widest inline-flex items-center gap-1.5 bg-neutral-100 px-3 py-1 rounded-md border border-neutral-200">
          <Factory className="w-3.5 h-3.5 text-black" /> {BRAND_NAME} Manufacturing Lab
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight font-mono uppercase">
          Streetwear, Made Different.
        </h1>
        <p className="text-base text-neutral-600 leading-relaxed font-mono text-sm">
          {BRAND_NAME} operates an international-standard streetwear manufacturing lab based in {BUSINESS_LOCATION}, rooted in the renowned South India and Kerala textile production corridors. We engineer heavyweight blanks, 250 GSM French Terry, vintage acid wash, and precision-printed apparel for modern streetwear labels, creators, and brands.
        </p>
      </div>

      {/* Production Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-[#121212] text-white rounded-2xl p-8 border border-[#262626] shadow-sm">
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black font-mono text-white">50K+</div>
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Monthly Garment Capacity</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black font-mono text-white">10 Pcs</div>
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Low Bulk MOQ</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black font-mono text-white">100+</div>
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Lab-Dipped Color Shades</div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black font-mono text-white">1 Pc</div>
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">POD Sample MOQ</div>
        </div>
      </div>

      {/* Fabric Standards & Lab Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
            Uncompromising Material Quality
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono uppercase">
            100% Combed Bio-Washed Cotton Fabric Standards
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Every garment crafted at {BRAND_NAME} starts with 100% super-combed bio-washed cotton and heavyweight 240–250 GSM French Terry, spun from compact long-staple fibers. Our enzyme bio-wash bath removes surface fuzz, yielding an ultra-soft handle, deep dye luster, and zero pilling wash after wash.
          </p>
          <ul className="space-y-3 text-sm text-neutral-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
              <span><strong>Pre-Shrunk Dimensional Stability:</strong> Maximum fabric relaxation ensures under 2% shrinkage over lifetime use.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
              <span><strong>Reactive Eco-Dyeing:</strong> Colorfast OEKO-TEX standard dyes that prevent bleeding and fading in tropical washes.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-neutral-900 shrink-0 mt-0.5" />
              <span><strong>Streetwear Drop Construction:</strong> 2.5 cm lycra-reinforced neck rib, twin-needle drop-shoulder stitching, and clean seam tape bindings.</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 space-y-6">
          <h3 className="text-lg font-bold text-neutral-900 font-mono uppercase flex items-center gap-2">
            <Award className="w-5 h-5 text-neutral-900" /> Why Labels Build with {BRAND_NAME}
          </h3>
          <div className="space-y-4 text-xs text-neutral-600">
            <div className="border-b border-neutral-200 pb-3">
              <h4 className="font-bold text-neutral-900 text-sm mb-1 font-mono uppercase">Factory-Direct Pricing</h4>
              <p>Transparent volume price breaks with no middleman margins, starting at ₹192 per t-shirt.</p>
            </div>
            <div className="border-b border-neutral-200 pb-3">
              <h4 className="font-bold text-neutral-900 text-sm mb-1 font-mono uppercase">Private Labeling & Blind Shipping</h4>
              <p>We print your custom inside neck labels, attach branded merchandise tags, and blind-ship directly to end customers.</p>
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 text-sm mb-1 font-mono uppercase">South India & Kerala Manufacturing Facilities</h4>
              <p>Direct manufacturing lab and fulfillment facilities in {BUSINESS_LOCATION}, South India.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigational CTAs */}
      <div className="bg-[#121212] text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 border border-[#262626]">
        <h2 className="text-2xl sm:text-3xl font-black font-mono uppercase">Ready to Manufacture Your Collection?</h2>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto font-mono">
          Explore ready-stock blank silhouettes, customize prints in our studio, or contact our {BUSINESS_LOCATION} lab.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/bulk-orders"
            className="px-6 py-3 rounded-md bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow"
          >
            Explore Bulk Orders <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/design"
            className="px-6 py-3 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider transition border border-neutral-700 flex items-center gap-2"
          >
            Launch Design Studio <Sparkles className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-md bg-transparent hover:bg-white/10 text-neutral-200 font-mono text-xs uppercase tracking-wider transition border border-neutral-700"
          >
            Contact Factory Lab
          </Link>
        </div>
      </div>
    </div>
  );
}
