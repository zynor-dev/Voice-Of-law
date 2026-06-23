// components/NetflixFooter.jsx
import React, { useState } from "react";
import "../styles/Footer.css";

const Footerd = () => {
  const [language, setLanguage] = useState("English");

  return (
    <footer className="netflix-footer">
      <div className="footer-content">
       

    

        <div className="footer-middle">
          <h4 className="footer-contact-heading">Questions? Contact us.</h4>

          <div className="footer-links-grid">
            

            <div className="footer-link-column">
              <a href="#" className="footer-link">
                Help Center
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
                Only on Lawyers
              </a>
            </div>

            <div className="footer-link-column">
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

export default Footerd;
