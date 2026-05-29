import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowRight,
  FaClock,
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// ============================================
// ARTICLE CARD COMPONENT (Matches Screenshot 1)
// ============================================
const ArticleCard = ({ article, isFeatured = false, showAuthor = true }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to public preview first (no auth required)
    navigate(`/articles/${article._id || article.id}/preview`);
  };

  if (isFeatured) {
    return (
      <div
        className="grid md:grid-cols-2 gap-6 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Left - Image */}
        <div className="relative h-64 md:h-full">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          {article.isExternal && (
            <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              News!
            </span>
          )}
        </div>

        {/* Right - Content */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
              News!
            </span>
            <span className="flex items-center gap-1">
              <FaClock className="text-xs" />8 mins read
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            {article.description?.substring(0, 150)}...
          </p>

          <button className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
            Read More <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {showAuthor && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className="font-medium text-orange-500">
              {article.author || article.source}
            </span>
            <span>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.description}
        </p>

        <button className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all">
          Read More <FaArrowRight className="text-xs" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// PUBLIC ARTICLE PREVIEW (No Login Required)
// ============================================
const PublicArticlePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const response = await fetch(
        `https://voiceoflaw-backend.onrender.com/api/articles/${id}`
      );
      const data = await response.json();

      if (response.ok) {
        setArticle(data);
      } else {
        // If it's an external article, show message
        if (data.isExternal) {
          alert(
            "This is an external article. Please visit the source website."
          );
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error loading article:", error);
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
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Article Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* News Update Banner */}
      <div className="bg-red-50 border-b border-red-100 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-red-800">
            <span className="font-bold">News Update:</span> Stay informed with
            our latest legal insights and updates
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/")}
            >
              Home
            </span>
            <span>›</span>
            <span className="cursor-pointer hover:text-blue-600">
              Legal News
            </span>
            <span>›</span>
            <span className="text-gray-900">{article.category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Info */}
              <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center gap-4 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {(article.author || "A")[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {article.author || article.source}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-gray-600">Share:</span>
                    <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                      <FaFacebook className="text-sm" />
                    </button>
                    <button className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600">
                      <FaTwitter className="text-sm" />
                    </button>
                    <button className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800">
                      <FaLinkedin className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Limited Content Preview */}
                <div className="mt-6">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {article.description}
                  </p>

                  <div className="relative">
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      {article.content?.substring(0, 500)}...
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
                  </div>

                  {/* Login CTA */}
                  <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-3">
                      Continue Reading
                    </h3>
                    <p className="mb-6 text-blue-100">
                      Login to read the complete article and access exclusive
                      legal insights
                    </p>
                    <button
                      onClick={handleLoginToReadFull}
                      className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Login to Read Full Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Top Stories
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex gap-3 pb-4 border-b last:border-0"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${
                        1580489944761 + i * 1000
                      }-d2c8ba118e12?w=200`}
                      alt="Story"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                        Related Legal Update {i}
                      </h4>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FULL ARTICLE DETAIL (Login Required)
// ============================================
const FullArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://voiceoflaw-backend.onrender.com/api/articles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setArticle(data);
        loadRelatedArticles(data.category);
      } else {
        alert("Error loading article");
        navigate("/user-panel/legal-news-articles");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedArticles = async (category) => {
    try {
      const response = await fetch(
        `https://voiceoflaw-backend.onrender.com/api/articles?category=${category}&limit=3`
      );
      const data = await response.json();
      setRelatedArticles(data.filter((a) => a._id !== id).slice(0, 3));
    } catch (error) {
      console.error("Error loading related articles:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* News Update Banner */}
      <div className="bg-red-50 border-b border-red-100 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-red-800">
            <span className="font-bold">News Update:</span> Latest legal
            developments and insights from Pakistan
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/user-panel")}
            >
              Dashboard
            </span>
            <span>›</span>
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/user-panel/legal-news-articles")}
            >
              Legal News
            </span>
            <span>›</span>
            <span className="text-gray-900">{article.category}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {article.title}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center gap-4 pb-6 border-b mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {(article.author || "A")[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {article.author || article.source}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-gray-600">Share:</span>
                    <button className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                      <FaFacebook className="text-sm" />
                    </button>
                    <button className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600">
                      <FaTwitter className="text-sm" />
                    </button>
                    <button className="w-8 h-8 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800">
                      <FaLinkedin className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Full Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
                    {article.description}
                  </p>

                  <div className="text-gray-700 leading-relaxed space-y-4">
                    {article.content?.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* External Link if applicable */}
                {article.isExternal && article.url && (
                  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                    <p className="text-gray-700 mb-4">
                      This article was originally published on{" "}
                      <strong>{article.source}</strong>
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Read Full Article on {article.source}
                      <FaArrowRight />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b">
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((related) => (
                  <div
                    key={related._id}
                    onClick={() =>
                      navigate(`/user-panel/legal-news-articles/${related._id}`)
                    }
                    className="flex gap-3 pb-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                  >
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                        {related.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {new Date(related.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                          }
                        )}
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
  );
};

// ============================================
// ARTICLE FEED (For Dashboard)
// ============================================
const ArticleFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch(
        "https://voiceoflaw-backend.onrender.com/api/articles?limit=4"
      );
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading articles...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Featured Article */}
      {articles[0] && <ArticleCard article={articles[0]} isFeatured={true} />}

      {/* Recent Articles Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Our Recent Articles
            </h2>
            <p className="text-gray-600 mt-1">
              Stay Informed with Our Latest Insights
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-colors">
              <FaChevronLeft />
            </button>
            <button className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-blue-600 hover:text-blue-600 transition-colors">
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1, 4).map((article) => (
            <ArticleCard key={article._id || article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN EXPORT
// ============================================
export { ArticleCard, PublicArticlePreview, FullArticleDetail, ArticleFeed };
