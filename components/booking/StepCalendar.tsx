"use client";
import { useState, useEffect, useCallback } from "react";
import type { CalSlot, ConsultationType } from "@/lib/types";

export interface SlotSelection {
  date: string;        // "YYYY-MM-DD"
  displayDate: string; // "Monday, 10 June 2026"
  time: string;        // ISO UTC from Cal.com
  displayTime: string; // "10:00 AM"
}

interface StepCalendarProps {
  consultationType: ConsultationType;
  onSelect: (slot: SlotSelection) => void;
  onBack: () => void;
}

function buildCalendarDays(year: number, month: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return { days, today, daysInMonth };
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export default function StepCalendar({ consultationType, onSelect, onBack }: StepCalendarProps) {
  const now = new Date();
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selDate,   setSelDate]   = useState<string | null>(null);
  const [slots,     setSlots]     = useState<CalSlot[]>([]);
  const [selTime,   setSelTime]   = useState<CalSlot | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const { days, today } = buildCalendarDays(viewYear, viewMonth);

  // max booking window: 30 days from today
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  const prevMonth = () => {
    if (viewYear === now.getFullYear() && viewMonth === now.getMonth()) return;
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    const limit = new Date(maxDate);
    const limitY = limit.getFullYear();
    const limitM = limit.getMonth();
    if (viewYear > limitY || (viewYear === limitY && viewMonth >= limitM)) return;
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const fetchSlots = useCallback(async (dateISO: string) => {
    setLoading(true);
    setError("");
    setSlots([]);
    setSelTime(null);
    try {
      const res = await fetch(
        `/api/cal/slots?consultationType=${consultationType}&date=${dateISO}`
      );
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to load slots"); return; }
      setSlots(data.slots ?? []);
      if ((data.slots ?? []).length === 0) setError("No slots available on this date. Please try another day.");
    } catch {
      setError("Could not fetch available slots. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [consultationType]);

  const selectDate = (d: number) => {
    const dateISO = `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const dateObj  = new Date(dateISO + "T12:00:00");
    const dayDate  = new Date(dateISO + "T00:00:00");
    if (dayDate <= today) return;
    if (dayDate > maxDate) return;
    setSelDate(dateISO);
    fetchSlots(dateISO);
    return { dateISO, dateObj };
  };

  const handleContinue = () => {
    if (!selDate || !selTime) return;
    const dateObj = new Date(selDate + "T12:00:00");
    onSelect({
      date:        selDate,
      displayDate: dateObj.toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      }),
      time:        selTime.time,
      displayTime: selTime.displayTime,
    });
  };

  return (
    <div className="px-5 sm:px-8 pt-6 pb-8 overflow-y-auto">
      <button
        onClick={onBack}
        className="text-slate-400 hover:text-navy-950 text-[0.8rem] font-semibold mb-4 flex items-center gap-1 transition-colors"
      >
        ← Back
      </button>
      <h2 className="text-[1.3rem] font-black text-navy-950 mb-1">Pick a Date & Time</h2>
      <p className="text-[0.85rem] text-slate-500 mb-5">
        Your slot will be confirmed only after payment.
      </p>

      {/* Calendar header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500"
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="font-bold text-navy-950 text-[0.95rem]">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[0.7rem] font-bold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1 mb-5">
        {days.map((d, i) => {
          if (d === null) return <div key={`e-${i}`} />;
          const dateISO = `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const dayDate = new Date(dateISO + "T00:00:00");
          const isPast  = dayDate <= today;
          const isFar   = dayDate > maxDate;
          const isDisabled = isPast || isFar;
          const isSelected = selDate === dateISO;

          return (
            <button
              key={dateISO}
              disabled={isDisabled}
              onClick={() => selectDate(d)}
              className={`
                mx-auto w-8 h-8 rounded-full text-[0.82rem] font-semibold transition-all duration-150 flex items-center justify-center
                ${isSelected  ? "bg-navy-950 text-white shadow-sm" : ""}
                ${isDisabled  ? "text-slate-300 cursor-not-allowed" : ""}
                ${!isSelected && !isDisabled ? "hover:bg-navy-950/10 text-gray-700 cursor-pointer" : ""}
              `}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* Time slots */}
      {selDate && (
        <div className="mb-5">
          <p className="text-[0.75rem] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Available Times
          </p>

          {loading && (
            <div className="flex items-center justify-center py-6">
              <div
                className="w-6 h-6 border-2 border-slate-200 border-t-navy-950 rounded-full"
                style={{ animation: "spin 0.8s linear infinite" }}
              />
              <span className="ml-2 text-slate-400 text-sm">Loading slots…</span>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-4 text-[0.83rem] text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
              {error}
            </div>
          )}

          {!loading && !error && slots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => {
                const isSel = selTime?.time === s.time;
                return (
                  <button
                    key={s.time}
                    onClick={() => setSelTime(s)}
                    className={`
                      py-2.5 rounded-[10px] text-[0.8rem] font-semibold border-[1.5px] transition-all duration-150 cursor-pointer
                      ${isSel
                        ? "bg-navy-950 text-white border-navy-950 shadow-sm"
                        : "bg-white text-gray-700 border-slate-200 hover:border-navy-950 hover:bg-navy-950/5"
                      }
                    `}
                  >
                    {s.displayTime}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <button
        disabled={!selDate || !selTime || loading}
        onClick={handleContinue}
        className="w-full py-3.5 rounded-[11px] font-extrabold text-[0.95rem] cursor-pointer transition-colors duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed bg-navy-950 hover:bg-navy-800 text-white"
      >
        {selDate && selTime
          ? `Continue → Pay for ${selTime.displayTime} slot`
          : "Select a date and time to continue"}
      </button>
    </div>
  );
}
