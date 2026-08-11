// LegalLibrary.jsx - COMPLETE FIX using api.js service
import React, { useState, useEffect } from "react";
import { FaSearch, FaDownload, FaClock } from "react-icons/fa";
import { booksAPI, getServerOrigin, handleApiError } from "../../services/api";
import "../Style/LegalLibrary.css";

const LegalLibrary = () => {
  const [activeCategory, setActiveCategory] = useState("Books");
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    "Books",
    "Case Laws / Judgements",
    "Acts & Rules",
    "Research Papers / Articles",
  ];

  useEffect(() => {
    loadBooks();
  }, [activeCategory, searchQuery]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📚 Loading books:", { activeCategory, searchQuery });

      const response = await booksAPI.getAll(activeCategory, searchQuery);

      console.log("✅ API Response:", response.data);

      // Backend returns { success: true, data: [...] }
      const booksData = response.data?.data || response.data || [];

      console.log("📖 Books loaded:", booksData.length);

      setBooks(Array.isArray(booksData) ? booksData : []);
    } catch (err) {
      console.error("❌ Error loading books:", err);
      setError(handleApiError(err));
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (bookId, bookTitle) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to download books");
        return;
      }

      console.log("📥 Starting download for book:", bookId);

      // Get download URL from api.js
      const response = await booksAPI.download(bookId);
      const fileUrl = response.data?.fileUrl;
      if (!fileUrl) throw new Error("The file is not available for this book.");
      const downloadUrl = fileUrl.startsWith("http") ? fileUrl : `${getServerOrigin()}${fileUrl}`;

      console.log("🔗 Download URL:", downloadUrl);

      // Open download in new tab with token
      window.open(downloadUrl, "_blank", "noopener");

      setTimeout(() => {
        alert(`Download started: ${bookTitle}`);
      }, 500);
    } catch (err) {
      console.error("❌ Download error:", err);
      alert("Failed to download book: " + handleApiError(err));
    }
  };

  const formatAddedDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="legal-library-container">
      <div className="library-header">
        <h1>Legal Library</h1>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search books, cases, acts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="categories-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={loadBooks} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="no-results">
          <p>
            No books found {searchQuery && `for "${searchQuery}"`} in{" "}
            {activeCategory}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Admin can add books through the admin panel.
          </p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="resources-grid">
          {books.map((item) => (
            <div key={item._id} className="resource-card">
              <div className="book-image">
                <img
                  src={item.coverImage ? (item.coverImage.startsWith("http") ? item.coverImage : `${getServerOrigin()}${item.coverImage}`) : ""}
                  alt={item.title}
                  className="book-cover-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="book-cover" style={{ display: "none" }}>
                  <div className="book-spine"></div>
                  <div className="book-title-fallback">{item.title}</div>
                </div>
              </div>
              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.author && (
                  <p className="book-author">By: {item.author}</p>
                )}
                {item.fileSize && (
                  <p className="book-size">Size: {item.fileSize}</p>
                )}

                {item.downloads > 0 && (
                  <p className="book-downloads">Downloads: {item.downloads}</p>
                )}
              </div>
              <button
                className="download-btn"
                onClick={() => handleDownload(item._id, item.title)}
              >
                <FaDownload className="download-icon" />
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LegalLibrary;
