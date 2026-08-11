// src/components/Articles/FullArticleDetail.jsx - LOGIN REQUIRED (FULL ACCESS)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaArrowRight,
  FaArrowLeft,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const FullArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login", {
        state: { from: `/user-panel/legal-news-articles/${id}` },
      });
      return;
    }
    loadArticle();
  }, [id, user]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `https://api.voiceoflaws.com/api/articles/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.isExternal) {
        window.open(response.data.url, "_blank");
        navigate("/user-panel/legal-news-articles");
        return;
      }

      setArticle(response.data);
      loadRelatedArticles(response.data.category);
    } catch (err) {
      console.error("Error loading article:", err);
      setError("Article not found or unavailable");
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedArticles = async (category) => {
    try {
      const response = await axios.get(
        `https://api.voiceoflaws.com/api/articles?category=${category}&limit=4`,
      );
      setRelatedArticles(response.data.filter((a) => a._id !== id).slice(0, 3));
    } catch (err) {
      console.error("Error loading related articles:", err);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = article.title;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url,
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url,
      )}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url,
      )}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold text-lg">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The article you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/user-panel/legal-news-articles")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* News Update Banner - Matches Screenshot */}
      <div className="bg-red-50 border-b border-red-100 py-2.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-red-800 whitespace-nowrap">
              News Update:
            </span>
            <marquee className="text-red-700">
              Latest legal developments from Pakistan • Constitutional
              amendments • Tax law reforms • Supreme Court decisions
            </marquee>
          </div>
        </div>
      </div>

      {/* Breadcrumb - Matches Screenshot */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                onClick={() => navigate("/user-panel")}
                className="hover:text-blue-600 transition-colors font-medium"
              >
                Dashboard
              </button>
              <span className="text-gray-400">›</span>
              <button
                onClick={() => navigate("/user-panel/legal-news-articles")}
                className="hover:text-blue-600 transition-colors font-medium"
              >
                Legal News
              </button>
              <span className="text-gray-400">›</span>
              <span className="text-gray-900 font-semibold">
                {article.category}
              </span>
            </div>

            <button
              onClick={() => navigate("/user-panel/legal-news-articles")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors"
            >
              <FaArrowLeft />
              Back to Articles
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Article Content - Left 2/3 */}
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Hero Image */}
              <div className="relative h-[450px] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800";
                  }}
                />
                {/* Category Badge on Image */}
                <div className="absolute top-6 left-6 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg text-sm">
                  {article.category}
                </div>
              </div>

              {/* Article Body */}
              <div className="p-8 sm:p-10 lg:p-12">
                {/* Title */}
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {article.title}
                </h1>

                {/* Meta Information */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b-2 border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {(article.author ||
                        article.source ||
                        "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {article.author || article.source || "Legal Team"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium mr-2">
                      Share:
                    </span>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    >
                      <FaFacebook />
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    >
                      <FaTwitter />
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
                    >
                      <FaLinkedin />
                    </button>
                  </div>
                </div>

                {/* Full Article Content */}
                <div className="prose prose-lg max-w-none">
                  {/* Introduction/Description */}
                  <p className="text-xl leading-relaxed font-medium text-gray-800 mb-8 pb-6 border-b border-gray-200">
                    {article.description}
                  </p>

                  {/* Main Content */}
                  <div className="text-gray-700 text-lg leading-relaxed space-y-6">
                    {article.content?.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* External Link Card (if applicable) */}
                {article.isExternal && article.url && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-12 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-8 text-center"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Read Original Article
                    </h3>
                    <p className="text-gray-700 mb-6">
                      This article was originally published on{" "}
                      <strong>{article.source}</strong>
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Visit {article.source}
                      <FaExternalLinkAlt />
                    </a>
                  </motion.div>
                )}

                {/* Article Footer */}
                <div className="mt-12 pt-8 border-t-2 border-gray-100">
                  <div className="flex flex-wrap gap-3">
                    <span className="text-sm font-semibold text-gray-600">
                      Tags:
                    </span>
                    {[article.category, "Pakistan Law", "Legal Updates"].map(
                      (tag, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar - Right 1/3 - Matches Screenshot */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Related Articles */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-100">
                  Related Articles
                </h3>

                <div className="space-y-5">
                  {relatedArticles.length > 0 ? (
                    relatedArticles.map((related) => (
                      <div
                        key={related._id}
                        onClick={() =>
                          navigate(
                            `/user-panel/legal-news-articles/${related._id}`,
                          )
                        }
                        className="flex gap-4 pb-5 border-b last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-all hover:scale-105"
                      >
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-24 h-24 object-cover rounded-lg shadow-md flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mb-2 leading-tight hover:text-blue-600 transition-colors">
                            {related.title}
                          </h4>
                          <p className="text-xs text-gray-500 font-medium">
                            {new Date(related.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No related articles found
                    </p>
                  )}
                </div>
              </div>

              {/* Newsletter Signup (Optional) */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get the latest legal news and insights delivered to your inbox
                </p>
                <button className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-md">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullArticleDetail;
