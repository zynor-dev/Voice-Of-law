// components/NetflixFooter.jsx
import React, { useState } from "react";
import "../../styles/Footer.css";

const Footer = () => {
  const [language, setLanguage] = useState("English");

  return (
    <footer className="netflix-footer">
      <div className="footer-content">
        <div className="footer-top">
          <p className="footer-text">
            Ready to get legal help? Enter your email to consult with our
            experts.
          </p>
          <div className="footer-email-form">
            <input
              type="email"
              placeholder="Email address"
              className="footer-email-input"
            />
            <button className="footer-cta-button">Get Started &gt;</button>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-middle">
          <h4 className="footer-contact-heading">Questions? Contact us.</h4>

          <div className="footer-links-grid">
            <div className="footer-link-column">
              <a href="#" className="footer-link">
                FAQ
              </a>
              <a href="#" className="footer-link">
                Investor Relations
              </a>
              <a href="#" className="footer-link">
                Privacy
              </a>
              <a href="#" className="footer-link">
                Speed Test
              </a>
            </div>

            <div className="footer-link-column">
              <a href="#" className="footer-link">
                Help Center
              </a>
              <a href="#" className="footer-link">
                Jobs
              </a>
              <a href="#" className="footer-link">
                Cookie Preferences
              </a>
              <a href="#" className="footer-link">
                Legal Notices
              </a>
            </div>

            <div className="footer-link-column">
              <a href="#" className="footer-link">
                Account
              </a>
              <a href="#" className="footer-link">
                Ways to Consult
              </a>
              <a href="#" className="footer-link">
                Corporate Information
              </a>
              <a href="#" className="footer-link">
                Only on Lawyers
              </a>
            </div>

            <div className="footer-link-column">
              <a href="#" className="footer-link">
                Media Center
              </a>
              <a href="#" className="footer-link">
                Terms of Use
              </a>
              <a href="#" className="footer-link">
                Contact Us
              </a>
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
              <option value="Hindi">Hindi</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>

          <p className="footer-country">Lawyers Pakistan</p>

          <div className="footer-legal">
            <p className="captcha-notice">
              This page is protected by Google reCAPTCHA to ensure you're not a
              bot.{" "}
              <a href="#" className="learn-more-link">
                Learn more
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
