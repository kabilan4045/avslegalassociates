"use client";
import { useState, useEffect, useRef } from "react";
import { CalendarDays, Clock, CreditCard, AlertTriangle, ShieldCheck } from "lucide-react";
import type { ConsultationType } from "@/lib/types";
import { getPlanByType } from "@/lib/types";
import type { SlotSelection } from "./StepCalendar";

interface StepCountdownProps {
  consultationType: ConsultationType;
  slot: SlotSelection;
  name: string;
  onPay: () => void;
  onBack: () => void;
  payError: string;
  loading: boolean;
}

const TOTAL_SECONDS = 300; // 5 minutes

export default function StepCountdown({
  consultationType,
  slot,
  name,
  onPay,
  onBack,
  payError,
  loading,
}: StepCountdownProps) {
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const expired = seconds <= 0;
  const plan = getPlanByType(consultationType);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setSeconds(TOTAL_SECONDS);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const pct  = (seconds / TOTAL_SECONDS) * 100;
  const timerColor = seconds > 120 ? "#16a34a" : seconds > 60 ? "#f59e0b" : "#dc2626";

  return (
    <div className="px-5 sm:px-8 pt-6 pb-8 overflow-y-auto">
      <button
        onClick={onBack}
        className="text-slate-400 hover:text-navy-950 text-[0.8rem] font-semibold mb-4 flex items-center gap-1 transition-colors"
        disabled={loading}
      >
        ← Change slot
      </button>

      <h2 className="text-[1.3rem] font-black text-navy-950 mb-1">Complete Your Payment</h2>
      <p className="text-[0.85rem] text-slate-500 mb-5">
        Hi <strong className="text-navy-950">{name}</strong>, review your booking and pay to confirm.
      </p>

      {/* Countdown timer */}
      <div className="mb-5 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span className="text-[0.78rem] font-semibold text-slate-500 uppercase tracking-wide">
              Time to confirm
            </span>
          </div>
          <span
            className="text-[1.6rem] font-black tabular-nums leading-none"
            style={{ color: timerColor }}
          >
            {mins}:{secs}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${pct}%`, backgroundColor: timerColor }}
          />
        </div>

        {expired && (
          <div className="mt-3 flex items-center gap-2 text-[0.78rem] text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            Timer expired — the slot may be taken by someone else. You can still attempt payment.
          </div>
        )}

        {!expired && (
          <p className="mt-2 text-[0.72rem] text-slate-400 text-center">
            Your selected slot will only be confirmed after successful payment.
          </p>
        )}
      </div>

      {/* Booking summary */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="bg-navy-950 px-5 py-3">
          <p className="text-white font-bold text-[0.9rem]">{plan.name}</p>
          <p className="text-blue-300/70 text-[0.75rem]">{plan.duration}</p>
        </div>
        <div className="divide-y divide-slate-100">
          <div className="flex items-center gap-3 px-5 py-3">
            <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-[0.7rem] text-slate-400 uppercase font-bold tracking-wide">Date</p>
              <p className="text-[0.88rem] font-semibold text-navy-950">{slot.displayDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-[0.7rem] text-slate-400 uppercase font-bold tracking-wide">Time</p>
              <p className="text-[0.88rem] font-semibold text-navy-950">{slot.displayTime} IST</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3">
            <CreditCard className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-[0.7rem] text-slate-400 uppercase font-bold tracking-wide">Amount</p>
              <p className="text-[0.88rem] font-semibold text-green-700">
                ₹{plan.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pay error */}
      {payError && !loading && (
        <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[0.8rem] text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{payError}</span>
        </div>
      )}

      {/* Pay button */}
      <button
        onClick={onPay}
        disabled={loading}
        className="w-full py-4 rounded-[12px] font-extrabold text-[1rem] cursor-pointer transition-all duration-200 bg-navy-950 hover:bg-navy-800 text-white flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(15,23,42,0.25)]"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: "spin 0.7s linear infinite" }} />
            Opening payment…
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" aria-hidden="true" />
            Pay ₹{plan.price.toLocaleString("en-IN")} with Razorpay
          </>
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-[0.7rem] text-slate-400 mt-3">
        <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
        Secured by Razorpay · UPI, Cards, Net Banking accepted
      </p>
    </div>
  );
}
