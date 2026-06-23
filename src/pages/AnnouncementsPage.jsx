// src/components/UpdatedAnnouncementsPage.jsx
import React, { useState, useEffect } from "react";
import "../styles/AnnouncementsPage.css";

const API_BASE = "https://voiceoflaw-backend.onrender.com/api";

const AnnouncementsPage = () => {
  const [activeTab, setActiveTab] = useState("TENDERS");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch announcements from backend
  useEffect(() => {
    fetchAnnouncements();
  }, [activeTab]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/announcements?category=${activeTab}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message);
      // Fallback to mock data if API fails
      setAnnouncements(getMockAnnouncements(activeTab));
    } finally {
      setLoading(false);
    }
  };

  const getMockAnnouncements = (category) => {
    const mockData = {
      TENDERS: [
        {
          id: "1",
          date: "16-MAY-2025",
          type: "Tender",
          title:
            "Islamabad High Court Islamabad invites electronic bids through PPPRA EPPADS portal as per Rule-2004, Rule 3(a), (Single Stage on...",
          link: "#",
          priority: "high",
        },
        {
          id: "2",
          date: "15-NOV-2024",
          type: "Tender",
          title:
            "Islamabad High Court, Islamabad invites sealed-bids from well reputed contractors based in Islamabad / Rawalpindi, register...",
          link: "#",
          priority: "medium",
        },
      ],
      NOTIFICATIONS: [
        {
          id: "3",
          date: "24-FEB-2025",
          type: "Notification",
          title:
            "New court procedures for digital document submission now in effect for all registered legal practitioners...",
          link: "#",
          priority: "high",
        },
        {
          id: "4",
          date: "10-JAN-2025",
          type: "Notification",
          title:
            "Updated guidelines for case filing and documentation requirements have been published...",
          link: "#",
          priority: "medium",
        },
      ],
      PRESS_RELEASE: [
        {
          id: "5",
          date: "20-APR-2025",
          type: "Press Release",
          title:
            "Islamabad High Court announces digital transformation initiative for improved public access to legal services...",
          link: "#",
          priority: "high",
        },
      ],
      NEWS: [
        {
          id: "6",
          date: "18-APR-2025",
          type: "News",
          title:
            "Supreme Court ruling on constitutional matters affects lower court proceedings nationwide...",
          link: "#",
          priority: "medium",
        },
      ],
      EVENTS: [
        {
          id: "7",
          date: "25-MAY-2025",
          type: "Event",
          title:
            "Annual Legal Conference 2025 - Registration now open for legal practitioners and law students...",
          link: "#",
          priority: "medium",
        },
      ],
      DOWNLOADS: [
        {
          id: "8",
          date: "12-APR-2025",
          type: "Download",
          title:
            "Updated legal forms and templates are now available for download from the official portal...",
          link: "#",
          priority: "low",
        },
      ],
    };
    return mockData[category] || [];
  };

  const formatDate = (dateString) => {
    try {
      // Handle both DD-MMM-YYYY and YYYY-MM-DD formats
      let date;
      if (dateString.includes("-") && dateString.split("-")[0].length === 4) {
        // YYYY-MM-DD format
        date = new Date(dateString);
      } else {
        // DD-MMM-YYYY format
        date = new Date(dateString.replace(/-/g, " "));
      }

      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-")
        .toUpperCase();
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      Tender: "📋",
      Notification: "📢",
      "Press Release": "📰",
      News: "📺",
      Event: "📅",
      Download: "⬇️",
    };
    return iconMap[type] || "📄";
  };

  if (error && announcements.length === 0) {
    return (
      <div id="ann">
        <div className="announcements-page-container">
          <div className="announcements-header">
            <h1 className="announcements-title">
              <span role="img" aria-label="alert">
                📢
              </span>{" "}
              Announcements & Alerts
            </h1>
            <div className="error-message">
              <p>Unable to load announcements. Please try again later.</p>
              <button onClick={fetchAnnouncements} className="retry-btn">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="ann">
      <div className="announcements-page-container">
        <div className="announcements-header">
          <h1 className="announcements-title">
            <span role="img" aria-label="alert">
              📢
            </span>{" "}
            Announcements & Alerts
          </h1>
          <div className="announcements-tabs">
            {[
              "TENDERS",
              "NOTIFICATIONS",
              "PRESS_RELEASE",
              "NEWS",
              "EVENTS",
              "DOWNLOADS",
            ].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="no-announcements">
            <p>No announcements available for this category.</p>
          </div>
        ) : (
          <div className="announcements-grid">
            {announcements.map((announcement) => (
              <div
                className={`announcement-card ${getPriorityColor(
                  announcement.priority
                )}`}
                key={announcement.id}
              >
                <div className="card-header">
                  <span className="card-date">
                    {formatDate(announcement.date)}
                  </span>
                  <div className="card-type-container">
                    <span className="card-type-icon">
                      {getTypeIcon(announcement.type)}
                    </span>
                    <span className="card-type">{announcement.type}</span>
                  </div>
                </div>
                <p className="card-title">{announcement.title}</p>
                <div className="card-footer">
                  <a
                    href={announcement.link || "#"}
                    className="read-more-btn"
                    onClick={(e) => {
                      if (!announcement.link || announcement.link === "#") {
                        e.preventDefault();
                        alert("Full details will be available soon.");
                      }
                    }}
                  >
                    Read More →
                  </a>
                  {announcement.priority && (
                    <span
                      className={`priority-badge priority-${announcement.priority}`}
                    >
                      {announcement.priority.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
