// src/components/LandingPage/AIAssistantSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Sparkles } from "lucide-react";

const demoMessages = [
  {
    role: "user",
    text: "What are the grounds for bail under Section 497 CrPC?",
  },
  {
    role: "ai",
    text: "Under Section 497 CrPC, bail may be granted in non-bailable offences if the accused shows reasonable grounds — such as absence of prima facie evidence, delay in trial, or the offence not being punishable with death or life imprisonment...",
  },
];

const AIAssistantSection = () => {
  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* LEFT: Copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vol-gold-dim text-vol-gold text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> AI LEGAL ASSISTANT
          </div>
          <h2
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl md:text-5xl text-vol-dark mb-6 leading-tight"
          >
            Ask anything.
            <br /> Get authoritative answers.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md">
            Trained on Pakistan's legal framework, our AI assistant instantly
            answers case law queries, drafts responses, and explains complex
            statutes in plain language — available 24/7.
          </p>
          <ul className="space-y-3">
            {[
              "Real-time legal Q&A",
              "Context-aware conversation history",
              "Citations from real case law",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-vol-dark2 text-sm font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-vol-gold-dim flex items-center justify-center text-vol-gold text-xs">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: Chat mockup */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="vol-card p-0 overflow-hidden"
        >
          <div className="bg-vol-dark px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-vol-gold flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-vol-dark" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">
                Voice of Law AI
              </p>
              <p className="text-white/40 text-xs">Online now</p>
            </div>
          </div>

          <div className="p-6 space-y-4 bg-gray-50 min-h-[320px]">
            {demoMessages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-vol-dark text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-vol-dark2 rounded-bl-sm shadow-vol-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
            <input
              disabled
              placeholder="Ask a legal question..."
              className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 text-sm text-gray-400 outline-none"
            />
            <button className="w-10 h-10 rounded-full bg-vol-gold flex items-center justify-center flex-shrink-0">
              <Send className="w-4 h-4 text-vol-dark" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIAssistantSection;
