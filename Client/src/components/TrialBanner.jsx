// src/components/TrialBanner.jsx - Persistent Trial Days Banner
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCrown, FaClock, FaRocket, FaTimes } from "react-icons/fa";
import useSubscriptionCheck from "../hooks/useSubscriptionCheck";
import "./TrialBanner.css";

const TrialBanner = ({ showOnDashboardOnly = false, compact = false }) => {
  const navigate = useNavigate();
  const { subscriptionStatus, loading } = useSubscriptionCheck();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  // Show pulse animation when days are low
  useEffect(() => {
    if (
      subscriptionStatus?.isTrialActive &&
      subscriptionStatus?.daysRemaining <= 3
    ) {
      setShowPulse(true);
    }
  }, [subscriptionStatus]);

  // Don't show if loading, dismissed, or not on trial
  if (loading || isDismissed || !subscriptionStatus?.isTrialActive) {
    return null;
  }

  const daysRemaining = subscriptionStatus.daysRemaining || 0;
  const isUrgent = daysRemaining <= 3;
  const isWarning = daysRemaining <= 7;

  // Get urgency level for styling
  const getUrgencyLevel = () => {
    if (daysRemaining <= 1) return "critical";
    if (daysRemaining <= 3) return "urgent";
    if (daysRemaining <= 7) return "warning";
    return "normal";
  };

  const urgencyLevel = getUrgencyLevel();

  // Compact version for in-page display
  if (compact) {
    return (
      <motion.div
        className={`trial-banner-compact ${urgencyLevel}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <div className="trial-compact-content">
          <FaClock className="trial-icon" />
          <span className="trial-text">
            <strong>{daysRemaining}</strong>{" "}
            {daysRemaining === 1 ? "day" : "days"} left in trial
          </span>
          <button
            className="trial-upgrade-btn-compact"
            onClick={() => navigate("/subscription")}
          >
            Upgrade
          </button>
        </div>
      </motion.div>
    );
  }

  // Full banner version
  return (
    <AnimatePresence>
      <motion.div
        className={`trial-banner-full ${urgencyLevel} ${
          showPulse ? "pulse" : ""
        }`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
      >
        <div className="trial-banner-container">
          <div className="trial-banner-icon">
            {isUrgent ? (
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <FaClock />
              </motion.div>
            ) : (
              <FaCrown />
            )}
          </div>

          <div className="trial-banner-content">
            <div className="trial-banner-title">
              {isUrgent ? (
                <>⏰ Trial Ending Soon!</>
              ) : isWarning ? (
                <>⚠️ Free Trial Active</>
              ) : (
                <>🎉 Free Trial Active</>
              )}
            </div>

            <div className="trial-banner-message">
              <strong className="days-count">{daysRemaining}</strong>
              <span className="days-text">
                {daysRemaining === 1 ? "day" : "days"}
              </span>
              <span className="remaining-text">remaining</span>

              {isUrgent && (
                <span className="urgent-text">
                  {" "}
                  - Subscribe now to keep access!
                </span>
              )}
            </div>

            {subscriptionStatus.dailyLimits && (
              <div className="trial-limits-info">
                <span className="limit-item">
                  📁 Cases: {subscriptionStatus.dailyLimits.cases.used}/
                  {subscriptionStatus.dailyLimits.cases.limit} today
                </span>
                <span className="limit-item">
                  📥 Downloads: {subscriptionStatus.dailyLimits.downloads.used}/
                  {subscriptionStatus.dailyLimits.downloads.limit} today
                </span>
                <span className="limit-item">
                  📝 Notes: {subscriptionStatus.dailyLimits.notes.used}/
                  {subscriptionStatus.dailyLimits.notes.limit} today
                </span>
              </div>
            )}
          </div>

          <div className="trial-banner-actions">
            <motion.button
              className="trial-upgrade-btn"
              onClick={() => navigate("/subscription")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRocket />
              <span>Upgrade Now</span>
            </motion.button>

            {!isUrgent && (
              <button
                className="trial-dismiss-btn"
                onClick={() => setIsDismissed(true)}
                title="Dismiss (will show again next login)"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar showing trial timeline */}
        <div className="trial-progress-container">
          <motion.div
            className="trial-progress-bar"
            initial={{ width: "0%" }}
            animate={{ width: `${((15 - daysRemaining) / 15) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrialBanner;
