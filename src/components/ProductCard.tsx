"use client";

import { useState } from "react";
import Link from "next/link";
import { Palette, ArrowRight } from "lucide-react";
import { GarmentProduct } from "@/lib/constants";

export interface ProductCardProps {
  product: GarmentProduct;
  badge?: string;
  showTiers?: boolean;
}

export function ProductCard({
  product,
  badge,
  showTiers = true,
}: ProductCardProps) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const currentColor = product.colours[selectedColorIdx] || product.colours[0];
  const lowTierPrice =
    product.prices.find((p) => p.min === 10)?.price || product.basePrice;

  // Determine badge if not explicitly passed
  const displayBadge =
    badge ||
    (product.id === "oversized-tee-250-gsm-french-terry"
      ? "Bestseller"
      : product.id === "acid-wash-oversized-tee-250-gsm"
      ? "Trending"
      : product.id === "regular-fit-tee-190-gsm"
      ? "Best Value"
      : null);

  const maxSwatches = 6;
  const visibleColours = product.colours.slice(0, maxSwatches);
  const overflowCount = product.colours.length - maxSwatches;

  return (
    <article
      data-fit={product.fit.toLowerCase()}
      data-price={product.basePrice}
      className="p-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col group"
    >
      {/* Garment Image & Swatches Overlay */}
      <div className="h-72 bg-slate-100 overflow-hidden relative">
        <Link href={`/design?product=${product.id}&color=${encodeURIComponent(currentColor.name)}`} className="block w-full h-full">
          <img
            src={currentColor.front}
            alt={`${product.name} in ${currentColor.name}`}
            className="p-card-photo w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded bg-brand-900/90 text-white text-[11px] font-bold">
            {product.gsm} GSM
          </span>
          {displayBadge && (
            <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-[11px] font-bold shadow-sm uppercase tracking-wide">
              {displayBadge}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-white/90 text-slate-800 text-[11px] font-medium shadow">
          {product.colours.length} colors
        </div>

        {/* Dynamic Color Swatch Selector with Hover, Focus & Click Preview */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
          <div
            className="swatches flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none"
            aria-label="Colours"
          >
            {visibleColours.map((col, idx) => (
              <button
                key={col.name}
                type="button"
                onMouseEnter={() => setSelectedColorIdx(idx)}
                onFocus={() => setSelectedColorIdx(idx)}
                onClick={() => setSelectedColorIdx(idx)}
                title={col.name}
                aria-label={col.name}
                style={{ backgroundColor: col.hex }}
                className={`swatch-dot w-4 h-4 rounded-full border border-white/80 transition transform ${
                  selectedColorIdx === idx
                    ? "ring-2 ring-amber-400 scale-125 z-10"
                    : "hover:scale-110 opacity-90"
                }`}
              />
            ))}
            {overflowCount > 0 && (
              <span className="text-[10px] text-white/90 font-medium pl-0.5">
                +{overflowCount}
              </span>
            )}
          </div>
          <span className="text-[10px] text-white font-semibold truncate max-w-[95px] text-right">
            {currentColor.name}
          </span>
        </div>
      </div>

      {/* Card Body & Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
            {product.fit}
          </span>
          <h3 className="p-card-title text-base font-bold text-slate-900 mt-1 group-hover:text-brand-800 transition-colors">
            <Link href={`/design?product=${product.id}&color=${encodeURIComponent(currentColor.name)}`}>{product.name}</Link>
          </h3>
          <p className="p-card-spec text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.spec}
          </p>

          {/* Pricing breakdown */}
          {showTiers ? (
            <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[10px]">100+ pcs</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  ₹{product.basePrice}
                </span>
                <span className="text-slate-400 text-[10px]"> / pc</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px]">10–24 pcs</span>
                <span className="font-bold text-slate-700 text-sm">
                  ₹{lowTierPrice}
                </span>
                <span className="text-slate-400 text-[10px]"> / pc</span>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-xs text-slate-400 font-medium">From</span>
              <span className="text-xl font-black text-slate-900">
                ₹{product.basePrice}
              </span>
              <span className="text-xs text-slate-400">/ piece</span>
            </div>
          )}
        </div>

        {/* Dual Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
          <Link
            href={`/design?product=${product.id}&color=${encodeURIComponent(currentColor.name)}`}
            className="flex-1 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <Palette className="w-3.5 h-3.5" /> Customize
          </Link>
          <Link
            href={`/design?product=${product.id}&color=${encodeURIComponent(currentColor.name)}`}
            className="flex-1 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs text-center flex items-center justify-center gap-1 transition"
          >
            Design Studio <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
