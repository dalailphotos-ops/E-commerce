"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/constants";
import {
  FileText,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Mail,
  Phone,
  Calculator,
  Layers,
  AlertCircle,
} from "lucide-react";

export default function QuotePage() {
  const {
    items,
    itemCount,
    subtotal,
    gst,
    grandTotal,
    updateItem,
    removeItem,
    clearCart,
    isLoaded,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If cart has items, use active cart totals; if empty, provide fallback calculation
  const hasCartItems = items.length > 0;
  const displaySubtotal = hasCartItems ? subtotal : 0;
  const displayGst = hasCartItems ? gst : 0;
  const displayGrandTotal = hasCartItems ? grandTotal : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const submissionItems = hasCartItems
        ? items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            color: i.color,
            quantity: i.quantity,
            sizes: i.sizes,
            printType:
              i.prints && i.prints.length > 0
                ? i.prints.map((p) => p.sizeLabel || p.sizeKey).join(", ")
                : "Plain Blanks",
            printSize:
              i.prints && i.prints.length > 0
                ? i.prints.map((p) => `${p.position}: ${p.sizeLabel || p.sizeKey}`).join(", ")
                : "None",
            designPreviewUrl: i.mockupFrontUrl || i.mockupBackUrl || "",
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice,
          }))
        : [
            {
              productId: "custom-rfq",
              productName: "Custom Merchandising & Apparel RFQ",
              color: "Assorted",
              quantity: 50,
              unitPrice: 260,
              totalPrice: 13000,
            },
          ];

      const payload = {
        customerName,
        phone,
        email,
        company: company || undefined,
        items: submissionItems,
        subtotal: hasCartItems ? subtotal : 13000,
        gst: hasCartItems ? gst : 650,
        total: hasCartItems ? grandTotal : 13650,
        notes,
      };

      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit quote request");
      }

      const data = await res.json();
      setQuoteId(data.quoteId || `ASSN-${Date.now().toString().slice(-6)}`);
      if (hasCartItems) {
        clearCart();
      }
      setSubmitted(true);
    } catch (err: any) {
      console.error("Quote submission error:", err);
      setErrorMessage(
        err.message || "Failed to submit quote. Please contact orders@assonclothing.com directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-accent uppercase tracking-widest">
          Request for Quotation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Quote List & Custom RFQ
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Need an official GST proforma invoice or custom garment quote? Review your saved items below or submit your custom specifications directly to our production lab.
        </p>
      </div>

      {/* 3 Step Integration Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/price-estimator"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm transition space-y-2 group"
        >
          <span className="text-xs font-bold text-amber-600">Step 1</span>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition flex items-center justify-between">
            <span>Price Estimator</span>
            <Calculator className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
          </h3>
          <p className="text-xs text-slate-500">
            Calculate tiered per-piece prices for front and back prints across volume breaks.
          </p>
        </Link>

        <Link
          href="/design"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm transition space-y-2 group"
        >
          <span className="text-xs font-bold text-amber-600">Step 2</span>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition flex items-center justify-between">
            <span>Design Studio</span>
          </h3>
          <p className="text-xs text-slate-500">
            Create front & back mockups with custom graphics, sleeve prints, and woven labels.
          </p>
        </Link>

        <Link
          href="/bulk-orders"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm transition space-y-2 group"
        >
          <span className="text-xs font-bold text-amber-600">Step 3</span>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition flex items-center justify-between">
            <span>Bulk Manufacturing</span>
            <Layers className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
          </h3>
          <p className="text-xs text-slate-500">
            High volume runs with custom reactive dyes, relabeling, and wholesale packaging.
          </p>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Cart Items List */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <span>Active Quote Items</span>
              </h2>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {itemCount} units
              </span>
            </div>

            {hasCartItems ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                  >
                    <div className="flex gap-3 items-start">
                      {(item.mockupFrontUrl || item.mockupBackUrl) && (
                        <div className="w-16 h-20 rounded-xl bg-[#e9e8e4] border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                          <img
                            src={item.mockupFrontUrl || item.mockupBackUrl}
                            alt={item.productName}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900">
                              {item.productName}
                            </h4>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Color: <strong>{item.color}</strong> · {formatINR(item.unitPrice)} / piece
                            </div>
                          </div>
                          <span className="font-black text-sm text-slate-900">
                            {formatINR(item.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Size Breakdown */}
                    {item.sizes && (
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {Object.entries(item.sizes).map(([sz, qty]) =>
                          Number(qty) > 0 ? (
                            <span
                              key={sz}
                              className="px-2 py-0.5 bg-white rounded-md border border-slate-200 text-[11px] font-medium"
                            >
                              <strong>{sz}:</strong> {qty}
                            </span>
                          ) : null
                        )}
                      </div>
                    )}

                    {/* Prints */}
                    {item.prints && item.prints.length > 0 && (
                      <div className="text-[11px] text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex flex-wrap gap-2">
                        {item.prints.map((p, idx) => (
                          <span key={idx}>
                            <strong>{p.position}:</strong> {p.sizeLabel || p.sizeKey}{" "}
                            {p.cost === 0 ? "(Free)" : `(+₹${p.cost})`}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quantity Adjustment & Remove */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500">Qty:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newQty = Math.max(1, item.quantity - 1);
                            updateItem(item.id, { quantity: newQty });
                          }}
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-100">
                <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">
                  Your quote list is currently empty. You can still submit a general custom order inquiry below or explore blanks.
                </p>
                <div className="flex justify-center gap-3 pt-1">
                  <Link
                    href="/design"
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    Design Studio <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/design"
                    className="text-xs font-bold text-brand-900 hover:text-brand-800 flex items-center gap-1"
                  >
                    Design Custom Mockup <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Subtotal, 5% GST, and Grand Total Calculation Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Calculated Subtotal</span>
                <span className="font-bold text-slate-900">{formatINR(displaySubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Applicable GST (5%)</span>
                <span className="font-bold text-slate-900">{formatINR(displayGst)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline font-black">
                <span className="text-sm text-slate-900">Grand Total Estimate</span>
                <span className="text-xl text-brand-900">{formatINR(displayGrandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: RFQ Submission Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">
                  Quote Request Logged!
                </h3>
                {quoteId && (
                  <p className="text-xs font-mono font-bold text-slate-600 bg-slate-50 py-1 px-3 rounded-lg border border-slate-200 inline-block">
                    Reference ID: {quoteId}
                  </p>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our manufacturing team will review your specifications and issue a formal GST proforma invoice within 2 to 4 working hours.
              </p>
              <div className="pt-2">
                <Link
                  href="/design"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition"
                >
                  Start New Design <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">
                  Request for Quotation Form
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit your details for official quotation and GST billing.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  name="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  placeholder="+91 80899 63691"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  placeholder="orders@assonclothing.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Company / Label Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  placeholder="e.g. Apex Apparel Exports"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Order Notes & Customization Requirements
                </label>
                <textarea
                  rows={3}
                  name="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  placeholder="Specify silhouettes, estimated quantities, printing needs..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting RFQ..." : "Send Formal Quote Request"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-accent" />
              <span>Direct: +91 80899 63691</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span>Email: orders@assonclothing.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
