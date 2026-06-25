import { Scale, Users, Gavel, ShoppingCart, FileText, Building2 } from "lucide-react";

const specialisations = [
  { Icon: Scale,        label: "Civil & Property Law" },
  { Icon: Users,        label: "Family Law (Divorce, Custody, Maintenance)" },
  { Icon: Gavel,        label: "Criminal Law & Bail Matters" },
  { Icon: ShoppingCart, label: "Consumer Disputes" },
  { Icon: FileText,     label: "Cheque Bounce & Negotiable Instruments" },
  { Icon: Building2,    label: "Labour & Service Matters" },
];

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center gap-10 sm:gap-12">
          {/* Photo */}
          <div className="shrink-0">
            <div className="relative">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-navy-950/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/advocate.png"
                  alt="Adv. R. Abirami"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gold-400 text-navy-950 font-bold text-xs px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
                10+ Years Experience
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="mt-6 md:mt-0">
            <div className="inline-block text-gold-500 font-semibold text-sm uppercase tracking-widest mb-3">
              About the Advocate
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-950 mb-4 sm:mb-5">
              Adv. R. Abirami
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
              Adv. R. Abirami is a practising advocate at the Madras High Court, Chennai, with
              deep expertise in civil, family, property, and criminal matters. She is known for
              her clear, client-focused approach — breaking down complex legal situations into
              practical steps that clients can actually act on.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
              Whether you are dealing with a property dispute, a family matter, a consumer
              grievance, or any criminal issue, Adv. Abirami provides honest, well-researched
              legal advice tailored to your specific situation.
            </p>
            <div className="mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Specialisations
              </p>
              <div className="flex flex-wrap gap-2">
                {specialisations.map(({ Icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 bg-navy-950/5 text-navy-950 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg"
                  >
                    <Icon className="w-3.5 h-3.5 text-navy-700 shrink-0" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
