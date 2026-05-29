import React, { useState } from "react";
import "../styles/features.css";

const cardData = {
  legalgpt: [
    {
      icon: "⚡️",
      title: "Fast & Accurate",
      description:
        "Get precise and reliable legal insights within seconds, saving you valuable time on research.",
    },
    {
      icon: "🖥️",
      title: "User-Friendly Interface",
      description:
        "Navigate our platform with ease. A simple, intuitive design makes legal assistance accessible to all.",
    },
  ],
  chatbot: [
    {
      icon: "💬",
      title: "Instant Answers",
      description:
        "Ask any legal question and get an immediate, AI-powered response, anytime you need it.",
    },
    {
      icon: "⏰",
      title: "24/7 Availability",
      description:
        "Our chatbot is always ready to assist you with your legal queries, day or night.",
    },
  ],
  research: [
    {
      icon: "📚",
      title: "Comprehensive Database",
      description:
        "Access a vast library of Pakistani laws, legal precedents, and judgments with a single click.",
    },
    {
      icon: "🔍",
      title: "Advanced Search",
      description:
        "Use intelligent search filters to find specific information, case laws, or legal documents effortlessly.",
    },
  ],
  advice: [
    {
      icon: "👨‍⚖️",
      title: "Expert Guidance",
      description:
        "Get personalized, professional legal advice from our panel of experienced advocates.",
    },
    {
      icon: "🤝",
      title: "Direct Consultation",
      description:
        "Schedule one-on-one sessions with legal experts to discuss your specific legal matters in detail.",
    },
  ],
};

const features = [
  {
    icon: "📚",
    title: "Extensive Law Library",
    description:
      "Access a comprehensive database of Pakistani laws, case precedents, and legal documents.",
  },
  {
    icon: "🧠",
    title: "AI-Powered Legal Research",
    description:
      "Find relevant legal information instantly with our advanced AI search engine, saving you hours of manual work.",
  },
  {
    icon: "💬",
    title: "Interactive Legal Chat",
    description:
      "Get real-time answers and guidance on legal queries through our conversational AI assistant.",
  },
  {
    icon: "📝",
    title: "Automated Petition Drafting",
    description:
      "Generate legal petitions and documents quickly and accurately with our smart drafting tool.",
  },
  {
    icon: "📅",
    title: "Case Management System",
    description:
      "Organize and track your cases efficiently with a powerful, user-friendly management dashboard.",
  },
  {
    icon: "📱",
    title: "Mobile Accessibility",
    description:
      "Access all features on the go with our mobile-friendly interface, ensuring you are always connected.",
  },
];

const Features = () => {
  const [activeTab, setActiveTab] = useState("legalgpt");

  return (
    <section className="features-section">
      <div className="features-container">
        {/* Left side: Dynamic buttons and cards */}
        <div className="left-side-cards">
          <h2>Picked for You</h2>
          <div className="card-tabs">
            <button
              className={`tab-button ${
                activeTab === "legalgpt" ? "active" : ""
              }`}
              onClick={() => setActiveTab("legalgpt")}
            >
              LegalGPT?
            </button>
            <button
              className={`tab-button ${
                activeTab === "chatbot" ? "active" : ""
              }`}
              onClick={() => setActiveTab("chatbot")}
            >
              Chatbot
            </button>
            <button
              className={`tab-button ${
                activeTab === "research" ? "active" : ""
              }`}
              onClick={() => setActiveTab("research")}
            >
              Research
            </button>
            <button
              className={`tab-button ${activeTab === "advice" ? "active" : ""}`}
              onClick={() => setActiveTab("advice")}
            >
              Expert Advice
            </button>
          </div>

          <div className="cards-wrapper">
            {cardData[activeTab].map((card, index) => (
              <div key={index} className="feature-card">
                <span className="card-icon">{card.icon}</span>
                <h4>{card.title}</h4>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Features list (unchanged) */}
        {/* <div className="right-side">
          <h3>Our Key Features</h3>
          <div className="features-list">
            {features.map((feature, index) => (
              <div className="feature-item" key={index}>
                <span className="feature-icon">{feature.icon}</span>
                <div className="feature-details">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Features;

// import cardImage1 from "../assets/image/1.jpg";
// import cardImage2 from "../assets/image/1.jpg";
// import featuredImage1 from "../assets/image/1.jpg";
// import featuredImage2 from "../assets/image/1.jpg";
// import featuredImage3 from "../assets/image/1.jpg";
