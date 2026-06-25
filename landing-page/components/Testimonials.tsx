"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const TESTIMONIALS = [
  {
    quote:
      "I had a complicated property dispute that had been dragging on for years. Adv. Abirami reviewed everything in our 45-minute session and gave me a clear roadmap. Her advice was practical, honest, and very affordable. Highly recommended.",
    name: "Suresh R.",
    role: "Property Owner, Chennai",
    initials: "SR",
    color: "bg-navy-950",
  },
  {
    quote:
      "I was served a legal notice and had no idea what to do. I booked a ₹500 consultation with Adv. Abirami and she explained everything clearly in Tamil and English. I felt so much more confident after the call.",
    name: "Meenakshi V.",
    role: "Teacher, Tambaram",
    initials: "MV",
    color: "bg-purple-700",
  },
  {
    quote:
      "My cheque bounce case seemed hopeless before I spoke to Adv. Abirami. She knew the exact sections and strategy needed. The detailed report she sent after the consultation was incredibly thorough. Worth every rupee.",
    name: "Karthikeyan P.",
    role: "Business Owner, Madurai",
    initials: "KP",
    color: "bg-emerald-700",
  },
  {
    quote:
      "The divorce process was emotionally draining and legally confusing. Adv. Abirami was patient, empathetic, and very knowledgeable about family law. She helped me understand my rights and options without any pressure.",
    name: "Name Withheld",
    role: "Family Matter, Chennai",
    initials: "—",
    color: "bg-slate-500",
  },
];

const VerifiedBadge = () => (
  <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-[0.8rem] font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
    <svg className="w-[15px] h-[15px] shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    Verified
  </div>
);

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${color}`}
    >
      {initials}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [modal, setModal] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = TESTIMONIALS.length;

  const goTo = useCallback((n: number) => {
    setCurrent(((n % total) + total) % total);
  }, [total]);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, goTo]);

  const startX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  };

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(null); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  return (
    <section className="py-[72px] pb-16 bg-[#f8faff] overflow-hidden">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.1em] text-gold-400 mb-2">
            Client Stories
          </p>
          <h2
            className="font-extrabold text-navy-950"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}
          >
            What Our Clients Say
          </h2>
        </div>

        <div
          className="relative overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {TESTIMONIALS.map((item, idx) => (
              <div key={idx} className="min-w-full px-1.5 box-border">
                <div
                  className="bg-white border-[1.5px] border-slate-200 rounded-[18px] p-7 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => setModal(idx)}
                >
                  <div className="flex gap-[3px] mb-3.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-gold-400">★</span>
                    ))}
                  </div>
                  <p className="text-[1rem] text-gray-700 leading-[1.65] mb-1.5 line-clamp-3">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <button
                    className="text-navy-600 text-[0.9rem] font-semibold bg-none border-none p-0 cursor-pointer font-sans hover:underline"
                    onClick={(e) => { e.stopPropagation(); setModal(idx); }}
                  >
                    see more...
                  </button>
                  <div className="flex items-center justify-between mt-[22px] flex-wrap gap-2.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={item.initials} color={item.color} />
                      <div>
                        <div className="text-[0.95rem] font-bold text-navy-950">{item.name}</div>
                        <div className="text-[0.78rem] text-slate-500 mt-px">{item.role}</div>
                      </div>
                    </div>
                    <VerifiedBadge />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-[7px] mt-7">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-[6px] rounded-[3px] border-none cursor-pointer p-0 transition-all duration-200 ${
                i === current ? "bg-navy-950 w-10" : "bg-slate-300 w-7"
              }`}
            />
          ))}
        </div>
      </div>

      {modal !== null && (
        <div
          className="fixed inset-0 z-[10000] bg-navy-950/55 backdrop-blur-sm flex items-center justify-center p-6"
          style={{ animation: "fadeIn 0.2s ease" }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}
        >
          <div
            className="bg-white rounded-[20px] p-8 max-w-[540px] w-full shadow-2xl relative max-h-[85vh] overflow-y-auto"
            style={{ animation: "slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <button
              className="absolute top-4 right-4 w-8 h-8 rounded-full border-none bg-slate-100 hover:bg-slate-200 cursor-pointer text-[1.1rem] text-slate-500 flex items-center justify-center transition-colors"
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex gap-[3px] mb-4">
              {[...Array(5)].map((_, i) => <span key={i} className="text-gold-400">★</span>)}
            </div>
            <p className="text-[1rem] text-gray-700 leading-[1.75] mb-6">
              &ldquo;{TESTIMONIALS[modal].quote}&rdquo;
            </p>
            <div className="flex items-center justify-between flex-wrap gap-2.5 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar initials={TESTIMONIALS[modal].initials} color={TESTIMONIALS[modal].color} />
                <div>
                  <div className="text-[0.95rem] font-bold text-navy-950">{TESTIMONIALS[modal].name}</div>
                  <div className="text-[0.78rem] text-slate-500 mt-px">{TESTIMONIALS[modal].role}</div>
                </div>
              </div>
              <VerifiedBadge />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
