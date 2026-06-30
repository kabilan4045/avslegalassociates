"use client";
import { Scale, Trophy, FileSearch, Check } from "lucide-react";
import { CONSULTATION_PLANS, type ConsultationType, type PlanDefinition } from "@/lib/types";

const ICONS: Record<ConsultationType, React.ElementType> = {
  doubt:    Scale,
  quick:    Trophy,
  detailed: FileSearch,
};

interface StepPlanProps {
  selected: ConsultationType | null;
  onSelect: (type: ConsultationType) => void;
  onContinue: () => void;
}

export default function StepPlan({ selected, onSelect, onContinue }: StepPlanProps) {
  return (
    <div className="px-5 sm:px-8 pt-6 pb-8 overflow-y-auto">
      <h2 className="text-[1.3rem] font-black text-navy-950 mb-1">Book a Consultation</h2>
      <p className="text-[0.85rem] text-slate-500 mb-6">Choose the consultation that fits your legal need.</p>

      <div className="space-y-3 mb-7">
        {CONSULTATION_PLANS.map((plan: PlanDefinition) => {
          const Icon = ICONS[plan.id];
          const isSelected = selected === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={`w-full text-left rounded-[14px] border-2 px-4 py-4 transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? "border-navy-950 bg-navy-950/5 shadow-[0_0_0_2px_rgba(15,23,42,0.08)]"
                  : "border-slate-200 bg-white hover:border-slate-400"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? "bg-navy-950" : "bg-slate-100"
                }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-slate-500"}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`font-bold text-[0.92rem] leading-snug ${isSelected ? "text-navy-950" : "text-gray-800"}`}>
                        {plan.name}
                      </span>
                    </div>
                    <span className={`font-black text-[1.05rem] shrink-0 ${isSelected ? "text-navy-950" : "text-gray-700"}`}>
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-[0.78rem] text-slate-400 mt-0.5">{plan.duration}</p>
                  <ul className="mt-2 space-y-0.5">
                    {plan.features.slice(0, 2).map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[0.78rem] text-slate-500">
                        <Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-navy-950 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" aria-hidden="true" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        disabled={!selected}
        onClick={onContinue}
        className="w-full py-3.5 rounded-[11px] font-extrabold text-[0.95rem] cursor-pointer transition-colors duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed bg-navy-950 hover:bg-navy-800 text-white"
      >
        Continue →
      </button>
    </div>
  );
}
