"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Palette,
  Calculator,
  Layers,
  FileText,
  Phone,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { BRAND_NAME } from "@/lib/constants";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const displayCount = mounted ? itemCount : 0;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "is-scrolled shadow-sm border-b border-brand-800 bg-brand-900"
          : "border-b border-brand-800/80 bg-brand-900"
      } text-white`}
    >
      {/* Top Announcement Bar */}
      <div className="bg-[#0b1426] text-slate-200 text-xs py-2 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left contact info */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a
              href="tel:+918089963691"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-accent" />
              <span>+91 80899 63691</span>
            </a>
            <a
              href="mailto:orders@assonclothing.com"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>orders@assonclothing.com</span>
            </a>
          </div>

          {/* Right quick actions */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <Link
              href="/quote"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-300" />
              <span>Quote List</span>
              <span
                data-quote-count
                className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-accent text-white"
              >
                {displayCount}
              </span>
            </Link>
            <Link
              href="/quote"
              className="hidden sm:inline-flex items-center font-semibold text-amber-300 hover:text-amber-200 transition-colors"
            >
              Get a Quote →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-tr from-accent to-amber-500 flex items-center justify-center font-bold text-xl text-white shadow-lg">
              A
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white group-hover:text-amber-300 transition-colors">
                {BRAND_NAME.toUpperCase()}
              </span>
              <span className="block text-[9px] sm:text-[10px] text-brand-300 tracking-widest uppercase">
                The Clothing Lab
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium">
            <Link
              href="/shop"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Shop Blanks
            </Link>
            <Link
              href="/design"
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-semibold transition-colors"
            >
              <Palette className="w-4 h-4" />
              Design Studio
            </Link>
            <Link
              href="/dropshipping"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Dropshipping
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
              href="/price-estimator"
              className="text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Price Estimator
            </Link>
            <Link
              href="/contact"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/quote"
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-brand-800 text-slate-200 hover:bg-brand-700 hover:text-white border border-brand-700 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Quote List</span>
              <span
                data-quote-count
                className="ml-1 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold rounded-full bg-accent text-white"
              >
                {displayCount}
              </span>
            </Link>

            <Link
              href="/design"
              className="px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-colors flex items-center gap-1.5"
            >
              <Palette className="w-4 h-4" />
              <span>Design Studio</span>
            </Link>
          </div>

          {/* Mobile / Tablet Hamburger Toggle */}
          <div className="xl:hidden flex items-center gap-2">
            <Link
              href="/quote"
              className="md:hidden p-2 rounded-md text-slate-300 hover:text-white relative"
              aria-label="Quote List"
            >
              <ShoppingBag className="w-5 h-5" />
              <span
                data-quote-count
                className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[15px] h-[15px] text-[9px] font-bold rounded-full bg-accent text-white"
              >
                {displayCount}
              </span>
            </Link>
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

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-brand-950 border-t border-brand-800 px-4 pt-3 pb-6 space-y-1">
          <Link
            href="/shop"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800 transition-colors"
          >
            Shop Blanks
          </Link>
          <Link
            href="/design"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-amber-300 hover:bg-brand-800 flex items-center gap-2 transition-colors"
          >
            <Palette className="w-5 h-5" />
            Design Studio
          </Link>
          <Link
            href="/dropshipping"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800 transition-colors"
          >
            Dropshipping
          </Link>
          <Link
            href="/bulk-orders"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800 flex items-center gap-2 transition-colors"
          >
            <Layers className="w-5 h-5" />
            Bulk Orders
          </Link>
          <Link
            href="/printing"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800 transition-colors"
          >
            Printing
          </Link>
          <Link
            href="/price-estimator"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800 flex items-center gap-2 transition-colors"
          >
            <Calculator className="w-5 h-5" />
            Price Estimator
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800 transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/quote"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-brand-800 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Quote List
            </span>
            <span
              data-quote-count
              className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-accent text-white"
            >
              {displayCount}
            </span>
          </Link>

          <div className="pt-3">
            <Link
              href="/design"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-amber-400 transition-colors"
            >
              <Palette className="w-4 h-4" /> Start Customizing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
