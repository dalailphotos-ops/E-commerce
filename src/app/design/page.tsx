"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  REVERSE_ENGINEERED_PRODUCTS,
  DTF_PRINTS,
  SIZES,
  GST_PERCENTAGE,
  WHATSAPP_NUMBER,
  GarmentProduct,
} from "@/lib/constants";
import {
  Palette,
  Upload,
  Type,
  Move,
  RotateCw,
  Trash2,
  PhoneCall,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  Download,
  FileCheck,
} from "lucide-react";

function DesignStudioContent() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get("product") || REVERSE_ENGINEERED_PRODUCTS[0].id;
  const initialColorName = searchParams.get("color");

  // State
  const [selectedProduct, setSelectedProduct] = useState<GarmentProduct>(
    REVERSE_ENGINEERED_PRODUCTS.find((p) => p.id === initialProductId) ||
      REVERSE_ENGINEERED_PRODUCTS[0]
  );

  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0);
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [quantity, setQuantity] = useState<number>(25);

  // Print technique and placement
  const [printSizeKey, setPrintSizeKey] = useState<string>("a3");
  const [isEmbroidery, setIsEmbroidery] = useState<boolean>(false);
  const [hasNeckLabel, setHasNeckLabel] = useState<boolean>(true);

  // Artwork & Canvas Elements
  const [frontUploadedImage, setFrontUploadedImage] = useState<string | null>(null);
  const [backUploadedImage, setBackUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Custom Text overlay
  const [customText, setCustomText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#ffffff");
  const [textSize, setTextSize] = useState<number>(28);
  const [textElements, setTextElements] = useState<
    Array<{ id: string; text: string; color: string; size: number; side: "front" | "back"; x: number; y: number }>
  >([]);

  // Customer quote submission state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Initialize matching color if passed via query
  useEffect(() => {
    if (initialColorName) {
      const idx = selectedProduct.colours.findIndex(
        (c) => c.name.toLowerCase() === initialColorName.toLowerCase()
      );
      if (idx !== -1) setSelectedColorIdx(idx);
    }
  }, [initialColorName, selectedProduct]);

  const currentColor =
    selectedProduct.colours[selectedColorIdx] || selectedProduct.colours[0];
  const activeGarmentPhoto =
    activeSide === "front" ? currentColor.front : currentColor.back;

  // Calculation Logic
  const isBulk = quantity >= 10;
  const baseGarmentPrice = (() => {
    const tier = [...selectedProduct.prices]
      .sort((a, b) => b.min - a.min)
      .find((t) => quantity >= t.min);
    return tier ? tier.price : selectedProduct.basePrice;
  })();

  const printUnitCost = isEmbroidery
    ? isBulk ? 50 : 70
    : DTF_PRINTS[printSizeKey]
    ? isBulk ? DTF_PRINTS[printSizeKey].bulk : DTF_PRINTS[printSizeKey].single
    : 0;

  const unitPrice = baseGarmentPrice + printUnitCost;
  const subtotal = unitPrice * quantity;
  const gstAmount = Math.round((subtotal * GST_PERCENTAGE) / 100);
  const total = subtotal + gstAmount;

  // Cloudinary image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "asson_studio_designs");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        if (activeSide === "front") {
          setFrontUploadedImage(data.url);
        } else {
          setBackUploadedImage(data.url);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      // Fallback to local data URL if API error
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (activeSide === "front") {
          setFrontUploadedImage(uploadEvent.target?.result as string);
        } else {
          setBackUploadedImage(uploadEvent.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddText = () => {
    if (!customText.trim()) return;
    setTextElements((prev) => [
      ...prev,
      {
        id: `text_${Date.now()}`,
        text: customText,
        color: textColor,
        size: textSize,
        side: activeSide,
        x: 50,
        y: 50,
      },
    ]);
    setCustomText("");
  };

  const handleClearArt = () => {
    if (activeSide === "front") setFrontUploadedImage(null);
    else setBackUploadedImage(null);
    setTextElements((prev) => prev.filter((t) => t.side !== activeSide));
  };

  // WhatsApp Quote Link
  const activeArtUrl = frontUploadedImage || backUploadedImage;
  const whatsappMsg = encodeURIComponent(
    `*Custom Studio Design Enquiry — Asson Clothing Brand*\n\n` +
      `*Garment:* ${selectedProduct.name}\n` +
      `*Colour:* ${currentColor.name}\n` +
      `*Quantity:* ${quantity} pcs\n` +
      `*Print Technique:* ${isEmbroidery ? "Computerized Embroidery" : "HD DTF Print"}\n` +
      `*Print Size:* ${DTF_PRINTS[printSizeKey]?.label || printSizeKey}\n` +
      `*Neck Label:* ${hasNeckLabel ? "Included (Free Branding)" : "None"}\n` +
      `*Unit Price:* ₹${unitPrice} / pc\n` +
      `*Estimated Total:* ₹${total.toLocaleString()} (incl. 5% GST)\n` +
      (activeArtUrl ? `*Artwork:* ${activeArtUrl}\n` : "") +
      `\nPlease review my mockup and confirm order schedule.`
  );

  // Submit quote to MongoDB
  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    setIsSubmitting(true);
    try {
      // 1. Save design session
      const designRes = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          colorName: currentColor.name,
          colorHex: currentColor.hex,
          frontPreviewUrl: frontUploadedImage,
          backPreviewUrl: backUploadedImage,
          uploadedAssets: [frontUploadedImage, backUploadedImage].filter(Boolean),
          printType: isEmbroidery ? "Embroidery" : "DTF",
          printSize: printSizeKey,
          estimatedPrice: total,
          customerPhone,
        }),
      });

      // 2. Save quote record
      await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone: customerPhone,
          email: `${customerPhone}@asson-lead.com`,
          items: [
            {
              productId: selectedProduct.id,
              productName: selectedProduct.name,
              color: currentColor.name,
              quantity,
              printType: isEmbroidery ? "Embroidery" : "DTF",
              printSize: printSizeKey,
              designPreviewUrl: frontUploadedImage || backUploadedImage,
              unitPrice,
              totalPrice: total,
            },
          ],
          subtotal,
          gst: gstAmount,
          total,
          notes: "Generated via Asson Interactive Design Studio",
        }),
      });

      setSubmittedSuccess(true);
    } catch (err) {
      console.error("Quote submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500 text-slate-950">
              <Palette className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              Live Mockup Builder
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Asson Design Studio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload custom artwork, adjust print dimensions, configure volume tiers,
            and get instant factory pricing.
          </p>
        </div>

        {/* View Switcher Pill */}
        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveSide("front")}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSide === "front"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Front View
          </button>
          <button
            onClick={() => setActiveSide("back")}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSide === "back"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Back View
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Canvas Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-100 border border-slate-200 rounded-3xl overflow-hidden aspect-square relative shadow-inner flex items-center justify-center">
            {/* Garment Base Photo */}
            <img
              src={activeGarmentPhoto}
              alt="Custom Apparel Canvas"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Print Placement Zone (Active boundary) */}
            <div
              className="absolute border-2 border-dashed border-amber-400/80 rounded-lg pointer-events-none flex flex-col items-center justify-center"
              style={{
                width: "48%",
                height: "56%",
                top: "22%",
                left: "26%",
              }}
            >
              <span className="absolute top-1 text-[9px] font-bold text-amber-500 bg-black/60 px-2 py-0.5 rounded-full uppercase">
                {activeSide.toUpperCase()} PRINT ZONE (
                {DTF_PRINTS[printSizeKey]?.size || printSizeKey})
              </span>

              {/* Uploaded Artwork Preview on Canvas */}
              {((activeSide === "front" && frontUploadedImage) ||
                (activeSide === "back" && backUploadedImage)) && (
                <div className="relative max-w-[85%] max-h-[85%] overflow-hidden pointer-events-auto group">
                  <img
                    src={
                      (activeSide === "front"
                        ? frontUploadedImage
                        : backUploadedImage) as string
                    }
                    alt="Uploaded Artwork"
                    className="object-contain max-h-56 filter drop-shadow-md"
                  />
                  <button
                    onClick={handleClearArt}
                    title="Remove artwork"
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Rendered Text Overlays */}
              {textElements
                .filter((t) => t.side === activeSide)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      color: item.color,
                      fontSize: `${item.size}px`,
                    }}
                    className="font-extrabold tracking-wider select-none text-center drop-shadow-md my-1"
                  >
                    {item.text}
                  </div>
                ))}
            </div>

            {/* Clear button if art exists */}
            {(frontUploadedImage || backUploadedImage || textElements.length > 0) && (
              <button
                onClick={handleClearArt}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold shadow border border-slate-200 flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear {activeSide}
              </button>
            )}
          </div>

          {/* Color Swatches bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">
              Colour:{" "}
              <strong className="text-slate-900">{currentColor.name}</strong>
            </span>
            <div className="flex gap-2">
              {selectedProduct.colours.map((col, idx) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  title={col.name}
                  style={{ backgroundColor: col.hex }}
                  className={`w-6 h-6 rounded-full border border-black/20 transition ${
                    selectedColorIdx === idx
                      ? "ring-2 ring-amber-500 scale-110 shadow"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls & Pricing */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Garment Selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              1. Select Base Apparel Silhouette
            </span>
            <select
              value={selectedProduct.id}
              onChange={(e) => {
                const p = REVERSE_ENGINEERED_PRODUCTS.find(
                  (prod) => prod.id === e.target.value
                );
                if (p) {
                  setSelectedProduct(p);
                  setSelectedColorIdx(0);
                }
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-900"
            >
              {REVERSE_ENGINEERED_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} (from ₹{prod.basePrice})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Upload Artwork & Add Typography */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              2. Upload Artwork to Cloudinary
            </span>

            <div className="flex gap-3">
              <label className="flex-1 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer transition bg-slate-50">
                <Upload className="w-5 h-5 mx-auto text-slate-500 mb-1" />
                <span className="text-xs font-bold text-slate-700 block">
                  {isUploading ? "Uploading to Cloudinary..." : "Choose PNG / Vector"}
                </span>
                <span className="text-[10px] text-slate-400">
                  Transparent PNG recommended
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Add Custom Text */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Add Custom Typography
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter custom slogan..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                  title="Text color"
                />
                <button
                  type="button"
                  onClick={handleAddText}
                  className="px-3 py-2 bg-brand-900 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition"
                >
                  Add Text
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Print Technique & Placement */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              3. Printing Method & Dimensions
            </span>

            {/* Technique Switch */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsEmbroidery(false)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition ${
                  !isEmbroidery
                    ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                High-Definition DTF
              </button>
              <button
                type="button"
                onClick={() => setIsEmbroidery(true)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition ${
                  isEmbroidery
                    ? "bg-brand-900 text-white border-brand-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Embroidery
              </button>
            </div>

            {/* Print Dimensions Selection */}
            {!isEmbroidery && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 block">
                  Select Print Dimension:
                </label>
                <select
                  value={printSizeKey}
                  onChange={(e) => setPrintSizeKey(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                >
                  {Object.entries(DTF_PRINTS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label} ({item.size}) — +₹
                      {isBulk ? item.bulk : item.single} / pc
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Free Neck Label Checkbox */}
            <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={hasNeckLabel}
                onChange={(e) => setHasNeckLabel(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400"
              />
              <span>Include FREE Custom Brand Neck Label (Branding)</span>
            </label>
          </div>

          {/* Step 4: Quantity & Pricing Summary */}
          <div className="bg-brand-900 text-white rounded-2xl p-6 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-brand-200 uppercase">
                  Order Quantity (Pieces)
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  {quantity >= 10 ? "Wholesale Bulk Rate" : "Sample Rate"}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 10)}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>10 pcs (MOQ)</span>
                <span className="text-white font-extrabold text-sm">
                  {quantity} Pieces
                </span>
                <span>300+ pcs</span>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="pt-3 border-t border-brand-800 space-y-2 text-xs">
              <div className="flex justify-between text-brand-200">
                <span>Base Garment ({quantity} pcs tier):</span>
                <span>₹{baseGarmentPrice} / pc</span>
              </div>
              <div className="flex justify-between text-brand-200">
                <span>Print / Craft Cost:</span>
                <span>+₹{printUnitCost} / pc</span>
              </div>
              <div className="flex justify-between font-bold text-white text-sm pt-1">
                <span>Unit Price:</span>
                <span>₹{unitPrice} / pc</span>
              </div>
              <div className="flex justify-between text-brand-300 text-[11px]">
                <span>GST (5%):</span>
                <span>₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-brand-800">
                <span className="text-sm font-bold text-brand-100">
                  Total Quote:
                </span>
                <span className="text-2xl font-black text-amber-400">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick WhatsApp Share & Order */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs flex items-center justify-center gap-2 transition text-white shadow-lg"
            >
              <PhoneCall className="w-4 h-4" /> Send Design on WhatsApp
            </a>

            {/* Save to MongoDB Quote Drawer */}
            {submittedSuccess ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-center text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
                <FileCheck className="w-4 h-4" /> Quote requested & saved! Our team will contact you.
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="pt-2 space-y-2">
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
                    placeholder="Phone / WhatsApp"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="p-2 rounded-lg bg-brand-950 border border-brand-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 border border-brand-700 text-white font-semibold text-xs transition"
                >
                  {isSubmitting ? "Submitting..." : "Save Design & Get Formal Quote"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DesignStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-xs font-semibold text-slate-500">
          Loading Asson Design Studio...
        </div>
      }
    >
      <DesignStudioContent />
    </Suspense>
  );
}
