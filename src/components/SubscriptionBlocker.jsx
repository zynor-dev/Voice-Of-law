import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCrown, FaTimes, FaRocket, FaCheckCircle } from "react-icons/fa";

const SubscriptionBlocker = ({ isOpen, onClose, featureName }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubscribe = () => {
    navigate("/subscription");
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-4xl max-h-[95vh] relative overflow-y-auto mx-auto my-auto flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 bg-gray-100 border-none w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300 z-10 text-gray-900 text-base md:text-lg"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        {/* Left Section - Icon & Title */}
        <div className="lg:w-1/3 bg-gradient-to-br from-[#17161e] to-[#2a2d35] rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center">
          <div className="text-4xl md:text-5xl text-[#d79b10] mb-4 md:mb-6 animate-bounce">
            <FaCrown />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-['Montserrat'] leading-tight">
            Premium Feature Locked
          </h2>
        </div>

        {/* Right Section - Content */}
        <div className="lg:w-2/3 flex flex-col gap-4 md:gap-6">
          <p className="text-gray-900 text-base md:text-lg leading-relaxed">
            Your <strong className="text-[#3498DB]">15-day free trial</strong>{" "}
            has ended. Subscribe now to continue using{" "}
            <strong className="text-[#3498DB]">{featureName}</strong> and all
            premium features.
          </p>

          <div className="bg-[#F0F2F5] p-4 md:p-6 rounded-xl grid grid-cols-1 gap-3 md:gap-4">
            <div className="flex items-center gap-3 text-gray-900 font-semibold text-sm md:text-base">
              <FaCheckCircle className="text-[#2ECC71] text-lg md:text-xl flex-shrink-0" />
              <span>Unlimited Case Management</span>
            </div>
            <div className="flex items-center gap-3 text-gray-900 font-semibold text-sm md:text-base">
              <FaCheckCircle className="text-[#2ECC71] text-lg md:text-xl flex-shrink-0" />
              <span>AI Legal Assistant</span>
            </div>
            <div className="flex items-center gap-3 text-gray-900 font-semibold text-sm md:text-base">
              <FaCheckCircle className="text-[#2ECC71] text-lg md:text-xl flex-shrink-0" />
              <span>Legal Drafting Tools</span>
            </div>
            <div className="flex items-center gap-3 text-gray-900 font-semibold text-sm md:text-base">
              <FaCheckCircle className="text-[#2ECC71] text-lg md:text-xl flex-shrink-0" />
              <span>Document Vault & Library</span>
            </div>
            <div className="flex items-center gap-3 text-gray-900 font-semibold text-sm md:text-base">
              <FaCheckCircle className="text-[#2ECC71] text-lg md:text-xl flex-shrink-0" />
              <span>Priority Support</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-4 md:p-6 bg-gradient-to-br from-[#17161e] to-[#2a2d35] rounded-xl text-white">
            <span className="text-sm md:text-base">Only</span>
            <span className="text-2xl md:text-3xl font-black text-[#d79b10]">
              700 PKR
            </span>
            <span className="text-sm md:text-base opacity-90">/month</span>
          </div>

          <button
            className="w-full bg-gradient-to-r from-[#3498DB] to-[#2a2d35] text-white p-3 md:p-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-3 text-base md:text-lg"
            onClick={handleSubscribe}
          >
            <FaRocket />
            Subscribe Now
          </button>

          <button
            className="bg-transparent border-none text-[#95A5A6] text-sm md:text-base cursor-pointer p-2 hover:text-gray-900 transition-colors duration-300 text-center"
            onClick={onClose}
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionBlocker;
