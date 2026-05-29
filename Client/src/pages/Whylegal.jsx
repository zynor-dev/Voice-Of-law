import React from "react";
import mustardBg from "../assets/image/1.jpg"; // Yahan apni image ka path do
import "../styles/style.css";
import FaqPage from "./FaqPage";
import { useNavigate } from "react-router-dom";

const Whylegal = () => {
    const navigate = useNavigate();

  return (
    <section id="Whylegal" className="mustard-section">
      <div className="container">
        <div className="left-content">
          <img src={mustardBg} alt="Lawgpt on Devices" />
        </div>
        <div className="right-content">
          <h2>
            <span className="black-heading">Why </span>
            <span className="mustard-heading">Voice Of Law?</span>
          </h2>
          <p>Redefining the Legal Landscape in Pakistan with LegalGPT</p>
          <p>
            Our platform brings together everything lawyers and law students
            need verified cases, books, study guides, and law updates all in
            one place. We save your time by delivering authentic and regularly
            updated content without the hassle of searching multiple sources.
            With our 24/7 AI chatbot and expert forum, you get instant answers
            and professional guidance whenever you need it.
          </p>
          <p>
            We help you grow by providing networking opportunities with top
            legal professionals and access to exclusive premium resources. Every
            detail on our platform is trustworthy, secure, and designed to make
            your legal journey easier and more productive.
          </p>
          <button className="dark-button"  onClick={() => navigate("/auth/subscribe")}>Get Started</button>
        </div>
      </div>
    </section>
  );
};

export default Whylegal;
