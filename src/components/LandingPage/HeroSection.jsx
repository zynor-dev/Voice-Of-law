// src/components/LandingPage/HeroSection.jsx
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, PlayCircle } from "lucide-react";

// TODO: apni actual mockup images yahan daalein
import phoneMockup from "../../assets/image/mockups/Hero.png";
import dashboardScreen from "../../assets/image/mockups/Herso.png";

const chips = [
  { label: "AI Research", pos: "-left-4 top-[20%]" },
  { label: "Smart Drafting", pos: "-right-6 top-[48%]" },
  { label: "Case Insights", pos: "left-4 bottom-14" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);

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

  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative min-h-screen bg-vol-dark overflow-hidden flex items-center">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-vol-gold/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-32 -right-20 w-[400px] h-[400px] bg-vol-gold/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center py-32 w-full">
        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-vol-gold-ring bg-vol-gold-dim text-vol-gold text-xs font-semibold tracking-wide mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            NEXT-GEN LEGAL INTELLIGENCE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: "var(--font-display)" }}
            className="text-5xl md:text-6xl lg:text-[4rem] leading-[1.08] text-white mb-6"
          >
            Precision Intelligence
            <br />
            <span className="italic text-vol-gold">for the Elite.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-white/60 max-w-md mb-10 leading-relaxed"
          >
            Merge the authoritative weight of traditional legal excellence with
            cutting-edge AI. Voice of Law is Pakistan's premier platform for
            complex case analysis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => navigate("/auth/signup")}
              className="vol-btn-gold !px-7 !py-3.5 !text-sm"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/auth/login")}
              className="vol-btn-dark !px-7 !py-3.5 !text-sm !bg-transparent !border-white/20"
            >
              <PlayCircle className="w-4 h-4" /> Sign In
            </button>
          </motion.div>
        </div>

        {/* RIGHT — 3D Phone */}
        <div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ perspective: 1200 }}
          className="relative flex justify-center lg:justify-end"
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-[270px] md:w-[320px]"
          >
            <div className="relative">
              <img
                src={phoneMockup}
                alt="Voice of Law mobile"
                className="w-full h-auto drop-shadow-2xl select-none pointer-events-none"
                draggable={false}
              />
              <img
                src={dashboardScreen}
                alt="Dashboard preview"
                className="absolute top-[6%] left-[9%] w-[82%] h-auto rounded-[1.4rem] pointer-events-none select-none"
                draggable={false}
              />
            </div>

            {chips.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                transition={{
                  opacity: { delay: 0.5 + i * 0.15 },
                  scale: { delay: 0.5 + i * 0.15 },
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  },
                }}
                style={{ transform: "translateZ(60px)" }}
                className={`absolute px-4 py-2 bg-vol-dark3/90 backdrop-blur-md border border-vol-gold-ring rounded-xl shadow-vol-gold text-xs text-white ${c.pos}`}
              >
                <span className="w-1.5 h-1.5 bg-vol-gold rounded-full inline-block mr-2" />
                {c.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
