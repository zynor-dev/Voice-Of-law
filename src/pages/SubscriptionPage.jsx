import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCrown,
  FaCheckCircle,
  FaUniversity,
  FaMobileAlt,
  FaTimes,
  FaLock,
  FaRocket,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { fetchSubscriptionStatusFromProfile } from "../services/subscriptionStatus";

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  useEffect(() => {
    let userData = null;
    try {
      userData = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      userData = null;
    }
    if (!userData) {
      navigate("/auth/login");
      return;
    }
    setUser(userData);
    checkSubscriptionStatus();
  }, [navigate]);

  const checkSubscriptionStatus = async () => {
    try {
      const data = await fetchSubscriptionStatusFromProfile();
      setSubscriptionStatus(data);
      if (data.hasActiveSubscription) {
        navigate("/user-panel");
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto">
        <motion.div
          className="text-center text-white mb-8 md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl md:text-6xl text-yellow-400 mb-4 md:mb-6 animate-bounce">
            <FaCrown />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Upgrade to Premium
          </h1>

          {subscriptionStatus && subscriptionStatus.isTrialActive && (
            <div className="inline-flex items-center gap-2 bg-green-500/20 border-2 border-green-500 px-4 md:px-6 py-2 md:py-3 rounded-full text-base md:text-lg mt-4">
              <FaRocket />
              <span>
                Your free trial ends in {subscriptionStatus.daysRemaining} days
              </span>
            </div>
          )}

          {subscriptionStatus && !subscriptionStatus.isTrialActive && (
            <div className="inline-flex items-center gap-2 bg-red-500/20 border-2 border-red-500 px-4 md:px-6 py-2 md:py-3 rounded-full text-base md:text-lg mt-4">
              <FaTimes />
              <span>Your free trial has expired</span>
            </div>
          )}
        </motion.div>

        <motion.div
          className="mb-8 md:mb-12 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-12 max-w-2xl w-full shadow-2xl relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 px-4 md:px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
              <FaCrown />
              Most Popular
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">
              Premium Plan
            </h2>

            <div className="flex items-center justify-center gap-2 mb-8 p-6 md:p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
              <span className="text-xl md:text-2xl font-semibold">PKR</span>
              <span className="text-4xl md:text-6xl font-black">700</span>
              <span className="text-lg md:text-xl opacity-90">/month</span>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">
                Everything included:
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
                  <FaCheckCircle className="text-green-500 text-xl md:text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <strong className="block text-gray-900 text-base md:text-lg">
                      AI Legal Assistant
                    </strong>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      Unlimited queries and instant responses
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
                  <FaCheckCircle className="text-green-500 text-xl md:text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <strong className="block text-gray-900 text-base md:text-lg">
                      Case Management
                    </strong>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      Organize unlimited cases with documents
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
                  <FaCheckCircle className="text-green-500 text-xl md:text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <strong className="block text-gray-900 text-base md:text-lg">
                      Legal Drafting
                    </strong>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      AI-powered document generation
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
                  <FaCheckCircle className="text-green-500 text-xl md:text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <strong className="block text-gray-900 text-base md:text-lg">
                      Legal Library
                    </strong>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      Access to extensive legal resources
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
                  <FaCheckCircle className="text-green-500 text-xl md:text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <strong className="block text-gray-900 text-base md:text-lg">
                      Priority Support
                    </strong>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      24/7 dedicated customer support
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
                  <FaCheckCircle className="text-green-500 text-xl md:text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <strong className="block text-gray-900 text-base md:text-lg">
                      Secure Storage
                    </strong>
                    <p className="text-gray-600 text-sm md:text-base mt-1">
                      Encrypted document vault
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl text-gray-600 flex items-center justify-center gap-2">
              <FaLock />
              Secure Payment • Cancel Anytime
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl text-white text-center font-bold mb-6 md:mb-8">
            Choose Payment Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            <motion.div
              className="bg-white rounded-xl p-6 text-center cursor-pointer border-3 border-transparent hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
              onClick={() => handleSelectMethod("bank_transfer")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaUniversity className="text-indigo-500 text-4xl md:text-5xl mb-4 mx-auto" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                Bank Transfer
              </h3>
              <p className="text-gray-600 text-sm md:text-base mb-6">
                Direct bank account transfer
              </p>
              <button className="bg-indigo-500 text-white px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors duration-300">
                Select
              </button>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 text-center cursor-pointer border-3 border-transparent hover:border-green-600 hover:shadow-xl transition-all duration-300"
              onClick={() => handleSelectMethod("easypaisa")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaMobileAlt className="text-green-600 text-4xl md:text-5xl mb-4 mx-auto" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                EasyPaisa
              </h3>
              <p className="text-gray-600 text-sm md:text-base mb-6">
                Pay via EasyPaisa mobile wallet
              </p>
              <button className="bg-indigo-500 text-white px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors duration-300">
                Select
              </button>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-yellow-50 to-white rounded-xl p-6 text-center cursor-pointer border-3 border-yellow-400 hover:shadow-xl transition-all duration-300 relative"
              onClick={() => handleSelectMethod("jazzcash")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                Recommended
              </div>
              <FaMobileAlt className="text-red-600 text-4xl md:text-5xl mb-4 mx-auto" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                JazzCash
              </h3>
              <p className="text-gray-600 text-sm md:text-base mb-6">
                Pay via JazzCash mobile wallet
              </p>
              <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 md:py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-300">
                Select
              </button>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showPaymentModal && (
            <PaymentModal
              method={selectedMethod}
              onClose={() => setShowPaymentModal(false)}
              onSuccess={() => {
                setShowPaymentModal(false);
                navigate("/user-panel");
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PaymentModal = ({ method, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData(e.target);

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod: method,
          accountNumber: formData.get("accountNumber"),
          senderName: formData.get("senderName"),
          transactionId: formData.get("transactionId"),
        }),
      });

      if (response.ok) {
        alert(
          "✅ Payment submitted successfully! We'll verify and activate your subscription within 24 hours."
        );
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || "Payment submission failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 bg-gray-100 border-none w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors duration-300 text-lg"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Complete Payment
        </h2>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border-l-4 border-red-500">
            {error}
          </div>
        )}

        {method === "bank_transfer" && (
          <BankTransferForm onSubmit={handlePaymentSubmit} loading={loading} />
        )}

        {method === "easypaisa" && (
          <EasyPaisaForm onSubmit={handlePaymentSubmit} loading={loading} />
        )}

        {method === "jazzcash" && (
          <JazzCashForm onSubmit={handlePaymentSubmit} loading={loading} />
        )}
      </motion.div>
    </motion.div>
  );
};

const BankTransferForm = ({ onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="bg-gray-50 p-4 md:p-6 rounded-xl border-2 border-gray-200">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Transfer to:</h3>
      <div className="flex justify-between items-center py-3 border-b border-gray-300 last:border-b-0">
        <span className="text-gray-600 font-medium">Bank Name:</span>
        <strong className="text-gray-900 font-bold">Meezan Bank</strong>
      </div>
      <div className="flex justify-between items-center py-3 border-b border-gray-300 last:border-b-0">
        <span className="text-gray-600 font-medium">Account Title:</span>
        <strong className="text-gray-900 font-bold">Voice of Law</strong>
      </div>
      <div className="flex justify-between items-center py-3 border-b border-gray-300 last:border-b-0">
        <span className="text-gray-600 font-medium">Account Number:</span>
        <strong className="text-gray-900 font-bold">01234567890123</strong>
      </div>
      <div className="flex justify-between items-center py-3 border-b border-gray-300 last:border-b-0">
        <span className="text-gray-600 font-medium">IBAN:</span>
        <strong className="text-gray-900 font-bold">
          PK12MEZN0001234567890123
        </strong>
      </div>
      <div className="flex justify-between items-center p-4 mt-4 bg-white rounded-lg border-2 border-dashed border-indigo-500">
        <span className="text-gray-600 font-semibold">Amount:</span>
        <strong className="text-indigo-500 text-xl font-extrabold">
          PKR 700
        </strong>
      </div>
    </div>

    <div className="space-y-2">
      <label className="font-semibold text-gray-700">
        Your Name (as per bank)
      </label>
      <input
        type="text"
        name="senderName"
        placeholder="Enter your full name"
        required
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300"
      />
    </div>

    <div className="space-y-2">
      <label className="font-semibold text-gray-700">
        Transaction ID / Reference Number
      </label>
      <input
        type="text"
        name="transactionId"
        placeholder="Enter transaction reference"
        required
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 md:p-4 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 mt-4"
      disabled={loading}
    >
      {loading ? "Processing..." : "Submit Payment"}
    </button>

    <p className="text-center text-gray-600 text-sm bg-gray-50 p-3 rounded-lg mt-4">
      ⏱ Verification typically takes 2-24 hours
    </p>
  </form>
);

const EasyPaisaForm = ({ onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-xl border-2 border-green-500">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        EasyPaisa Account:
      </h3>
      <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg mb-4">
        <FaMobileAlt className="text-2xl text-indigo-500" />
        <strong className="text-xl">03XX-XXXXXXX</strong>
      </div>
      <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 border-dashed border-green-500">
        <span className="text-gray-600 font-semibold">Amount:</span>
        <strong className="text-green-600 text-xl font-extrabold">
          PKR 700
        </strong>
      </div>
    </div>

    <div className="space-y-2">
      <label className="font-semibold text-gray-700">Your Name</label>
      <input
        type="text"
        name="senderName"
        placeholder="Enter your full name"
        required
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300"
      />
    </div>

    <div className="space-y-2">
      <label className="font-semibold text-gray-700">
        Your EasyPaisa Number
      </label>
      <input
        type="tel"
        name="accountNumber"
        placeholder="03XX-XXXXXXX"
        required
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300"
      />
    </div>

    <div className="space-y-2">
      <label className="font-semibold text-gray-700">Transaction ID</label>
      <input
        type="text"
        name="transactionId"
        placeholder="Enter EasyPaisa transaction ID"
        required
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 md:p-4 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 mt-4"
      disabled={loading}
    >
      {loading ? "Processing..." : "Submit Payment"}
    </button>

    <p className="text-center text-gray-600 text-sm bg-gray-50 p-3 rounded-lg mt-4">
      ⏱ Verification typically takes 2-24 hours
    </p>
  </form>
);

const JazzCashForm = ({ onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 md:p-6 rounded-xl border-2 border-red-500">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        JazzCash Account:
      </h3>
      <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg mb-4">
        <FaMobileAlt className="text-2xl text-indigo-500" />
        <strong className="text-xl">03XX-XXXXXXX</strong>
      </div>
      <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 border-dashed border-red-500">
        <span className="text-gray-600 font-semibold">Amount:</span>
        <strong className="text-red-600 text-xl font-extrabold">PKR 700</strong>
      </div>
    </div>

    <div className="space-y-2">
      <label className="font-semibold text-gray-700">Your Name</label>
      <input
        type="text"
        name="senderName"
        placeholder="Enter your full name"
        required
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300"
      />
    </div>

    <div className="space-y-2">
      <label className="font-semibold text-gray-700">
        Your JazzCash Number
      </label>
      <input
        type="tel"
        name="accountNumber"
        placeholder="03XX-XXXXXXX"
        required
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300"
      />
    </div>

    <div className="space-y-2">
      <label className="font-semibold text-gray-700">Transaction ID</label>
      <input
        type="text"
        name="transactionId"
        placeholder="Enter JazzCash transaction ID"
        required
        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all duration-300"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white p-3 md:p-4 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 mt-4"
      disabled={loading}
    >
      {loading ? "Processing..." : "Submit Payment"}
    </button>

    <p className="text-center text-gray-600 text-sm bg-gray-50 p-3 rounded-lg mt-4">
      ⏱ Verification typically takes 2-24 hours
    </p>
  </form>
);

export default SubscriptionPage;
