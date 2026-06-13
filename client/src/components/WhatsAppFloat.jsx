import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloat() {
  return (
    <a
      className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 z-40 border border-emerald-400/20"
      href="https://wa.me/919829593852?text=Hi%20HomeHub%2C%20I%20would%20like%20to%20book%20a%20consultation."
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <FaWhatsapp size={26} />
    </a>
  );
}
