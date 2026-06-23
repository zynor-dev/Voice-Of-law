import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaCrown,
  FaRocket,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import lawgptLogo from "../assets/image/logo.png";
import {
  Scale,
  MessageSquare,
  FileText,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Chrome,
} from "lucide-react";
import { API_V1_BASE } from "../services/api";

const EnhancedAuthPage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [courtName, setCourtName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (!mode || (mode !== "login" && mode !== "signup")) {
      navigate("/auth/login", { replace: true });
    }
  }, [mode, navigate]);

  const isLoginMode = mode === "login";

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLoginMode
      ? `${API_V1_BASE}/auth/login`
      : `${API_V1_BASE}/auth/register`;

    const payload = isLoginMode
      ? { email, password }
      : {
          fullName: name.trim(),
          email: email.trim(),
          password,
          city: city.trim(),
          courtName: courtName.trim(),
          bio: "",
        };

    if (!isLoginMode) {
      if (!payload.fullName || !payload.city || !payload.courtName) {
        setError("Please fill full name, city, and court name.");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.token && data.user) {
        const userData = { ...data.user, token: data.token };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("voicelaw_user", JSON.stringify(userData));

        if (!isLoginMode) {
          alert("Welcome! Your trial has started.");
        }

        if (data.user.role === "admin") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/user-panel", { replace: true });
        }
      } else {
        const msg =
          data.message ||
          (Array.isArray(data.errors) && data.errors.length
            ? data.errors.map((x) => x.msg || x.message).join(" ")
            : null) ||
          "An error occurred";
        setError(msg);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Connection error. Check API URL and network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/">
              <img
                src={lawgptLogo}
                alt="Voice of Law Logo"
                className="w-24 h-auto mb-3"
              />
            </Link>
            <div className="text-center">
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: "#2c2c2c" }}
              >
                Voice of Law
              </h1>
              <p className="text-sm text-gray-600">
                Your Most Trusted Legal Assistant
              </p>
            </div>
          </div>

          {/* Subtitle */}
          <div className="text-center mb-6">
            <p className="text-xs text-gray-500">
              Pakistan First Legal Marketplace & AI-powered legal Assistance
            </p>
          </div>

          {/* Service Tags */}
          {/* <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
              <MessageSquare className="w-4 h-4" style={{ color: "#8b7355" }} />
              <span
                className="text-xs font-medium"
                style={{ color: "#8b7355" }}
              >
                AI Legal Answers
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
              <Scale className="w-4 h-4" style={{ color: "#8b7355" }} />
              <span
                className="text-xs font-medium"
                style={{ color: "#8b7355" }}
              >
                Legal Research
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
              <FileText className="w-4 h-4" style={{ color: "#8b7355" }} />
              <span
                className="text-xs font-medium"
                style={{ color: "#8b7355" }}
              >
                Legal Consultations
              </span>
            </div>
          </div> */}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border-l-4 border-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ "--tw-ring-color": "#8b7355" }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ "--tw-ring-color": "#8b7355" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ "--tw-ring-color": "#8b7355" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {!isLoginMode && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lahore"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ "--tw-ring-color": "#8b7355" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Court name
                  </label>
                  <input
                    type="text"
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    placeholder="e.g. District Court"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ "--tw-ring-color": "#8b7355" }}
                    required
                  />
                </div>
              </>
            )}

            {isLoginMode && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border-gray-300 rounded"
                    style={{ accentColor: "#8b7355" }}
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  className="text-sm font-medium"
                  style={{ color: "#8b7355" }}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              onClick={handleAuthSubmit}
              disabled={loading}
              className="w-full py-3 text-white rounded-lg font-medium transition text-sm"
              style={{ backgroundColor: "#2c2c2c" }}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              ) : isLoginMode ? (
                "Login to your account"
              ) : (
                "Create New Account"
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3 text-sm text-gray-700">
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLoginMode ? (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/auth/signup"
                    className="font-medium"
                    style={{ color: "#8b7355" }}
                  >
                    Create New Account
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="font-medium"
                    style={{ color: "#8b7355" }}
                  >
                    Login
                  </Link>
                </>
              )}
            </p>
          </div>

          {/* Trial Info */}
          {!isLoginMode && (
            <div
              className="mt-6 p-4 rounded-lg"
              style={{
                backgroundColor: "#8b73551a",
                border: "1px solid #8b735533",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "#8b7355" }}
                >
                  ✓
                </div>
                <div>
                  <div
                    className="text-sm font-medium mb-1"
                    style={{ color: "#2c2c2c" }}
                  >
                    15-Day Free Trial Included
                  </div>
                  <p className="text-xs" style={{ color: "#8b7355" }}>
                    Start your free trial today. No credit card required.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Legal Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" style={{ color: "#8b7355" }}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" style={{ color: "#8b7355" }}>
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2"
          >
            <Scale className="w-4 h-4" />
            voiceoflaw.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAuthPage;
