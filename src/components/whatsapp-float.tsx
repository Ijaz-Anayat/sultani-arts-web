"use client";

import { MessageCircle } from "lucide-react";
import { SITE_CONTACT } from "@/lib/constants";

export function WhatsAppFloat() {
  return (
    <a
      href={SITE_CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 left-5 z-[75] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_32px_-8px_rgba(37,211,102,0.65)] transition-transform hover:scale-105 hover:bg-[#20bd5a] sm:bottom-6 sm:left-6"
    >
      <MessageCircle size={26} strokeWidth={1.8} fill="currentColor" />
    </a>
  );
}
