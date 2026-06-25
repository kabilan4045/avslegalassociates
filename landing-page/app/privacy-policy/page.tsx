import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | AVS Legal Associates — Adv. R. Abirami",
  description: "Privacy Policy for AVS Legal Associates. Learn how we collect, use, and protect your personal data when you book a legal consultation.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-navy-950 sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white font-semibold text-base hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-md bg-[#f59e0b] flex items-center justify-center font-bold text-navy-950 text-xs">RA</div>
            Adv. R. Abirami
          </Link>
          <Link href="/" className="text-blue-200/70 hover:text-white text-sm transition-colors">← Back to Home</Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 sm:px-10 py-10 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] mb-3">Legal Document</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: 1 June 2026 &nbsp;·&nbsp; Effective immediately</p>

          <div className="prose prose-slate max-w-none text-[0.95rem] leading-relaxed space-y-8">

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">1. Introduction</h2>
              <p className="text-gray-600">
                AVS Legal Associates ("we", "our", "us"), operated by Adv. R. Abirami, is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, share, and safeguard your data when you visit our website (<strong>avslegal.in</strong>) or book a legal consultation through our platform.
              </p>
              <p className="text-gray-600 mt-3">
                By using our website or services, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">2. Information We Collect</h2>
              <p className="text-gray-600 mb-3">We collect the following types of personal information:</p>
              <ul className="list-none space-y-2">
                {[
                  ["Identity Information", "Full name, as provided during booking."],
                  ["Contact Information", "Email address and phone number."],
                  ["Payment Information", "Transaction ID and order ID from Razorpay. We do not store card numbers, UPI credentials, or bank account details. All payment data is handled by Razorpay (PCI-DSS compliant)."],
                  ["Consultation Details", "Your legal query or description of the matter you wish to discuss, and your preferred appointment date/time."],
                  ["Technical Information", "IP address, browser type, device type, and pages visited — collected automatically via server logs."],
                ].map(([title, desc]) => (
                  <li key={title as string} className="flex gap-3 text-gray-600">
                    <span className="text-[#f59e0b] font-bold shrink-0 mt-0.5">→</span>
                    <span><strong className="text-[#0f172a]">{title}:</strong> {desc}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-3">We use your personal information solely for the following purposes:</p>
              <ul className="list-none space-y-2">
                {[
                  "To process and confirm your consultation booking",
                  "To schedule your appointment via Cal.com and send you the meeting link",
                  "To send booking confirmation emails and important updates",
                  "To process payments securely via Razorpay",
                  "To respond to your queries or requests for rescheduling or refunds",
                  "To maintain records for legal and accounting compliance",
                  "To improve our website and services based on usage patterns",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-gray-600">
                    <span className="text-green-500 font-bold shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mt-3">
                We do <strong>not</strong> sell, rent, or trade your personal information to any third party for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">4. Third-Party Services</h2>
              <p className="text-gray-600 mb-3">We share your data with the following trusted service providers, only to the extent necessary for providing our services:</p>
              <div className="space-y-3">
                {[
                  ["Razorpay", "Payment processing. Your payment data is governed by Razorpay's Privacy Policy.", "razorpay.com"],
                  ["Cal.com", "Appointment scheduling and calendar management.", "cal.com"],
                  ["Resend", "Transactional email delivery (booking confirmations).", "resend.com"],
                  ["Supabase", "Secure database storage of booking records.", "supabase.com"],
                ].map(([name, desc, domain]) => (
                  <div key={name as string} className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                    <p className="font-semibold text-[#0f172a] text-sm">{name}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{desc} (<a href={`https://${domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{domain}</a>)</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">5. Cookies and Tracking</h2>
              <p className="text-gray-600">
                Our website uses minimal cookies required for session management and security (via NextAuth.js). We may also use standard analytics to understand how visitors use our website. We do not use advertising cookies or cross-site tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">6. Data Retention</h2>
              <p className="text-gray-600">
                We retain your booking and payment records for a minimum of 7 years as required by applicable accounting and tax laws in India. Consultation content and legal queries are retained only as long as necessary for service delivery. You may request deletion of non-legally-required data at any time.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">7. Data Security</h2>
              <p className="text-gray-600">
                We implement industry-standard security measures including HTTPS encryption, secure API communication, and access-controlled databases. While we strive to protect your data, no method of internet transmission is 100% secure. We encourage you to contact us immediately if you suspect any unauthorised access.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">8. Your Rights</h2>
              <p className="text-gray-600 mb-2">Under applicable Indian data protection principles, you have the right to:</p>
              <ul className="list-none space-y-1.5 text-gray-600">
                {[
                  "Access the personal data we hold about you",
                  "Request correction of inaccurate personal data",
                  "Request deletion of your personal data (subject to legal obligations)",
                  "Withdraw consent for data processing at any time",
                  "Lodge a complaint with the relevant authority",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="text-[#f59e0b] shrink-0 mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mt-3">To exercise any of these rights, please email: <strong>contact@avslegal.in</strong></p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">9. Children's Privacy</h2>
              <p className="text-gray-600">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected data from a minor, please contact us and we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">10. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Your continued use of our services after any changes constitutes acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#0f172a] mb-3">11. Contact Us</h2>
              <p className="text-gray-600">For any privacy-related queries or requests:</p>
              <div className="mt-3 bg-[#0f172a]/5 rounded-xl px-5 py-4 text-sm text-gray-700 space-y-1">
                <p><strong>Adv. R. Abirami</strong></p>
                <p>Enrolled Advocate, Madras High Court, Chennai</p>
                <p>Email: <a href="mailto:contact@avslegal.in" className="text-blue-600 underline">contact@avslegal.in</a></p>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
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
