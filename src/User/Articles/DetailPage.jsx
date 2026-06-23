import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaStar, FaShieldAlt, FaClock, FaUser, FaShare, FaBookmark, FaThumbsUp, FaComment, FaTags } from 'react-icons/fa';

const UpdateDetailPage = ({ update, onBack }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);

  // Sample detailed content for the update
  const getDetailedContent = (updateId) => {
    const contents = {
      1: {
        fullTitle: "Revolutionary AI Legal Research Feature Now Live",
        content: `
          We're thrilled to announce the launch of our groundbreaking AI Legal Research feature, designed to transform how legal professionals conduct case law research and legal analysis.

          ## What's New?

          Our new AI-powered research tool leverages advanced machine learning algorithms to analyze thousands of legal documents, case precedents, and statutory provisions in seconds. This cutting-edge technology provides you with:

          ### Key Features:
          - **Intelligent Case Analysis**: Automatically identifies relevant case laws and precedents
          - **Smart Legal Reasoning**: Provides AI-generated insights and legal arguments
          - **Citation Network Mapping**: Visualizes connections between related cases
          - **Precedent Strength Assessment**: Evaluates the authority and relevance of legal precedents

          ## How It Works

          Simply input your legal query or upload a case document, and our AI will:

          1. **Analyze** your query using natural language processing
          2. **Search** through our comprehensive legal database
          3. **Rank** results by relevance and legal authority
          4. **Present** findings with explanatory summaries

          ## Real-World Impact

          Early beta users have reported a 70% reduction in research time while discovering 40% more relevant precedents compared to traditional research methods.

          "This tool has revolutionized our practice. What used to take hours now takes minutes, and we're finding cases we never would have discovered manually." - Sarah Ahmed, Senior Partner at Ahmed & Associates

          ## Getting Started

          The AI Legal Research feature is available to all premium subscribers and can be accessed through the main dashboard. We've also prepared comprehensive tutorials to help you maximize this powerful tool.
        `,
        image: "/api/placeholder/800/400",
        tags: ['AI', 'Research', 'Innovation', 'Legal Tech'],
        readTime: '5 min read',
        author: 'Voice of Law Team',
        publishDate: '2 days ago'
      },
      2: {
        fullTitle: "Enterprise-Grade Security Enhancement: Your Data is Now Safer Than Ever",
        content: `
          We've implemented military-grade security enhancements to ensure your sensitive legal documents remain protected with the highest level of encryption available.

          ## Security Upgrades Overview

          Your trust is paramount to us. That's why we've invested heavily in upgrading our security infrastructure with enterprise-grade protection mechanisms.

          ### New Security Features:
          - **AES-256 Encryption**: End-to-end encryption for all document transfers
          - **Zero-Knowledge Architecture**: We cannot access your encrypted data
          - **Multi-Factor Authentication**: Enhanced login security protocols
          - **Real-time Threat Detection**: AI-powered security monitoring

          ## Technical Specifications

          Our new security layer includes:

          ### Encryption Standards
          All data is now protected using AES-256 encryption, the same standard used by banks and government agencies. This ensures that your sensitive legal documents remain confidential and secure.

          ### Access Controls
          We've implemented role-based access controls with granular permissions, allowing you to control exactly who can view, edit, or share your documents.

          ### Audit Trails
          Complete logging of all document access and modifications, providing you with a comprehensive audit trail for compliance purposes.

          ## Compliance Certifications

          Our enhanced security measures meet and exceed:
          - **ISO 27001** - Information Security Management
          - **SOC 2 Type II** - Security, Availability, and Confidentiality
          - **GDPR Compliance** - European data protection standards

          ## What This Means for You

          - **Peace of Mind**: Your client data is protected by industry-leading security
          - **Compliance Ready**: Meet professional and regulatory requirements
          - **Seamless Experience**: Enhanced security without compromising usability

          The security updates are already active for all users. No action is required on your part - your data is automatically protected by these new measures.
        `,
        image: "/api/placeholder/800/400",
        tags: ['Security', 'Encryption', 'Privacy', 'Compliance'],
        readTime: '4 min read',
        author: 'Security Team',
        publishDate: '5 days ago'
      }
    };
    return contents[updateId] || contents[1];
  };

  const detailedUpdate = getDetailedContent(update.id);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="update-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft />
          <span>Back to Updates</span>
        </button>
        
        <div className="header-actions">
          <button className="action-btn">
            <FaShare />
          </button>
          <button 
            className={`action-btn ${isBookmarked ? 'active' : ''}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <FaBookmark />
          </button>
        </div>
      </div>

      <article className="detail-content">
        <div className="article-header">
          <div className="update-meta">
            <div className="meta-item">
              <div className="update-type-badge" style={{ background: update.gradient }}>
                {update.icon}
                <span>{update.type}</span>
              </div>
            </div>
            <div className="meta-divider">•</div>
            <div className="meta-item">
              <FaClock className="meta-icon" />
              <span>{detailedUpdate.readTime}</span>
            </div>
            <div className="meta-divider">•</div>
            <div className="meta-item">
              <FaUser className="meta-icon" />
              <span>{detailedUpdate.author}</span>
            </div>
          </div>

          <h1 className="article-title">{detailedUpdate.fullTitle}</h1>
          
          <div className="article-date">{detailedUpdate.publishDate}</div>
        </div>

        <div className="featured-image">
          <img src={detailedUpdate.image} alt={detailedUpdate.fullTitle} />
        </div>

        <div className="article-body">
          <div dangerouslySetInnerHTML={{ 
            __html: detailedUpdate.content
              .split('\n')
              .map(line => {
                if (line.startsWith('## ')) {
                  return `<h2>${line.substring(3)}</h2>`;
                } else if (line.startsWith('### ')) {
                  return `<h3>${line.substring(4)}</h3>`;
                } else if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                  if (match) {
                    return `<li><strong>${match[1]}</strong>: ${match[2]}</li>`;
                  }
                  return `<li>${line.substring(2)}</li>`;
                } else if (line.startsWith('- ')) {
                  return `<li>${line.substring(2)}</li>`;
                } else if (line.trim().startsWith('"') && line.trim().endsWith('"')) {
                  return `<blockquote>${line}</blockquote>`;
                } else if (line.trim() === '') {
                  return '<br />';
                } else if (!line.startsWith('#')) {
                  return `<p>${line}</p>`;
                }
                return line;
              })
              .join('')
          }} />
        </div>

        <div className="article-tags">
          <FaTags className="tags-icon" />
          <div className="tags-list">
            {detailedUpdate.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="article-actions">
          <button 
            className={`action-button like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <FaThumbsUp />
            <span>{likes} Likes</span>
          </button>
          <button className="action-button comment-btn">
            <FaComment />
            <span>12 Comments</span>
          </button>
        </div>
      </article>

      <style jsx>{`
        .update-detail-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          background: var(--dashboard-bg);
          min-height: 100vh;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-grey);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--card-bg-light);
          border: 1px solid var(--border-grey);
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          color: var(--text-dark);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .back-button:hover {
          background: var(--accent-gold);
          color: white;
          border-color: var(--accent-gold);
          transform: translateX(-3px);
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid var(--border-grey);
          background: var(--card-bg-light);
          color: var(--text-light-grey);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: var(--accent-gold);
          color: white;
          border-color: var(--accent-gold);
          transform: translateY(-2px);
        }

        .action-btn.active {
          background: var(--accent-gold);
          color: white;
          border-color: var(--accent-gold);
        }

        .detail-content {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .article-header {
          padding: 2.5rem 3rem 1.5rem;
          border-bottom: 1px solid var(--border-grey);
        }

        .update-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-light-grey);
          font-size: 0.9rem;
        }

        .meta-divider {
          color: var(--border-grey);
        }

        .meta-icon {
          font-size: 0.8rem;
        }

        .update-type-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .article-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-dark);
          line-height: 1.3;
          margin: 0 0 1rem;
        }

        .article-date {
          color: var(--text-light-grey);
          font-size: 1rem;
        }

        .featured-image {
          width: 100%;
          height: 400px;
          overflow: hidden;
        }

        .featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: linear-gradient(45deg, #f0f2f5, #e9ecef);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-light-grey);
        }

        .featured-image img::before {
          content: "📷 Featured Image";
          font-size: 1.2rem;
        }

        .article-body {
          padding: 3rem;
          line-height: 1.8;
          color: var(--text-dark);
          font-size: 1.1rem;
        }

        .article-body h2 {
          color: var(--text-dark);
          font-size: 1.6rem;
          font-weight: 700;
          margin: 2rem 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--accent-gold);
        }

        .article-body h3 {
          color: var(--text-dark);
          font-size: 1.3rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem;
        }

        .article-body p {
          margin-bottom: 1.5rem;
          text-align: justify;
        }

        .article-body li {
          margin-bottom: 0.5rem;
          list-style: none;
          position: relative;
          padding-left: 1.5rem;
        }

        .article-body li::before {
          content: "▶";
          color: var(--accent-gold);
          position: absolute;
          left: 0;
        }

        .article-body blockquote {
          background: linear-gradient(135deg, rgba(164, 142, 101, 0.1) 0%, rgba(23, 22, 30, 0.05) 100%);
          border-left: 4px solid var(--accent-gold);
          padding: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          border-radius: 0 12px 12px 0;
          color: var(--text-dark);
          position: relative;
        }

        .article-body blockquote::before {
          content: '"';
          font-size: 3rem;
          color: var(--accent-gold);
          position: absolute;
          top: 0.5rem;
          left: 1rem;
          opacity: 0.3;
        }

        .article-body strong {
          color: var(--accent-gold);
          font-weight: 600;
        }

        .article-tags {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 2rem 3rem;
          border-top: 1px solid var(--border-grey);
          background: #fafbfc;
        }

        .tags-icon {
          color: var(--text-light-grey);
        }

        .tags-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tag {
          background: var(--accent-gold);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .article-actions {
          display: flex;
          gap: 1rem;
          padding: 2rem 3rem;
          border-top: 1px solid var(--border-grey);
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--card-bg-light);
          border: 1px solid var(--border-grey);
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          color: var(--text-dark);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .like-btn:hover, .like-btn.liked {
          background: #e3f2fd;
          border-color: #2196f3;
          color: #2196f3;
        }

        .comment-btn:hover {
          background: #f3e5f5;
          border-color: #9c27b0;
          color: #9c27b0;
        }

        @media (max-width: 768px) {
          .update-detail-page {
            padding: 1rem;
          }

          .detail-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .header-actions {
            align-self: flex-end;
          }

          .article-header {
            padding: 2rem 1.5rem 1rem;
          }

          .article-title {
            font-size: 1.75rem;
          }

          .featured-image {
            height: 250px;
          }

          .article-body {
            padding: 2rem 1.5rem;
            font-size: 1rem;
          }

          .article-tags,
          .article-actions {
            padding: 1.5rem;
            flex-wrap: wrap;
          }

          .update-meta {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .back-button span {
            display: none;
          }

          .article-title {
            font-size: 1.5rem;
          }

          .article-body {
            padding: 1.5rem 1rem;
          }

          .article-tags,
          .article-actions {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UpdateDetailPage;