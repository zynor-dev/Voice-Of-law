// src/services/ArticleService.js - PROFESSIONAL VERSION
import axios from "axios";

const BACKEND_API =
  import.meta.env.VITE_API_URL || "https://voiceoflaw-backend.onrender.com/api";

// Axios instance with auth token
const api = axios.create({
  baseURL: BACKEND_API,
  timeout: 15000, // 15 second timeout
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("voicelaw_user") || "{}");
    const token = user.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Placeholder image for missing article images
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800";

class ArticleService {
  /**
   * Fetch all articles (Database + NewsAPI combined)
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @param {number} limit - Articles per page
   * @param {string} category - Category filter
   */
  static async fetchAllArticles(
    query = "",
    page = 1,
    limit = 12,
    category = "All"
  ) {
    try {
      console.log("🔍 Fetching articles:", { query, page, limit, category });

      const response = await api.get("/articles", {
        params: {
          search: query,
          page,
          limit,
          category: category !== "All" ? category : undefined,
        },
      });

      const articles = Array.isArray(response.data) ? response.data : [];

      console.log("✅ Articles fetched:", articles.length);

      return articles.map((article) => ({
        id: article._id || article.id,
        title: article.title,
        description: article.description || "No description available",
        content: article.content || article.description,
        introduction: article.introduction,
        image: article.image || PLACEHOLDER_IMAGE,
        source: article.source || "Legal Source",
        author: article.author || "Unknown",
        publishedAt:
          article.publishedAt || article.date || new Date().toISOString(),
        url: article.url,
        category: article.category || "General Legal",
        isExternal: article.isExternal || false,
        views: article.views || 0,
      }));
    } catch (error) {
      console.error(
        "❌ Fetch articles error:",
        error.response?.data || error.message
      );
      return [];
    }
  }

  /**
   * Get single article by ID
   * @param {string} id - Article ID
   */
  static async getArticleById(id) {
    try {
      console.log("📄 Fetching article:", id);

      // Check if it's an external article
      if (id.startsWith("news-")) {
        console.log("⚠️ External article - redirecting to source");
        return null;
      }

      const response = await api.get(`/articles/${id}`);

      const article = response.data;

      console.log("✅ Article fetched:", article.title);

      return {
        id: article._id || article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        introduction: article.introduction,
        image: article.image || PLACEHOLDER_IMAGE,
        source: article.source,
        author: article.author,
        publishedAt: article.publishedAt,
        url: article.url,
        category: article.category,
        isExternal: article.isExternal,
        views: article.views,
      };
    } catch (error) {
      console.error(
        "❌ Get article error:",
        error.response?.data || error.message
      );
      return null;
    }
  }

  /**
   * Search articles
   * @param {string} searchTerm - Search term
   */
  static async searchArticles(searchTerm) {
    if (!searchTerm) return this.fetchAllArticles();

    try {
      console.log("🔎 Searching articles:", searchTerm);

      const response = await api.get("/articles", {
        params: { search: searchTerm },
      });

      const articles = Array.isArray(response.data) ? response.data : [];

      console.log("✅ Search results:", articles.length);

      return articles.map((article) => ({
        id: article._id || article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        image: article.image || PLACEHOLDER_IMAGE,
        source: article.source,
        author: article.author,
        publishedAt: article.publishedAt,
        category: article.category,
        isExternal: article.isExternal,
      }));
    } catch (error) {
      console.error("❌ Search error:", error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Filter articles by category (client-side)
   * @param {Array} articles - Articles array
   * @param {string} category - Category to filter
   */
  static filterByCategory(articles, category) {
    if (category === "All") return articles;
    return articles.filter((article) => article.category === category);
  }

  /**
   * Get related articles based on category
   * @param {Object} currentArticle - Current article object
   * @param {Array} allArticles - All articles array
   * @param {number} limit - Number of related articles
   */
  static getRelatedArticles(currentArticle, allArticles, limit = 3) {
    if (!currentArticle || !allArticles) return [];

    return allArticles
      .filter(
        (article) =>
          article.id !== currentArticle.id &&
          article.category === currentArticle.category
      )
      .slice(0, limit);
  }

  /**
   * Create article (Admin only)
   * @param {Object} articleData - Article data
   */
  static async createArticle(articleData) {
    try {
      console.log("➕ Creating article:", articleData.title);

      const response = await api.post("/articles", articleData);

      console.log("✅ Article created");

      return response.data;
    } catch (error) {
      console.error(
        "❌ Create article error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Update article (Admin only)
   * @param {string} id - Article ID
   * @param {Object} articleData - Updated article data
   */
  static async updateArticle(id, articleData) {
    try {
      console.log("✏️ Updating article:", id);

      const response = await api.put(`/articles/${id}`, articleData);

      console.log("✅ Article updated");

      return response.data;
    } catch (error) {
      console.error(
        "❌ Update article error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Delete article (Admin only)
   * @param {string} id - Article ID
   */
  static async deleteArticle(id) {
    try {
      console.log("🗑️ Deleting article:", id);

      const response = await api.delete(`/articles/${id}`);

      console.log("✅ Article deleted");

      return response.data;
    } catch (error) {
      console.error(
        "❌ Delete article error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

export default ArticleService;
