import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import lawgptLogo from "../assets/image/logo.png";
import { API_V1_BASE } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // 'email' -> 'otp' -> 'password'
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ─── Step 1: request the reset code ──────────────────────────
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_V1_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setInfo(
          "If an account exists with this email, a reset code has been sent.",
        );
        setStep("otp");
        setResendTimer(30);
      } else {
        setError(data.message || "Could not send reset code.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setError("");
    setInfo("");
    try {
      const res = await fetch(`${API_V1_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setInfo("A new code has been sent to your email.");
        setResendTimer(30);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch (err) {
      setError("Connection error while resending code.");
    }
  };

  // ─── OTP input handlers (same pattern as signup/login OTP) ────
  const handleOtpChange = (idx, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[idx] = value;
    setOtp(next);
    if (value && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(text)) {
      setOtp(text.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ─── Step 2: move to new-password screen once code is entered ─
  const handleContinueFromOtp = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError("");
    setInfo("");
    setStep("password");
  };

  // ─── Step 3: set new password, then log the user straight in ──
  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const code = otp.join("");

    try {
      const resetRes = await fetch(`${API_V1_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: code, password }),
      });
      const resetData = await resetRes.json().catch(() => ({}));

      if (!resetRes.ok) {
        setError(resetData.message || "Invalid or expired reset code.");
        setLoading(false);
        return;
      }

      // Password reset succeeded — log the user straight in with it.
      const loginRes = await fetch(`${API_V1_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const loginData = await loginRes.json().catch(() => ({}));

      if (loginRes.ok && loginData.token && loginData.user) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("voicelaw_user");
        const userData = { ...loginData.user, token: loginData.token };
        localStorage.setItem("token", loginData.token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("voicelaw_user", JSON.stringify(userData));
        setUser(userData);
        navigate(
          loginData.user.role === "admin" ? "/dashboard" : "/user-panel",
          { replace: true },
        );
      } else {
        // Password was reset successfully even if auto-login didn't fire —
        // send them to a normal login instead of leaving them stuck.
        navigate("/auth/login", { replace: true });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  };

  const cardWrap = (children) => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">{children}</div>
      </div>
    </div>
  );

  const header = (title, subtitle) => (
    <div className="flex flex-col items-center mb-6">
      <img
        src={lawgptLogo}
        alt="Voice of Law Logo"
        className="w-20 h-auto mb-3"
      />
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#2c2c2c" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-gray-600 text-center mt-1">{subtitle}</p>
      )}
    </div>
  );

  const alerts = (
    <>
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-5 border-l-4 border-red-700 text-sm">
          {error}
        </div>
      )}
      {info && !error && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-5 border-l-4 border-green-600 text-sm">
          {info}
        </div>
      )}
    </>
  );

  // ─── Step 1: Email ──────────────────────────────────────────
  if (step === "email") {
    return cardWrap(
      <>
        {header(
          "Reset your password",
          "Enter the email linked to your account and we'll send you a reset code.",
        )}
        {alerts}
        <form onSubmit={handleRequestCode} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
              style={{ "--tw-ring-color": "#8b7355" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white rounded-lg font-medium transition text-sm"
            style={{ backgroundColor: "#2c2c2c" }}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
              "Send reset code"
            )}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/auth/login"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to login
          </Link>
        </div>
      </>,
    );
  }

  // ─── Step 2: OTP ────────────────────────────────────────────
  if (step === "otp") {
    return cardWrap(
      <>
        {header(
          "Enter the code",
          <>
            We've sent a 6-digit code to
            <br />
            <span className="font-medium" style={{ color: "#8b7355" }}>
              {email}
            </span>
          </>,
        )}
        {alerts}
        <form onSubmit={handleContinueFromOtp}>
          <div
            className="flex justify-center gap-2 mb-6"
            onPaste={handleOtpPaste}
          >
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (otpRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": "#8b7355" }}
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white rounded-lg font-medium transition text-sm"
            style={{ backgroundColor: "#2c2c2c" }}
          >
            Continue
          </button>
        </form>
        <div className="mt-5 text-center text-sm text-gray-600">
          Didn't get the code?{" "}
          <button
            onClick={handleResendCode}
            disabled={resendTimer > 0}
            className="font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            style={{ color: resendTimer > 0 ? undefined : "#8b7355" }}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setStep("email");
              setError("");
              setInfo("");
              setOtp(["", "", "", "", "", ""]);
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
        </div>
      </>,
    );
  }

  // ─── Step 3: New password ───────────────────────────────────
  return cardWrap(
    <>
      {header("Set a new password", "Choose a new password for your account.")}
      {alerts}
      <form onSubmit={handleSetNewPassword} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repeat new password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
            style={{ "--tw-ring-color": "#8b7355" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white rounded-lg font-medium transition text-sm"
          style={{ backgroundColor: "#2c2c2c" }}
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          ) : (
            "Set password & login"
          )}
        </button>
      </form>
    </>,
  );
};

export default ForgotPasswordPage;
