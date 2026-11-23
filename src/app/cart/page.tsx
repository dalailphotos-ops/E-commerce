"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/constants";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  FileText,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
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

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-r-transparent mb-4" />
        <p className="text-sm text-slate-500">Loading your quote cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Your Quote Cart is Empty
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            You haven&apos;t added any blank garments or custom mockups yet. Explore our catalog of heavyweight streetwear blanks or customize in the studio.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/design"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition flex items-center gap-2 shadow-md"
          >
            Launch Design Studio <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/design"
            className="px-6 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm transition flex items-center gap-2 shadow-sm"
          >
            Launch Design Studio <Sparkles className="w-4 h-4" />
          </Link>
          <Link
            href="/price-estimator"
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition border border-slate-200"
          >
            Price Estimator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-widest block">
            Quote Review & Order Conversion
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
            Your Quote Cart
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={clearCart}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
          <Link
            href="/design"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Studio
          </Link>
        </div>
      </div>

      {/* Grid: Line Items (2/3) + Summary Sidebar (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Line Items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 transition hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {item.productName}
                    </h3>
                    {item.color && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.colorHex && (
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        )}
                        {item.color}
                      </span>
                    )}
                  </div>
                  {item.productSpec && (
                    <p className="text-xs text-slate-500 font-mono">
                      {item.productSpec}
                    </p>
                  )}
                </div>

                {/* Per Piece Unit Price & Line Total */}
                <div className="text-right sm:shrink-0">
                  <div className="text-base sm:text-lg font-black text-slate-900">
                    {formatINR(item.totalPrice)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatINR(item.unitPrice)} / piece
                  </div>
                </div>
              </div>

              {/* Size Breakdown Chips */}
              {item.sizes && Object.keys(item.sizes).length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Size Allocation ({item.quantity} total pcs)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(item.sizes).map(([size, count]) =>
                      Number(count) > 0 ? (
                        <span
                          key={size}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                        >
                          <strong className="font-bold text-slate-900">{size}:</strong> {count} pcs
                        </span>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              {/* Prints & Customizations Badges */}
              {item.prints && item.prints.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Custom Print Placements
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.prints.map((p, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium"
                      >
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span className="capitalize font-bold">{p.position}:</span>
                        <span>{p.sizeLabel || p.sizeKey}</span>
                        <span className="font-bold text-emerald-700">
                          {p.cost === 0 ? "(Free)" : `(+₹${p.cost})`}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Adjusters & Line Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 mr-1">Qty:</span>
                  <button
                    onClick={() => {
                      const newQty = Math.max(1, item.quantity - 1);
                      updateItem(item.id, { quantity: newQty });
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      updateItem(item.id, { quantity: item.quantity + 1 });
                    }}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                    title="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold transition"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Quote Summary Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Quote Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total Units</span>
                <span className="font-bold text-slate-900">{itemCount} pcs</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. Tax)</span>
                <span className="font-bold text-slate-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span className="font-bold text-slate-900">{formatINR(gst)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-base font-black text-slate-900">Grand Total</span>
                <span className="text-2xl font-black text-brand-900">
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Factory Direct Pricing
              </div>
              <p>
                Volume tier discounts are applied automatically. Formal GST proforma invoice issued upon checkout.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/checkout"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-md"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quote"
                className="w-full py-2.5 px-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Request Formal RFQ Proforma
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
