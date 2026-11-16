"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  REVERSE_ENGINEERED_PRODUCTS,
  SIZES,
  formatINR,
  GST_PERCENTAGE,
} from "@/lib/constants";
import {
  Palette,
  Check,
  Shield,
  Layers,
  ArrowLeft,
  FileText,
  FileCheck,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = REVERSE_ENGINEERED_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [viewSide, setViewSide] = useState<"front" | "back">("front");
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({
    XS: 0,
    S: 5,
    M: 10,
    L: 10,
    XL: 5,
    XXL: 0,
  });

  // Direct Quote Modal state
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentColor = product.colours[selectedColorIdx] || product.colours[0];
  const activeImage =
    viewSide === "front" ? currentColor.front : currentColor.back;

  // Total quantity
  const totalQuantity = Object.values(sizeQuantities).reduce((a, b) => a + b, 0);

  // Compute unit price from tier
  const matchedTier = [...product.prices]
    .sort((a, b) => b.min - a.min)
    .find((tier) => totalQuantity >= tier.min) || product.prices[0];

  const unitPrice = matchedTier ? matchedTier.price : product.basePrice;
  const subtotal = unitPrice * totalQuantity;
  const gstAmount = Math.round((subtotal * GST_PERCENTAGE) / 100);
  const total = subtotal + gstAmount;

  const handleSizeChange = (size: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setSizeQuantities((prev) => ({ ...prev, [size]: num }));
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone: customerPhone,
          email: `${customerPhone}@customer.com`,
          items: [
            {
              productId: product.id,
              productName: product.name,
              color: currentColor.name,
              quantity: totalQuantity,
              sizes: sizeQuantities,
              unitPrice,
              totalPrice: total,
            },
          ],
          subtotal,
          gst: gstAmount,
          total,
          notes: `Batch Order for ${product.name} in ${currentColor.name}`,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Quote error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Col: Visual Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 aspect-square relative shadow-inner">
            <img
              src={activeImage}
              alt={`${product.name} in ${currentColor.name}`}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* Front / Back Switcher pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20">
              <button
                onClick={() => setViewSide("front")}
                className={`px-4 py-1 rounded-full text-xs font-medium transition ${
                  viewSide === "front"
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Front View
              </button>
              <button
                onClick={() => setViewSide("back")}
                className={`px-4 py-1 rounded-full text-xs font-medium transition ${
                  viewSide === "back"
                    ? "bg-white text-slate-900 shadow"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Back View
              </button>
            </div>
          </div>

          {/* Color Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-3 uppercase tracking-wider">
              Available Colours ({product.colours.length}) — Selected:{" "}
              <span className="text-slate-900 font-extrabold">
                {currentColor.name}
              </span>
            </span>
            <div className="flex flex-wrap gap-2.5">
              {product.colours.map((col, idx) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                    selectedColorIdx === idx
                      ? "border-brand-900 bg-brand-50/50 ring-1 ring-brand-900"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Product Info & Pricing Matrix */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-brand-900 text-white text-[11px] font-bold">
                {product.gsm}
              </span>
              <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                {product.fit}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {product.name}
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              {product.spec}
            </p>
          </div>

          {/* Volume Tier Pricing Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Volume Discount Tiers
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">
                Factory Wholesale Rates
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
              {product.prices.map((tier) => {
                const isCurrent =
                  matchedTier && matchedTier.label === tier.label;
                return (
                  <div
                    key={tier.label}
                    className={`p-2.5 rounded-xl border transition ${
                      isCurrent
                        ? "bg-amber-50 border-amber-400 ring-2 ring-amber-400/30"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      {tier.label}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 block mt-1">
                      ₹{tier.price}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Size Breakdown Quantity Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Sizes & Quantities
              </span>
              <span className="text-xs text-slate-500">
                Total Pieces:{" "}
                <strong className="text-slate-900 text-sm">
                  {totalQuantity}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SIZES.map((size) => (
                <div key={size} className="text-center">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    {size}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sizeQuantities[size]}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                    className="w-full text-center py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary Box */}
          <div className="bg-brand-900 text-white rounded-2xl p-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-200">
                Unit Price ({totalQuantity} pcs tier):
              </span>
              <span className="font-bold">₹{unitPrice} / pc</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-200">Subtotal:</span>
              <span className="font-bold">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-brand-300">
              <span>GST (5%):</span>
              <span>₹{gstAmount.toLocaleString()}</span>
            </div>
            <div className="pt-3 border-t border-brand-800 flex justify-between items-center">
              <span className="font-extrabold text-lg text-white">
                Total Estimate:
              </span>
              <span className="font-black text-2xl text-amber-400">
                ₹{total.toLocaleString()}
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/design?product=${product.id}&color=${encodeURIComponent(
                  currentColor.name
                )}`}
                className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Palette className="w-4 h-4" />
                Customize in Studio
              </Link>

              <button
                type="button"
                onClick={() => setShowQuoteForm(true)}
                className="py-3 px-4 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-brand-700 transition"
              >
                <FileText className="w-4 h-4" />
                Request Quote
              </button>
            </div>

            {/* In-app Quote submission drawer */}
            {showQuoteForm && (
              <div className="mt-4 pt-4 border-t border-brand-800">
                {submitted ? (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
                    <FileCheck className="w-4 h-4" /> Order quote saved! Our team will contact you.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitQuote} className="space-y-2">
                    <span className="text-xs font-bold text-brand-200 block">
                      Enter Details for Formal Quote:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="p-2 rounded-lg bg-brand-950 border border-brand-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="p-2 rounded-lg bg-brand-950 border border-brand-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                    >
                      {isSubmitting ? "Submitting..." : "Confirm & Send Quote Request"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
