import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | AVS Legal Associates — Adv. R. Abirami",
  description: "Refund and cancellation policy for AVS Legal Associates online legal consultations. Learn how to cancel, reschedule, and request a refund.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy-950 sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white font-semibold text-base hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-md bg-[#f59e0b] flex items-center justify-center font-bold text-navy-950 text-xs">RA</div>
            Adv. R. Abirami
          </Link>
          <Link href="/" className="text-blue-200/70 hover:text-white text-sm transition-colors">← Back to Home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 sm:px-10 py-10 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] mb-3">Legal Document</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-2">Refund Policy</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: 1 June 2026 &nbsp;·&nbsp; Effective immediately</p>

          <div className="space-y-9 text-[0.95rem] leading-relaxed">

            {/* Summary cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { emoji: "✓", color: "bg-green-50 border-green-200", title: "Full Refund", desc: "Cancellation ≥ 24 hours before session", textColor: "text-green-700" },
                { emoji: "✕", color: "bg-red-50 border-red-200", title: "No Refund", desc: "Cancellation < 24 hours before session", textColor: "text-red-700" },
                { emoji: "↻", color: "bg-blue-50 border-blue-200", title: "Reschedule", desc: "1 free reschedule with ≥ 12 hours' notice", textColor: "text-blue-700" },
              ].map(({ emoji, color, title, desc, textColor }) => (
                <div key={title} className={`rounded-xl border px-5 py-4 text-center ${color}`}>
                  <p className={`text-2xl font-bold mb-1 ${textColor}`}>{emoji}</p>
                  <p className={`font-bold text-sm mb-1 ${textColor}`}>{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              ))}
            </div>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">1. Overview</h2>
              <p className="text-gray-600">
                At AVS Legal Associates, we understand that plans can change. This Refund Policy explains the conditions under which you may cancel your consultation and receive a refund. Please read it carefully before booking.
              </p>
              <p className="text-gray-600">
                All consultations are prepaid at the time of booking. By completing the payment, you acknowledge that you have read and agreed to this Refund Policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">2. Cancellation & Refund Eligibility</h2>

              <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-5 space-y-2">
                <p className="font-bold text-green-800 flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span>
                  Full Refund — Eligible
                </p>
                <p className="text-green-900 text-sm leading-relaxed">
                  If you cancel your appointment at least <strong>24 hours before</strong> your scheduled session, you are entitled to a full refund of the amount paid. No questions asked.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-5 space-y-2">
                <p className="font-bold text-red-800 flex items-center gap-2">
                  <span className="text-red-600 text-lg">✕</span>
                  No Refund — Not Eligible
                </p>
                <p className="text-red-900 text-sm leading-relaxed">
                  Cancellations made <strong>less than 24 hours</strong> before the scheduled session are non-refundable. This includes cancellations due to change of mind, no-shows, or failure to join the video call.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-5 space-y-2">
                <p className="font-bold text-amber-800 flex items-center gap-2">
                  <span className="text-amber-600 text-lg">↻</span>
                  Technical Issues / Advocate Unavailability
                </p>
                <p className="text-amber-900 text-sm leading-relaxed">
                  If the session cannot proceed due to technical issues on our end, or if the advocate is unavailable for reasons beyond your control, you will be offered a full refund or a free reschedule at your preference.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">3. Rescheduling</h2>
              <ul className="space-y-2.5 text-gray-600">
                {[
                  "One (1) free rescheduling is allowed per booking.",
                  "The reschedule request must be made at least 12 hours before the original appointment time.",
                  "Rescheduling is subject to the advocate's availability.",
                  "If you miss the rescheduled session without prior notice, no further reschedule or refund will be offered.",
                  "To reschedule, email your booking details and preferred new slot to contact@avslegal.in.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-blue-500 shrink-0 font-bold mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">4. How to Request a Refund</h2>
              <p className="text-gray-600">To request a cancellation and refund, follow these steps:</p>
              <ol className="space-y-4 mt-2">
                {[
                  ["Email us", "Send an email to contact@avslegal.in with the subject line: 'Refund Request — [Your Name]'."],
                  ["Include your details", "Provide your full name, registered email address, booking date, Razorpay Payment ID, and reason for cancellation."],
                  ["Confirmation", "We will confirm your cancellation request within 24 hours (business days)."],
                  ["Refund processing", "Approved refunds are processed within 5–7 business days. The amount will be credited to the original payment method used."],
                ].map(([step, desc], i) => (
                  <li key={step as string} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-[#0f172a] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</div>
                    <div>
                      <p className="font-semibold text-[#0f172a] text-sm">{step}</p>
                      <p className="text-gray-600 text-sm mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">5. Refund Timeline</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="text-left px-4 py-3 border border-gray-200 rounded-tl-lg">Scenario</th>
                      <th className="text-left px-4 py-3 border border-gray-200">Eligibility</th>
                      <th className="text-left px-4 py-3 border border-gray-200 rounded-tr-lg">Timeline</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    {[
                      ["Cancel ≥ 24h before", "Full refund", "5–7 business days"],
                      ["Cancel < 24h before", "No refund", "N/A"],
                      ["Advocate cancels", "Full refund or reschedule", "5–7 business days"],
                      ["Technical failure (our side)", "Full refund or reschedule", "5–7 business days"],
                      ["No-show by client", "No refund", "N/A"],
                    ].map(([scenario, eligibility, timeline]) => (
                      <tr key={scenario as string} className="border-b border-gray-100">
                        <td className="px-4 py-3 border border-gray-200">{scenario}</td>
                        <td className={`px-4 py-3 border border-gray-200 font-medium ${(eligibility as string).includes("No") ? "text-red-600" : "text-green-600"}`}>{eligibility}</td>
                        <td className="px-4 py-3 border border-gray-200">{timeline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">6. Non-Refundable Situations</h2>
              <p className="text-gray-600">Refunds will not be issued in the following circumstances:</p>
              <ul className="space-y-2 text-gray-600">
                {[
                  "You were dissatisfied with the legal advice given (consultations are provided in good faith based on the information you share)",
                  "You failed to attend the scheduled session without prior notice",
                  "You provided incorrect contact information and did not receive the meeting link",
                  "The session was completed in full",
                  "Cancellation was requested after the session end time",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-red-400 shrink-0 font-bold mt-0.5">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">7. Contact for Refund Queries</h2>
              <div className="bg-[#0f172a]/5 rounded-xl px-5 py-4 text-sm text-gray-700 space-y-1">
                <p><strong>Adv. R. Abirami — AVS Legal Associates</strong></p>
                <p>Email: <a href="mailto:contact@avslegal.in" className="text-blue-600 underline">contact@avslegal.in</a></p>
                <p className="text-gray-500 text-xs mt-1">Response within 24 hours on business days (Mon–Sat, 9 AM – 6 PM IST)</p>
              </div>
            </section>

          </div>
        </div>
      </main>

      <footer className="bg-navy-950 text-blue-200/50 text-xs py-6 text-center">
        <p>© 2026 Adv. R. Abirami. All rights reserved. &nbsp;|&nbsp;
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link> &nbsp;·&nbsp;
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link> &nbsp;·&nbsp;
          <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link> &nbsp;·&nbsp;
          <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
        </p>
      </footer>
    </div>
  );
}
