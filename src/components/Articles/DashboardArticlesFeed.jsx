// src/components/Articles/DashboardArticlesFeed.jsx
// This component shows articles in the User Dashboard
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaNewspaper, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { ArticleCard } from "./ArticleCard";
import axios from "axios";

const DashboardArticlesFeed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.voiceoflaws.com/api/articles?limit=4",
      );
      setArticles(response.data);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllArticles = () => {
    navigate("/user-panel/legal-news-articles");
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading latest articles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Article (First one) */}
      {articles[0] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ArticleCard
            article={articles[0]}
            isFeatured={true}
            isAuthenticated={!!user}
          />
        </motion.div>
      )}

      {/* Recent Articles Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FaNewspaper className="text-3xl text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                Our Recent Articles
              </h2>
            </div>
            <p className="text-gray-600 text-lg">
              Stay Informed with Our Latest Insights
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-all shadow-md hover:shadow-lg"
              aria-label="Previous"
            >
              <FaChevronLeft className="text-lg" />
            </button>
            <button
              className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-all shadow-md hover:shadow-lg"
              aria-label="Next"
            >
              <FaChevronRight className="text-lg" />
            </button>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.slice(1, 4).map((article, index) => (
            <motion.div
              key={article._id || article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ArticleCard article={article} isAuthenticated={!!user} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={handleViewAllArticles}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            View All Legal Articles
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardArticlesFeed;
