// src/components/Articles/ArticleDetail.jsx - PROFESSIONAL VERSION
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ArticleService from "../../services/ArticleService";
import {
  FaClock,
  FaUser,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaShare,
  FaBookmark,
  FaEye,
  FaPrint,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./ArticleDetail.css";

const ArticleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📄 Loading article:", id);

      const data = await ArticleService.getArticleById(id);

      if (!data) {
        if (id.startsWith("news-")) {
          setError("external");
        } else {
          setError("notfound");
        }
        return;
      }

      setArticle(data);
      loadRelatedArticles(data);

      console.log("✅ Article loaded:", data.title);
    } catch (err) {
      console.error("❌ Failed to load article:", err);
      setError("error");
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedArticles = async (currentArticle) => {
    try {
      console.log("🔗 Loading related articles...");

      const allArticles = await ArticleService.fetchAllArticles(
        "",
        1,
        20,
        currentArticle.category
      );
      const related = ArticleService.getRelatedArticles(
        currentArticle,
        allArticles,
        3
      );
      setRelatedArticles(related);

      console.log("✅ Related articles loaded:", related.length);
    } catch (err) {
      console.error("⚠️ Failed to load related articles:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Criminal Law": "#e74c3c",
      "Civil Law": "#3498db",
      "Tax Law": "#f39c12",
      "Family Law": "#9b59b6",
      "Corporate Law": "#1abc9c",
      "Constitutional Law": "#34495e",
      "General Legal": "#95a5a6",
    };
    return colors[category] || "#95a5a6";
  };

  if (loading) {
    return (
      <div className="article-detail-wrapper">
        <div className="article-detail-container">
          <div className="article-detail-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error === "external") {
    return (
      <div className="article-detail-wrapper">
        <div className="article-detail-container">
          <motion.div
            className="article-auth-required"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="auth-required-content">
              <h2>External Article</h2>
              <p>
                This article is from an external source. Please visit the
                original website to read the full content.
              </p>
              <div className="auth-buttons">
                <button onClick={handleBack} className="back-btn-secondary">
                  Go Back to Articles
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-wrapper">
        <div className="article-detail-container">
          <div className="article-error">
            <h2>Article Not Found</h2>
            <p>{error || "The article you are looking for does not exist."}</p>
            <button onClick={handleBack} className="back-button">
              <FaArrowLeft /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="article-detail-wrapper">
        <div className="article-detail-container">
          <motion.div
            className="article-auth-required"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="auth-required-content">
              <h2>Authentication Required</h2>
              <p>
                Please log in to read the full article and access premium legal
                content.
              </p>
              <div className="auth-buttons">
                <button
                  onClick={() => navigate("/auth/login")}
                  className="login-btn-primary"
                >
                  Login to Continue
                </button>
                <button onClick={handleBack} className="back-btn-secondary">
                  Go Back
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-wrapper">
      <div className="article-detail-container">
        <div className="article-detail-header">
          <button onClick={handleBack} className="back-button">
            <FaArrowLeft /> Back to Articles
          </button>
          <div className="article-actions">
            <button onClick={handleShare} className="action-btn">
              <FaShare /> Share
            </button>
            <button className="action-btn">
              <FaBookmark /> Save
            </button>
            <button onClick={handlePrint} className="action-btn">
              <FaPrint /> Print
            </button>
          </div>
        </div>

        <article className="article-detail-content">
          <div className="article-hero">
            <div className="article-hero-meta">
              <span
                className="article-category-tag"
                style={{
                  backgroundColor: getCategoryColor(article.category),
                }}
              >
                {article.category}
              </span>
              <div className="article-meta-info">
                <span className="meta-item">
                  <FaClock /> {formatDate(article.publishedAt)}
                </span>
                {article.author && (
                  <span className="meta-item">
                    <FaUser /> {article.author}
                  </span>
                )}
                <span className="meta-item">
                  <FaExternalLinkAlt /> {article.source}
                </span>
                {article.views > 0 && (
                  <span className="meta-item">
                    <FaEye /> {article.views} views
                  </span>
                )}
              </div>
            </div>

            <h1 className="article-detail-title">{article.title}</h1>

            {article.description && (
              <p className="article-lead">{article.description}</p>
            )}
          </div>

          <div className="article-image-container">
            <img
              src={article.image}
              alt={article.title}
              className="article-detail-image"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800";
              }}
            />
          </div>

          <div className="article-body-wrapper">
            <div className="article-body">
              {article.introduction && (
                <div className="article-introduction">
                  <p>{article.introduction}</p>
                </div>
              )}

              <div className="article-text">
                {article.content.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {article.isExternal && article.url && (
                <div className="external-link-card">
                  <p>Read the full article at the source:</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link-btn"
                  >
                    Visit {article.source} <FaExternalLinkAlt />
                  </a>
                </div>
              )}
            </div>

            {relatedArticles.length > 0 && (
              <aside className="article-sidebar">
                <div className="sidebar-sticky">
                  <h3 className="sidebar-title">Related Articles</h3>
                  <div className="related-articles-list">
                    {relatedArticles.map((related) => (
                      <div
                        key={related.id}
                        className="related-article-item"
                        onClick={() =>
                          navigate(
                            `/user-panel/legal-news-articles/${related.id}`
                          )
                        }
                      >
                        <img src={related.image} alt={related.title} />
                        <div className="related-article-info">
                          <h4>{related.title}</h4>
                          <span>{formatDate(related.publishedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
