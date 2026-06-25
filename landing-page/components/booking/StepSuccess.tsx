"use client";
import { CheckCircle, CalendarDays, Clock, ExternalLink, Download, Home } from "lucide-react";
import type { ConsultationType } from "@/lib/types";
import { getPlanByType } from "@/lib/types";
import type { SlotSelection } from "./StepCalendar";

export interface SuccessData {
  meetingUrl:        string | null;
  calBookingUid:     string | null;
  bookingId:         string | null;
  paymentId:         string;
  appointmentDisplay: string;
  calBookingFailed:  boolean;
}

interface StepSuccessProps {
  data: SuccessData;
  consultationType: ConsultationType;
  slot: SlotSelection;
  name: string;
  email: string;
  onClose: () => void;
}

export default function StepSuccess({
  data,
  consultationType,
  slot,
  name,
  email,
  onClose,
}: StepSuccessProps) {
  const plan = getPlanByType(consultationType);

  const handleDownload = () => {
    const content = [
      "==============================================",
      "  AVS LEGAL ASSOCIATES — BOOKING CONFIRMATION",
      "==============================================",
      "",
      `Client Name    : ${name}`,
      `Email          : ${email}`,
      `Consultation   : ${plan.name}`,
      `Date           : ${slot.displayDate}`,
      `Time           : ${slot.displayTime} IST`,
      `Amount Paid    : ₹${plan.price.toLocaleString("en-IN")}`,
      `Payment ID     : ${data.paymentId}`,
      data.calBookingUid ? `Booking UID    : ${data.calBookingUid}` : "",
      data.meetingUrl    ? `Meeting Link   : ${data.meetingUrl}` : "",
      "",
      "Questions? Email: contact@avslegal.in",
      "==============================================",
    ].filter(Boolean).join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `AVS-Legal-Booking-${data.paymentId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-5 sm:px-8 py-8 overflow-y-auto text-center">
      {/* Success icon */}
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-9 h-9 text-green-600" aria-hidden="true" />
      </div>

      <h2 className="text-[1.5rem] font-extrabold text-navy-950 mb-1.5">
        {data.calBookingFailed ? "Payment Confirmed!" : "Booking Confirmed!"}
      </h2>
      <p className="text-slate-500 text-[0.88rem] mb-6 max-w-sm mx-auto">
        {data.calBookingFailed
          ? "Your payment was received. Our team will confirm your slot and send the meeting link to your email shortly."
          : `Your ${plan.name} has been booked. A confirmation email has been sent to ${email}.`
        }
      </p>

      {/* Booking card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl text-left mb-6 overflow-hidden">
        <div className="bg-navy-950 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-[0.9rem]">{plan.name}</p>
            <p className="text-blue-300/60 text-[0.72rem]">{plan.duration}</p>
          </div>
          <span className="text-[#f59e0b] font-black text-[1rem]">
            ₹{plan.price.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="divide-y divide-slate-200">
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
          <div className="px-5 py-2.5">
            <p className="text-[0.68rem] text-slate-400 uppercase font-bold tracking-wide">Payment ID</p>
            <p className="text-[0.78rem] text-slate-500 font-mono mt-0.5">{data.paymentId}</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {data.meetingUrl && !data.calBookingFailed && (
          <a
            href={data.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-[12px] font-bold text-[0.95rem] bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Join Meeting
          </a>
        )}

        <button
          onClick={handleDownload}
          className="w-full py-3.5 rounded-[12px] font-bold text-[0.95rem] bg-slate-100 hover:bg-slate-200 text-navy-950 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download Confirmation
        </button>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-[12px] font-bold text-[0.95rem] bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" aria-hidden="true" />
          Return Home
        </button>
      </div>
    </div>
  );
}
