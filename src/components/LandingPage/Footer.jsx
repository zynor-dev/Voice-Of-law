import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";

const Footer = () => {
  const [language, setLanguage] = useState("English");
  const [email, setEmail] = useState("");

  return (
    <footer className="netflix-footer">
      <div className="footer-content">
        <div className="footer-top">
          <p className="footer-text">
            Ready to get legal help? Enter your email to get started.
          </p>
          <div className="footer-email-form">
            <input
              type="email"
              placeholder="Email address"
              className="footer-email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Link to="/auth/register" className="footer-cta-button">
              Get Started &gt;
            </Link>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-middle">
          <h4 className="footer-contact-heading">Questions? Contact us.</h4>

          <div className="footer-links-grid">
            <div className="footer-link-column">
              <Link to="/faq" className="footer-link">FAQ</Link>
              <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="footer-link">Terms & Conditions</Link>
              <Link to="/refund-policy" className="footer-link">Refund Policy</Link>
            </div>

            <div className="footer-link-column">
              <Link to="/contact" className="footer-link">Help Center</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
              <Link to="/ownership" className="footer-link">Ownership Statement</Link>
              <Link to="/about" className="footer-link">About Us</Link>
            </div>

            <div className="footer-link-column">
              <Link to="/auth/register" className="footer-link">Create Account</Link>
              <Link to="/pricing" className="footer-link">Pricing & Plans</Link>
              <Link to="/features" className="footer-link">Features</Link>
              <Link to="/auth/login" className="footer-link">Login</Link>
            </div>

            <div className="footer-link-column">
              <Link to="/articles" className="footer-link">Legal Articles</Link>
              <Link to="/terms-and-conditions" className="footer-link">Legal Notices</Link>
              <Link to="/privacy-policy" className="footer-link">Cookie Policy</Link>
              <span className="footer-link" style={{opacity:0.5, cursor:'default'}}>
                Voice of Law © {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="language-selector">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-dropdown"
            >
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>

          <p className="footer-country">Voice of Law — Pakistan</p>

          <div className="footer-legal">
            <p className="captcha-notice">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="learn-more-link">
                Learn more
              </a>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
