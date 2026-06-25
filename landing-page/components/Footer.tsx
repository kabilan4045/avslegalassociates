import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-blue-200/60 text-sm py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gold-400 flex items-center justify-center font-bold text-navy-950 text-xs">
              RA
            </div>
            <div>
              <span className="text-white font-semibold block leading-tight">Adv. R. Abirami</span>
              <span className="text-[0.7rem] text-blue-200/50 leading-tight">Enrolled Advocate, Madras High Court, Chennai</span>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors duration-200">
              Refund Policy
            </Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors duration-200">
              Disclaimer
            </Link>
          </nav>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2026 Adv. R. Abirami. All rights reserved.</p>
          <p className="text-center">Legal advice provided through this platform does not constitute a formal attorney-client relationship.</p>
        </div>
      </div>
    </footer>
  );
}
