// src/components/LandingPage/DashboardShowcase.jsx
import React from "react";
import { motion } from "framer-motion";

// TODO: apna actual dashboard screenshot yahan daalein
import dashboardFull from "../../assets/image/mockups/dashboard-full.png";

const DashboardShowcase = () => {
  return (
    <section className="py-28 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <div className="inline-flex px-4 py-1.5 rounded-full bg-vol-gold-dim text-vol-gold text-xs font-semibold mb-5">
          SEE IT IN ACTION
        </div>
        <h2
          style={{ fontFamily: "var(--font-display)" }}
          className="text-4xl md:text-5xl text-vol-dark mb-4"
        >
          Your entire practice, in one dashboard.
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          AI assistant, case tracker, drafting tools and calendar — all working
          together seamlessly.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-vol-lg border border-gray-200"
      >
        {/* Browser chrome bar */}
        <div className="bg-vol-dark2 px-5 py-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-4 text-white/40 text-xs">
            app.voiceoflaw.com/user-panel
          </span>
        </div>
        <img
          src={dashboardFull}
          alt="Voice of Law dashboard"
          className="w-full h-auto"
        />
      </motion.div>
    </section>
  );
};

export default DashboardShowcase;
