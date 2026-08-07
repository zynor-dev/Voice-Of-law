// src/components/LandingPage/FeaturesBentoSection.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Search,
  Calendar,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Case Management",
    desc: "Track hearings, notes, evidence and status for every case in one dashboard.",
    size: "lg",
  },
  {
    icon: FileText,
    title: "Legal Drafting",
    desc: "Generate professional legal drafts from templates in seconds.",
    size: "sm",
  },
  {
    icon: Search,
    title: "Smart Search",
    desc: "Find relevant case law and statutes instantly with AI-powered semantic search.",
    size: "sm",
  },
  {
    icon: Calendar,
    title: "Calendar Sync",
    desc: "Hearing dates auto-sync to your calendar — never miss a court date.",
    size: "sm",
  },
  {
    icon: ShieldCheck,
    title: "Secure Vault",
    desc: "Encrypted document storage for sensitive case files and evidence.",
    size: "sm",
  },
  {
    icon: BookOpen,
    title: "Legal Library",
    desc: "Access an extensive, verified library of legal books and resources.",
    size: "lg",
  },
];

const FeaturesBentoSection = () => {
  return (
    <section className="py-28 px-6 bg-vol-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex px-4 py-1.5 rounded-full bg-vol-gold-dim text-vol-gold text-xs font-semibold mb-5">
            EVERYTHING YOU NEED
          </div>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl md:text-5xl text-white mb-4"
          >
            One platform. Every legal tool.
          </h2>
          <p className="text-white/50">
            Built for lawyers who demand precision, speed and reliability.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative p-8 rounded-2xl bg-vol-dark2 border border-white/5 hover:border-vol-gold-ring transition-all duration-300 overflow-hidden ${
                f.size === "lg" ? "md:col-span-2" : "md:col-span-1"
              }`}
            >
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-vol-gold/5 rounded-full blur-2xl group-hover:bg-vol-gold/10 transition-all" />
              <div className="relative w-12 h-12 rounded-xl bg-vol-gold-dim flex items-center justify-center mb-6">
                <f.icon className="w-6 h-6 text-vol-gold" />
              </div>
              <h3 className="relative text-xl font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="relative text-white/50 text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBentoSection;
