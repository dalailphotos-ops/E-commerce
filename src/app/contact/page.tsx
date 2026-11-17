"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";

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
        message: "Your enquiry has been received! Our manufacturing lab team will contact you shortly by phone or email.",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-accent uppercase tracking-widest">Official Direct Channels</span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Contact Our Factory Lab</h1>
        <p className="text-sm text-slate-600">
          Get in touch with Asson Clothing Brand for custom apparel manufacturing, bulk orders, and print-on-demand fulfillment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900">Direct Contact Information</h2>

            <div className="space-y-4">
              <a
                href="tel:+918089963691"
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Official Phone</span>
                  <span className="text-base font-bold text-slate-900 group-hover:text-accent transition">+91 80899 63691</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Direct line to manufacturing specialists</span>
                </div>
              </a>

              <a
                href="mailto:orders@assonclothing.com"
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Official Email</span>
                  <span className="text-base font-bold text-slate-900 group-hover:text-accent transition">orders@assonclothing.com</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Send tech packs, vector files, & purchase orders</span>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Factory Lab Location</span>
                  <span className="text-sm font-bold text-slate-900 block">Watani Complex, Manjeri Rd, Kizhisseri</span>
                  <span className="text-xs text-slate-600 block mt-0.5">Malappuram, Kerala 673641, South India</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase block">Operating Lab Hours</span>
                  <span className="text-sm font-bold text-slate-900 block">Monday to Saturday: 9:00 AM – 7:00 PM IST</span>
                  <span className="text-xs text-slate-600 block mt-0.5">Sunday: Factory floor closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Enquiry Interactive Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Send Direct Manufacturing Enquiry</h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your specifications below. Our production lab will evaluate your requirements and contact you with a formal quotation.
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
                    placeholder="e.g. Suresh Menon"
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
                    placeholder="orders@assonclothing.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Apparel Exports"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apparel Type *</label>
                  <select
                    value={formData.apparelType}
                    onChange={(e) => setFormData({ ...formData, apparelType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-900"
                  >
                    <option value="Oversized Tee — 250 GSM French Terry">Oversized Tee (250 GSM)</option>
                    <option value="Regular Fit Tee — 190 GSM">Regular Fit Tee (190 GSM)</option>
                    <option value="Acid Wash Oversized Tee — 250 GSM">Acid Wash Oversized Tee</option>
                    <option value="Full Sleeve Oversized Tee — 250 GSM">Full Sleeve Oversized Tee</option>
                    <option value="Custom Manufacturing / Blanks">Custom Blanks / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Printing Method</label>
                  <select
                    value={formData.printingType}
                    onChange={(e) => setFormData({ ...formData, printingType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-900"
                  >
                    <option value="DTF (Direct-to-Film)">DTF (Direct-to-Film)</option>
                    <option value="Screen Printing">Screen Printing</option>
                    <option value="Screen Printing + 3D Puff">Screen Printing + 3D Puff</option>
                    <option value="Computerized Embroidery">Computerized Embroidery</option>
                    <option value="Plain Blanks (No Print)">Plain Blanks (No Print)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Project Details & Specifications *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail your requirements, color choices, print placements, timeline, and delivery expectations..."
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
                {loading ? "Submitting Enquiry..." : "Submit Formal Enquiry"} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
