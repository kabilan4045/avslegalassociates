const steps = [
  {
    bg: "bg-blue-100",
    number: "01",
    title: "Fill Your Details",
    desc: "Enter your name, phone number, email, and a brief description of your legal query. Takes less than 60 seconds.",
    svg: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="13" height="18" rx="2" fill="#3b82f6" opacity="0.15" />
        <rect x="4" y="2" width="13" height="18" rx="2" stroke="#2563eb" strokeWidth="1.5" />
        <path d="M8 7h7M8 11h7M8 15h4" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="14" y="13" width="6" height="7" rx="1" fill="#fff" stroke="#2563eb" strokeWidth="1.5" />
        <path d="M16 16h2M16 18h2" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    bg: "bg-amber-100",
    number: "02",
    title: "Choose Date & Time",
    desc: "Pick a convenient date and time slot from the available calendar. Morning and evening slots are available.",
    svg: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#f59e0b" opacity="0.2" />
        <circle cx="12" cy="12" r="9" stroke="#d97706" strokeWidth="1.5" />
        <path d="M12 7v5.5l3.5 2" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="1" fill="#d97706" />
      </svg>
    ),
  },
  {
    bg: "bg-green-100",
    number: "03",
    title: "Pay & Confirm",
    desc: "Complete the secure online payment. You will instantly receive a confirmation email with your Google Meet link for the scheduled session.",
    svg: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill="#16a34a" opacity="0.15" stroke="#16a34a" strokeWidth="1.5" />
        <path d="M8 12l3 3 5-5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-[72px]">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="text-center mb-[52px]">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-500 mb-2">
            Simple Process
          </p>
          <h2
            className="font-extrabold text-navy-950"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            Book Your Consultation in 3 Simple Steps
          </h2>
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden sm:flex items-start justify-center">
          {steps.map((step, i) => (
            <div key={step.title} className="contents">
              <div className="flex-1 flex flex-col items-center text-center px-4">
                <div
                  className={`w-[100px] h-[100px] rounded-full flex items-center justify-center mb-5 shrink-0 ${step.bg}`}
                >
                  {step.svg}
                </div>
                <div className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-1">
                  Step {step.number}
                </div>
                <div className="text-[1rem] font-bold text-navy-950 mb-2 leading-[1.3]">
                  {step.title}
                </div>
                <div className="text-[0.875rem] text-gray-500 leading-[1.6] max-w-[200px]">
                  {step.desc}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="flex items-center shrink-0 w-[72px]"
                  aria-hidden="true"
                  style={{ paddingTop: "52px" }}
                >
                  <div style={{ flex: 1, borderTop: "2px dashed #c4cfe0" }} />
                  <div
                    style={{
                      width: 0, height: 0,
                      borderTop: "7px solid transparent",
                      borderBottom: "7px solid transparent",
                      borderLeft: "10px solid #c4cfe0",
                      flexShrink: 0,
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical */}
        <div className="flex flex-col sm:hidden gap-0">
          {steps.map((step, i) => (
            <div key={step.title}>
              <div className="flex items-start gap-5">
                <div
                  className={`w-[80px] h-[80px] rounded-full flex items-center justify-center shrink-0 ${step.bg}`}
                >
                  {step.svg}
                </div>
                <div className="pt-2">
                  <div className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-0.5">
                    Step {step.number}
                  </div>
                  <div className="text-[1.05rem] font-bold text-navy-950 mb-1">{step.title}</div>
                  <div className="text-[0.9rem] text-gray-500 leading-[1.6]">{step.desc}</div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="h-12 flex flex-col"
                  style={{ paddingLeft: "39px" }}
                >
                  <div style={{ flex: 1, borderLeft: "2px dashed #c4cfe0" }} />
                  <div
                    style={{
                      width: 0, height: 0,
                      borderLeft: "7px solid transparent",
                      borderRight: "7px solid transparent",
                      borderTop: "10px solid #c4cfe0",
                      marginLeft: "-6px",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
