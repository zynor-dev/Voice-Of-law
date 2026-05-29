// ArticleDetail.jsx (New component for individual article details)
import React from 'react';
import { FaCalendarAlt, FaBookmark, FaShare, FaArrowLeft, FaClock } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/ArticleDetail.css';

const ArticleDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const article = location.state?.article;

  if (!article) {
    return (
      <div className="article-detail-container">
        <div className="article-not-found">
          <h2>Article not found</h2>
          <button className="back-btn" onClick={() => navigate('/legal-articles')}>
            <FaArrowLeft /> Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/legal-articles');
  };

  return (
    <div className="article-detail-container">
      <button className="back-btn" onClick={handleBack}>
        <FaArrowLeft /> Back to Articles
      </button>

      <article className="article-detail">
        <div className="article-hero">
          <img src={article.image} alt={article.title} />
          <div className="hero-contents">
            <span className="article-category">{article.category}</span>
            <h1>{article.title}</h1>
            <div className="article-meta">
              <span><FaCalendarAlt /> {article.date}</span>
              <span><FaClock /> {article.readTime}</span>
            </div>
          </div>
        </div>

        <div className="article-body">
          <div className="article-content">
            <p>{article.fullContent}</p>
            <p>The legal implications of these developments continue to evolve as courts interpret the new regulations and stakeholders adapt to the changing landscape. Legal professionals are advised to stay current with these changes to ensure compliance and effective representation of their clients.</p>
            <p>As these legal frameworks develop, we will continue to monitor and report on significant changes and their practical implications for both legal practitioners and the general public.</p>
          </div>

          <div className="article-sidebar">
            <div className="share-section">
              <h3>Share this article</h3>
              <div className="share-buttons">
                <button className="share-btn"><FaShare /> Share</button>
                <button className="bookmark-btn"><FaBookmark /> Save</button>
              </div>
            </div>

            <div className="related-articles">
              <h3>Related Articles</h3>
              <div className="related-list">
                <div className="related-item">
                  <h4>Similar Legal Developments in Regional Courts</h4>
                  <span>June 01, 2023</span>
                </div>
                <div className="related-item">
                  <h4>Impact of Recent Legislation on Business Practices</h4>
                  <span>May 28, 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;