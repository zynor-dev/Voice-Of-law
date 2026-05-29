// src/pages/AuthPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import lawgptLogo from "../assets/image/logo.png";
import "../styles/AuthPages.css";

const AuthPage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activePlan, setActivePlan] = useState("seasonal");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mode || (mode !== "login" && mode !== "subscribe")) {
      navigate("/auth/login", { replace: true });
    }
  }, [mode, navigate]);

  const isLoginMode = mode === "login";

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const url = `/api/auth/${isLoginMode ? "login" : "register"}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.user.role === "admin") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/user-panel", { replace: true });
        }
      } else {
        if (response.status === 401 && isLoginMode) {
          setError(
            "Account does not exist. Please check your details or create a new account."
          );
        } else {
          setError(data.message || "An error occurred.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
           {" "}
      {isLoginMode ? (
        <div className="auth-card">
                   {" "}
          <Link to="/">
                       {" "}
            <img src={lawgptLogo} alt="Lawgpt Logo" className="auth-logo" />   
                 {" "}
          </Link>
                    <h2 className="auth-title">Login</h2>         {" "}
          {error && <p className="error-message">{error}</p>}         {" "}
          <form className="auth-form" onSubmit={handleAuthSubmit}>
                       {" "}
            <div className="form-group">
                           {" "}
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
                         {" "}
            </div>
                       {" "}
            <div className="form-group">
                           {" "}
              <div className="password-input-wrapper">
                               {" "}
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter Your Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                               {" "}
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />} 
                               {" "}
                </span>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <button type="submit" className="auth-submit-btn">
              Login
            </button>
                     {" "}
          </form>
                   {" "}
          <p className="auth-switch-text">
                        Don't have an account?{" "}
            <Link to="/auth/subscribe">Get Started with Payment</Link>         {" "}
          </p>
                 {" "}
        </div>
      ) : (
        <div className="subscription-content">
                   {" "}
          <Link to="/">
                       {" "}
            <img src={lawgptLogo} alt="Lawgpt Logo" className="auth-logo" />   
                 {" "}
          </Link>
                   {" "}
          <h2 className="subscription-title">
            Get Started With Our Pricing Plan
          </h2>
                   {" "}
          <p className="subscription-description">
                        Choose a plan that works best for you and your legal
            needs.          {" "}
          </p>
                   {" "}
          <div className="plan-selection">
                        {/* ... pricing plan options ... */}         {" "}
          </div>
                    {error && <p className="error-message">{error}</p>}         {" "}
          <form className="subscription-form" onSubmit={handleAuthSubmit}>
                       {" "}
            <div className="form-section">
                           {" "}
              <h3 className="section-title">Account Information</h3>           
               {" "}
              <div className="form-group">
                               {" "}
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                             {" "}
              </div>
                           {" "}
              <div className="form-group">
                               {" "}
                <input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <button type="submit" className="auth-submit-btn">
              CONTINUE
            </button>
                     {" "}
          </form>
                   {" "}
          <p className="auth-switch-text">
                        Already have an account?{" "}
            <Link to="/auth/login">Login</Link>         {" "}
          </p>
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
};

export default AuthPage;
