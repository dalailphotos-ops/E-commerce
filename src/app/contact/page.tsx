"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Instagram } from "lucide-react";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  BUSINESS_PHONE,
  SUPPORT_EMAIL,
  ORDERS_EMAIL,
  BUSINESS_LOCATION,
  INSTAGRAM_HANDLE,
  INSTAGRAM_LINK,
} from "@/lib/constants";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    apparelType: "Oversized Tee — 250 GSM French Terry",
    quantity: 50,
    printingType: "DTF (Direct-to-Film)",
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
      if (!res.ok) throw new Error(data.error || "Failed to submit enquiry");

      setStatus({
        type: "success",
        message: "Your enquiry has been received! Our streetwear manufacturing lab team will contact you shortly by phone or email.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        apparelType: "Oversized Tee — 250 GSM French Terry",
        quantity: 50,
        printingType: "DTF (Direct-to-Film)",
        details: "",
      });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Something went wrong. Please call or email us directly." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
          {BRAND_NAME} Manufacturing Lab
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight uppercase">
          Contact Our Lab
        </h1>
        <p className="text-sm font-mono text-neutral-500 uppercase tracking-wider">
          {BRAND_TAGLINE} — International streetwear manufacturing, heavyweight blanks, and custom drops based in {BUSINESS_LOCATION}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 font-mono uppercase tracking-wide">
              Official Channels
            </h2>

            <div className="space-y-4">
              <a
                href="tel:+918089963691"
                className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-400 transition group"
              >
                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500 font-mono font-semibold uppercase block">Official Phone</span>
                  <span className="text-base font-bold text-neutral-900 group-hover:text-black transition">{BUSINESS_PHONE}</span>
                  <span className="text-xs text-neutral-500 block mt-0.5">+91 80899 63691 (Direct desk)</span>
                </div>
              </a>

              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-400 transition group"
              >
                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500 font-mono font-semibold uppercase block">Support & Orders Email</span>
                  <span className="text-base font-bold text-neutral-900 group-hover:text-black transition">{SUPPORT_EMAIL}</span>
                  <span className="text-xs text-neutral-500 block mt-0.5">orders@assonclothing.com</span>
                </div>
              </a>

              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-400 transition group"
              >
                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500 font-mono font-semibold uppercase block">Instagram Official</span>
                  <span className="text-base font-bold text-neutral-900 group-hover:text-black transition">@{INSTAGRAM_HANDLE}</span>
                  <span className="text-xs text-neutral-500 block mt-0.5">Follow our drop releases & factory behind-the-scenes</span>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500 font-mono font-semibold uppercase block">Manufacturing Location</span>
                  <span className="text-sm font-bold text-neutral-900 block">{BUSINESS_LOCATION}</span>
                  <span className="text-xs text-neutral-600 block mt-0.5">South India Apparel & Printing Facilities</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500 font-mono font-semibold uppercase block">Operating Lab Hours</span>
                  <span className="text-sm font-bold text-neutral-900 block">Monday to Saturday: 9:00 AM – 7:30 PM IST</span>
                  <span className="text-xs text-neutral-600 block mt-0.5">Sunday: Factory floor offline</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Enquiry Interactive Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-neutral-900 font-mono uppercase tracking-wide">
                B2B Custom Drop Enquiry
              </h2>
              <p className="text-xs text-neutral-500 mt-1 font-mono">
                Submit tech specs, quantities, and silhouette requirements. Our production team will respond within 24 hours.
              </p>
            </div>

            {status && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold ${
                  status.type === "success"
                    ? "bg-neutral-900 text-white border border-neutral-800"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@brand.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                    Brand / Label Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Studio Streetwear"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="apparelType" className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                    Garment Silhouette *
                  </label>
                  <select
                    id="apparelType"
                    value={formData.apparelType}
                    onChange={(e) => setFormData({ ...formData, apparelType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white"
                  >
                    <option value="Oversized Tee — 250 GSM French Terry">Oversized Tee (250 GSM)</option>
                    <option value="Oversized Tee — 240 GSM Loopknit">Oversized Tee (240 GSM)</option>
                    <option value="Oversized Acid Wash — 240 GSM">Acid Wash Tee (240 GSM)</option>
                    <option value="Heavyweight Hoodie — 380 GSM">Heavyweight Hoodie (380 GSM)</option>
                    <option value="Crewneck Sweatshirt — 350 GSM">Crewneck Sweatshirt (350 GSM)</option>
                    <option value="Regular Fit Tee — 190 GSM">Regular Fit Tee (190 GSM)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                    Quantity (Pcs) *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="10"
                    step="5"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 10 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="printingType" className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                    Print Technique
                  </label>
                  <select
                    id="printingType"
                    value={formData.printingType}
                    onChange={(e) => setFormData({ ...formData, printingType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white"
                  >
                    <option value="DTF (Direct-to-Film)">DTF (Direct to Film)</option>
                    <option value="Screen Printing + Puff">Screen Printing + High Density Puff</option>
                    <option value="Computerized Embroidery">Computerized Embroidery</option>
                    <option value="Plain Blanks Only">Plain Blanks (No Print)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="details" className="block text-xs font-mono font-bold text-neutral-700 uppercase mb-1">
                  Collection Details & Notes
                </label>
                <textarea
                  id="details"
                  rows={4}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Specify sizing ratios (e.g. 10 S, 20 M, 15 L, 5 XL), artwork placements, wash preferences, and desired dispatch timeline..."
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-lg bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-widest shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Transmitting Specs...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send RFQ to Manufacturing Lab</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
