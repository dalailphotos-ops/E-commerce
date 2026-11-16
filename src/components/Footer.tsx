import Link from "next/link";
import { BRAND_NAME, BRAND_TAGLINE, WHATSAPP_NUMBER } from "@/lib/constants";
import { Phone, Mail, MapPin, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-400 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-tr from-accent to-amber-500 flex items-center justify-center font-bold text-white text-lg">
                A
              </div>
              <span className="font-bold text-lg text-white tracking-wider">
                {BRAND_NAME}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {BRAND_TAGLINE}. South India’s custom apparel manufacturing hub
              offering bulk t-shirt production, premium blanks, and
              print-on-demand services.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Low MOQ (10 pcs) · High Quality Cotton · Fast Turnaround
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Products & Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white transition">
                  Blank Apparel Catalog
                </Link>
              </li>
              <li>
                <Link href="/design" className="hover:text-white transition">
                  Interactive Design Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/price-estimator"
                  className="hover:text-white transition"
                >
                  Live Price Estimator
                </Link>
              </li>
              <li>
                <Link
                  href="/bulk-orders"
                  className="hover:text-white transition"
                >
                  Bulk Orders & College Merch
                </Link>
              </li>
              <li>
                <Link href="/printing" className="hover:text-white transition">
                  DTF & Screen Printing
                </Link>
              </li>
            </ul>
          </div>

          {/* Sizing & Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Specs & Guides
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/size-guide" className="hover:text-white transition">
                  Size Guide & Measurements
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-white transition">
                  Request Custom Quote
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Staff Admin Dashboard
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 text-emerald-500 flex items-center gap-1 transition"
                >
                  WhatsApp Direct Inquiry
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / Factory */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Visit & Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span>
                  Asson Clothing Brand, Kerala & South India Manufacturing Facilities
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 80899 63691</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>orders@assonclothing.com</span>
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
