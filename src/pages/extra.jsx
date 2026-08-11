// src/pages/Home.jsx - FIXED BACKGROUND & ARTICLES LAYOUT
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Scale,
  FileText,
  BookOpen,
  Briefcase,
  Wallet,
  Users,
  Clock,
  Star,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

// Import your background images
import bg2 from "../assets/image/new/Download23.png";
import bg3 from "../assets/image/new/Download24.png";

// Import existing components
import WhyLegal from "../pages/Whylegal";

import Contact from "../pages/Contact";
import Footer from "../components/LandingPage/Footer";

import FaqPage from "./FaqPage";
import { ArticleCard } from "../components/Articles/ArticleCard";
import axios from "axios";

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const navigate = useNavigate();

  const backgroundImages = [bg2, bg3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  useEffect(() => {
    loadPreviewArticles();
  }, []);

  const loadPreviewArticles = async () => {
    try {
      setLoadingArticles(true);
      const response = await axios.get(
        "https://api.voiceoflaws.com/api/articles?limit=3",
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoadingArticles(false);
    }
  };

  const features = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "AI Legal Answers",
      description: "Get instant answers to your legal questions",
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Legal Research",
      description: "Access comprehensive legal resources",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Legal Consultations",
      description: "Professional legal consultation 24/7",
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Case Management",
      description: "Organize and track all your cases",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Legal Library",
      description: "Extensive library of legal documents",
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      title: "Digital Wallet",
      description: "Secure payment processing",
    },
  ];

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "10,000+",
      label: "Active Users",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      value: "50,000+",
      label: "Cases Managed",
    },
    { icon: <Clock className="w-6 h-6" />, value: "24/7", label: "Support" },
    { icon: <Star className="w-6 h-6" />, value: "4.9/5", label: "Rating" },
  ];

  const keyPoints = [
    {
      title: "Future of Legal Technology",
      description:
        "Experience the future of legal technology with the best in AI law in Pakistan. Whether you're searching for legal precedents, researching Pakistan law site AI tools, or simply exploring the benefits of a law bot AI, Voice of Law has you covered.",
    },
    {
      title: "Empowering Users",
      description:
        "Our commitment is to empower users with access to authoritative legal content and innovative tools. By combining the latest advancements in artificial intelligence with the depth of Pakistan's legal system, we offer an unparalleled experience for professionals and individuals alike.",
    },
    {
      title: "Most Authenticated AI Law Bot",
      description:
        "The Most Authenticated AI law bot in Pakistan is here to revolutionize the way you access and understand legal information. Whether you're a lawyer, student, or curious citizen, Voice of Law offers instant, accurate, and user-friendly solutions for all your legal queries.",
    },
  ];

  return (
    <div className="homepage">
      {/* Background Slideshow */}
      <div className="background-slideshow">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentImageIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1
            className="slide-down"
            style={{ fontSize: "3.5rem", marginBottom: "1rem" }}
          >
            Voice Of Law
          </h1>
          <p
            className="fade-in"
            style={{ fontSize: "1.1rem", marginBottom: "2rem" }}
          >
            Pakistan's Most Trusted AI-Powered Legal Assistant
          </p>

          {/* Service Tags */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <MessageSquare style={{ width: "16px", height: "16px" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                AI Legal Answers
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <Scale style={{ width: "16px", height: "16px" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                Legal Research
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <FileText style={{ width: "16px", height: "16px" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                Legal Consultations
              </span>
            </div>
          </div>

          <div className="button-container">
            <button
              className="cta-button slide-left"
              onClick={() => navigate("/auth/login")}
              style={{ padding: "0.9rem 2rem", fontSize: "0.9rem" }}
            >
              Chat Now
            </button>
            <button
              className="cta-button secondary slide-right"
              onClick={() => navigate("/auth/signup")}
              style={{ padding: "0.9rem 2rem", fontSize: "0.9rem" }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "4rem 0", backgroundColor: "#2c2c2c" }}>
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "2rem",
            }}
          >
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: "center", color: "white" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "0.75rem",
                    color: "#8b7355",
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "1.875rem",
                    fontWeight: "bold",
                    marginBottom: "0.25rem",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.875rem", opacity: "0.8" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section style={{ padding: "4rem 1rem", backgroundColor: "white" }}>
        <div
          style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              color: "#1a1a1a",
            }}
          >
            Pakistan's Most Trusted AI-Powered Legal Assistant
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#555",
              lineHeight: "1.8",
              marginBottom: "1rem",
            }}
          >
            Your one-stop destination for cutting-edge legal solutions powered
            by artificial intelligence (AI). Voice of Law is a{" "}
            <strong>Most Popular And Authenticated AI law bot</strong> designed
            to simplify access to Pakistan's legal information, laws, judgments,
            drafts and resources in Pakistan Law. Whether you're a legal
            professional, student, or just someone seeking clarity on Pakistan's
            law & legal framework, our platform is here to assist you.
          </p>
          <p style={{ fontSize: "1rem", color: "#555", lineHeight: "1.8" }}>
            We are proud to be the leading{" "}
            <strong>AI Pakistan law chatbot</strong>, offering real-time
            assistance tailored to your needs. Our platform serves as a
            modernized version of a <strong>Pakistan law site</strong>,
            providing valuable insights into{" "}
            <strong>Pakistan law judgments</strong> and offering user-friendly
            navigation. Say goodbye to hours of manual research and hello to
            precision, speed, and reliability.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "4rem 1rem", backgroundColor: "#f8f8f8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "0.75rem",
                color: "#1a1a1a",
              }}
            >
              KEY FEATURES
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#666",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Comprehensive legal tools for Pakistani professionals
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: "1.25rem",
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  transition: "all 0.3s",
                }}
                className="feature-card"
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#8b73551a",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8b7355",
                    marginBottom: "0.75rem",
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1a1a1a",
                    marginBottom: "0.5rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#666" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Revolution Section */}
      <section style={{ padding: "4rem 1rem", backgroundColor: "white" }}>
        <div
          style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#1a1a1a",
            }}
          >
            Join the Law Revolution Today
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#555",
              lineHeight: "1.8",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            Voice of Law isn't just a tool—it's your partner in navigating the
            legal landscape. From professionals to individuals, everyone can
            benefit from our advanced AI legal assistant capabilities. Ready to
            simplify your legal journey? Dive into Voice of Law now and
            experience the power of AI-driven legal assistance.
          </p>
        </div>
      </section>

      {/* Simplifying Legal Access Section */}
      <section style={{ padding: "4rem 1rem", backgroundColor: "#f8f8f8" }}>
        <div
          style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              backgroundColor: "#dcfce7",
              color: "#166534",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            MOST AUTHENTICATED AI BASED PAKISTAN LAW SITE
          </div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              color: "#1a1a1a",
            }}
          >
            Simplifying Legal Access with AI
          </h2>
          <p style={{ fontSize: "1rem", color: "#555", lineHeight: "1.8" }}>
            Gone are the days of sifting through endless documents and outdated
            resources. With Voice of Law, you have a powerful tool at your
            fingertips—one that brings efficiency, accuracy, and ease to your
            legal inquiries. Embrace the future of legal technology and make
            informed decisions faster than ever before.
          </p>
        </div>
      </section>

      {/* Key Points Section */}
      <section style={{ padding: "4rem 1rem", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "3rem",
              color: "#1a1a1a",
            }}
          >
            Key Points:
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {keyPoints.map((point, index) => (
              <div
                key={index}
                style={{
                  padding: "2rem",
                  backgroundColor: "white",
                  border: "2px solid #16a34a",
                  borderRadius: "1rem",
                  transition: "all 0.3s",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "#16a34a",
                    borderRadius: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <CheckCircle
                    style={{ width: "24px", height: "24px", color: "white" }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "#1a1a1a",
                    marginBottom: "1rem",
                  }}
                >
                  {point.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#555",
                    lineHeight: "1.7",
                  }}
                >
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Existing Sections */}

      <WhyLegal />

      {/* Blog Section - Explore Our Law Blogs - FIXED LAYOUT */}
      <section
        style={{
          padding: "5rem 1rem",
          backgroundColor: "white",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#111827",
                marginBottom: "1rem",
              }}
            >
              Explore Our Law Blogs
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#6b7280",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              Stay informed with our latest articles covering legal updates, AI
              in law, research tips, and expert opinions to help you stay ahead
              in your legal journey.
            </p>
          </div>

          {loadingArticles ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "4px solid #8b7355",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 1rem",
                }}
              ></div>
              <p style={{ fontSize: "0.875rem", color: "#666" }}>
                Loading articles...
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                  gap: "2rem",
                  marginBottom: "3rem",
                }}
              >
                {articles.map((article) => (
                  <div
                    key={article._id || article.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "1rem",
                      overflow: "hidden",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.3s",
                      cursor: "pointer",
                      border: "1px solid #e5e7eb",
                    }}
                    className="article-blog-card"
                    onClick={() =>
                      navigate(`/articles/${article._id || article.id}/preview`)
                    }
                  >
                    {/* Article Image */}
                    <div
                      style={{
                        position: "relative",
                        height: "240px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={
                          article.image ||
                          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800"
                        }
                        alt={article.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800";
                        }}
                      />
                      {/* Logo Overlay */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "1rem",
                          left: "1rem",
                          backgroundColor: "rgba(255,255,255,0.95)",
                          padding: "0.5rem 1rem",
                          borderRadius: "0.5rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "700",
                            color: "#16a34a",
                          }}
                        >
                          VOICE OF LAW
                        </span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div style={{ padding: "1.5rem" }}>
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "700",
                          color: "#111827",
                          marginBottom: "0.75rem",
                          lineHeight: "1.4",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          marginBottom: "1rem",
                        }}
                      >
                        <span>
                          {new Date(
                            article.publishedAt || article.createdAt,
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>-</span>
                        <span>No Comments</span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.9375rem",
                          color: "#4b5563",
                          lineHeight: "1.6",
                          display: "-webkit-box",
                          WebkitLineClamp: "3",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.description ||
                          article.content?.substring(0, 150) + "..."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <button
                  className="cta-button"
                  onClick={() => navigate("/auth/login")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.9rem 2rem",
                    fontSize: "0.9rem",
                  }}
                >
                  View More Articles
                  <ChevronRight style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "5rem 1rem", backgroundColor: "#f8f8f8" }}>
        <div
          style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "0.75rem",
              color: "#1a1a1a",
            }}
          >
            Simple, Transparent Pricing
          </h2>
          <p style={{ fontSize: "1rem", color: "#666", marginBottom: "3rem" }}>
            Start with a 15-day free trial. No credit card required.
          </p>

          <div
            style={{
              maxWidth: "400px",
              margin: "0 auto",
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              border: "2px solid #8b7355",
              padding: "2rem",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  marginBottom: "1rem",
                  backgroundColor: "#8b73551a",
                  color: "#8b7355",
                }}
              >
                15-Day Free Trial
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    color: "#2c2c2c",
                  }}
                >
                  700
                </span>
                <span style={{ fontSize: "1.25rem", color: "#666" }}>
                  PKR/month
                </span>
              </div>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                marginBottom: "2rem",
                textAlign: "left",
              }}
            >
              {[
                "Unlimited AI Legal Queries",
                "Advanced Case Management",
                "Legal Document Drafting",
                "Access to Legal Library",
                "Digital Wallet Integration",
                "Priority Support 24/7",
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                      backgroundColor: "#8b73551a",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem", color: "#8b7355" }}>
                      ✓
                    </span>
                  </div>
                  <span style={{ fontSize: "0.875rem", color: "#333" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/auth/signup")}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                fontWeight: "500",
                color: "white",
                transition: "all 0.3s",
                fontSize: "0.875rem",
                backgroundColor: "#2c2c2c",
                border: "none",
                cursor: "pointer",
              }}
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </section>

      <FaqPage />
      <Contact />
      <Footer />

      <style>{`
        .feature-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border-color: #8b7355 !important;
          transform: translateY(-2px);
        }
        .article-blog-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15);
          border-color: #16a34a;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;
