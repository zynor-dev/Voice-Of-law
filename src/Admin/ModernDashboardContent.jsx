import React, { useState, useEffect, useRef } from "react";
import {
  FaGavel,
  FaEdit,
  FaArrowRight,
  FaShieldAlt,
  FaFileContract,
  FaBrain,
  FaRegCommentDots,
} from "react-icons/fa";
import { userAPI } from "../services/api";

// ─── Theme tokens ─────────────────────────────────────────────
const GOLD = "#C79F44";
const GOLD_LIGHT = "#f0d98a";
const GOLD_DIM = "rgba(199,159,68,0.12)";
const GOLD_BORDER = "rgba(199,159,68,0.25)";
const DARK = "#1a1a1a";
const DARK2 = "#222222";
const CARD_BG = "#ffffff";

const ModernDashboardContent = ({ setActiveMenu }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatedCards, setAnimatedCards] = useState([]);
  const onboardingCheckDone = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedCards([0, 1, 2, 3, 4, 5]), 80);
    return () => clearTimeout(t);
  }, []);

  const handleCardClick = (menuItem) => {
    if (setActiveMenu) setActiveMenu(menuItem);
  };

  const quickActions = [
    {
      id: "case-handling",
      title: "Case Handling",
      icon: <FaGavel />,
      desc: "Manage and track all your active legal cases with full visibility.",
      menuItem: "My Cases",
    },
    {
      id: "drafting",
      title: "Legal Drafting",
      icon: <FaEdit />,
      desc: "Create professional legal documents powered by AI templates.",
      menuItem: "AI Legal Assistant",
    },
    {
      id: "vault",
      title: "Document Vault",
      icon: <FaFileContract />,
      desc: "Securely store, organise and retrieve all case documents.",
      menuItem: "Document Uploads & Vault",
    },
  ];

  const badges = [
    { label: "AI-Powered", icon: <FaBrain />, bg: GOLD_DIM, color: GOLD },
    {
      label: "Secure Vault",
      icon: <FaShieldAlt />,
      bg: "rgba(30,100,60,0.08)",
      color: "#2d7a50",
    },
    {
      label: "Real-time Updates",
      icon: <FaRegCommentDots />,
      bg: "rgba(30,60,120,0.08)",
      color: "#2d4fa0",
    },
  ];

  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 pb-8">
      {/* ── HERO GRID ─────────────────────────────────────────── */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-5 ${
          animatedCards.includes(0) ? "vol-animate-in" : "opacity-0"
        }`}
      >
        {/* AI Assistant CTA card */}
        <button
          type="button"
          onClick={() => handleCardClick("AI Legal Assistant")}
          className="group relative flex flex-col items-center justify-center text-center min-h-[240px] sm:min-h-[270px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          style={{
            background: `linear-gradient(145deg, ${DARK} 0%, #2c2c2c 100%)`,
            border: `1px solid ${GOLD_BORDER}`,
          }}
        >
          {/* Subtle gold glow behind icon */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: GOLD }}
          />
          <div className="relative z-10 flex flex-col items-center gap-4 p-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
              style={{
                background: GOLD_DIM,
                border: `1px solid ${GOLD_BORDER}`,
                color: GOLD,
              }}
            >
              <FaBrain />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight">
                AI Legal Assistant
              </h2>
              <p
                className="text-sm flex items-center justify-center gap-1.5 font-medium transition-all group-hover:gap-2.5"
                style={{ color: GOLD_LIGHT }}
              >
                Start a Chat <FaArrowRight className="text-xs" />
              </p>
            </div>
          </div>
        </button>

        {/* Welcome card */}
        <div
          className="rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
          style={{
            background: CARD_BG,
            border: `1px solid rgba(0,0,0,0.06)`,
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          }}
        >
          {/* Gold accent bar */}
          <div
            className="w-10 h-1 rounded-full mb-5"
            style={{ background: GOLD }}
          />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-snug">
              Your Legal Journey,
              <br />
              Simplified.
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Voice of Law is your all-in-one legal management platform — AI
              assistance, case tracking, secure document storage, and more in
              one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={{ background: b.bg, color: b.color }}
              >
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ─────────────────────────────────────── */}
      <div
        className={`${animatedCards.includes(1) ? "vol-animate-in" : "opacity-0"}`}
        style={{ animationDelay: "0.1s" }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="w-1 h-5 rounded-full" style={{ background: GOLD }} />
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-none">
              Quick Actions
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Access your most-used features instantly
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={action.id}
              type="button"
              className="group relative text-left rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{
                background: hoveredCard === action.id ? DARK : CARD_BG,
                border: `1px solid ${hoveredCard === action.id ? GOLD_BORDER : "rgba(0,0,0,0.07)"}`,
                boxShadow:
                  hoveredCard === action.id
                    ? `0 12px 32px rgba(199,159,68,0.12)`
                    : "0 2px 10px rgba(0,0,0,0.05)",
                animationDelay: `${idx * 0.08}s`,
              }}
              onMouseEnter={() => setHoveredCard(action.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(action.menuItem)}
            >
              <div className="p-5">
                {/* Top: icon + arrow */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base transition-all"
                    style={{
                      background:
                        hoveredCard === action.id
                          ? GOLD_DIM
                          : "rgba(0,0,0,0.05)",
                      color: hoveredCard === action.id ? GOLD : "#555",
                      border: `1px solid ${hoveredCard === action.id ? GOLD_BORDER : "transparent"}`,
                    }}
                  >
                    {action.icon}
                  </div>
                  <FaArrowRight
                    className="text-xs mt-1 transition-transform group-hover:translate-x-1"
                    style={{ color: hoveredCard === action.id ? GOLD : "#bbb" }}
                  />
                </div>

                <h3
                  className="text-sm font-bold mb-1.5 transition-colors"
                  style={{ color: hoveredCard === action.id ? "#fff" : "#111" }}
                >
                  {action.title}
                </h3>
                <p
                  className="text-xs leading-relaxed transition-colors"
                  style={{
                    color:
                      hoveredCard === action.id
                        ? "rgba(255,255,255,0.5)"
                        : "#888",
                  }}
                >
                  {action.desc}
                </p>
              </div>

              {/* Bottom gold line on hover */}
              <div
                className="h-[2px] w-full transition-all duration-300"
                style={{
                  background: hoveredCard === action.id ? GOLD : "transparent",
                  opacity: hoveredCard === action.id ? 1 : 0,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernDashboardContent;
