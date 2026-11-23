"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BRAND_NAME,
  BUSINESS_PHONE,
  SUPPORT_EMAIL,
  BUSINESS_LOCATION,
  INSTAGRAM_HANDLE,
  INSTAGRAM_LINK,
  WHATSAPP_LINK,
  WHATSAPP_NUMBER,
} from "@/lib/constants";
import { Instagram } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#121212] text-neutral-400 border-t border-[#1F1F1F] relative overflow-hidden">
      {/* Large Watermark Logo Background */}
      <div
        aria-hidden="true"
        className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 w-full max-w-6xl pointer-events-none select-none opacity-[0.05] overflow-hidden flex items-center justify-center z-0"
      >
        <Image
          src="/logo-white.svg"
          alt=""
          width={1200}
          height={380}
          className="w-full max-w-5xl h-auto object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Small Logo + Instagram Button */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo-white.svg"
                alt={BRAND_NAME}
                width={130}
                height={45}
                className="h-8 sm:h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
              <span className="sr-only">{BRAND_NAME}</span>
            </Link>

            <div>
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow ${BRAND_NAME} on Instagram (@${INSTAGRAM_HANDLE})`}
                className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-all hover:scale-105"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: QUICK LINKS */}
          <div>
            <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-xs text-neutral-300">
              <li>
                <Link href="/design" className="hover:text-white transition-colors">
                  Design Studio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/bulk-orders" className="hover:text-white transition-colors">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: CONTACT US */}
          <div>
            <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-5">
              Contact Us
            </h3>
            <div className="space-y-2.5 text-xs text-neutral-300">
              <p className="text-neutral-300">{BUSINESS_LOCATION}</p>
              <p>
                <a href={`tel:${WHATSAPP_NUMBER}`} className="hover:text-white transition-colors">
                  {WHATSAPP_NUMBER}
                </a>
              </p>
              <p>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">
                  {SUPPORT_EMAIL}
                </a>
                <span className="sr-only">orders@assonclothing.com</span>
              </p>
              <div className="pt-3">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-neutral-700 hover:border-neutral-400 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-all duration-200"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: OUR STORES */}
          <div>
            <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest mb-5">
              Our Stores
            </h3>
            <div className="space-y-2 text-xs text-neutral-300">
              <p className="font-bold text-white tracking-wide">{BRAND_NAME}</p>
              <p className="text-neutral-400">{BUSINESS_LOCATION}</p>
              <p className="text-neutral-400">South India Manufacturing Hub</p>
              <p className="text-neutral-400">
                <a href={`tel:${WHATSAPP_NUMBER}`} className="hover:text-white transition-colors">
                  {WHATSAPP_NUMBER}
                </a>
              </p>
              <p className="text-neutral-400 text-[11px] pt-1">
                <a href="tel:+918089963691" className="hover:text-white transition-colors">
                  {BUSINESS_PHONE}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-14 pt-6 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} {BRAND_NAME.toUpperCase()}. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-neutral-400">
            <span className="text-neutral-500">GST: 5% Applicable</span>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/about#faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
