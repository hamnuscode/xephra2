import React, { useState } from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "WEEKLY",
    price: "PKR 749",
    period: "1 Week",
    features: [
      "Perfect for casual gamers wanting to compete",
      "Access to tournaments for one week",
      "Guaranteed spot and basic prizes",
    ],
    popular: false,
    accent: "#00E5FF",
  },
  {
    name: "MONTHLY",
    price: "PKR 1,499",
    period: "1 Month",
    features: [
      "Perfect for regular gamers with consistent access",
      "Access to all tournaments for one month",
      "Premium tournaments and better prize pools",
    ],
    popular: true,
    accent: "#6D28D9",
  },
  {
    name: "QUARTERLY",
    price: "PKR 3,999",
    period: "3 Months",
    features: [
      "Perfect for serious gamers wanting great value",
      "Access to all tournaments for three months",
      "VIP status, exclusive tournaments, big prizes",
    ],
    popular: false,
    accent: "#FF7A00",
  },
];

export default function PricesV2() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <section className="py-24 px-6" style={{ background: "rgba(6, 9, 25, 0.8)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(255, 122, 0, 0.08)",
              border: "1px solid rgba(255, 122, 0, 0.2)",
              color: "#FF7A00",
              fontFamily: "IBM Plex Mono, monospace",
            }}
          >
            Subscription Plans
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA", letterSpacing: "-0.02em" }}
          >
            Choose Your Plan
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
            Get ready for the ultimate gaming tournament experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="relative rounded-lg p-8 flex flex-col transition-all duration-200"
              style={{
                background: plan.popular ? `rgba(109, 40, 217, 0.08)` : "rgba(15, 23, 42, 0.95)",
                border: plan.popular
                  ? `1px solid rgba(109, 40, 217, 0.5)`
                  : `1px solid rgba(0, 229, 255, 0.12)`,
                boxShadow: plan.popular ? "0 8px 32px rgba(109, 40, 217, 0.2)" : "0 2px 8px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                if (!plan.popular) {
                  e.currentTarget.style.borderColor = `rgba(0,229,255,0.3)`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!plan.popular) {
                  e.currentTarget.style.borderColor = "rgba(0, 229, 255, 0.12)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
                }
              }}
            >
              {/* Most popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                    style={{
                      background: "#00E5FF",
                      color: "#0A0E1A",
                      fontFamily: "IBM Plex Mono, monospace",
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <span
                  className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                  style={{
                    background: `${plan.accent}15`,
                    border: `1px solid ${plan.accent}40`,
                    color: plan.accent,
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  {plan.name}
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div
                  className="text-4xl font-bold mb-1"
                  style={{ fontFamily: "IBM Plex Mono, monospace", color: "#F8F9FA" }}
                >
                  {plan.price}
                </div>
                <div className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                  per {plan.period.toLowerCase()}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feat, fi) => (
                  <li key={fi} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                      style={{ background: `${plan.accent}20`, border: `1px solid ${plan.accent}50` }}
                    >
                      <Check className="w-3 h-3" style={{ color: plan.accent }} />
                    </div>
                    <span className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => { setSelectedPlan(plan); setShowPopup(true); }}
                className="w-full py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-150"
                style={{
                  background: plan.popular
                    ? "#00E5FF"
                    : `${plan.accent}18`,
                  border: `1px solid ${plan.accent}50`,
                  color: plan.popular ? "#fff" : plan.accent,
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.background = `${plan.accent}28`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.background = `${plan.accent}18`;
                  }
                }}
              >
                Purchase Now
              </button>
            </div>
          ))}
        </div>

        <p
          className="text-center mt-12 text-sm"
          style={{ color: "#4B5563", fontFamily: "Inter, sans-serif" }}
        >
          Join thousands of gamers competing for glory and prizes
        </p>
      </div>

      {/* Modal */}
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setShowPopup(false)}
        >
          <div
            className="rounded-lg p-8 w-full max-w-md animate-fade-in"
            style={{
              background: "#0A0E27",
              border: "1px solid rgba(0,229,255,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-xl font-bold"
                style={{ fontFamily: "Poppins, sans-serif", color: "#F8F9FA" }}
              >
                How to Purchase
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F8F9FA")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ol className="space-y-4 mb-8">
              {[
                "Create an account if you haven't already.",
                "Go to the Payment Portal page from your dashboard.",
                "Choose and activate your subscription from there.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: "rgba(0,229,255,0.12)",
                      border: "1px solid rgba(0,229,255,0.3)",
                      color: "#00E5FF",
                      fontFamily: "IBM Plex Mono, monospace",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm" style={{ color: "#9CA3AF", fontFamily: "Inter, sans-serif" }}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>

            <button
              onClick={() => setShowPopup(false)}
              className="btn-primary w-full"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
