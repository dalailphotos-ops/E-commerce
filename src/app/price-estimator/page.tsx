"use client";

import { useState } from "react";
import Link from "next/link";
import {
  REVERSE_ENGINEERED_PRODUCTS,
  DTF_PRINTS,
  GST_PERCENTAGE,
  formatINR,
} from "@/lib/constants";
import {
  Calculator,
  CheckCircle2,
  Copy,
  Plus,
  Trash2,
  ArrowRight,
  FileCheck,
  Sparkles,
  Send,
} from "lucide-react";

interface EstimatorItem {
  id: string;
  productId: string;
  frontPrint: string;
  backPrint: string;
  quantity: number;
}

export default function PriceEstimatorPage() {
  const [items, setItems] = useState<EstimatorItem[]>([
    {
      id: "item_1",
      productId: REVERSE_ENGINEERED_PRODUCTS[0].id,
      frontPrint: "logo",
      backPrint: "a3",
      quantity: 50,
    },
  ]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper calculations
  const calculateItemCost = (item: EstimatorItem) => {
    const product =
      REVERSE_ENGINEERED_PRODUCTS.find((p) => p.id === item.productId) ||
      REVERSE_ENGINEERED_PRODUCTS[0];

    const isBulk = item.quantity >= 10;
    const tier = [...product.prices]
      .sort((a, b) => b.min - a.min)
      .find((t) => item.quantity >= t.min);
    const basePrice = tier ? tier.price : product.basePrice;

    const frontCost =
      item.frontPrint !== "none" && DTF_PRINTS[item.frontPrint]
        ? isBulk
          ? DTF_PRINTS[item.frontPrint].bulk
          : DTF_PRINTS[item.frontPrint].single
        : 0;

    const backCost =
      item.backPrint !== "none" && DTF_PRINTS[item.backPrint]
        ? isBulk
          ? DTF_PRINTS[item.backPrint].bulk
          : DTF_PRINTS[item.backPrint].single
        : 0;

    const unitPrice = basePrice + frontCost + backCost;
    const itemSubtotal = unitPrice * item.quantity;

    return { product, basePrice, frontCost, backCost, unitPrice, itemSubtotal };
  };

  const totals = items.reduce(
    (acc, it) => {
      const calc = calculateItemCost(it);
      acc.totalQuantity += it.quantity;
      acc.subtotal += calc.itemSubtotal;
      return acc;
    },
    { totalQuantity: 0, subtotal: 0 }
  );

  const gstAmount = Math.round((totals.subtotal * GST_PERCENTAGE) / 100);
  const grandTotal = totals.subtotal + gstAmount;

  // Add / remove items
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        productId: REVERSE_ENGINEERED_PRODUCTS[0].id,
        frontPrint: "logo",
        backPrint: "none",
        quantity: 25,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateItem = (id: string, patch: Partial<EstimatorItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  };

  // Preset combinations
  const applyPreset = (front: string, back: string) => {
    if (items.length > 0) {
      updateItem(items[0].id, { frontPrint: front, backPrint: back });
    }
  };

  // Quote Summary Text
  const generateQuoteSummaryText = () => {
    let msg = `Price Estimator Quote — Asson Clothing Brand\n\n`;
    items.forEach((it, idx) => {
      const calc = calculateItemCost(it);
      msg += `Item ${idx + 1}: ${calc.product.name}\n`;
      msg += `· Quantity: ${it.quantity} pcs\n`;
      msg += `· Front Print: ${it.frontPrint === "none" ? "None" : DTF_PRINTS[it.frontPrint]?.label}\n`;
      msg += `· Back Print: ${it.backPrint === "none" ? "None" : DTF_PRINTS[it.backPrint]?.label}\n`;
      msg += `· Unit Price: ₹${calc.unitPrice} / pc\n`;
      msg += `· Subtotal: ₹${calc.itemSubtotal.toLocaleString()}\n\n`;
    });
    msg += `Total Units: ${totals.totalQuantity} pcs\n`;
    msg += `Subtotal: ₹${totals.subtotal.toLocaleString()}\n`;
    msg += `GST (5%): ₹${gstAmount.toLocaleString()}\n`;
    msg += `Grand Total: ₹${grandTotal.toLocaleString()}\n\n`;
    msg += `Please confirm bulk production timeline.`;

    return msg;
  };

  const handleCopy = () => {
    const text = generateQuoteSummaryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);
    try {
      const quoteItems = items.map((it) => {
        const c = calculateItemCost(it);
        return {
          productId: it.productId,
          productName: c.product.name,
          color: "Standard / Custom",
          quantity: it.quantity,
          printType: "DTF",
          printSize: `Front: ${it.frontPrint}, Back: ${it.backPrint}`,
          unitPrice: c.unitPrice,
          totalPrice: c.itemSubtotal,
        };
      });

      await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone: customerPhone,
          email: `${customerPhone}@asson-estimator.com`,
          items: quoteItems,
          subtotal: totals.subtotal,
          gst: gstAmount,
          total: grandTotal,
          notes: "Generated via Asson Live Price Estimator",
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500 text-slate-950">
              <Calculator className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Live Factory Rates
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
            Price Estimator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Build your order configuration, combine front/back print dimensions, and
            view transparent per-piece rates.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Popular Presets:</span>
          <button
            onClick={() => applyPreset("none", "none")}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
          >
            Plain T-Shirt
          </button>
          <button
            onClick={() => applyPreset("none", "a3")}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
          >
            A3 Back Only
          </button>
          <button
            onClick={() => applyPreset("logo", "a3")}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition"
          >
            Chest Logo + A3 Back
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Order Line Items Builder */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item, idx) => {
            const calc = calculateItemCost(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-900 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      Configure Apparel Item
                    </span>
                  </div>

                  {items.length > 1 && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Product */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Garment Silhouette:
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        updateItem(item.id, { productId: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-900"
                    >
                      {REVERSE_ENGINEERED_PRODUCTS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity Slider / Input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-slate-700">
                        Order Quantity:
                      </label>
                      <span className="font-extrabold text-amber-600">
                        {item.quantity} pieces
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="500"
                      step="5"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, {
                          quantity: parseInt(e.target.value) || 10,
                        })
                      }
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>10 pcs MOQ</span>
                      <span>50 pcs</span>
                      <span>500+ pcs</span>
                    </div>
                  </div>
                </div>

                {/* Print Placement Selections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Front Print Size */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Front Print Size:
                    </label>
                    <select
                      value={item.frontPrint}
                      onChange={(e) =>
                        updateItem(item.id, { frontPrint: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    >
                      <option value="none">No Front Print (₹0)</option>
                      {Object.entries(DTF_PRINTS).map(([k, p]) => (
                        <option key={k} value={k}>
                          {p.label} ({p.size}) — +₹
                          {item.quantity >= 10 ? p.bulk : p.single}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Back Print Size */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Back Print Size:
                    </label>
                    <select
                      value={item.backPrint}
                      onChange={(e) =>
                        updateItem(item.id, { backPrint: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    >
                      <option value="none">No Back Print (₹0)</option>
                      {Object.entries(DTF_PRINTS).map(([k, p]) => (
                        <option key={k} value={k}>
                          {p.label} ({p.size}) — +₹
                          {item.quantity >= 10 ? p.bulk : p.single}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Per-item Cost preview bar */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex gap-4 text-slate-600">
                    <span>
                      Garment: <strong>₹{calc.basePrice}</strong>
                    </span>
                    <span>
                      Prints: <strong>+₹{calc.frontCost + calc.backCost}</strong>
                    </span>
                    <span>
                      Unit Net:{" "}
                      <strong className="text-slate-900">
                        ₹{calc.unitPrice}
                      </strong>
                    </span>
                  </div>

                  <div className="text-slate-900 font-extrabold text-sm">
                    Item Total: ₹{calc.itemSubtotal.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={handleAddItem}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-900 text-slate-700 hover:text-brand-900 font-bold text-xs flex items-center justify-center gap-2 transition bg-white"
          >
            <Plus className="w-4 h-4" /> Add Another Silhouette / Product Style
          </button>
        </div>

        {/* Right Column: Order Quote Summary & Submission */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-brand-900 text-white rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-lg font-black tracking-tight text-white border-b border-brand-800 pb-3 flex items-center justify-between">
              <span>Estimate Summary</span>
              <span className="text-xs px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold">
                {totals.totalQuantity} Pieces
              </span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-brand-200">
                <span>Subtotal ({totals.totalQuantity} garments):</span>
                <span className="font-bold text-white">
                  ₹{totals.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-brand-300">
                <span>GST (5% Indian Textile Slab):</span>
                <span>₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-brand-200">
                <span>Branding Neck Labels:</span>
                <span className="text-emerald-400 font-bold">FREE (₹0)</span>
              </div>

              <div className="pt-3 border-t border-brand-800 flex justify-between items-baseline">
                <span className="font-extrabold text-base text-white">
                  Estimated Total:
                </span>
                <span className="font-black text-2xl text-amber-400">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleCopy}
                className="w-full py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 border border-brand-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied to Clipboard!" : "Copy Quote Summary"}
              </button>
            </div>

            {/* Formal Quote form */}
            <div className="pt-4 border-t border-brand-800">
              <span className="text-xs font-bold text-brand-200 block mb-2 uppercase">
                Save to Database / Request Invoice
              </span>

              {submitted ? (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
                  <FileCheck className="w-4 h-4" /> Quote saved! We will contact you shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-brand-950 border border-brand-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (e.g. +91 9876543210)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-brand-950 border border-brand-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? "Saving..." : "Submit Quote Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
