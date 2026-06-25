import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | AVS Legal Associates — Adv. R. Abirami",
  description: "Terms of Service for AVS Legal Associates. Read our terms before booking an online legal consultation with Adv. R. Abirami.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-[#0f172a]">{title}</h2>
      {children}
    </section>
  );
}

export default function TermsPage() {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: 1 June 2026 &nbsp;·&nbsp; Effective immediately</p>

          <div className="space-y-9 text-[0.95rem] leading-relaxed">

            <Section title="1. Acceptance of Terms">
              <p className="text-gray-600">
                By accessing our website at <strong>avslegal.in</strong> and/or using any of our online legal consultation services, you agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you ("Client", "User", "you") and AVS Legal Associates, operated by Adv. R. Abirami ("Advocate", "we", "us").
              </p>
              <p className="text-gray-600">
                If you do not agree to any part of these terms, you must not use our website or services. We reserve the right to update these terms at any time without prior notice. Continued use of the service constitutes acceptance of any revised terms.
              </p>
            </Section>

            <Section title="2. Description of Services">
              <p className="text-gray-600">
                AVS Legal Associates provides paid online legal consultation services conducted via video call (Google Meet). We offer three consultation tiers:
              </p>
              <div className="space-y-3 mt-2">
                {[
                  ["Legal Doubt Clearance", "₹300", "10 minutes", "A focused Q&A session to answer a specific legal question."],
                  ["Quick Legal Consultation", "₹500", "15 minutes", "An in-depth review of your legal situation with recommended next steps."],
                  ["Detailed Legal Consultation", "₹2,000", "45 minutes", "Comprehensive case analysis, document review, and a written advice report within 24 hours."],
                ].map(([name, price, duration, desc]) => (
                  <div key={name as string} className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                      <p className="font-bold text-[#0f172a] text-sm">{name}</p>
                      <span className="text-xs font-bold text-[#f59e0b] bg-[#0f172a]/5 px-2 py-0.5 rounded-full">{price} · {duration}</span>
                    </div>
                    <p className="text-gray-500 text-sm">{desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="3. No Attorney-Client Relationship">
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
                <p className="text-amber-900 font-semibold text-sm mb-1">Important Notice</p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  The use of our website and booking a paid consultation does <strong>not</strong> create a formal attorney-client relationship. The consultation is an advisory service designed to provide general legal guidance. For formal legal representation, including court filings, appearances, or formal legal opinions, a separate written engagement agreement must be executed.
                </p>
              </div>
              <p className="text-gray-600">
                Information shared during the consultation is treated as confidential per professional privilege standards, but Adv. Abirami is not obligated to act on your behalf beyond the scope of the paid consultation session.
              </p>
            </Section>

            <Section title="4. Booking and Payment">
              <ul className="space-y-2.5 text-gray-600">
                {[
                  "All consultations must be booked and paid in advance through our website.",
                  "Payments are processed securely through Razorpay. We accept UPI, debit/credit cards, and net banking.",
                  "Your booking is confirmed only upon successful payment. You will receive a confirmation email with your Google Meet link.",
                  "Prices are inclusive of all applicable taxes unless otherwise stated.",
                  "All amounts are in Indian Rupees (INR).",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-[#f59e0b] shrink-0 font-bold mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="5. Client Responsibilities">
              <p className="text-gray-600">By booking a consultation, you agree to:</p>
              <ul className="space-y-2.5 text-gray-600 mt-2">
                {[
                  "Provide accurate and truthful information about your legal matter.",
                  "Join the video call on time at your booked appointment slot.",
                  "Prepare a clear and concise summary of your issue in advance.",
                  "For Detailed Consultation plan: share relevant documents via email at least 2 hours before the session.",
                  "Treat the consultation as an advisory session and not as formal legal representation.",
                  "Not record the consultation session without prior written consent.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-green-500 shrink-0 font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="6. Cancellation and Refund">
              <p className="text-gray-600">
                Please refer to our dedicated <Link href="/refund-policy" className="text-blue-600 underline font-medium">Refund Policy</Link> page for complete details on cancellations, rescheduling, and refunds.
              </p>
              <p className="text-gray-600">
                In summary: cancellations made at least 24 hours before the scheduled session are eligible for a full refund. Cancellations with less than 24 hours' notice are non-refundable.
              </p>
            </Section>

            <Section title="7. Limitation of Liability">
              <p className="text-gray-600">
                To the maximum extent permitted by applicable law, AVS Legal Associates and Adv. R. Abirami shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our services, including but not limited to loss of income, loss of data, or adverse legal outcomes following the consultation.
              </p>
              <p className="text-gray-600">
                Our total liability for any claim arising from a consultation service shall not exceed the amount paid for that specific consultation session.
              </p>
            </Section>

            <Section title="8. Intellectual Property">
              <p className="text-gray-600">
                All content on this website, including text, graphics, logos, and service descriptions, is the intellectual property of AVS Legal Associates and is protected by applicable Indian copyright laws. You may not reproduce, distribute, or create derivative works without prior written permission.
              </p>
            </Section>

            <Section title="9. Prohibited Conduct">
              <p className="text-gray-600">You agree not to use our services for:</p>
              <ul className="space-y-2 text-gray-600 mt-2">
                {[
                  "Any unlawful purpose or in violation of any applicable law",
                  "Providing false information to obtain a consultation",
                  "Harassing, abusing, or threatening the advocate or staff",
                  "Attempting to reverse-engineer or exploit our platform",
                  "Recording or distributing consultation content without consent",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-red-400 shrink-0 font-bold mt-0.5">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="10. Governing Law and Jurisdiction">
              <p className="text-gray-600">
                These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these terms or the use of our services shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu, India.
              </p>
            </Section>

            <Section title="11. Contact Information">
              <p className="text-gray-600">For any questions about these Terms of Service:</p>
              <div className="mt-3 bg-[#0f172a]/5 rounded-xl px-5 py-4 text-sm text-gray-700 space-y-1">
                <p><strong>Adv. R. Abirami</strong></p>
                <p>Enrolled Advocate, Madras High Court, Chennai</p>
                <p>Email: <a href="mailto:contact@avslegal.in" className="text-blue-600 underline">contact@avslegal.in</a></p>
              </div>
            </Section>

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
