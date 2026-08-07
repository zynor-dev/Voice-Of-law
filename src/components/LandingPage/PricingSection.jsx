// src/components/LandingPage/PricingSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const perks = [
  "Unlimited AI Legal Queries",
  "Advanced Case Management",
  "Legal Document Drafting",
  "Access to Legal Library",
  "Digital Wallet Integration",
  "Priority Support 24/7",
];

const PricingSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-28 px-6 bg-vol-dark">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex px-4 py-1.5 rounded-full bg-vol-gold-dim text-vol-gold text-xs font-semibold mb-5">
          SIMPLE PRICING
        </div>
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-4xl text-white mb-3"
        >
          Start your free trial
        </h2>
        <p className="text-white/50 mb-12">
          15-day free trial. No credit card required.
        </p>

        <div className="vol-card !bg-vol-dark2 !border-vol-gold-ring p-8 text-left">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-vol-gold-dim text-vol-gold text-xs font-semibold mb-4">
              15-Day Free Trial
            </span>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-white">700</span>
              <span className="text-white/50">PKR/month</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-vol-gold-dim flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-vol-gold" />
                </span>
                <span className="text-white/70 text-sm">{p}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/auth/signup")}
            className="vol-btn-gold w-full !justify-center !py-3"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
