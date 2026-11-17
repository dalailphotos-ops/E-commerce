"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Package, Truck, Tag, Sparkles, CheckCircle2, Send, AlertCircle } from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";

export default function DropshippingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    apparelType: "Dropshipping / POD Partner Application",
    quantity: 1,
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit partner application");

      setStatus({
        type: "success",
        message: "Your dropshipping application has been received! Our onboarding team will send your portal credentials to your email.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        apparelType: "Dropshipping / POD Partner Application",
        quantity: 1,
        details: "",
      });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Failed to submit. Please contact orders@assonclothing.com directly." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-accent uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Your Design, Our Production
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Dropshipping & Print-on-Demand (POD)
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Sell custom streetwear t-shirts without holding inventory or investing in equipment. You generate customer orders — our Kerala manufacturing lab prints, packs, and blind-ships directly to your customer under your brand name across India.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/design"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition flex items-center gap-2 shadow-md"
          >
            Design POD Sample in Studio <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#apply"
            className="px-6 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm transition"
          >
            Apply for Dropship Account
          </a>
        </div>
      </div>

      {/* Core Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Zero Minimum Order</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Order even a single piece on demand. Perfect for testing new streetwear drops and running made-to-order collections.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Customised Printing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Full-color DTF prints up to A2 size, crisp sleeve logos, and high-density 3D embroidery on any of our 6 premium blank styles.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Free Branding & Blind Shipping</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We heat-seal your brand&apos;s neck label for free. Parcels ship in plain packaging with your brand name on the shipping label.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Pan-India Courier Network</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Express shipping across all 28,000+ Indian pincodes with real-time end-to-end tracking shared automatically with you.
          </p>
        </div>
      </div>

      {/* 5-Step Fulfillment Workflow */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-accent uppercase tracking-widest">Fulfillment Pipeline</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Five Simple Steps to Ship</h2>
          <p className="text-xs text-slate-600">From order placement to customer doorstep within 48 to 72 hours.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-full bg-brand-900 text-white font-bold text-xs flex items-center justify-center">1</span>
            <h4 className="font-bold text-sm text-slate-900">Choose Blanks</h4>
            <p className="text-xs text-slate-500">Pick from 250 GSM French Terry, 190 GSM combed cotton, or acid wash silhouettes.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-full bg-brand-900 text-white font-bold text-xs flex items-center justify-center">2</span>
            <h4 className="font-bold text-sm text-slate-900">Place Order</h4>
            <p className="text-xs text-slate-500">Upload customer order details, design files, and mockups through our portal or email orders@assonclothing.com.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-full bg-brand-900 text-white font-bold text-xs flex items-center justify-center">3</span>
            <h4 className="font-bold text-sm text-slate-900">Make Payment</h4>
            <p className="text-xs text-slate-500">Settle invoice via UPI or bank transfer. 5% GST is applied with full tax compliance.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-full bg-brand-900 text-white font-bold text-xs flex items-center justify-center">4</span>
            <h4 className="font-bold text-sm text-slate-900">Print & Pack</h4>
            <p className="text-xs text-slate-500">Our lab prints high-definition DTF, presses custom neck label, and packs in plain white-label polybags.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <span className="w-7 h-7 rounded-full bg-brand-900 text-white font-bold text-xs flex items-center justify-center">5</span>
            <h4 className="font-bold text-sm text-slate-900">Ship & Track</h4>
            <p className="text-xs text-slate-500">Dispatched via integrated courier partners with live tracking link synced to your order dashboard.</p>
          </div>
        </div>
      </div>

      {/* Courier Partners */}
      <div className="text-center space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Integrated Pan-India Courier Partners</h3>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-extrabold text-slate-700">
          <span className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">Delhivery</span>
          <span className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">Blue Dart</span>
          <span className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">DTDC Express</span>
          <span className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">Ecom Express</span>
          <span className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">India Post</span>
          <span className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">Speed & Safe</span>
        </div>
      </div>

      {/* Onboarding Form */}
      <div id="apply" className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Start Dropshipping with Asson</h2>
          <p className="text-xs text-slate-500">
            Submit your brand details below to apply for our print-on-demand fulfillment partner account.
          </p>
        </div>

        {status && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
              status.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 80899 63691"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="rahul@mybrand.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Brand Name / Store Website</label>
              <input
                type="text"
                placeholder="e.g. Outlaw Apparel / Instagram handle"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monthly Expected Volume & Notes</label>
            <textarea
              rows={3}
              placeholder="Tell us about your brand aesthetic, target customer, and expected monthly volume..."
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? "Submitting Application..." : "Apply for Onboarding"} <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
