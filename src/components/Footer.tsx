"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  BUSINESS_PHONE,
  SUPPORT_EMAIL,
  BUSINESS_LOCATION,
  INSTAGRAM_HANDLE,
  INSTAGRAM_LINK,
} from "@/lib/constants";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#0A0A0A] text-neutral-400 border-t border-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <Image
                src="/logo-white.svg"
                alt={BRAND_NAME}
                width={130}
                height={38}
                className="h-8 sm:h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
              <span className="sr-only">{BRAND_NAME}</span>
            </Link>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-300">
              {BRAND_TAGLINE}
            </p>
            <p className="text-xs leading-relaxed text-neutral-400">
              International streetwear manufacturing lab based in {BUSINESS_LOCATION}. Heavyweight blanks, 250 GSM French Terry, acid wash drops, custom prints, and fast pan-India delivery from our South India manufacturing facilities.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                <span>{BUSINESS_LOCATION}, South India Manufacturing Facilities</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href="tel:+918089963691" className="hover:text-white transition-colors">
                  {BUSINESS_PHONE} / +91 80899 63691
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">
                  {SUPPORT_EMAIL}
                </a>
                <span className="sr-only">orders@assonclothing.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-neutral-400 shrink-0" />
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @{INSTAGRAM_HANDLE}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Products & Customization */}
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4">
              Products & Drops
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Shop Blanks
                </Link>
              </li>
              <li>
                <Link href="/design" className="hover:text-white transition-colors">
                  Design Studio
                </Link>
              </li>
              <li>
                <Link href="/price-estimator" className="hover:text-white transition-colors">
                  Price Estimator
                </Link>
              </li>
              <li>
                <Link href="/bulk-orders" className="hover:text-white transition-colors">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/printing" className="hover:text-white transition-colors">
                  Printing Techniques
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services & Solutions */}
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4">
              Streetwear Solutions
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/dropshipping" className="hover:text-white transition-colors">
                  Dropshipping & POD
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Decoration Services
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-white transition-colors">
                  Request a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company & Legal */}
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#1F1F1F] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. {BRAND_TAGLINE}.</p>
          <div className="flex gap-6">
            <span>GST: 5% Applicable</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
