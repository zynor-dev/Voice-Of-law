// src/components/LandingPage/HeroSection.jsx
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, PlayCircle } from "lucide-react";

// Replace with your actual hand+phone mockup (transparent screen cutout PNG)
import phoneMockup from "../../assets/image/mockups/phone-hand-mockup.png";
// Replace with your actual dashboard screenshot
import dashboardScreen from "../../assets/image/mockups/dashboard-screenshot.png";

const floatingChips = [
  { label: "AI Research", delay: 0 },
  { label: "Smart Drafting", delay: 0.15 },
  { label: "Case Insights", delay: 0.3 },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);

  // Mouse-driven 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative min-h-screen bg-ink overflow-hidden flex items-center">
      {/* Ambient background glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center py-32">
        {/* LEFT: Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-label font-medium tracking-wide mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            NEXT-GEN LEGAL INTELLIGENCE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-[4.2rem] leading-[1.05] text-white mb-6"
          >
            Precision Intelligence
            <br />
            <span className="italic text-primary">for the Elite.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-body text-lg text-white/60 max-w-md mb-10 leading-relaxed"
          >
            Merge the authoritative weight of traditional legal excellence with
            the clarity of cutting-edge AI. Voice of Law is Pakistan's premier
            platform for complex case analysis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => navigate("/auth/signup")}
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-ink font-label font-semibold rounded-lg hover:bg-primary-400 transition-all"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/auth/login")}
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white font-label font-medium rounded-lg hover:bg-white/5 transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              View Demo
            </button>
          </motion.div>
        </div>

        {/* RIGHT: 3D Phone Mockup */}
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1200 }}
          className="relative flex justify-center lg:justify-end"
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-[280px] md:w-[340px]"
          >
            {/* Phone/hand mockup frame */}
            <div className="relative">
              <img
                src={phoneMockup}
                alt="Voice of Law dashboard on mobile"
                className="w-full h-auto drop-shadow-2xl select-none pointer-events-none"
                draggable={false}
              />
              {/* Dashboard screenshot mapped onto phone screen —
                  adjust top/left/width % once you have your real mockup */}
              <img
                src={dashboardScreen}
                alt="Dashboard preview"
                className="absolute top-[6%] left-[9%] w-[82%] h-auto rounded-[1.4rem] pointer-events-none select-none"
                draggable={false}
              />
            </div>

            {/* Floating feature chips */}
            {floatingChips.map((chip, i) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -8, 0],
                }}
                transition={{
                  opacity: { delay: 0.5 + chip.delay, duration: 0.5 },
                  scale: { delay: 0.5 + chip.delay, duration: 0.5 },
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    delay: chip.delay,
                    ease: "easeInOut",
                  },
                }}
                style={{ transform: "translateZ(60px)" }}
                className={`absolute px-4 py-2 bg-ink-700/90 backdrop-blur-md border border-primary/20 rounded-xl shadow-xl text-xs font-label text-white
                  ${i === 0 ? "-left-4 top-1/4" : ""}
                  ${i === 1 ? "-right-6 top-[45%]" : ""}
                  ${i === 2 ? "left-2 bottom-16" : ""}
                `}
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block mr-2" />
                {chip.label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
