import React, { useState, useEffect } from "react";
import "../styles/About.css";
import axios from "axios";

const API_BASE_URL = "https://api.voiceoflaws.com/api";

const blogCategories = ["Law", "Cases", "Books", "ACTS"];

const BlogSection = () => {
  const [activeCategory, setActiveCategory] = useState("Law");
  const [currentPickedCards, setCurrentPickedCards] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPickedCards(activeCategory);
    fetchLatestAndFeatured();
  }, [activeCategory]);

  const fetchPickedCards = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${API_BASE_URL}/more-about-cards/category/${category}`,
      );
      setCurrentPickedCards(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching cards:", err);
      setError("Failed to load cards");
      setCurrentPickedCards([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestAndFeatured = async () => {
    try {
      const latestResponse = await axios.get(
        `${API_BASE_URL}/more-about-cards`,
      );
      setLatestPosts(
        Array.isArray(latestResponse.data)
          ? latestResponse.data.slice(0, 4)
          : [],
      );
      setFeaturedPosts(
        Array.isArray(latestResponse.data)
          ? latestResponse.data.slice(0, 3)
          : [],
      );
    } catch (err) {
      console.error("Error fetching latest/featured:", err);
      setLatestPosts([]);
      setFeaturedPosts([]);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const tags = ["Law", "Case", "Advocate", "World"];

  return (
    <section className="blog-section">
      <section id="features" className="blog-wrapper">
        <div className="left-blog-content">
          <div className="blog-header">
            <h2 className="section-title">More About</h2>
            <div className="category-buttons">
              {blogCategories.map((category) => (
                <button
                  key={category}
                  className={`category-button ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-message">
              <p>Loading cards...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : currentPickedCards.length === 0 ? (
            <div className="no-data-message">
              <p>
                No cards available for {activeCategory}. Admin can add cards
                through the admin panel.
              </p>
            </div>
          ) : (
            <div className="picked-cards-container">
              {currentPickedCards.slice(0, 2).map((card, index) => (
                <div className="picked-card" key={card._id || index}>
                  <div className="card-image-wrapper">
                    <img
                      src={`${API_BASE_URL.replace("/api", "")}${card.image}`}
                      alt={card.title}
                      className="card-image"
                      onError={(e) =>
                        (e.target.src =
                          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400")
                      }
                    />
                    <span className="lock-icon">🔒</span>
                  </div>
                  <p className="card-date">
                    {new Date(card.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="card-title">{card.title}</h3>
                </div>
              ))}
            </div>
          )}

          <br />
          <hr />

          <section id="about" className="latest-section">
            <h2 className="section-title">Latest</h2>
            {latestPosts.length === 0 ? (
              <div className="no-data-message">
                <p>No latest posts available.</p>
              </div>
            ) : (
              <div className="latest-scroll-wrapper">
                <div className="latest-cards-container">
                  {latestPosts.map((post, index) => (
                    <div className="latest-card" key={post._id || index}>
                      <div className="latest-card-content">
                        <img
                          src={`${API_BASE_URL.replace("/api", "")}${
                            post.image
                          }`}
                          alt={post.title}
                          className="latest-image"
                          onError={(e) =>
                            (e.target.src =
                              "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400")
                          }
                        />
                        <div className="latest-details">
                          <p className="latest-date">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <h3 className="latest-title">{post.title}</h3>
                          <p className="latest-description">
                            {post.description || "No description available"}
                          </p>
                        </div>
                      </div>
                      {index < latestPosts.length - 1 && <hr />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="right-blog-content">
          <h2 className="section-title">Featured</h2>
          {featuredPosts.length === 0 ? (
            <div className="no-data-message">
              <p>No featured posts available.</p>
            </div>
          ) : (
            <div className="featured-list">
              {featuredPosts.map((post, index) => (
                <div className="featured-item" key={post._id || index}>
                  <img
                    src={`${API_BASE_URL.replace("/api", "")}${post.image}`}
                    alt={post.title}
                    className="featured-image"
                    onError={(e) =>
                      (e.target.src =
                        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300")
                    }
                  />
                  <p className="featured-title">{post.title}</p>
                  <span className="lock-icon-small">🔒</span>
                </div>
              ))}
            </div>
          )}
          <h2 className="section-title tags-title">Tags</h2>
          <div className="tag-list">
            {tags.map((tag) => (
              <span key={tag} className="tag-item">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default BlogSection;
