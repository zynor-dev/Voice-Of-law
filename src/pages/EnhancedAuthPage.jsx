import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import lawgptLogo from "../assets/image/logo.png";
import { Scale } from "lucide-react";
import { API_V1_BASE } from "../services/api";
import { useAuth } from "../context/AuthContext";

const GOOGLE_CLIENT_ID =
  "340049121165-gi7nu1l4ba8u9ompc01cbbs3il07ouoo.apps.googleusercontent.com";

const EnhancedAuthPage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [courtName, setCourtName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ─── OTP screen state ──────────────────────────────────────
  const [step, setStep] = useState("form"); // 'form' | 'otp'
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpPurpose, setOtpPurpose] = useState("signup");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!mode || (mode !== "login" && mode !== "signup")) {
      navigate("/auth/login", { replace: true });
    }
  }, [mode, navigate]);

  const isLoginMode = mode === "login";

  // ─── Resend OTP countdown ──────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ─── Finish login: store data + redirect ──────────────────
  const completeAuth = useCallback(
    (data) => {
      // A browser can previously have held another user's session. Replace all
      // auth identity values before storing this account's token and profile.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("voicelaw_user");
      const userData = { ...data.user, token: data.token };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("voicelaw_user", JSON.stringify(userData));
      setUser(userData);

      if (data.user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/user-panel", { replace: true });
      }
    },
    [navigate, setUser],
  );

  // ─── Google Identity Services ──────────────────────────────
  const handleGoogleCredential = useCallback(
    async (response) => {
      setError("");
      setLoading(true);
      try {
        const res = await fetch(`${API_V1_BASE}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.token && data.user) {
          completeAuth(data);
        } else {
          setError(data.message || "Google sign-in failed. Please try again.");
        }
      } catch (err) {
        console.error("Google auth error:", err);
        setError("Connection error during Google sign-in.");
      } finally {
        setLoading(false);
      }
    },
    [completeAuth],
  );

  useEffect(() => {
    // Load Google's script once
    if (document.getElementById("google-identity-script")) {
      initGoogleButton();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.id = "google-identity-script";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleButton;
    document.body.appendChild(script);

    function initGoogleButton() {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: googleBtnRef.current.offsetWidth || 360,
        text: isLoginMode ? "signin_with" : "signup_with",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isLoginMode]);

  // ─── Email/Password submit ──────────────────────────────────
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const isPasswordlessLogin = isLoginMode && !password.trim();
    const endpoint = isLoginMode
      ? isPasswordlessLogin
        ? `${API_V1_BASE}/auth/request-login-otp`
        : `${API_V1_BASE}/auth/login`
      : `${API_V1_BASE}/auth/register`;

    const payload = isLoginMode
      ? isPasswordlessLogin
        ? { email: email.trim() }
        : { email, password }
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

      if (!response.ok) {
        // Existing-but-unverified login attempt
        if (data.errors?.needsVerification) {
          setOtpEmail(data.errors.email || email.trim());
          setOtpPurpose("signup");
          setStep("otp");
          setResendTimer(30);
          setError("");
          setInfo("Please verify your email to continue.");
          setLoading(false);
          return;
        }
        // Account already exists and is verified — don't show OTP screen
        if (data.errors?.accountExists) {
          setError(
            "An account with this email already exists. Please login instead.",
          );
          setLoading(false);
          return;
        }
        if (data.errors?.needsSignup) {
          setError("No account exists for this email. Please create an account first.");
          setLoading(false);
          return;
        }
        const msg =
          data.message ||
          (Array.isArray(data.errors) && data.errors.length
            ? data.errors.map((x) => x.msg || x.message).join(" ")
            : null) ||
          "An error occurred";
        setError(msg);
        setLoading(false);
        return;
      }

      if (isPasswordlessLogin) {
        setOtpEmail(payload.email);
        setOtpPurpose("login");
        setStep("otp");
        setResendTimer(30);
        setInfo("We've sent a 6-digit sign-in code to your email.");
      } else if (isLoginMode) {
        // Login success → token already issued
        completeAuth(data);
      } else {
        // Register success → move to OTP screen (no token yet)
        setOtpEmail(payload.email);
        setOtpPurpose("signup");
        setStep("otp");
        setResendTimer(30);
        setInfo("We've sent a 6-digit code to your email.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Connection error. Check API URL and network.");
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP input handlers ─────────────────────────────────────
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_V1_BASE}/auth/${otpPurpose === "login" ? "verify-login-otp" : "verify-otp"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp: code }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.token && data.user) {
        completeAuth(data);
      } else {
        setError(data.message || "Invalid or expired code.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError("");
    setInfo("");
    try {
      const res = await fetch(`${API_V1_BASE}/auth/${otpPurpose === "login" ? "request-login-otp" : "resend-otp"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setInfo("A new code has been sent to your email.");
        setResendTimer(30);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      } else {
        setError(data.message || "Could not resend code.");
      }
    } catch (err) {
      setError("Connection error while resending code.");
    }
  };

  // ─── Render: OTP Screen ──────────────────────────────────────
  if (step === "otp") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center mb-6">
              <img
                src={lawgptLogo}
                alt="Voice of Law Logo"
                className="w-20 h-auto mb-3"
              />
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: "#2c2c2c" }}
              >
                Verify your email
              </h1>
              <p className="text-sm text-gray-600 text-center mt-1">
                We've sent a 6-digit code to
                <br />
                <span className="font-medium" style={{ color: "#8b7355" }}>
                  {otpEmail}
                </span>
              </p>
            </div>

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

            <form onSubmit={handleVerifyOtp}>
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
                disabled={loading}
                className="w-full py-3 text-white rounded-lg font-medium transition text-sm"
                style={{ backgroundColor: "#2c2c2c" }}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-gray-600">
              Didn't get the code?{" "}
              <button
                onClick={handleResendOtp}
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
                  setStep("form");
                  setError("");
                  setInfo("");
                  setOtp(["", "", "", "", "", ""]);
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: Login / Signup Form ─────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
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

          <div className="text-center mb-6">
            <p className="text-xs text-gray-500">
              Pakistan's First Legal Marketplace & AI-powered Legal Assistance
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border-l-4 border-red-700 text-sm">
              {error}
            </div>
          )}
          {info && !error && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border-l-4 border-green-600 text-sm">
              {info}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                  style={{ "--tw-ring-color": "#8b7355" }}
                />
              </div>
            )}

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
              {isLoginMode && (
                <p className="mt-1 text-xs text-gray-500">Leave password empty to receive a secure login code by email.</p>
              )}
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
                <Link
                  to="/auth/forgot-password"
                  className="text-sm font-medium"
                  style={{ color: "#8b7355" }}
                >
                  Forgot Password?
                </Link>
              </div>
            )}

            <button
              type="submit"
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
          </form>

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

          <div
            ref={googleBtnRef}
            className="w-full flex justify-center"
            style={{ minHeight: "44px" }}
          />

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
