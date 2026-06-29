"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { ConsultationType } from "@/lib/types";
import { CONSULTATION_PLANS, getPlanByType } from "@/lib/types";
import type { Plan } from "@/components/Plans";
import StepPlan from "./booking/StepPlan";
import StepDetails, { type DetailsForm } from "./booking/StepDetails";
import StepCalendar, { type SlotSelection } from "./booking/StepCalendar";
import StepCountdown from "./booking/StepCountdown";
import StepSuccess, { type SuccessData } from "./booking/StepSuccess";

interface BookingModalProps {
  plan: Plan | null;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;
// 1 = plan selection
// 2 = user details
// 3 = calendar slot picker
// 4 = payment countdown
// 5 = success

declare global {
  interface Window {
    Razorpay: new (opts: object) => {
      open: () => void;
      on: (event: string, cb: (resp: { error?: { description?: string } }) => void) => void;
    };
  }
}

function planToConsultationType(planName: string): ConsultationType {
  if (/detailed/i.test(planName)) return "detailed";
  if (/quick/i.test(planName)) return "quick";
  return "doubt";
}

function ProgressBar({ step }: { step: Step }) {
  const labels = ["Plan", "Details", "Schedule", "Payment"];
  const activeStep = Math.min(step, 4) as 1 | 2 | 3 | 4;
  return (
    <div className="flex items-center pl-5 sm:pl-8 pr-12 sm:pr-14 pt-6 pb-4 shrink-0 gap-0">
      {labels.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4;
        const done    = activeStep > n;
        const current = activeStep === n;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-extrabold transition-all duration-300 ${
                  done    ? "bg-green-500 text-white" :
                  current ? "bg-navy-950 text-white shadow-[0_0_0_3px_rgba(15,23,42,0.12)]" :
                            "bg-slate-200 text-slate-400"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span className={`text-[0.6rem] font-semibold hidden sm:block ${
                current ? "text-navy-950" : done ? "text-green-600" : "text-slate-400"
              }`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1.5 mb-4 transition-colors duration-300 ${
                activeStep > n ? "bg-green-500" : "bg-slate-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BookingModal({ plan, onClose }: BookingModalProps) {
  // Derive initial consultation type from passed plan prop
  const initType: ConsultationType = plan
    ? planToConsultationType(plan.name)
    : "quick";

  const [step,             setStep]           = useState<Step>(1);
  const [consultationType, setConsultationType] = useState<ConsultationType | null>(initType);
  const [form,             setForm]            = useState<DetailsForm>({ name: "", email: "", phone: "", query: "" });
  const [slot,             setSlot]            = useState<SlotSelection | null>(null);
  const [loading,          setLoading]         = useState(false);
  const [payError,         setPayError]        = useState("");
  const [success,          setSuccess]         = useState<SuccessData | null>(null);

  // Refs for Razorpay handler closure
  const formRef   = useRef(form);
  const slotRef   = useRef(slot);
  const typeRef   = useRef(consultationType);
  const loadingRef = useRef(false);
  useEffect(() => { formRef.current = form; }, [form]);
  useEffect(() => { slotRef.current = slot; }, [slot]);
  useEffect(() => { typeRef.current = consultationType; }, [consultationType]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape" && !loading) onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose, loading]);

  const triggerRazorpay = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setPayError("");
    setLoading(true);

    const currentForm = formRef.current;
    const currentSlot = slotRef.current;
    const currentType = typeRef.current ?? "quick";
    const planDef     = getPlanByType(currentType);

    // 1. Create Razorpay order
    let orderId = "", amount = planDef.paise, key = "";
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationType: currentType,
          name:             currentForm.name,
          email:            currentForm.email,
          phone:            currentForm.phone,
          query:            currentForm.query,
          selectedDate:     currentSlot?.date    || "",
          selectedTime:     currentSlot?.displayTime || "",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        orderId = data.orderId || "";
        amount  = data.amount  || amount;
        key     = data.key     || "";
      }
    } catch {
      setLoading(false);
      loadingRef.current = false;
      setPayError("Unable to reach payment server. Please try again.");
      return;
    }

    if (!key) {
      setLoading(false);
      loadingRef.current = false;
      setPayError("Payment configuration error. Please try again.");
      return;
    }

    // 2. Open Razorpay checkout
    const rzpOpts = {
      key,
      amount,
      currency: "INR",
      name:        "AVS Legal Associates",
      description: planDef.name,
      order_id:    orderId || undefined,
      prefill: {
        name:    currentForm.name,
        email:   currentForm.email,
        contact: currentForm.phone,
      },
      theme: { color: "#0f172a" },
      modal: {
        ondismiss() {
          setLoading(false);
          loadingRef.current = false;
          setPayError("Payment was cancelled. You can try again.");
        },
      },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        // 3. Verify payment + create Cal.com booking
        try {
          const vRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_signature:  response.razorpay_signature,
              name:                currentForm.name,
              email:               currentForm.email,
              phone:               currentForm.phone,
              consultationType:    currentType,
              planName:            planDef.name,
              query:               currentForm.query,
              amount,
              selectedDate:        currentSlot?.date        || "",
              selectedTime:        currentSlot?.displayTime || "",
            }),
          });

          const vData = vRes.ok ? await vRes.json() : {};
          setSuccess({
            meetingUrl:         vData.meetingUrl        || null,
            calBookingUid:      vData.calBookingUid     || null,
            bookingId:          vData.bookingId         || null,
            paymentId:          response.razorpay_payment_id,
            appointmentDisplay: vData.appointmentDisplay || "",
            calBookingFailed:   vData.calBookingFailed   || false,
          });
        } catch {
          // Show success regardless — payment went through
          setSuccess({
            meetingUrl:         null,
            calBookingUid:      null,
            bookingId:          null,
            paymentId:          response.razorpay_payment_id,
            appointmentDisplay: "",
            calBookingFailed:   true,
          });
        }

        setLoading(false);
        loadingRef.current = false;
        setStep(5);
      },
    };

    try {
      const rzp = new window.Razorpay(rzpOpts);
      rzp.on("payment.failed", (resp) => {
        setLoading(false);
        loadingRef.current = false;
        setPayError(resp.error?.description || "Payment failed. Please try again.");
      });
      rzp.open();
    } catch {
      setLoading(false);
      loadingRef.current = false;
      setPayError("Could not open payment window. Please try again.");
    }
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[1000] bg-navy-950/65 backdrop-blur-[3px] flex items-center justify-center p-3 sm:p-4"
      style={{ animation: "fadeIn 0.22s ease" }}
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Book a consultation"
    >
      <div
        className="bg-white rounded-[20px] w-full shadow-2xl flex flex-col relative overflow-hidden"
        style={{
          maxWidth:  step === 5 ? "480px" : "500px",
          maxHeight: "min(94vh, 780px)",
          animation: "slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => { if (!loading) onClose(); }}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full border-none bg-slate-100 hover:bg-slate-200 cursor-pointer flex items-center justify-center text-slate-500 z-20 transition-colors"
          aria-label="Close"
          disabled={loading}
        >
          ×
        </button>

        {/* Progress bar (hidden on success) */}
        {step < 5 && <ProgressBar step={step} />}

        {/* Step content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {step === 1 && (
            <StepPlan
              selected={consultationType}
              onSelect={setConsultationType}
              onContinue={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepDetails
              form={form}
              onChange={setForm}
              onContinue={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && consultationType && (
            <StepCalendar
              consultationType={consultationType}
              onSelect={(s) => { setSlot(s); setStep(4); }}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && slot && consultationType && (
            <StepCountdown
              consultationType={consultationType}
              slot={slot}
              name={form.name}
              onPay={triggerRazorpay}
              onBack={() => { setPayError(""); setStep(3); }}
              payError={payError}
              loading={loading}
            />
          )}

          {step === 5 && success && consultationType && slot && (
            <StepSuccess
              data={success}
              consultationType={consultationType}
              slot={slot}
              name={form.name}
              email={form.email}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
