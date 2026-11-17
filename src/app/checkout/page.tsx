"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/constants";
import {
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Mail,
  Phone,
  FileText,
  Send,
  AlertCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const {
    items,
    itemCount,
    subtotal,
    gst,
    grandTotal,
    clearCart,
    isLoaded,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        customerName,
        email,
        phone,
        company: company || undefined,
        items: items.map((i) => ({
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
        })),
        subtotal,
        gst,
        total: grandTotal,
        notes: address
          ? `${notes ? notes + "\n" : ""}Delivery Address:\n${address}`.trim()
          : notes,
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
      clearCart();
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Checkout submission failed:", err);
      setErrorMessage(
        err.message ||
          "There was an issue processing your order. Please call or email us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-r-transparent mb-4" />
        <p className="text-sm text-slate-500">Loading checkout session...</p>
      </div>
    );
  }

  // Confirmation View
  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              RFQ & Order Conversion Confirmed
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
              Quote Request Successfully Placed!
            </h1>
            {quoteId && (
              <p className="text-sm font-mono text-slate-600 font-bold bg-slate-50 inline-block px-3 py-1 rounded-lg border border-slate-200">
                Reference ID: {quoteId}
              </p>
            )}
          </div>

          <div className="text-left bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-3">
            <h4 className="font-bold text-slate-900">Next Manufacturing Steps:</h4>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong>Tech Pack Review:</strong> Our merchandising team in Malappuram is reviewing your selected blank styles, sizes, and print placements.
              </li>
              <li>
                <strong>Proforma Invoice:</strong> We will issue a formal GST proforma invoice to <strong>{email}</strong> within 2 to 4 working hours.
              </li>
              <li>
                <strong>Payment & Production:</strong> Advance payment can be settled via NEFT/RTGS or UPI, after which production begins on our factory floor.
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              <span>Direct Hotline: <strong>+91 80899 63691</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-500" />
              <span>Direct Support: <strong>orders@assonclothing.com</strong></span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition flex items-center gap-2 shadow-md"
            >
              Continue Exploring Blanks <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Checkout Guard
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            No Items to Checkout
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your quote cart is currently empty. Please add items to your cart before proceeding with checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/cart"
            className="px-6 py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition flex items-center gap-2 shadow-md"
          >
            Shop Blanks Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-widest block">
            Final Step
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
            Checkout & Order Finalization
          </h1>
        </div>
        <Link
          href="/cart"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-800 border border-red-200 text-xs sm:text-sm font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: Form (7 cols) + Order Review (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Customer Information & Billing Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900">
              Customer & Commercial Details
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide contact and delivery information for your formal GST invoice and shipment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rahul@mybrand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Outlaw Apparel Co."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Shipping & Delivery Address
              </label>
              <textarea
                rows={3}
                placeholder="Building name, Street, City, State, Pincode..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Order Notes & Customization Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Special packaging requirements, neck tag details, delivery deadline..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isSubmitting ? "Finalizing RFQ & Submitting..." : "Submit Order & Request GST Proforma"}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {itemCount} pcs total
              </span>
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {item.productName}
                      </h4>
                      <div className="text-slate-500 mt-0.5">
                        Color: <span className="font-semibold text-slate-700">{item.color}</span> · {item.quantity} pcs
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 text-sm shrink-0">
                      {formatINR(item.totalPrice)}
                    </span>
                  </div>

                  {item.sizes && (
                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                      {Object.entries(item.sizes).map(([sz, qty]) =>
                        Number(qty) > 0 ? (
                          <span
                            key={sz}
                            className="px-1.5 py-0.5 bg-white rounded border border-slate-200"
                          >
                            {sz}: {qty}
                          </span>
                        ) : null
                      )}
                    </div>
                  )}

                  {item.prints && item.prints.length > 0 && (
                    <div className="text-[11px] text-amber-900 bg-amber-50/80 px-2 py-1 rounded border border-amber-200">
                      {item.prints.map((p) => `${p.position}: ${p.sizeLabel || p.sizeKey}`).join(" · ")}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-slate-200 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. Tax)</span>
                <span className="font-bold text-slate-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span className="font-bold text-slate-900">{formatINR(gst)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2.5 flex justify-between items-baseline">
                <span className="text-base font-black text-slate-900">Grand Total</span>
                <span className="text-2xl font-black text-brand-900">
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-[11px] text-brand-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Asson Factory Guarantee
              </div>
              <p>
                Zero middleman markups. Full commercial proforma with HSN codes and GST breakup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
