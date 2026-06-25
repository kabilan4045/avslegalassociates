"use client";
import { useEffect, useRef } from "react";

interface MobileCTAProps {
  onBookNow: () => void;
}

export default function MobileCTA({ onBookNow }: MobileCTAProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function shake() {
      const btn = btnRef.current;
      if (!btn) return;
      btn.style.animation = "none";
      void btn.offsetWidth; // force reflow
      btn.style.animation = "mobileShake 0.6s ease, mobilePulse 2.5s ease-in-out infinite";
    }
    const t1 = setTimeout(shake, 2000);
    const t2 = setInterval(shake, 5000);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, []);

  return (
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-[999] pointer-events-none"
      style={{
        padding: "12px 16px max(20px, env(safe-area-inset-bottom)) 16px",
        background: "linear-gradient(to top, rgba(255,255,255,1) 70%, rgba(255,255,255,0))",
      }}
    >
      <button
        ref={btnRef}
        onClick={onBookNow}
        className="flex w-full items-center justify-center gap-2.5 text-white bg-navy-950 font-extrabold text-[1.05rem] border-none rounded-[14px] py-[17px] px-6 cursor-pointer pointer-events-auto relative overflow-hidden"
        style={{
          letterSpacing: "0.01em",
          animation: "mobilePulse 2.5s ease-in-out infinite",
          boxShadow: "0 4px 24px rgba(15,23,42,0.35)",
        }}
      >
        {/* Gloss overlay */}
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)" }}
        />
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        Consult Now
      </button>
      <style>{`
        @keyframes mobilePulse {
          0%,100% { box-shadow: 0 4px 24px rgba(15,23,42,0.35); }
          50%      { box-shadow: 0 6px 32px rgba(15,23,42,0.55); }
        }
        @keyframes mobileShake {
          0%,100% { transform: translateX(0) rotate(0deg); }
          10%     { transform: translateX(-4px) rotate(-1.5deg); }
          20%     { transform: translateX(4px) rotate(1.5deg); }
          30%     { transform: translateX(-3px) rotate(-1deg); }
          40%     { transform: translateX(3px) rotate(1deg); }
          50%     { transform: translateX(-2px) rotate(-0.5deg); }
          60%     { transform: translateX(2px) rotate(0.5deg); }
          70%     { transform: translateX(0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
