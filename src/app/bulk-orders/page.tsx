"use client";

import { useState } from "react";
import {
  Layers,
  Upload,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  FileCheck,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function BulkOrdersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    apparelType: "Oversized Tee (250 GSM)",
    quantity: 50,
    printingType: "DTF (Full Color)",
    details: "",
  });

  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("folder", "looma_bulk_enquiries");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.url) {
        setUploadedUrl(json.url);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          attachments: uploadedUrl ? [uploadedUrl] : [],
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" /> High-Volume Apparel Manufacturing
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
          Custom T-Shirts in Bulk
        </h1>
        <p className="text-slate-600 text-sm">
          Low minimums. Full production control. Direct factory rates for
          streetwear brands, college fests, corporate uniforms, and tech events.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xl font-black text-slate-900 block">10 Pcs</span>
          <span className="text-xs text-slate-500">Low Starting MOQ</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xl font-black text-slate-900 block">
            FREE Branding
          </span>
          <span className="text-xs text-slate-500">Custom Neck Tags</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xl font-black text-slate-900 block">
            Custom Dyes
          </span>
          <span className="text-xs text-slate-500">Acid Wash & Pantone</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xl font-black text-slate-900 block">
            Rapid Dispatch
          </span>
          <span className="text-xs text-slate-500">5–7 Day Turnaround</span>
        </div>
      </div>

      {/* Main Bulk Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <FileCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Bulk Order Request Received!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Our merchandising team is reviewing your requirements and will
              reach out via WhatsApp / phone with a formal proforma invoice.
            </p>
            <div className="pt-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Looma,%20I%20just%20submitted%20a%20bulk%20order%20enquiry.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                <PhoneCall className="w-4 h-4" /> Message Us on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. +91 9876543210"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. brand@clothing.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Brand / College / Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. Outlaw Streetwear"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Apparel Silhouette *
                </label>
                <select
                  value={formData.apparelType}
                  onChange={(e) =>
                    setFormData({ ...formData, apparelType: e.target.value })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option>Oversized Tee (250 GSM French Terry)</option>
                  <option>Acid Wash Oversized Tee (250 GSM)</option>
                  <option>Full Sleeve Oversized Tee (250 GSM)</option>
                  <option>Oversized Single Jersey (230 GSM)</option>
                  <option>Regular Fit Tee (190 GSM)</option>
                  <option>Heavyweight Hoodies (350+ GSM)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Estimated Quantity *
                </label>
                <input
                  type="number"
                  min="10"
                  step="5"
                  required
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value) || 10,
                    })
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                />
              </div>
            </div>

            {/* Cloudinary artwork upload */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Upload Mockup / Tech Pack / Art File (Cloudinary Storage)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700 block">
                  {isUploading
                    ? "Uploading file to Cloudinary..."
                    : uploadedUrl
                    ? "Uploaded Successfully!"
                    : "Upload PNG, PDF, or Tech Pack"}
                </span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="mt-2 text-xs text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Specific Order Notes / Placement instructions *
              </label>
              <textarea
                rows={4}
                required
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                placeholder="Mention required colors, sizes breakdown, print locations (e.g. A3 back + chest crest) or custom Pantone requirements..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-brand-900 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition"
            >
              {isSubmitting ? "Submitting..." : "Send Bulk Order Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
