"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Palette,
  Calculator,
  Layers,
  FileText,
} from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-900 text-white shadow-md border-b border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-accent to-amber-500 flex items-center justify-center font-bold text-xl shadow-lg">
              A
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-wider text-white group-hover:text-amber-300 transition-colors">
                {BRAND_NAME.toUpperCase()}
              </span>
              <span className="block text-[10px] text-brand-300 tracking-widest uppercase">
                The Clothing Lab
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <Link
              href="/shop"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Shop Blank Tees
            </Link>
            <Link
              href="/design"
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-semibold transition-colors"
            >
              <Palette className="w-4 h-4" />
              Design Studio
            </Link>
            <Link
              href="/price-estimator"
              className="text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Price Estimator
            </Link>
            <Link
              href="/bulk-orders"
              className="text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-4 h-4" />
              Bulk Orders
            </Link>
            <Link
              href="/printing"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Printing
            </Link>
            <Link
              href="/size-guide"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Size Guide
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/quote"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-800 text-slate-200 hover:bg-brand-700 hover:text-white border border-brand-700 transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Quote List
            </Link>

            <Link
              href="/design"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition flex items-center gap-1.5"
            >
              <Palette className="w-4 h-4" />
              Design Studio
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-brand-950 border-t border-brand-800 px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/shop"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800"
          >
            Shop Blank Tees
          </Link>
          <Link
            href="/design"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-amber-300 hover:bg-brand-800 flex items-center gap-2"
          >
            <Palette className="w-5 h-5" />
            Design Studio
          </Link>
          <Link
            href="/price-estimator"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800 flex items-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Price Estimator
          </Link>
          <Link
            href="/bulk-orders"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800 flex items-center gap-2"
          >
            <Layers className="w-5 h-5" />
            Bulk Orders
          </Link>
          <Link
            href="/printing"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800"
          >
            Printing Techniques
          </Link>
          <Link
            href="/size-guide"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800"
          >
            Size Guide
          </Link>
          <Link
            href="/quote"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800 flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Quote List
          </Link>

          <div className="pt-3">
            <Link
              href="/design"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-1.5"
            >
              <Palette className="w-4 h-4" /> Start Customizing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
