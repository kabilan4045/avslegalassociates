import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | AVS Legal Associates — Adv. R. Abirami",
  description: "Legal disclaimer for AVS Legal Associates. Information provided through this platform does not constitute formal legal advice or create an attorney-client relationship.",
};

export default function DisclaimerPage() {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-2">Disclaimer</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: 1 June 2026 &nbsp;·&nbsp; Effective immediately</p>

          {/* Prominent alert */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-5 py-5 mb-10">
            <p className="font-bold text-amber-900 text-base mb-2 flex items-center gap-2">
              <span className="text-2xl">⚠</span>
              Important Notice
            </p>
            <p className="text-amber-800 text-sm leading-relaxed">
              The information and advice provided through AVS Legal Associates — whether through the website, paid consultations, or email communications — is intended for general legal guidance only. It does not constitute formal legal advice and does not create an attorney-client relationship unless a separate written engagement agreement has been executed.
            </p>
          </div>

          <div className="space-y-9 text-[0.95rem] leading-relaxed">

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">1. General Information Disclaimer</h2>
              <p className="text-gray-600">
                The content available on this website, including all text, images, FAQ answers, and blog posts (if any), is for general informational purposes only. While we endeavour to keep information current and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information on this site.
              </p>
              <p className="text-gray-600">
                Laws and regulations in India change frequently. Legal information on this website may not reflect the most current legal developments and should not be relied upon as a substitute for professional legal advice tailored to your specific situation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">2. No Attorney-Client Relationship</h2>
              <p className="text-gray-600">
                Using this website, filling out our booking form, or completing a paid consultation session does <strong>not</strong> establish an attorney-client relationship between you and Adv. R. Abirami or AVS Legal Associates.
              </p>
              <p className="text-gray-600">
                An attorney-client relationship is only formed when both parties have explicitly agreed to it in writing through a formal engagement agreement. Until such an agreement is in place, communications through this platform are not protected by attorney-client privilege in the formal legal sense.
              </p>
              <p className="text-gray-600">
                Our paid consultations are <strong>advisory sessions</strong> — designed to help you understand your legal situation and options, not to represent you in any legal proceedings.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">3. Limitation of Legal Advice</h2>
              <p className="text-gray-600">
                Legal advice provided during a paid consultation is based solely on the information and documents shared by the client during or before the session. Adv. Abirami will provide her best professional opinion based on the facts presented, but:
              </p>
              <ul className="space-y-2.5 text-gray-600 mt-2">
                {[
                  "The advice is specific to the facts you have disclosed and may not apply if facts change or additional information comes to light.",
                  "Legal outcomes are never guaranteed. Every legal situation is unique and courts have discretion in their decisions.",
                  "The consultation does not include filing of court documents, appearances on your behalf, or formal representation.",
                  "For complex matters, formal engagement with a legal team may be recommended after the consultation.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-amber-500 shrink-0 font-bold mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">4. Jurisdictional Disclaimer</h2>
              <p className="text-gray-600">
                Adv. R. Abirami is enrolled with the Bar Council of Tamil Nadu and Puducherry and is authorised to practise law in India. The legal advice provided is based on Indian law, specifically as applicable in Tamil Nadu and before the Madras High Court.
              </p>
              <p className="text-gray-600">
                If you are seeking advice on matters governed by the laws of other countries or jurisdictions, please note that this service may not be appropriate for your needs. You are advised to consult a lawyer qualified in the relevant jurisdiction.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">5. Accuracy and Updates</h2>
              <p className="text-gray-600">
                We make every effort to ensure the accuracy of information provided on this website and during consultations. However, Indian law is subject to frequent amendments, judicial interpretations, and new precedents. We do not accept responsibility for any reliance placed on information that has become outdated since it was provided.
              </p>
              <p className="text-gray-600">
                We reserve the right to update this disclaimer at any time. Continued use of our services after any changes constitutes acceptance of the revised disclaimer.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">6. Third-Party Links</h2>
              <p className="text-gray-600">
                Our website may contain links to third-party websites (such as Razorpay, Cal.com, or Google Meet). These links are provided for your convenience and do not signify our endorsement of those websites. We have no control over the content of linked sites and accept no responsibility for any loss or damage that may arise from your use of them.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">7. Limitation of Liability</h2>
              <p className="text-gray-600">
                To the fullest extent permitted by applicable law, AVS Legal Associates and Adv. R. Abirami disclaim all liability for any loss or damage — including without limitation, indirect or consequential loss or damage — arising out of or in connection with the use of this website or reliance on information provided through our consultation services.
              </p>
              <p className="text-gray-600">
                Nothing in this disclaimer excludes or limits liability for fraud, fraudulent misrepresentation, or any other liability that cannot be excluded or limited under applicable Indian law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">8. Bar Council Compliance</h2>
              <p className="text-gray-600">
                In compliance with the Bar Council of India Rules, we confirm that:
              </p>
              <ul className="space-y-2 text-gray-600 mt-2">
                {[
                  "This website does not constitute advertising in the traditional sense but is a platform to facilitate access to legal consultation services.",
                  "The content on this website has been created strictly for informational purposes.",
                  "There is no guarantee of business or outcomes by way of this website.",
                  "We do not receive any commission or incentive for referring clients to other advocates or services.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-green-500 shrink-0 font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#0f172a]">9. Contact</h2>
              <p className="text-gray-600">If you have any questions about this disclaimer:</p>
              <div className="mt-3 bg-[#0f172a]/5 rounded-xl px-5 py-4 text-sm text-gray-700 space-y-1">
                <p><strong>Adv. R. Abirami — AVS Legal Associates</strong></p>
                <p>Enrolled Advocate, Madras High Court, Chennai</p>
                <p>Email: <a href="mailto:contact@avslegal.in" className="text-blue-600 underline">contact@avslegal.in</a></p>
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
