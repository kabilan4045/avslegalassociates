"use client";
import { CalendarDays } from "lucide-react";

interface FinalCTAProps {
  onBookNow: () => void;
}

export default function FinalCTA({ onBookNow }: FinalCTAProps) {
  return (
    <section className="py-16 sm:py-20 gradient-hero relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Get Legal Clarity?
        </h2>
        <p className="text-blue-200/80 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto">
          Don&apos;t let legal uncertainty slow you down. Book a confidential consultation with
          Adv. R. Abirami today and take the first step towards resolving your matter.
        </p>
        <button
          onClick={onBookNow}
          className="inline-flex items-center justify-center gap-2.5 bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold px-8 sm:px-10 py-4 rounded-xl transition-colors duration-200 text-base sm:text-lg cursor-pointer w-full sm:w-auto max-w-sm sm:max-w-none"
        >
          <CalendarDays className="w-5 h-5 shrink-0" aria-hidden="true" />
          Book My Consultation Now
        </button>
      </div>
    </section>
  );
}
