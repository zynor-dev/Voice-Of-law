// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import { FaBars } from "react-icons/fa";
import aemsorLogo from "../../assets/image/logo.png"; // Yahan apni image file ka naam aur path daalo

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [transparent, setTransparent] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY < 100;
      setTransparent(isTop);

      if (location.pathname === "/") {
        const sections = document.querySelectorAll("section");
        let currentSection = "home";
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 140) {
            currentSection = section.id;
          }
        });
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 140,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 140,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <nav className={`navbar ${transparent ? "transparent" : ""}`}>
      <div className="navbar-left">
        <div className="brand">
          <img src={aemsorLogo} alt="Logo" className="brand-logo" />{" "}
          {/* Yeh line add kardo */}
        </div>
      </div>

      <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <li
          className={activeSection === "home" ? "active" : ""}
          onClick={() => handleNavClick("home")}
        >
          Home
        </li>

        <li
          className={activeSection === "features" ? "active" : ""}
          onClick={() => handleNavClick("features")}
        >
          Features
        </li>
        <li
          className={activeSection === "about" ? "active" : ""}
          onClick={() => handleNavClick("about")}
        >
          About Us
        </li>
        <li
          className={activeSection === "Whylegal" ? "active" : ""}
          onClick={() => handleNavClick("Whylegal")}
        >
          Why VoiceofLaw?
        </li>
        <li
          className={activeSection === "contact" ? "active" : ""}
          onClick={() => handleNavClick("contact")}
        >
          Contact Us
        </li>
      </ul>

      <div className="navbar-right">
        <div className="auth-buttons">
          <button onClick={() => navigate("/auth/login")}>
            Login / Sign Up
          </button>
        </div>
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FaBars />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
