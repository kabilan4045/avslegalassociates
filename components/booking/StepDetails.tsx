"use client";
import { useState } from "react";

export interface DetailsForm {
  name: string;
  email: string;
  phone: string;
  query: string;
}

interface StepDetailsProps {
  form: DetailsForm;
  onChange: (form: DetailsForm) => void;
  onContinue: () => void;
  onBack: () => void;
}

function validate(field: string, value: string): string {
  if (field === "name" && value.trim().length < 2) return "Please enter your full name";
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
  if (field === "phone" && !/^[0-9+\-\s()]{10,15}$/.test(value.replace(/\s/g, ""))) return "Please enter a valid phone number";
  return "";
}

const FIELDS = [
  { id: "name",  label: "Full Name",     type: "text",  placeholder: "Your full name",      autoComplete: "name" },
  { id: "email", label: "Email Address", type: "email", placeholder: "you@email.com",       autoComplete: "email" },
  { id: "phone", label: "Mobile Number", type: "tel",   placeholder: "+91 98765 43210",     autoComplete: "tel" },
] as const;

export default function StepDetails({ form, onChange, onContinue, onBack }: StepDetailsProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors: Record<string, string> = {};
  for (const f of FIELDS) errors[f.id] = validate(f.id, form[f.id]);
  const isValid = Object.values(errors).every((e) => !e);

  const handleSubmit = () => {
    setTouched({ name: true, email: true, phone: true });
    if (isValid) onContinue();
  };

  return (
    <div className="px-5 sm:px-8 pt-6 pb-8 overflow-y-auto">
      <button
        onClick={onBack}
        className="text-slate-400 hover:text-navy-950 text-[0.8rem] font-semibold mb-4 flex items-center gap-1 transition-colors"
      >
        ← Back
      </button>
      <h2 className="text-[1.3rem] font-black text-navy-950 mb-1">Your Details</h2>
      <p className="text-[0.85rem] text-slate-500 mb-6">We'll use these to confirm your booking and send your meeting link.</p>

      <div className="space-y-4 mb-5">
        {FIELDS.map((field) => {
          const hasError  = touched[field.id] && !!errors[field.id];
          const hasSuccess = touched[field.id] && !errors[field.id] && !!form[field.id];
          return (
            <div key={field.id}>
              <label className="block text-[0.75rem] font-bold text-gray-700 uppercase tracking-[0.05em] mb-1.5">
                {field.label} <span className="text-red-500">*</span>
              </label>
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                value={form[field.id]}
                onChange={(e) => onChange({ ...form, [field.id]: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, [field.id]: true }))}
                className={`w-full px-3.5 py-3 border-[1.5px] rounded-[10px] text-[0.9rem] font-sans text-navy-950 bg-white outline-none transition-all duration-200
                  ${hasError   ? "border-red-500 shadow-[0_0_0_3px_rgba(220,38,38,0.08)]" : ""}
                  ${hasSuccess ? "border-green-500" : ""}
                  ${!hasError && !hasSuccess ? "border-slate-200 focus:border-navy-950 focus:shadow-[0_0_0_3px_rgba(15,23,42,0.08)]" : ""}
                `}
              />
              {hasError && (
                <p className="text-red-600 text-[0.75rem] mt-1">{errors[field.id]}</p>
              )}
            </div>
          );
        })}

        <div>
          <label className="block text-[0.75rem] font-bold text-gray-700 uppercase tracking-[0.05em] mb-1.5">
            Legal Query <span className="text-slate-400 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Briefly describe your legal issue or question…"
            value={form.query}
            onChange={(e) => onChange({ ...form, query: e.target.value })}
            rows={3}
            className="w-full px-3.5 py-3 border-[1.5px] border-slate-200 rounded-[10px] text-[0.9rem] font-sans text-navy-950 bg-white outline-none resize-none transition-all duration-200 focus:border-navy-950 focus:shadow-[0_0_0_3px_rgba(15,23,42,0.08)]"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-[11px] font-extrabold text-[0.95rem] cursor-pointer transition-colors duration-200 bg-navy-950 hover:bg-navy-800 text-white"
      >
        Continue → Choose Time Slot
      </button>
    </div>
  );
}
