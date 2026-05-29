// pages/NetflixStyle.jsx
import React, { useState } from "react";
// import "../styles/Login.css";
import Footer from "./footer";

const Login = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    alert("Thank you for your interest! We'll contact you soon.");
    setEmail("");
  };

  const features = [
    {
      number: "01",
      title: "Expert Legal Consultation",
      description:
        "Get instant access to qualified lawyers for professional legal advice and case evaluation.",
      icon: "⚖️",
    },
    {
      number: "02",
      title: "Document Preparation",
      description:
        "Create legally binding documents, contracts, and agreements with our easy-to-use templates.",
      icon: "📄",
    },
    {
      number: "03",
      title: "Case Tracking",
      description:
        "Monitor your legal cases in real-time with our comprehensive tracking system.",
      icon: "📊",
    },
    {
      number: "04",
      title: "Legal Research",
      description:
        "Access vast database of legal precedents, case laws, and legal documentation.",
      icon: "🔍",
    },
    {
      number: "05",
      title: "24/7 Support",
      description:
        "Round-the-clock legal assistance for urgent matters and emergencies.",
      icon: "🕒",
    },
    {
      number: "06",
      title: "Confidential & Secure",
      description:
        "Your legal matters are handled with utmost confidentiality and security.",
      icon: "🔒",
    },
  ];

 
  const slidesToShow = 3;
  const totalSlides = features.length;
  const maxSlides = totalSlides - slidesToShow;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  return (
    <div>
      <div className="netflix-style-page">
        {/* Header with logo and sign in button */}
        <header className="netflix-header">
          <div className="header-content">
            <div className="logo">LAWYERS</div>
            <div className="auth-buttons">
              <button className="signin-btn">Sign In</button>
            </div>
          </div>
        </header>

        {/* Main hero section */}
        <div className="hero-sections">
          <div className="hero-content">
            <h1>Unlimited legal advice, and more</h1>
            <h2>Starts at Rs 1999</h2>

            <div className="cta-section">
              <form onSubmit={handleSubmit} className="email-form">
                <div className="input-container">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="cta-button">
                  Get Started &gt;
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Gradient overlay at bottom */}
        <div className="bottom-gradient"></div>
      </div>

      {/* new section  */}
      <div className="features-section">
        <div className="top-gradient-line"></div>
        <div className="features-gradient-overlay"></div>

        <div className="features-container">
          <h2 className="features-heading">TRENDING NOW</h2>
          <h3 className="features-subheading">MORE REASONS TO JOIN</h3>

          <div className="slider-container">
            <div className="slider-wrapper">
              <div
                className="slider-track"
                style={{
                  transform: `translateX(-${
                    currentSlide * (100 / slidesToShow)
                  }%)`,
                  width: `${(totalSlides / slidesToShow) * 100}%`,
                }}
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="feature-slide"
                    style={{ width: `${100 / slidesToShow}%` }}
                  >
                    <div className="slide-number">{feature.number}</div>
                    <div className="slide-icon">{feature.icon}</div>
                    <h4 className="slide-title">{feature.title}</h4>
                    <p className="slide-description">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="slider-controls">
              <button className="slider-btn prev" onClick={prevSlide}>
                ‹
              </button>
              <div className="slider-dots">
                {Array.from({ length: maxSlides + 1 }).map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentSlide ? "active" : ""}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              <button className="slider-btn next" onClick={nextSlide}>
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Login;
