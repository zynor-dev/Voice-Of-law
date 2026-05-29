// AllArticles.jsx (New component for View All page)
import React from 'react';
import { FaCalendarAlt, FaBookmark, FaShare, FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/AllArticles.css';

const AllArticles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const articles = location.state?.articles || [];

  const handleArticleClick = (article) => {
    navigate(`/legal-articles/${article.id}`, { state: { article } });
  };

  const handleBack = () => {
    navigate('/legal-articles');
  };

  return (
    <div className="all-articles-container">
      <div className="all-articles-header">
        <button className="back-btn" onClick={handleBack}>
          <FaArrowLeft /> Back to Articles
        </button>
        <h1>All Legal Articles</h1>
      </div>

      <div className="all-articles-grid">
        {articles.map(article => (
          <article 
            key={article.id} 
            className="article-card"
            onClick={() => handleArticleClick(article)}
          >
            <div className="article-image">
              <img src={article.image} alt={article.title} />
            </div>
            <div className="article-content">
              <span className="article-category">{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <div className="article-footer">
                <span className="article-date"><FaCalendarAlt /> {article.date}</span>
                <div className="article-actions">
                  <button className="icon-btn"><FaBookmark /></button>
                  <button className="icon-btn"><FaShare /></button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllArticles;