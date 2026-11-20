"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/lib/constants";

export default function FloatingWhatsApp() {
  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-6 right-6 z-50 print:hidden">
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ASSON Clothing on WhatsApp: ${WHATSAPP_NUMBER}`}
        className="group flex items-center gap-3 bg-[#121212] hover:bg-[#1a1a1a] text-white px-4 py-3 rounded-full border border-neutral-700 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-emerald-500"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 group-hover:bg-emerald-400 transition-colors">
          <MessageCircle className="w-5 h-5 fill-current" />
        </div>
        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-semibold">
            WhatsApp Business
          </span>
          <span className="text-xs font-bold text-white tracking-wide">
            {WHATSAPP_NUMBER}
          </span>
        </div>
      </a>
    </aside>
  );
}
