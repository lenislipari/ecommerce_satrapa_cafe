"use client";

import { MessageCircle } from "lucide-react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493515913367";
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("¡Hola Sátrapa! Quería consultarte algo ☕")}`;

export function WhatsAppFAB() {
  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:bg-[#128C7E] hover:scale-110 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <MessageCircle className="w-7 h-7" strokeWidth={1.75} />
      <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/40 pointer-events-none" />
    </a>
  );
}
