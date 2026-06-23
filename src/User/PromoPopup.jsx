import React, { useState } from 'react';
import { FaPenFancy, FaTimes, FaRocket, FaStar, FaArrowRight } from 'react-icons/fa';

const PromoPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="promo-popup-overlay" onClick={onClose}>
      <div className="promo-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="popup-header">
          <div className="popup-icon">
            <FaPenFancy />
          </div>
          <h2>AI Legal Drafting</h2>
          <div className="popup-rating">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            <span>4.9/5 rating</span>
          </div>
        </div>

        <div className="popup-body">
          <div className="feature-highlight">
            <FaRocket className="highlight-icon" />
            <h3>Draft Legal Documents in Minutes!</h3>
          </div>
          
          <p className="popup-description">
            Transform your legal practice with our AI-powered document drafting system. Create professional legal notices, contracts, and documents with just a few clicks.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <span>Pakistan Law Compliant Templates</span>
            </div>
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <span>AI-Powered Smart Suggestions</span>
            </div>
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <span>Professional Formatting</span>
            </div>
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <span>Multiple Document Types</span>
            </div>
          </div>

          <div className="popup-actions">
            <button className="try-now-btn">
              <span>Try AI Drafting Now</span>
              <FaArrowRight />
            </button>
            <button className="learn-more-btn" onClick={onClose}>
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobilePromoCard = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <div className="updates-promo-card mobile-promo-card">
        <FaPenFancy className="promo-icon" />
        <h3 className="promo-title">Did you know?</h3>
        <p className="promo-text">
          You can draft a full legal notice using our AI assistant. Just provide a few details and let it handle the rest!
        </p>
        <button 
          className="promo-btn mobile-show-popup-btn" 
          onClick={() => setIsPopupOpen(true)}
        >
          Learn More
        </button>
      </div>
      
      <PromoPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
      />

      <style jsx>{`
        .promo-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .promo-popup-content {
          background: white;
          border-radius: 24px;
          max-width: 400px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          animation: popupSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(40px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .popup-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.1);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #666;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .popup-close-btn:hover {
          background: rgba(0, 0, 0, 0.2);
          color: #333;
          transform: rotate(90deg);
        }

        .popup-header {
          text-align: center;
          padding: 32px 24px 16px;
          background: linear-gradient(135deg, #17161e 0%, #a48e65 100%);
          color: white;
          border-radius: 24px 24px 0 0;
        }

        .popup-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 1.8rem;
          backdrop-filter: blur(10px);
        }

        .popup-header h2 {
          margin: 0 0 8px;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .popup-rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          color: #FFD700;
          font-size: 0.9rem;
        }

        .popup-rating span {
          color: rgba(255, 255, 255, 0.8);
          margin-left: 8px;
          font-size: 0.8rem;
        }

        .popup-body {
          padding: 24px;
        }

        .feature-highlight {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(164, 142, 101, 0.1) 0%, rgba(23, 22, 30, 0.1) 100%);
          border-radius: 12px;
          border-left: 4px solid #a48e65;
        }

        .highlight-icon {
          color: #a48e65;
          font-size: 1.5rem;
        }

        .feature-highlight h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .popup-description {
          color: #6c757d;
          line-height: 1.6;
          margin-bottom: 24px;
          font-size: 0.95rem;
        }

        .features-list {
          margin-bottom: 24px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          padding: 8px 0;
        }

        .feature-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #28a745;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .feature-item span {
          color: #2c3e50;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .popup-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .try-now-btn {
          background: linear-gradient(135deg, #a48e65 0%, #17161e 100%);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(164, 142, 101, 0.3);
        }

        .try-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(164, 142, 101, 0.4);
        }

        .learn-more-btn {
          background: transparent;
          color: #6c757d;
          border: 1px solid #dee2e6;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .learn-more-btn:hover {
          background: #f8f9fa;
          border-color: #a48e65;
          color: #a48e65;
        }

        .mobile-show-popup-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-promo-card .promo-btn {
            display: none;
          }
          
          .mobile-show-popup-btn {
            display: block !important;
            background: #17161e;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .mobile-show-popup-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(23, 22, 30, 0.3);
          }

          .promo-popup-content {
            margin: 10px;
            max-height: 95vh;
          }
        }
      `}</style>
    </>
  );
};

export default MobilePromoCard;