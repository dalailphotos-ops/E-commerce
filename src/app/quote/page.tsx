"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function QuotePage() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          items: [
            {
              productId: "custom-rfq",
              productName: "Custom Merchandising & Apparel RFQ",
              color: "Assorted",
              quantity: 50,
              unitPrice: 260,
              totalPrice: 13000,
            },
          ],
          subtotal: 13000,
          gst: 650,
          total: 13650,
          notes,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-accent uppercase tracking-widest">
          Request for Quotation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Quote List & Custom RFQ
        </h1>
        <p className="text-sm text-slate-600">
          Need an official GST proforma invoice or custom garment quote? Fill in
          your contact details below or use our online calculators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/price-estimator"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm transition space-y-2 group"
        >
          <span className="text-xs font-bold text-amber-600">Step 1</span>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition">
            Price Estimator
          </h3>
          <p className="text-xs text-slate-500">
            Calculate tiered per-piece prices for front and back prints.
          </p>
        </Link>

        <Link
          href="/design"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm transition space-y-2 group"
        >
          <span className="text-xs font-bold text-amber-600">Step 2</span>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition">
            Design Studio
          </h3>
          <p className="text-xs text-slate-500">
            Create front & back mockups with custom graphics and logos.
          </p>
        </Link>

        <Link
          href="/bulk-orders"
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-sm transition space-y-2 group"
        >
          <span className="text-xs font-bold text-amber-600">Step 3</span>
          <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition">
            Bulk Manufacturing
          </h3>
          <p className="text-xs text-slate-500">
            High volume runs with custom dyes, relabeling, and packaging.
          </p>
        </Link>
      </div>

      {/* Quote Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">
              Quote Request Logged!
            </h3>
            <p className="text-xs text-slate-600">
              Our team will review your specs and send a formal estimate within a
              few hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Direct Quote Request
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
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
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                placeholder="contact@brand.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tell Us About Your Order & Requirements
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                placeholder="Specify silhouettes, estimated quantities, printing needs..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs shadow transition"
            >
              {isSubmitting ? "Submitting..." : "Send Quote Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
