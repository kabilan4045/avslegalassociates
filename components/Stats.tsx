"use client";
import { useEffect, useRef, useState } from "react";

interface StatDef {
  target: number;
  suffix: string;
  label: string;
  display?: string; // override animated number with fixed text
}

const STATS: StatDef[] = [
  { target: 500, suffix: "+", label: "Happy Clients" },
  { target: 1000, suffix: "+", label: "Consultations Done" },
  { target: 10, suffix: "+ Yrs", label: "of Practice" },
  { target: 0, suffix: "", label: "Enrolled Advocate", display: "High Court" },
];

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return value;
}

function StatCard({ stat, active, index }: { stat: StatDef; active: boolean; index: number }) {
  const val = useCountUp(stat.target, active, 1800 - index * 120);
  return (
    <div
      className="stat-card-item text-center px-6 py-10 relative cursor-default transition-transform duration-200 hover:-translate-y-1 group"
    >
      <div className="absolute top-0 left-[20%] right-[20%] h-[3px] rounded-sm bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {index < STATS.length - 1 && (
        <div className="absolute right-0 top-[20%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden sm:block" />
      )}
      <strong
        className="block text-navy-950 font-extrabold leading-none mb-2.5 tabular-nums"
        style={{ fontSize: "clamp(2.25rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
      >
        {stat.display ?? val.toLocaleString("en-IN")}
        {!stat.display && <span className="text-gold-400">{stat.suffix}</span>}
      </strong>
      <span className="text-[0.875rem] font-medium text-slate-500 uppercase tracking-[0.03em]">
        {stat.label}
      </span>
    </div>
  );
}

export default function Stats() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="stats" ref={ref} className="py-[72px] bg-[#f8f9fb]">
      <div className="text-center mb-10 px-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">
          By the Numbers
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-navy-950">
          Trusted by Clients Across Tamil Nadu
        </h2>
      </div>
      <div
        className="grid grid-cols-2 sm:grid-cols-4 max-w-[1100px] mx-auto px-6"
        style={{ gap: 0 }}
      >
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} active={active} index={i} />
        ))}
      </div>
    </section>
  );
}
