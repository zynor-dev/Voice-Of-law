import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCrown, FaTimes, FaRocket, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { fetchSubscriptionStatusFromProfile } from "../services/subscriptionStatus";

const SubscriptionReminder = () => {
  const [showReminder, setShowReminder] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    checkAndShowReminder();

    // Set up interval to check periodically
    const interval = setInterval(checkAndShowReminder, 1000 * 60 * 60 * 4); // Every 4 hours

    return () => clearInterval(interval);
  }, []);

  const checkAndShowReminder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await fetchSubscriptionStatusFromProfile();
      setSubscriptionStatus(data);
      setDaysRemaining(data.daysRemaining || 0);

      if (data.isTrialActive && data.daysRemaining <= 3) {
        const lastShown = localStorage.getItem("lastReminderShown");
        const now = Date.now();

        if (!lastShown || now - parseInt(lastShown, 10) > 8 * 60 * 60 * 1000) {
          setShowReminder(true);
          localStorage.setItem("lastReminderShown", now.toString());
        }
      }

      if (!data.hasActiveSubscription && !data.isTrialActive) {
        setShowReminder(true);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const handleClose = () => {
    setShowReminder(false);
    localStorage.setItem("lastReminderShown", Date.now().toString());
  };

  const getUrgencyLevel = () => {
    if (!subscriptionStatus?.isTrialActive) return "expired";
    if (daysRemaining <= 1) return "urgent";
    if (daysRemaining <= 3) return "warning";
    return "normal";
  };

  const urgencyLevel = getUrgencyLevel();

  return (
    <AnimatePresence>
      {showReminder && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-white rounded-2xl p-6 md:p-8 max-w-md w-full relative text-center ${
              urgencyLevel === "urgent"
                ? "border-3 border-red-400 animate-pulse"
                : urgencyLevel === "warning"
                ? "border-3 border-orange-500"
                : urgencyLevel === "expired"
                ? "border-3 border-red-500"
                : ""
            }`}
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            <button
              className="absolute top-3 right-3 bg-gray-100 border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300 text-gray-600 text-base"
              onClick={handleClose}
            >
              <FaTimes />
            </button>

            <div className="text-5xl md:text-6xl mb-6">
              {urgencyLevel === "expired" ? (
                <FaClock className="text-red-500 mx-auto animate-shake" />
              ) : (
                <FaCrown className="text-yellow-400 mx-auto animate-bounce" />
              )}
            </div>

            <h2
              className={`text-2xl md:text-3xl font-extrabold mb-4 ${
                urgencyLevel === "urgent"
                  ? "text-red-400"
                  : urgencyLevel === "expired"
                  ? "text-red-500"
                  : "text-gray-900"
              }`}
            >
              {urgencyLevel === "expired"
                ? "⏰ Trial Expired"
                : `⏰ Trial Ending in ${daysRemaining} ${
                    daysRemaining === 1 ? "Day" : "Days"
                  }`}
            </h2>

            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              {urgencyLevel === "expired"
                ? "Your free trial has ended. Subscribe now to continue accessing all premium features!"
                : "Don't lose access to your premium features! Subscribe now and get uninterrupted service."}
            </p>

            <div className="flex flex-col md:flex-row justify-around gap-4 md:gap-0 mb-8 p-4 md:p-6 bg-gray-50 rounded-xl">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">🤖</span>
                <span className="text-gray-600 text-sm font-semibold">
                  AI Legal Assistant
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">📁</span>
                <span className="text-gray-600 text-sm font-semibold">
                  Case Management
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">📝</span>
                <span className="text-gray-600 text-sm font-semibold">
                  Document Drafting
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-8 p-4 md:p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
              <span className="text-base md:text-lg">Only</span>
              <span className="text-3xl md:text-4xl font-black">700 PKR</span>
              <span className="text-base md:text-lg opacity-90">/month</span>
            </div>

            <Link
              to="/subscription"
              className="block w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 md:p-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 mb-4 flex items-center justify-center gap-3 text-base md:text-lg"
            >
              Subscribe Now <FaRocket />
            </Link>

            <button
              className="bg-transparent border-none text-gray-500 text-sm md:text-base cursor-pointer p-2 hover:text-gray-700 transition-colors duration-300"
              onClick={handleClose}
            >
              Remind me later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionReminder;
