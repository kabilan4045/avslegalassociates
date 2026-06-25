"use client";
import { useState, useEffect } from "react";

interface NavbarProps {
  onBookNow: () => void;
}

export default function Navbar({ onBookNow }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 border-b border-white/10 transition-all duration-200 ${
        scrolled ? "bg-navy-950/98 backdrop-blur-sm" : "bg-navy-950/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold-400 flex items-center justify-center font-bold text-navy-950 text-xs">
            RA
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Adv. R. Abirami
          </span>
        </div>
        <button
          onClick={onBookNow}
          className="hidden sm:inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors duration-200"
        >
          Book Consultation
        </button>
      </div>
    </nav>
  );
}
