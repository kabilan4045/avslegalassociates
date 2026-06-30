"use client";
import { Scale, Trophy, FileSearch } from "lucide-react";

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  Icon: React.ElementType;
  features: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "doubt",
    name: "Legal Doubt Clearance",
    price: 300,
    duration: "10-minute session",
    Icon: Scale,
    features: [
      "Quick answer to your specific legal question",
      "Understand your rights in a particular situation",
      "No documents required",
      "Ideal for: first-time queries & emergency guidance",
    ],
  },
  {
    id: "quick",
    name: "Quick Legal Consultation",
    price: 500,
    duration: "15-minute session",
    Icon: Trophy,
    features: [
      "In-depth review of your legal situation",
      "Case assessment & recommended next steps",
      "Written summary sent to your email after the session",
      "Ideal for: disputes, court notices, family matters",
    ],
    popular: true,
  },
  {
    id: "detailed",
    name: "Detailed Legal Consultation",
    price: 2000,
    duration: "45-minute session",
    Icon: FileSearch,
    features: [
      "Comprehensive case analysis and legal strategy",
      "Document review included",
      "Detailed written advice report within 24 hours",
      "Ideal for: property disputes, criminal & complex cases",
    ],
  },
];

interface PlansProps {
  onSelectPlan: (plan: Plan) => void;
}

export default function Plans({ onSelectPlan }: PlansProps) {
  return (
    <section id="plans" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-950 mb-3">
            Choose Your Consultation
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Select the plan that fits your legal need. All sessions are conducted via a secure
            Google Meet video call.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {PLANS.map((plan) => {
            const { Icon } = plan;
            return (
              <div
                key={plan.id}
                className={`card-hover rounded-2xl border p-6 sm:p-8 flex flex-col ${
                  plan.popular
                    ? "bg-navy-950 border-navy-700 relative overflow-hidden"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="mb-5 sm:mb-6">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                    plan.popular ? "bg-white/10" : "bg-navy-950/8"
                  }`}>
                    <Icon
                      className={`w-6 h-6 ${plan.popular ? "text-gold-400" : "text-navy-950"}`}
                      aria-hidden="true"
                    />
                  </div>
                  <h3
                    className={`text-lg sm:text-xl font-bold mb-1 ${
                      plan.popular ? "text-white" : "text-navy-950"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-end gap-1 mt-3 mb-1">
                    <span
                      className={`text-3xl sm:text-4xl font-extrabold ${
                        plan.popular ? "text-gold-400" : "text-navy-950"
                      }`}
                    >
                      ₹{plan.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      plan.popular ? "text-blue-300/70" : "text-gray-500"
                    }`}
                  >
                    {plan.duration}
                  </p>
                </div>

                <ul className="space-y-3 mb-7 sm:mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-start gap-2 text-sm ${
                        plan.popular ? "text-blue-200/80" : "text-gray-600"
                      }`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 text-[0.85rem] leading-5 ${
                          plan.popular ? "text-gold-400" : "text-green-500"
                        }`}
                      >
                        ✔
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full font-semibold py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-sm sm:text-base ${
                    plan.popular
                      ? "bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold"
                      : "bg-navy-950 hover:bg-navy-800 text-white"
                  }`}
                >
                  Book Now
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
