import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-400 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-accent to-amber-500 flex items-center justify-center font-bold text-white text-lg">
                A
              </div>
              <span className="font-bold text-lg text-white tracking-wider">
                {BRAND_NAME}
              </span>
            </div>
            <p className="text-xs font-semibold text-amber-400">
              Asson Clothing Brand — The Clothing Lab
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              {BRAND_TAGLINE}. South India’s custom apparel manufacturing hub
              offering bulk t-shirt production, premium blanks, and
              print-on-demand services.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>South India & Kerala Manufacturing Facilities</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+918089963691" className="hover:text-white transition-colors">
                  +91 80899 63691
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:orders@assonclothing.com" className="hover:text-white transition-colors">
                  orders@assonclothing.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Products & Customization */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Products & Customization
            </h3>
            <ul className="space-y-2.5 text-sm">
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
                  Printing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services & Solutions */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services & Solutions
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dropshipping" className="hover:text-white transition-colors">
                  Dropshipping
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
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
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
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

        <div className="mt-12 pt-8 border-t border-brand-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. Built with Next.js, MongoDB & Cloudinary.</p>
          <div className="flex gap-6">
            <span>GST: 5% Applicable</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
