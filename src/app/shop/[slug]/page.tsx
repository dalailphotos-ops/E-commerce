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
import { useCart } from "@/context/CartContext";
import {
  Palette,
  Check,
  Shield,
  Layers,
  ArrowLeft,
  FileText,
  FileCheck,
  Shirt,
  Sparkles,
  ShoppingBag,
  Mail,
  Phone,
  CheckCircle2,
  X,
  Plus,
  Minus,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = REVERSE_ENGINEERED_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const { addItem, itemCount } = useCart();

  // Gallery view state: 3-Tab Gallery (Product, Fabric, Printed)
  const [galleryTab, setGalleryTab] = useState<"product" | "fabric" | "printed">("product");
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [viewSide, setViewSide] = useState<"front" | "back">("front");

  // Size breakdown quantities (XS, S, M, L, XL, XXL)
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

  // Toast Notification state
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "warning";
  } | null>(null);

  const currentColor = product.colours[selectedColorIdx] || product.colours[0];
  const activeImage =
    viewSide === "front" ? currentColor.front : currentColor.back;

  // Total quantity calculation
  const totalQuantity = Object.values(sizeQuantities).reduce((a, b) => a + b, 0);

  // Volume Tier Pricing Math
  const sortedTiers = [...product.prices].sort((a, b) => a.min - b.min);
  const matchedTier =
    [...product.prices]
      .sort((a, b) => b.min - a.min)
      .find((tier) => totalQuantity >= tier.min) || product.prices[0];

  const unitPrice = matchedTier ? matchedTier.price : product.basePrice;
  const subtotal = unitPrice * totalQuantity;
  const gstAmount = Math.round((subtotal * GST_PERCENTAGE) / 100);
  const total = subtotal + gstAmount;

  // Dynamic Volume Tier Incentive Hint
  const nextTier = sortedTiers.find((tier) => tier.min > totalQuantity);
  const unitsNeeded = nextTier ? nextTier.min - totalQuantity : 0;
  const priceSavings = nextTier ? unitPrice - nextTier.price : 0;

  const handleSizeChange = (size: string, val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setSizeQuantities((prev) => ({ ...prev, [size]: num }));
  };

  const handleStepQuantity = (size: string, delta: number) => {
    setSizeQuantities((prev) => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) + delta),
    }));
  };

  const handleQuickAddAll = (qty: number) => {
    setSizeQuantities((prev) => {
      const next: Record<string, number> = {};
      for (const size of SIZES) {
        next[size] = (prev[size] || 0) + qty;
      }
      return next;
    });
  };

  const handleClearSizes = () => {
    const next: Record<string, number> = {};
    for (const size of SIZES) next[size] = 0;
    setSizeQuantities(next);
  };

  // Add to Quote List via CartContext
  const handleAddToQuote = () => {
    if (totalQuantity <= 0) {
      setToast({
        show: true,
        title: "Quantity Required",
        message: "Please enter at least 1 piece across sizes to add to your Quote List.",
        type: "warning",
      });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      productSpec: product.spec,
      color: currentColor.name,
      colorHex: currentColor.hex,
      sizes: { ...sizeQuantities },
      quantity: totalQuantity,
      unitPrice,
      mockupFrontUrl: currentColor.front,
      mockupBackUrl: currentColor.back,
      prints: [],
    });

    setToast({
      show: true,
      title: "Added to Quote List!",
      message: `${totalQuantity} pcs of ${product.name} (${currentColor.name}) added at ₹${unitPrice} / pc.`,
      type: "success",
    });

    setTimeout(() => setToast(null), 4500);
  };

  // Direct RFQ Email Mailto Link
  const mailtoSubject = encodeURIComponent(
    `Asson Clothing RFQ — ${totalQuantity} pcs ${product.name} (${currentColor.name})`
  );
  const mailtoBody = encodeURIComponent(
    `Asson Clothing Brand — Wholesale RFQ\n\n` +
      `Product: ${product.name}\n` +
      `Specification: ${product.spec}\n` +
      `Colorway: ${currentColor.name}\n` +
      `Total Units: ${totalQuantity} pcs\n\n` +
      `Size Breakdown:\n` +
      Object.entries(sizeQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([size, qty]) => `  · ${size === "XXL" ? "2XL / XXL" : size}: ${qty} pcs`)
        .join("\n") +
      `\n\nPricing Estimate:\n` +
      `  · Unit Price (${totalQuantity} pcs tier): ₹${unitPrice} / pc\n` +
      `  · Subtotal: ₹${subtotal.toLocaleString()}\n` +
      `  · Estimated GST (${GST_PERCENTAGE}%): ₹${gstAmount.toLocaleString()}\n` +
      `  · Grand Total: ₹${total.toLocaleString()}\n\n` +
      `Contact & Next Steps:\n` +
      `Please provide formal proforma invoice, production timeline, and shipping terms.\n`
  );
  const mailtoUrl = `mailto:orders@assonclothing.com?subject=${mailtoSubject}&body=${mailtoBody}`;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: 3-Tab Visual Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* 3-Tab Gallery Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setGalleryTab("product")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                galleryTab === "product"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              Product View
            </button>
            <button
              type="button"
              onClick={() => setGalleryTab("fabric")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                galleryTab === "fabric"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Fabric Detail
            </button>
            <button
              type="button"
              onClick={() => setGalleryTab("printed")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                galleryTab === "printed"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Printed Sample
            </button>
          </div>

          {/* Gallery View Canvas */}
          <div className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 aspect-square relative shadow-inner flex items-center justify-center">
            {/* View 1: Clean Garment Blank with Front/Back toggle */}
            {galleryTab === "product" && (
              <>
                <img
                  src={activeImage}
                  alt={`${product.name} in ${currentColor.name}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Front / Back Switcher pill */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20 z-10">
                  <button
                    type="button"
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
                    type="button"
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
              </>
            )}

            {/* View 2: Fabric & Texture Detail */}
            {galleryTab === "fabric" && (
              <div className="w-full h-full bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                {/* Background weave aesthetic texture */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundColor: currentColor.hex,
                    backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px)`,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 10px",
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: currentColor.hex }}
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      {currentColor.name} Textile Spec
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    4x Macro Zoom
                  </span>
                </div>

                <div className="relative z-10 space-y-4 my-auto">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                      Fabric Density & Weave
                    </span>
                    <p className="text-lg font-black mt-1 text-white">
                      {product.gsm} GSM · {product.fabric}
                    </p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Woven from long-staple combed cotton yarns with double-needle hems, pre-shrunk to guarantee under 3% dimensional shrinkage across 50+ wash cycles.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-slate-400 block font-semibold">Surface Finish</span>
                      <strong className="text-white mt-0.5 block">Bio-Washed & Silicon Softened</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                      <span className="text-[10px] text-slate-400 block font-semibold">Collar Construction</span>
                      <strong className="text-white mt-0.5 block">1x1 Ribbed Lycra Rib</strong>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-3">
                  <span>Factory Lab Checked: South India Mill</span>
                  <span className="text-emerald-400 font-semibold">✓ 100% Ring-Spun Cotton</span>
                </div>
              </div>
            )}

            {/* View 3: Printed Sample Mockup */}
            {galleryTab === "printed" && (
              <div className="w-full h-full relative">
                {/* Base garment in active color */}
                <img
                  src={currentColor.front}
                  alt={`${product.name} in ${currentColor.name} with DTF sample print`}
                  className="w-full h-full object-cover"
                />

                {/* Overlaid sample DTF artwork */}
                <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
                  <div className="w-44 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-amber-400/40 text-center shadow-2xl transform -translate-y-4">
                    <span className="text-[9px] uppercase tracking-widest text-amber-400 font-black block">
                      ASSON SOUTH INDIA
                    </span>
                    <span className="text-base font-black text-white uppercase tracking-tight block mt-1">
                      DTF HIGH-DEF
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium block mt-0.5">
                      CMYK + Dense White Underbase
                    </span>
                    <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-center gap-1.5 text-[9px] text-emerald-400 font-bold">
                      <Sparkles className="w-3 h-3" /> Crack & Fade Proof
                    </div>
                  </div>
                </div>

                {/* Printed Sample Badge & Link to Studio */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/75 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
                  <span className="text-[11px] font-semibold text-white pl-2">
                    Industrial Direct-to-Film (DTF)
                  </span>
                  <Link
                    href={`/design?product=${product.id}&color=${encodeURIComponent(currentColor.name)}`}
                    className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition"
                  >
                    Open Studio →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Color Selector */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Available Colours ({product.colours.length})
              </span>
              <span className="text-xs text-slate-900 font-extrabold">
                Selected: <span className="text-brand-900">{currentColor.name}</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.colours.map((col, idx) => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                    selectedColorIdx === idx
                      ? "border-brand-900 bg-brand-50/50 ring-1 ring-brand-900 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                  {selectedColorIdx === idx && (
                    <Check className="w-3 h-3 text-brand-900 ml-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Product Specs, Tier Table, Sizes, Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-brand-900 text-white text-[11px] font-bold">
                {product.gsm} GSM
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

          {/* Volume Discount Tiers Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
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
                        ? "bg-amber-50 border-amber-400 ring-2 ring-amber-400/30 shadow-sm"
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

            {/* Dynamic Volume Tier Incentive Hint */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                {nextTier ? (
                  <span className="text-slate-800 font-medium leading-relaxed">
                    Order <strong className="text-amber-700 font-bold">{unitsNeeded} more</strong> to pay{" "}
                    <strong className="text-slate-900 font-extrabold">₹{nextTier.price} / pc</strong>
                    {priceSavings > 0 && (
                      <span className="text-emerald-700 font-semibold ml-1.5">
                        (Save ₹{priceSavings} / pc)
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Maximum volume discount unlocked: ₹{unitPrice} / pc!
                  </span>
                )}
              </div>
              {nextTier && (
                <button
                  type="button"
                  onClick={() => {
                    setSizeQuantities((prev) => ({
                      ...prev,
                      L: (prev.L || 0) + unitsNeeded,
                    }));
                  }}
                  className="text-[11px] font-bold text-amber-900 hover:text-amber-950 px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 transition flex-shrink-0"
                >
                  + Add {unitsNeeded}
                </button>
              )}
            </div>
          </div>

          {/* Size Breakdown Quantity Matrix */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Sizes & Quantities
                </span>
                <span className="text-[11px] text-slate-500">
                  Total Units: <strong className="text-slate-900 text-sm font-black">{totalQuantity} pcs</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickAddAll(5)}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition"
                >
                  +5 All
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddAll(10)}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition"
                >
                  +10 All
                </button>
                <button
                  type="button"
                  onClick={handleClearSizes}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 text-[11px] font-semibold transition"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {SIZES.map((size) => (
                <div key={size} className="text-center p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    {size === "XXL" ? "2XL / XXL" : size}
                  </label>
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => handleStepQuantity(size, -1)}
                      className="w-6 h-6 rounded flex items-center justify-center bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold"
                      aria-label={`Decrease ${size}`}
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={sizeQuantities[size]}
                      onChange={(e) => handleSizeChange(size, e.target.value)}
                      className="w-full text-center py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleStepQuantity(size, 1)}
                      className="w-6 h-6 rounded flex items-center justify-center bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold"
                      aria-label={`Increase ${size}`}
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary Box & Conversion Actions */}
          <div className="bg-brand-900 text-white rounded-2xl p-6 space-y-4 shadow-xl">
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
              <span>GST ({GST_PERCENTAGE}%):</span>
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

            {/* Primary Action: Add to Quote List */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddToQuote}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Quote List ({totalQuantity} pcs · ₹{total.toLocaleString()})
              </button>
            </div>

            {/* Secondary Actions Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <Link
                href={`/design?product=${product.id}&color=${encodeURIComponent(currentColor.name)}`}
                className="py-2.5 px-3 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-brand-700 transition"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Customize
              </Link>

              <a
                href={mailtoUrl}
                className="py-2.5 px-3 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-brand-700 transition"
              >
                <Mail className="w-3.5 h-3.5 text-brand-300" />
                Email RFQ
              </a>

              <button
                type="button"
                onClick={() => setShowQuoteForm(true)}
                className="py-2.5 px-3 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-brand-700 transition"
              >
                <FileText className="w-3.5 h-3.5 text-brand-300" />
                Quick Quote
              </button>
            </div>

            {/* Direct Phone Support */}
            <div className="pt-2 border-t border-brand-800/60 flex items-center justify-between text-[11px] text-brand-300">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" /> Factory Direct Wholesale
              </span>
              <a
                href="tel:+918089963691"
                className="hover:text-white transition flex items-center gap-1 font-semibold"
              >
                <Phone className="w-3 h-3 text-amber-400" /> +91 80899 63691
              </a>
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

      {/* Floating Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {toast.title}
            </p>
            <p className="text-sm text-slate-200 mt-0.5 leading-snug">
              {toast.message}
            </p>
            <div className="mt-2.5 flex items-center gap-3">
              <Link
                href="/quote"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-2"
              >
                View Quote List ({itemCount} {itemCount === 1 ? "item" : "items"}) →
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
