import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ArticleService from "../../services/ArticleService";
import { ArticleCard } from "./ArticleCard";
import { FaSearch, FaFilter, FaTimes, FaNewspaper } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./DashboardFeed.css";

const CATEGORIES = [
  "All",
  "Criminal Law",
  "Civil Law",
  "Tax Law",
  "Family Law",
  "Corporate Law",
  "Constitutional Law",
  "General Legal",
];

const DashboardFeed = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, page]);

  useEffect(() => {
    applyFilters();
  }, [articles, searchTerm, sortBy]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      console.log("📰 Loading articles...");

      const data = await ArticleService.fetchAllArticles(
        searchTerm,
        page,
        12,
        selectedCategory
      );

      if (page === 1) {
        setArticles(data);
      } else {
        setArticles((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === 12);

      console.log("✅ Articles loaded:", data.length);
    } catch (error) {
      console.error("❌ Failed to load articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...articles];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredArticles(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    setArticles([]);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const SkeletonCard = () => (
    <div className="article-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-feed">
      {/* Header Section */}
      <motion.div
        className="feed-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="feed-title-section">
          <h1 className="feed-title">
            <FaNewspaper style={{ marginRight: "12px" }} />
            Legal News & Articles
          </h1>
          <p className="feed-subtitle">
            Stay updated with the latest legal developments in Pakistan
          </p>
        </div>

        <div className="feed-controls">
          <div className="search-bar-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={handleSearch}
              className="feed-search-input"
            />
            {searchTerm && (
              <button onClick={clearSearch} className="clear-search-btn">
                <FaTimes />
              </button>
            )}
          </div>

          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="filters-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="filters-content">
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <div className="category-pills">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      className={`category-pill ${
                        selectedCategory === category ? "active" : ""
                      }`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Info */}
      <div className="results-info">
        <p>
          Showing <strong>{filteredArticles.length}</strong> articles
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="articles-grid">
        {loading && page === 1 ? (
          <>
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </>
        ) : filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ArticleCard article={article} isAuthenticated={!!user} />
            </motion.div>
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">📰</div>
            <h3>No Articles Found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {!loading && filteredArticles.length > 0 && hasMore && (
        <div className="load-more-section">
          <button
            onClick={loadMore}
            className="load-more-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More Articles"}
          </button>
        </div>
      )}

      {/* Loading Indicator for Load More */}
      {loading && page > 1 && (
        <div className="articles-grid" style={{ marginTop: "2rem" }}>
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={`loading-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardFeed;
