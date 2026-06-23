// LegalArticles.jsx
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaBookmark, FaShare, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/LegalArticles.css';

const LegalArticles = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const navigate = useNavigate();

  // Sample legal articles data
  useEffect(() => {
    const sampleArticles = [
      {
        id: 1,
        title: 'New Amendments in Labor Laws',
        excerpt: 'Recent changes in labor regulations that affect workers rights and employer obligations...',
        category: 'Business',
        date: 'June 08, 2023',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        readTime: '5 min read',
        featured: true,
        fullContent: 'The recent amendments to labor laws represent a significant shift in worker protections and employer responsibilities. These changes include updated minimum wage requirements, enhanced safety regulations, and new provisions for remote work arrangements. Employers must now provide comprehensive documentation of workplace conditions and implement stricter compliance measures.'
      },
      {
        id: 2,
        title: 'Supreme Court Landmark Decision on Digital Privacy',
        excerpt: 'The Supreme Court has issued a groundbreaking ruling on digital privacy rights in the modern era...',
        category: 'Technology',
        date: 'June 07, 2023',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        readTime: '7 min read',
        fullContent: 'In a historic decision, the Supreme Court has expanded digital privacy protections, setting new precedents for how tech companies can collect and use personal data. The ruling mandates stricter consent requirements and gives individuals greater control over their digital footprint. This decision is expected to have far-reaching implications for the tech industry and privacy advocacy.'
      },
      {
        id: 3,
        title: 'Historic Legal Reform Bill Passed',
        excerpt: 'Parliament approves the most significant legal reform package in decades...',
        category: 'History',
        date: 'June 06, 2023',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        readTime: '6 min read',
        featured: true,
        fullContent: 'After years of deliberation, Parliament has passed the most comprehensive legal reform bill in recent history. This sweeping legislation modernizes numerous aspects of the judicial system, streamlines court procedures, and introduces alternative dispute resolution mechanisms. The reforms aim to increase access to justice and reduce case backlogs throughout the court system.'
      },
      {
        id: 4,
        title: 'Intellectual Property Rights in the Digital Age',
        excerpt: 'How recent technological advancements are challenging traditional IP laws...',
        category: 'Technology',
        date: 'June 05, 2023',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        readTime: '4 min read',
        fullContent: 'The rapid advancement of digital technologies continues to challenge traditional intellectual property frameworks. New issues around AI-generated content, NFT ownership, and digital replication require updated legal approaches. This article examines how courts and legislators are adapting to these challenges and what it means for creators and consumers alike.'
      },
      {
        id: 5,
        title: 'Covid Legal Implications: Cases Rising in North Bengal',
        excerpt: '210 more cases detected in last 24 hours, legal measures being considered...',
        category: 'Health',
        date: 'June 04, 2023',
        image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        readTime: '3 min read',
        featured: true,
        fullContent: 'With COVID-19 cases rising again in North Bengal, authorities are considering reinstating certain legal measures to control the spread. Potential actions include mask mandates for indoor spaces, capacity restrictions for large gatherings, and updated quarantine protocols. Public health officials are monitoring the situation closely while balancing economic concerns with public health needs.'
      },
      {
        id: 6,
        title: 'RMG Workers Vaccination Initiative',
        excerpt: 'Garment workers to receive priority vaccination as essential workforce...',
        category: 'Business',
        date: 'June 03, 2023',
        image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        readTime: '5 min read',
        fullContent: 'The government has announced a new initiative to prioritize vaccination for Ready-Made Garment (RMG) workers, recognizing their essential role in the economy. The program will establish vaccination centers at major factory locations and provide paid time off for workers to get vaccinated. This effort aims to maintain production continuity while protecting worker health.'
      }
    ];
    setArticles(sampleArticles);
    setFilteredArticles(sampleArticles);
  }, []);

  const handleArticleClick = (article) => {
    navigate(`/legal-articles/${article.id}`, { state: { article } });
  };

  const handleViewAll = () => {
    navigate('/legal-articles/all');
  };

  return (
    <div className="legal-articles-container">
      {/* Header Section */}
      <div className="articles-header">
        <div className="header-content">
          <h1>Legal Articles & News</h1>
          <p>Stay updated with the latest legal developments, case analyses, and legislative changes</p>
        </div>
        <div className="date-display">
          <h2>Tuesday</h2>
          <p>June 08, 2023</p>
        </div>
      </div>

      {/* Featured Articles */}
      <div className="featured-section">
        <h2>Headlines</h2>
        <div className="featured-grid">
          {filteredArticles.filter(article => article.featured).map(article => (
            <div 
              key={article.id} 
              className="featured-article"
              onClick={() => handleArticleClick(article)}
            >
              <div className="featured-image">
                <img src={article.image} alt={article.title} />
                <span className="category-badge">{article.category}</span>
              </div>
              <div className="featured-content">
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="article-meta">
                  <span><FaCalendarAlt /> {article.date}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Updates */}
      <div className="updates-section">
        <div className="section-header">
          <h2>Latest Updates</h2>
          <button className="view-all-btn" onClick={handleViewAll}>
            View All <FaArrowRight />
          </button>
        </div>
        
        <div className="updates-grid">
          {filteredArticles.map(article => (
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
    </div>
  );
};

export default LegalArticles;