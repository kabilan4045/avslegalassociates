"use client";
import { useState } from "react";

const FAQS = [
  {
    q: "Is my consultation completely confidential?",
    a: "Yes, absolutely. All consultations are fully protected under attorney-client privilege. Your personal information, case details, and conversation will never be shared with any third party without your explicit written consent.",
  },
  {
    q: "How will the session be conducted?",
    a: "After successful payment, you will receive a Google Meet link via email. Join at your scheduled time from any device — phone, tablet, or laptop. No additional software is needed.",
  },
  {
    q: "Can I consult in Tamil?",
    a: "Yes. Adv. R. Abirami is fluent in Tamil and English and is happy to conduct the session in whichever language you are most comfortable with.",
  },
  {
    q: "What is the refund policy?",
    a: "Cancellations made at least 24 hours before the scheduled session are eligible for a full refund. Cancellations made less than 24 hours before the session are non-refundable. Refunds are processed within 5–7 business days.",
  },
  {
    q: "Can I reschedule?",
    a: "Yes. One free rescheduling is allowed if you request it at least 12 hours before your session. Email your booking details and preferred new slot to reschedule.",
  },
  {
    q: "What should I prepare before the consultation?",
    a: "Have a clear summary of your issue ready. For the Detailed Consultation plan, please share any relevant documents (photos or scanned copies are fine) via email at least 2 hours before the session so the advocate can review them in advance.",
  },
  {
    q: "Is this a formal attorney-client engagement?",
    a: "This is a paid advisory consultation. It provides you with expert legal guidance to help you understand your situation and options. For formal legal representation and filing, a separate engagement agreement is required.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-950 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-lg">Everything you need to know before booking.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-navy-950">{faq.q}</span>
                  <span
                    className="text-2xl leading-none text-gray-400 font-light transition-transform duration-300 shrink-0 ml-4"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-[350ms] ease-in-out"
                  style={{ maxHeight: isOpen ? "400px" : "0" }}
                >
                  <p className="text-gray-600 text-sm pb-5 px-6 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
