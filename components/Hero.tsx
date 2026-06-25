"use client";
import { BadgeCheck, Lock, CalendarDays, Star } from "lucide-react";

interface HeroProps {
  onBookNow: () => void;
}

const TRUST = [
  { Icon: BadgeCheck, text: "Verified High Court Advocate" },
  { Icon: Lock, text: "Fully Confidential Sessions" },
  { Icon: CalendarDays, text: "Flexible Online Booking" },
  { Icon: Star, text: "Rated 4.8 / 5 by Clients" },
];

export default function Hero({ onBookNow }: HeroProps) {
  return (
    <section
      className="hero-bg min-h-screen flex items-center relative overflow-hidden pt-16"
      id="hero"
    >
      {/* Background watermark — SVG scale, no emoji */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-[70vw] max-w-[600px] opacity-[0.025]"
        >
          <path
            d="M12 3L4 7v5c0 5 3.5 9.7 8 10.9C16.5 21.7 20 17 20 12V7L12 3z"
            fill="#0f172a"
          />
          <path
            d="M3 12h18M12 3v18M6 7l12 10M18 7L6 17"
            stroke="#0f172a"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-[760px] mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center w-full">
        {/* Headline */}
        <h1
          className="font-black text-navy-950 leading-[1.1] tracking-tight mb-4 sm:mb-5"
          style={{ fontSize: "clamp(1.7rem, 5vw, 3.4rem)" }}
        >
          Get Expert Legal Advice from Adv. R. Abirami
        </h1>

        {/* Tagline */}
        <p className="text-slate-600 text-base sm:text-lg leading-[1.7] max-w-[560px] mx-auto mb-6 sm:mb-8">
          Trusted Chennai High Court Advocate — Available for Online Consultations. Get clear,
          confidential legal guidance{" "}
          <strong className="text-navy-950">starting at just ₹300.</strong>
        </p>

        {/* Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 mb-7 sm:mb-9">
          {TRUST.map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-[0.82rem] sm:text-[0.9rem] text-slate-700 font-medium">
              <Icon className="w-4 h-4 text-gold-500 shrink-0" aria-hidden="true" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onBookNow}
          className="inline-flex items-center justify-center bg-navy-950 hover:bg-navy-800 text-white text-base sm:text-[1.1rem] font-bold px-8 sm:px-12 py-4 rounded-[10px] border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 mb-7 sm:mb-8 w-full sm:w-auto max-w-sm tracking-[0.01em]"
        >
          Book Your Consultation Now
        </button>

        {/* Google reviews row */}
        <div className="flex items-center justify-center gap-2.5 mb-4 flex-wrap">
          <div className="w-[28px] h-[28px] rounded-full bg-white border border-slate-200 text-[0.9rem] font-black text-blue-500 flex items-center justify-center shadow-sm shrink-0">
            G
          </div>
          <span className="text-gold-400 tracking-[1px] text-sm">★★★★★</span>
          <span className="text-[0.82rem] text-slate-500 font-medium">
            4.8 / 5 &nbsp;(500+ Reviews)
          </span>
        </div>

        {/* Mini stats bar */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-[0.78rem] sm:text-[0.8rem] text-slate-500 flex-wrap">
          <span>
            <strong className="text-navy-950 font-bold">500+</strong> Happy Clients
          </span>
          <span className="text-slate-300 hidden xs:inline">|</span>
          <span>
            <strong className="text-navy-950 font-bold">1,000+</strong> Consultations Done
          </span>
          <span className="text-slate-300 hidden xs:inline">|</span>
          <span>
            <strong className="text-navy-950 font-bold">10+ Years</strong> of Practice
          </span>
        </div>
      </div>
    </section>
  );
}
