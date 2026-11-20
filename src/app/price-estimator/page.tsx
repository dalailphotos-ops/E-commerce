"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  REVERSE_ENGINEERED_PRODUCTS,
  DTF_PRINTS,
  SIZES,
  GST_PERCENTAGE,
  formatINR,
  GarmentProduct,
} from "@/lib/constants";
import { useCart } from "@/context/CartContext";
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
  Mail,
  Printer,
  ShoppingBag,
  Palette,
  Layers,
} from "lucide-react";

interface EstimatorLineItem {
  id: string;
  productId: string;
  colorIdx: number;
  sizes: Record<string, number>;
  frontPrint: string;
  backPrint: string;
  leftPrint?: string;
  rightPrint?: string;
}

export default function PriceEstimatorPage() {
  const { addItem } = useCart();

  const [items, setItems] = useState<EstimatorLineItem[]>([
    {
      id: "item_1",
      productId: REVERSE_ENGINEERED_PRODUCTS[0].id,
      colorIdx: 0,
      sizes: { XS: 0, S: 10, M: 20, L: 15, XL: 5, XXL: 0 },
      frontPrint: "logo",
      backPrint: "a3",
    },
  ]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [copied, setCopied] = useState(false);
  const [cartTransferred, setCartTransferred] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper calculations for a line item
  const calculateItemCost = (item: EstimatorLineItem) => {
    const product =
      REVERSE_ENGINEERED_PRODUCTS.find((p) => p.id === item.productId) ||
      REVERSE_ENGINEERED_PRODUCTS[0];

    const quantity = Object.values(item.sizes).reduce(
      (sum, count) => sum + (Number(count) || 0),
      0
    );

    const isBulk = quantity >= 10;
    const tier = [...product.prices]
      .sort((a, b) => b.min - a.min)
      .find((t) => quantity >= t.min);
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
    const itemSubtotal = unitPrice * quantity;

    const currentColor = product.colours[item.colorIdx] || product.colours[0];

    return {
      product,
      color: currentColor,
      quantity,
      basePrice,
      frontCost,
      backCost,
      unitPrice,
      itemSubtotal,
    };
  };

  // Cumulative order totals
  const totals = useMemo(() => {
    return items.reduce(
      (acc, it) => {
        const calc = calculateItemCost(it);
        acc.totalQuantity += calc.quantity;
        acc.subtotal += calc.itemSubtotal;
        return acc;
      },
      { totalQuantity: 0, subtotal: 0 }
    );
  }, [items]);

  const gstAmount = Math.round((totals.subtotal * GST_PERCENTAGE) / 100);
  const grandTotal = totals.subtotal + gstAmount;

  // Add line item
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        productId: REVERSE_ENGINEERED_PRODUCTS[0].id,
        colorIdx: 0,
        sizes: { XS: 0, S: 5, M: 10, L: 10, XL: 0, XXL: 0 },
        frontPrint: "logo",
        backPrint: "none",
      },
    ]);
  };

  // Remove line item
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Update line item
  const updateItem = (id: string, patch: Partial<EstimatorLineItem>) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  };

  // Update size in line item
  const updateItemSize = (id: string, sizeKey: string, val: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        return {
          ...it,
          sizes: {
            ...it.sizes,
            [sizeKey]: Math.max(0, val),
          },
        };
      })
    );
  };

  // Quick preset combinations
  const applyPreset = (front: string, back: string) => {
    if (items.length > 0) {
      updateItem(items[0].id, { frontPrint: front, backPrint: back });
    }
  };

  // Format Quote Summary Text for Clipboard and RFQ
  const generateQuoteSummaryText = () => {
    let msg = `Price Estimator Quote — Asson Clothing Brand\n\n`;
    items.forEach((it, idx) => {
      const calc = calculateItemCost(it);
      msg += `Item ${idx + 1}: ${calc.product.name} (${calc.color.name})\n`;
      msg += `· Quantity: ${calc.quantity} pcs\n`;
      const sizeList = Object.entries(it.sizes)
        .filter(([, count]) => count > 0)
        .map(([sz, count]) => `${sz}:${count}`)
        .join(", ");
      if (sizeList) {
        msg += `· Sizes: ${sizeList}\n`;
      }
      msg += `· Front Print: ${
        it.frontPrint === "none" ? "None" : DTF_PRINTS[it.frontPrint]?.label || it.frontPrint
      }\n`;
      msg += `· Back Print: ${
        it.backPrint === "none" ? "None" : DTF_PRINTS[it.backPrint]?.label || it.backPrint
      }\n`;
      msg += `· Unit Price: ₹${calc.unitPrice} / pc\n`;
      msg += `· Subtotal: ₹${calc.itemSubtotal.toLocaleString()}\n\n`;
    });
    msg += `Total Units: ${totals.totalQuantity} pcs\n`;
    msg += `Subtotal: ₹${totals.subtotal.toLocaleString()}\n`;
    msg += `GST (5%): ₹${gstAmount.toLocaleString()}\n`;
    msg += `Grand Total: ₹${grandTotal.toLocaleString()}\n\n`;
    msg += `Contact: orders@assonclothing.com | +91 80899 63691\n`;
    msg += `Please confirm bulk production timeline.`;

    return msg;
  };

  // Export Channel 1: Clipboard
  const handleCopy = () => {
    const text = generateQuoteSummaryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Export Channel 2: Email RFQ mailto link
  const emailMailtoUrl = useMemo(() => {
    const recipient = "orders@assonclothing.com";
    const subject = `Asson Clothing Quote Request — ${totals.totalQuantity} pcs`;
    const body = generateQuoteSummaryText();
    return `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }, [items, totals, gstAmount, grandTotal]);

  // Export Channel 3: PDF Print
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Export Channel 4: Transfer directly into CartContext
  const handleTransferToCart = () => {
    items.forEach((it) => {
      const calc = calculateItemCost(it);
      const printsList = [];

      if (it.frontPrint !== "none" && DTF_PRINTS[it.frontPrint]) {
        printsList.push({
          position: "front",
          sizeKey: it.frontPrint,
          sizeLabel: `Front: ${DTF_PRINTS[it.frontPrint].label}`,
          dimensions: DTF_PRINTS[it.frontPrint].dimensions || DTF_PRINTS[it.frontPrint].size,
          cost: calc.frontCost,
        });
      }

      if (it.backPrint !== "none" && DTF_PRINTS[it.backPrint]) {
        printsList.push({
          position: "back",
          sizeKey: it.backPrint,
          sizeLabel: `Back: ${DTF_PRINTS[it.backPrint].label}`,
          dimensions: DTF_PRINTS[it.backPrint].dimensions || DTF_PRINTS[it.backPrint].size,
          cost: calc.backCost,
        });
      }

      addItem({
        productId: calc.product.id,
        productName: calc.product.name,
        productSpec: calc.product.spec,
        color: calc.color.name,
        colorHex: calc.color.hex,
        sizes: { ...it.sizes },
        quantity: calc.quantity,
        unitPrice: calc.unitPrice,
        prints: printsList,
      });
    });

    setCartTransferred(true);
    setTimeout(() => setCartTransferred(false), 4000);
  };

  // Direct In-App Quote submission to /api/quotes
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
          color: c.color.name,
          quantity: c.quantity,
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
      console.error("Quote save error:", err);
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
              Live Factory Rates & Multi-Line RFQ
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
            Price Estimator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure multi-item orders, independent size matrix (XS–XXL), print placements,
            and export to email, clipboard, PDF, or cart.
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
        {/* Left Column: Multi-Line Items Builder */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item, idx) => {
            const calc = calculateItemCost(item);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
              >
                {/* Item header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#121212] text-white border border-[#262626] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {calc.product.name}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                      {calc.quantity} pieces
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
                        updateItem(item.id, { productId: e.target.value, colorIdx: 0 })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {REVERSE_ENGINEERED_PRODUCTS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (from ₹{p.basePrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color Swatch Picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Garment Colour: <span className="font-semibold text-slate-900">{calc.color.name}</span>
                    </label>
                    <div className="flex gap-2 pt-1">
                      {calc.product.colours.map((col, cIdx) => (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => updateItem(item.id, { colorIdx: cIdx })}
                          title={col.name}
                          style={{ backgroundColor: col.hex }}
                          className={`w-7 h-7 rounded-full border border-black/20 transition ${
                            item.colorIdx === cIdx
                              ? "ring-2 ring-amber-500 scale-110 shadow"
                              : "hover:scale-105"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Independent Size Breakdown Matrix (XS - XXL) */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200/70">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">
                      Independent Size Matrix Breakdown:
                    </span>
                    <span className="text-amber-700 font-extrabold">
                      Line Total: {calc.quantity} pcs
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {SIZES.map((sz) => (
                      <div key={sz} className="text-center">
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">
                          {sz}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="2000"
                          value={item.sizes[sz] ?? 0}
                          onChange={(e) =>
                            updateItemSize(item.id, sz, parseInt(e.target.value) || 0)
                          }
                          className="w-full text-center p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-black"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Print Placement Selections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      {Object.entries(DTF_PRINTS)
                        .filter(([k]) => k !== "label")
                        .map(([k, p]) => (
                          <option key={k} value={k}>
                            {p.label} ({p.size}) — +₹
                            {calc.quantity >= 10 ? p.bulk : p.single}
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
                      {Object.entries(DTF_PRINTS)
                        .filter(([k]) => k !== "label")
                        .map(([k, p]) => (
                          <option key={k} value={k}>
                            {p.label} ({p.size}) — +₹
                            {calc.quantity >= 10 ? p.bulk : p.single}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Per-item Cost preview bar */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex gap-4 text-slate-600">
                    <span>
                      Garment ({calc.quantity} pcs tier):{" "}
                      <strong>₹{calc.basePrice}</strong>
                    </span>
                    <span>
                      Prints:{" "}
                      <strong>+₹{calc.frontCost + calc.backCost}</strong>
                    </span>
                    <span>
                      Unit Net:{" "}
                      <strong className="text-slate-900">₹{calc.unitPrice}</strong>
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
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-black text-neutral-700 hover:text-black font-bold text-xs flex items-center justify-center gap-2 transition bg-white"
          >
            <Plus className="w-4 h-4" /> Add Another Silhouette / Product Style
          </button>
        </div>

        {/* Right Column: Order Quote Summary & Export Channels */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#121212] text-white border border-[#262626] rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-lg font-black tracking-tight text-white border-b border-[#262626] pb-3 flex items-center justify-between">
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

              <div className="pt-3 border-t border-[#262626] flex justify-between items-baseline">
                <span className="font-extrabold text-base text-white">
                  Estimated Total:
                </span>
                <span className="font-black text-2xl text-amber-400">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Export Channels Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-[#262626]">
              <span className="text-[11px] font-bold text-brand-300 uppercase block mb-1">
                Export Quotation Channels
              </span>

              {/* Transfer All to Cart */}
              <button
                type="button"
                onClick={handleTransferToCart}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow"
              >
                <ShoppingBag className="w-4 h-4" /> Transfer All to Quote List (Cart)
              </button>

              {cartTransferred && (
                <div className="p-2 bg-emerald-900/90 border border-emerald-600 rounded-lg text-xs text-emerald-200 flex items-center justify-between">
                  <span>Transferred to Cart!</span>
                  <Link href="/quote" className="underline font-bold text-white">
                    Open Quote List →
                  </Link>
                </div>
              )}

              {/* Copy to Clipboard */}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-neutral-700 border border-neutral-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied Quote Summary!" : "Copy Quote Summary"}
              </button>

              {/* Email RFQ Link */}
              <a
                href={emailMailtoUrl}
                className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-neutral-700 border border-neutral-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
              >
                <Mail className="w-4 h-4" /> Email RFQ Quote
              </a>

              {/* PDF Print Layout */}
              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-neutral-700 border border-neutral-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" /> Print / PDF Layout
              </button>
            </div>

            {/* Formal Quote form for direct database save */}
            <div className="pt-3 border-t border-[#262626]">
              <span className="text-[11px] font-bold text-brand-300 block mb-2 uppercase">
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
                    className="w-full p-2.5 rounded-lg bg-[#0A0A0A] border border-[#262626] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (e.g. +91 80899 63691)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#0A0A0A] border border-[#262626] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-neutral-700 border border-neutral-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition"
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
