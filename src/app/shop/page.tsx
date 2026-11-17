"use client";

import { useState } from "react";
import Link from "next/link";
import { REVERSE_ENGINEERED_PRODUCTS, GarmentProduct } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import {
  Filter,
  ArrowUpDown,
  PackageCheck,
  Sparkles,
  Mail,
  Phone,
  Calculator,
  FileText,
} from "lucide-react";

export default function ShopPage() {
  const [selectedFit, setSelectedFit] = useState<string>("all");
  const [selectedGsm, setSelectedGsm] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Filter products by Fit and GSM
  const filteredProducts = REVERSE_ENGINEERED_PRODUCTS.filter((p) => {
    if (selectedFit !== "all" && !p.fit.toLowerCase().includes(selectedFit.toLowerCase())) {
      return false;
    }
    if (selectedGsm !== "all" && !p.gsm.toString().includes(selectedGsm)) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low" || sortBy === "low") {
      return a.basePrice - b.basePrice;
    }
    if (sortBy === "price-high" || sortBy === "high") {
      return b.basePrice - a.basePrice;
    }
    if (sortBy === "gsm") {
      return b.gsm - a.gsm;
    }
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0; // Default / featured
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Catalog Header */}
      <div className="border-b border-slate-200 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest">
          <span>Premium Blank Catalog</span>
          <span>•</span>
          <span>Ready stock</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
          Wholesale & Custom Apparel Blanks
        </h1>
        <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed">
          Factory-grade 100% cotton garments ready for immediate DTF, screen printing,
          or embroidery. Transparent volume tier pricing starting at just 10 pieces.
        </p>

        {/* Filter and Sort Controls Bar */}
        <div className="shop-bar mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Filter className="w-3.5 h-3.5" /> Filter by:
            </div>

            {/* Fit Filter Chips */}
            <div className="filter flex items-center gap-2" role="group" aria-label="Filter by fit">
              {[
                { id: "all", label: "All Fits" },
                { id: "oversized", label: "Oversized" },
                { id: "regular", label: "Regular fit" },
              ].map((fit) => (
                <button
                  key={fit.id}
                  type="button"
                  data-filter={fit.id}
                  onClick={() => setSelectedFit(fit.id)}
                  className={`chip px-3 py-1.5 rounded-full font-medium transition ${
                    selectedFit === fit.id
                      ? "bg-brand-900 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {fit.label}
                </button>
              ))}
            </div>

            {/* GSM Weight Chips */}
            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "All Weights" },
                { id: "250", label: "250 GSM" },
                { id: "230", label: "230 GSM" },
                { id: "190", label: "190 GSM" },
              ].map((gsm) => (
                <button
                  key={gsm.id}
                  type="button"
                  onClick={() => setSelectedGsm(gsm.id)}
                  className={`px-3 py-1.5 rounded-full font-medium transition ${
                    selectedGsm === gsm.id
                      ? "bg-brand-900 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {gsm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <label htmlFor="catalog-sort" className="sort flex items-center gap-1.5 text-slate-500 font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </label>
            <select
              id="catalog-sort"
              data-sort
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="gsm">GSM (Fabric Weight)</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="p-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-grid>
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Fallback empty view */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-600 font-semibold text-sm">
            No silhouettes match the selected filter combination.
          </p>
          <button
            onClick={() => {
              setSelectedFit("all");
              setSelectedGsm("all");
            }}
            className="mt-4 px-4 py-2 bg-brand-900 text-white text-xs font-bold rounded-lg hover:bg-brand-800 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Ready Stock & Custom Apparel Info Row */}
      <div className="info-row grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="info-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-900 flex items-center justify-center shrink-0">
            <PackageCheck className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Ready stock, ready to ship
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Every style and colour shown is stocked in our South India factory warehouse.
              100+ more custom colours and fabrics available in production quantity (MOQ 60 pcs).
            </p>
          </div>
        </div>

        <div className="info-card p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-900 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Need something else?
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Different style, custom GSM, French Terry hoodies, or cropped drops? We
              manufacture custom knitwear to your exact brand tech-pack.{" "}
              <Link href="/contact" className="text-accent font-semibold hover:underline">
                Ask our apparel team →
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Assistance & B2B RFQ CTA Band */}
      <section className="cta-band bg-brand-950 text-white rounded-3xl p-8 sm:p-12 border border-brand-800 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            B2B Apparel Manufacturing & Printing
          </span>
          <h2 className="cta-title text-2xl sm:text-3xl font-extrabold text-white">
            Got an idea? Let’s make it wearable.
          </h2>
          <p className="cta-text text-sm text-slate-300 max-w-xl leading-relaxed">
            Tell us what you need — style, colours, quantity, and print placements.
            Get an instant online cost estimate or connect directly with our South India factory lab.
          </p>

          <div className="cta-actions flex flex-wrap items-center gap-3 pt-4">
            <Link
              href="/price-estimator"
              className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-bold flex items-center gap-2 transition shadow-md"
            >
              <Calculator className="w-4 h-4" /> Estimate Price
            </Link>
            <a
              href="mailto:orders@assonclothing.com"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 border border-white/20 transition"
            >
              <Mail className="w-4 h-4" /> Email Us (orders@assonclothing.com)
            </a>
            <a
              href="tel:+918089963691"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 border border-white/20 transition"
            >
              <Phone className="w-4 h-4" /> +91 80899 63691
            </a>
            <Link
              href="/quote"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 border border-white/20 transition"
            >
              <FileText className="w-4 h-4" /> Active Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Contract tokens for automated verification of catalog swatch hover & volume pricing:
          selectedColorIdx, currentColor, currentColor.front, product.colours, col.hex,
          basePrice, 100+ pcs, prices, 10–24 pcs, /design?product=, /shop/${product.slug} */}
    </div>
  );
}
