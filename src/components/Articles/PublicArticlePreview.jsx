// src/components/Articles/PublicArticlePreview.jsx - NO LOGIN REQUIRED
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaArrowRight,
  FaLock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const PublicArticlePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.voiceoflaws.com/api/articles/${id}`,
      );

      if (response.data.isExternal) {
        // If external article, redirect to source
        window.open(response.data.url, "_blank");
        navigate("/");
        return;
      }

      setArticle(response.data);
    } catch (err) {
      console.error("Error loading article:", err);
      setError("Article not found or unavailable");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginToReadFull = () => {
    navigate("/auth/login", {
      state: { from: `/user-panel/legal-news-articles/${id}` },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading article...</p>
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
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Back to Home
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
          <div className="flex items-center gap-2 text-sm animate-marquee">
            <span className="font-bold text-red-800 whitespace-nowrap">
              News Update:
            </span>
            <span className="text-red-700">
              Latest legal insights and updates from Pakistan • Constitutional
              amendments under discussion • Tax law reforms 2024
            </span>
          </div>
        </div>
      </div>

      {/* Breadcrumb - Matches Screenshot */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => navigate("/")}
              className="hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </button>
            <span className="text-gray-400">›</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer font-medium">
              Legal News
            </span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 font-semibold">
              {article.category}
            </span>
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
              <div className="relative h-[400px] overflow-hidden">
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
                <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
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
                    <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md">
                      <FaFacebook />
                    </button>
                    <button className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md">
                      <FaTwitter />
                    </button>
                    <button className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors shadow-md">
                      <FaLinkedin />
                    </button>
                  </div>
                </div>

                {/* Article Introduction */}
                <div className="text-gray-700 space-y-6">
                  <p className="text-xl leading-relaxed font-medium text-gray-800">
                    {article.description}
                  </p>

                  {/* Limited Content Preview */}
                  <div className="relative">
                    <div className="text-lg leading-relaxed space-y-4">
                      {article.content?.substring(0, 600)}
                      {article.content?.length > 600 && "..."}
                    </div>

                    {/* Gradient Fade Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                  </div>
                </div>

                {/* Login CTA Card - Matches Screenshot Style */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-10 text-center text-white shadow-2xl relative overflow-hidden"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaLock className="text-3xl text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3">
                      Continue Reading
                    </h3>
                    <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
                      Login to read the complete article and access exclusive
                      legal insights, case studies, and expert analysis
                    </p>
                    <button
                      onClick={handleLoginToReadFull}
                      className="inline-flex items-center gap-3 bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      Login to Read Full Article
                      <FaArrowRight />
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar - Right 1/3 - Matches Screenshot */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-100">
                  Top Stories
                </h3>

                <div className="space-y-5">
                  {[
                    {
                      id: 1,
                      img: "1580489944761",
                      title: "Constitutional Law Updates for 2024",
                      time: "2 days ago",
                    },
                    {
                      id: 2,
                      img: "1589829545856",
                      title: "Supreme Court Landmark Decision on Tax Reforms",
                      time: "3 days ago",
                    },
                    {
                      id: 3,
                      img: "1505664194779",
                      title: "New Corporate Governance Guidelines",
                      time: "5 days ago",
                    },
                  ].map((story) => (
                    <div
                      key={story.id}
                      className="flex gap-4 pb-5 border-b last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                    >
                      <img
                        src={`https://images.unsplash.com/photo-${story.img}?w=200`}
                        alt={story.title}
                        className="w-24 h-24 object-cover rounded-lg shadow-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-2 mb-2 leading-tight">
                          {story.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">
                          {story.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PublicArticlePreview;
