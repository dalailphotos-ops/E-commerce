"use client";

import { useState } from "react";
import Link from "next/link";
import { REVERSE_ENGINEERED_PRODUCTS, GarmentProduct } from "@/lib/constants";
import { Palette, ArrowRight, Filter } from "lucide-react";

export default function ShopPage() {
  const [selectedFit, setSelectedFit] = useState<string>("all");
  const [selectedGsm, setSelectedGsm] = useState<string>("all");

  const filteredProducts = REVERSE_ENGINEERED_PRODUCTS.filter((p) => {
    if (selectedFit !== "all" && !p.fit.toLowerCase().includes(selectedFit.toLowerCase())) {
      return false;
    }
    if (selectedGsm !== "all" && !p.gsm.includes(selectedGsm)) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8">
        <span className="text-xs font-bold text-accent uppercase tracking-widest">
          Premium Blank Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
          Wholesale & Custom Apparel Blanks
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-2xl">
          Factory-grade 100% cotton garments ready for immediate DTF, screen printing,
          or embroidery. Transparent volume tier pricing starting at just 10 pieces.
        </p>

        {/* Filter Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </div>

          <div className="flex gap-2">
            {["all", "oversized", "regular"].map((fit) => (
              <button
                key={fit}
                onClick={() => setSelectedFit(fit)}
                className={`px-3 py-1.5 rounded-full capitalize font-medium transition ${
                  selectedFit === fit
                    ? "bg-brand-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {fit === "all" ? "All Fits" : `${fit} Fit`}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {["all", "250", "230", "190"].map((gsm) => (
              <button
                key={gsm}
                onClick={() => setSelectedGsm(gsm)}
                className={`px-3 py-1.5 rounded-full font-medium transition ${
                  selectedGsm === gsm
                    ? "bg-brand-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {gsm === "all" ? "All Weights" : `${gsm} GSM`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: GarmentProduct }) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const currentColor = product.colours[selectedColorIdx] || product.colours[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
      {/* Image container */}
      <div className="h-72 bg-slate-100 overflow-hidden relative">
        <img
          src={currentColor.front}
          alt={`${product.name} in ${currentColor.name}`}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-brand-900/90 text-white text-[11px] font-bold">
          {product.gsm}
        </div>

        {/* Color swatches */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <div className="flex items-center gap-1.5">
            {product.colours.map((col, idx) => (
              <button
                key={col.name}
                onClick={() => setSelectedColorIdx(idx)}
                title={col.name}
                style={{ backgroundColor: col.hex }}
                className={`w-4 h-4 rounded-full border border-white/60 transition ${
                  selectedColorIdx === idx ? "ring-2 ring-amber-400 scale-110" : ""
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-white font-medium">
            {currentColor.name}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-accent uppercase">
            {product.fit}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {product.spec}
          </p>

          {/* Pricing mini table */}
          <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] flex justify-between items-center">
            <span className="text-slate-500">100+ pcs:</span>
            <span className="font-extrabold text-slate-900">
              ₹{product.basePrice}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">10–24 pcs:</span>
            <span className="font-bold text-slate-700">
              ₹{product.prices.find((p) => p.min === 10)?.price || product.basePrice}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
          <Link
            href={`/design?product=${product.id}&color=${encodeURIComponent(currentColor.name)}`}
            className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition"
          >
            <Palette className="w-3.5 h-3.5" /> Customize
          </Link>

          <Link
            href={`/shop/${product.slug}`}
            className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold text-center transition"
          >
            Details & Tiers
          </Link>
        </div>
      </div>
    </div>
  );
}
