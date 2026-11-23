"use client";

import Link from "next/link";
import Image from "next/image";
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
  MapPin,
} from "lucide-react";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  BUSINESS_PHONE,
  SUPPORT_EMAIL,
  BUSINESS_LOCATION,
} from "@/lib/constants";
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
          ? "is-scrolled shadow-lg border-b border-[#262626] bg-[#121212]/95 backdrop-blur-md"
          : "border-b border-[#1F1F1F] bg-[#121212]"
      } text-white w-full`}
    >
      {/* Top Announcement Bar */}
      <div className="bg-[#0A0A0A] text-neutral-400 text-xs py-2 px-3 sm:px-6 lg:px-8 border-b border-[#1F1F1F]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
          {/* Left contact info */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs truncate">
            <a
              href="tel:+918089963691"
              className="flex items-center gap-1.5 hover:text-white transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="font-medium text-neutral-200">{BUSINESS_PHONE}</span>
              <span className="sr-only">+91 80899 63691</span>
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="hidden sm:flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors shrink-0"
            >
              <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{SUPPORT_EMAIL}</span>
              <span className="sr-only">orders@assonclothing.com</span>
            </a>
            <span className="hidden lg:flex items-center gap-1 text-[11px] text-neutral-400 shrink-0">
              <MapPin className="w-3 h-3 text-neutral-500" />
              <span>{BUSINESS_LOCATION}</span>
            </span>
          </div>

          {/* Right quick actions */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-mono uppercase tracking-wider shrink-0">
            <Link
              href="/quote"
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="hidden xs:inline">Quote List</span>
              <span
                data-quote-count
                className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-white text-black"
              >
                {displayCount}
              </span>
            </Link>
            <Link
              href="/quote"
              className="hidden sm:inline-flex items-center font-bold text-white hover:text-neutral-300 transition-colors shrink-0 underline underline-offset-4 decoration-neutral-700 hover:decoration-white"
            >
              Get a Quote →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 lg:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative flex items-center">
              <Image
                src="/logo-white.svg"
                alt={BRAND_NAME}
                width={130}
                height={45}
                className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
            {/* Tagline visible only on 2xl screens to avoid squeezing desktop links on 1280px-1440px laptops */}
            <div className="hidden 2xl:block border-l border-neutral-800 pl-3">
              <span className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">
                {BRAND_TAGLINE}
              </span>
              <span className="sr-only">{BRAND_NAME.toUpperCase()}</span>
            </div>
          </Link>

          {/* Desktop Nav: responsive gap and tracking */}
          <nav className="hidden xl:flex items-center gap-2.5 2xl:gap-5 text-[11px] 2xl:text-xs font-mono uppercase tracking-wider 2xl:tracking-widest whitespace-nowrap">
            <Link
              href="/design"
              className="whitespace-nowrap text-white font-bold transition-colors py-1 hover:underline underline-offset-8"
            >
              Design Studio
            </Link>
            <Link
              href="/bulk-orders"
              className="whitespace-nowrap text-neutral-300 hover:text-white transition-colors py-1 hover:underline underline-offset-8"
            >
              Bulk Orders
            </Link>
            <Link
              href="/price-estimator"
              className="whitespace-nowrap text-neutral-300 hover:text-white transition-colors py-1 hover:underline underline-offset-8"
            >
              Price Estimator
            </Link>
            <Link
              href="/contact"
              className="whitespace-nowrap text-neutral-300 hover:text-white transition-colors py-1 hover:underline underline-offset-8"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Link
              href="/quote"
              className="whitespace-nowrap px-2.5 2xl:px-3 py-1.5 2xl:py-2 text-[11px] 2xl:text-xs font-mono uppercase tracking-wider rounded-md bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white border border-neutral-700 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <FileText className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              <span>Quote List</span>
              <span
                data-quote-count
                className="ml-0.5 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold rounded-full bg-white text-black"
              >
                {displayCount}
              </span>
            </Link>

            <Link
              href="/design"
              className="whitespace-nowrap px-3 2xl:px-4 py-1.5 2xl:py-2 text-[11px] 2xl:text-xs font-mono font-bold uppercase tracking-wider rounded-md bg-white hover:bg-neutral-200 text-black shadow transition-all flex items-center gap-1.5 shrink-0"
            >
              <Palette className="w-3.5 h-3.5 shrink-0" />
              <span>Design Studio</span>
            </Link>
          </div>

          {/* Mobile / Tablet Hamburger Toggle */}
          <div className="xl:hidden flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/quote"
              className="md:hidden p-2 rounded-md text-neutral-300 hover:text-white relative"
              aria-label="Quote List"
            >
              <ShoppingBag className="w-5 h-5" />
              <span
                data-quote-count
                className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[15px] h-[15px] text-[9px] font-bold rounded-full bg-white text-black"
              >
                {displayCount}
              </span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-neutral-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-[#0A0A0A] border-t border-[#1F1F1F] px-4 pt-4 pb-6 space-y-2">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1F1F1F] px-1">
            <Image
              src="/logo-white.svg"
              alt={BRAND_NAME}
              width={110}
              height={38}
              className="h-7 w-auto object-contain"
            />
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
              {BRAND_TAGLINE}
            </span>
          </div>
          <Link
            href="/design"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-md text-sm font-mono uppercase tracking-wider text-white hover:bg-[#1A1A1A] flex items-center gap-2 transition-colors font-bold"
          >
            <Palette className="w-4 h-4 text-neutral-400" />
            Design Studio
          </Link>
          <Link
            href="/bulk-orders"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-md text-sm font-mono uppercase tracking-wider text-neutral-200 hover:bg-[#1A1A1A] flex items-center gap-2 transition-colors"
          >
            <Layers className="w-4 h-4 text-neutral-400" />
            Bulk Orders
          </Link>
          <Link
            href="/price-estimator"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-md text-sm font-mono uppercase tracking-wider text-neutral-200 hover:bg-[#1A1A1A] flex items-center gap-2 transition-colors"
          >
            <Calculator className="w-4 h-4 text-neutral-400" />
            Price Estimator
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-md text-sm font-mono uppercase tracking-wider text-neutral-200 hover:bg-[#1A1A1A] transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/quote"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-md text-sm font-mono uppercase tracking-wider text-neutral-200 hover:bg-[#1A1A1A] flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-neutral-400" />
              Quote List
            </span>
            <span
              data-quote-count
              className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-white text-black"
            >
              {displayCount}
            </span>
          </Link>

          <div className="pt-3">
            <Link
              href="/design"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3 rounded-md bg-white text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
            >
              <Palette className="w-4 h-4" /> Start Customizing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
