// DocumentVault.jsx - COMPLETE WITH ALL FIXES
import React, { useState, useRef } from "react";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaStar,
  FaRegStar,
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaFolder,
  FaUpload,
  FaRobot,
  FaBookOpen,
  FaBell,
  FaStickyNote,
  FaTags,
  FaCalendar,
  FaUser,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaCopy,
} from "react-icons/fa";
import SubscriptionBlocker from "../../components/SubscriptionBlocker";
import useSubscriptionCheck from "../../hooks/useSubscriptionCheck";
import "../Style/Vault.css";

const DocumentVault = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ FIX: Get subscription status properly
  const { canAccessFeature, subscriptionStatus } = useSubscriptionCheck();
  const [showBlocker, setShowBlocker] = useState(false);

  const [vaultItems, setVaultItems] = useState([
    {
      id: 1,
      title: "Property Sale Agreement - Ahmed vs Khan",
      type: "document",
      fileType: "pdf",
      source: "case",
      caseId: "C001",
      dateAdded: "2024-01-15",
      size: "2.4 MB",
      isFavorite: true,
      tags: ["property", "agreement", "urgent"],
      description:
        "Legal agreement for property sale between Ahmad Khan and Malik Ahmed",
      addedBy: "user",
    },
    {
      id: 2,
      title: "AI Legal Research - Criminal Law Precedents",
      type: "chat",
      source: "chatbot",
      dateAdded: "2024-01-14",
      isFavorite: false,
      tags: ["research", "criminal law"],
      description:
        "Comprehensive research on criminal law precedents in Pakistan",
      chatContent:
        "Criminal law in Pakistan is governed by the Pakistan Penal Code 1860...",
      addedBy: "chatbot",
    },
    {
      id: 3,
      title: "Contract Law Handbook - Legal Library",
      type: "reference",
      source: "library",
      dateAdded: "2024-01-13",
      isFavorite: true,
      tags: ["contract law", "reference"],
      description:
        "Essential guide to contract law principles and applications",
      addedBy: "library",
    },
    {
      id: 4,
      title: "New Security Updates - Platform Announcement",
      type: "update",
      source: "updates",
      dateAdded: "2024-01-12",
      isFavorite: false,
      tags: ["security", "announcement"],
      description: "Important security enhancements and new features announced",
      addedBy: "system",
    },
    {
      id: 5,
      title: "Meeting Notes - Client Consultation",
      type: "note",
      source: "notes",
      dateAdded: "2024-01-11",
      isFavorite: true,
      tags: ["meeting", "client"],
      description: "Discussion points and action items from client meeting",
      noteContent:
        "Client discussed property dispute case. Key points: 1. Timeline, 2. Documentation needed...",
      addedBy: "user",
    },
  ]);

  const categories = [
    {
      id: "all",
      name: "All Items",
      icon: <FaFolder />,
      count: vaultItems.length,
    },
    {
      id: "documents",
      name: "Documents",
      icon: <FaFileAlt />,
      count: vaultItems.filter((item) => item.type === "document").length,
    },
    {
      id: "chats",
      name: "AI Chats",
      icon: <FaRobot />,
      count: vaultItems.filter((item) => item.type === "chat").length,
    },
    {
      id: "references",
      name: "Library Items",
      icon: <FaBookOpen />,
      count: vaultItems.filter((item) => item.type === "reference").length,
    },
    {
      id: "updates",
      name: "Updates",
      icon: <FaBell />,
      count: vaultItems.filter((item) => item.type === "update").length,
    },
    {
      id: "notes",
      name: "Notes",
      icon: <FaStickyNote />,
      count: vaultItems.filter((item) => item.type === "note").length,
    },
    {
      id: "favorites",
      name: "Favorites",
      icon: <FaStar />,
      count: vaultItems.filter((item) => item.isFavorite).length,
    },
  ];

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "pdf":
        return <FaFilePdf style={{ color: "#dc3545" }} />;
      case "doc":
      case "docx":
        return <FaFileWord style={{ color: "#007bff" }} />;
      case "jpg":
      case "png":
      case "gif":
        return <FaFileImage style={{ color: "#28a745" }} />;
      default:
        return <FaFileAlt style={{ color: "#6c757d" }} />;
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case "chatbot":
        return <FaRobot style={{ color: "#667eea" }} />;
      case "library":
        return <FaBookOpen style={{ color: "#28a745" }} />;
      case "updates":
        return <FaBell style={{ color: "#fd7e14" }} />;
      case "notes":
        return <FaStickyNote style={{ color: "#ffc107" }} />;
      case "case":
        return <FaFileAlt style={{ color: "#dc3545" }} />;
      default:
        return <FaFolder style={{ color: "#6c757d" }} />;
    }
  };

  const toggleFavorite = (itemId) => {
    setVaultItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const filteredItems = vaultItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      activeTab === "all" ||
      (activeTab === "favorites" && item.isFavorite) ||
      (activeTab === "documents" && item.type === "document") ||
      (activeTab === "chats" && item.type === "chat") ||
      (activeTab === "references" && item.type === "reference") ||
      (activeTab === "updates" && item.type === "update") ||
      (activeTab === "notes" && item.type === "note");

    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (event) => {
    // ✅ CHECK SUBSCRIPTION - Block only if trial expired AND not subscribed
    if (!canAccessFeature()) {
      setShowBlocker(true);
      return;
    }

    const files = Array.from(event.target.files);
    files.forEach((file) => {
      const newItem = {
        id: Date.now() + Math.random(),
        title: file.name,
        type: "document",
        fileType: file.name.split(".").pop().toLowerCase(),
        source: "upload",
        dateAdded: new Date().toISOString().split("T")[0],
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        isFavorite: false,
        tags: ["uploaded"],
        description: `Uploaded file: ${file.name}`,
        addedBy: "user",
      };
      setVaultItems((prev) => [newItem, ...prev]);
    });
    setShowUploadModal(false);
  };

  const handleUploadClick = () => {
    // ✅ CHECK SUBSCRIPTION - Block only if trial expired AND not subscribed
    if (!canAccessFeature()) {
      setShowBlocker(true);
      return;
    }
    setShowUploadModal(true);
  };

  const VaultItemRow = ({ item }) => (
    <div className="vault-item-row">
      <div className="row-icon">
        {item.type === "document"
          ? getFileIcon(item.fileType)
          : getSourceIcon(item.source)}
      </div>

      <div className="row-content">
        <div className="row-title">{item.title}</div>
        <div className="row-meta">
          <span>{item.addedBy}</span>
          <span>•</span>
          <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
          {item.size && (
            <>
              <span>•</span>
              <span>{item.size}</span>
            </>
          )}
        </div>
      </div>

      <div className="row-tags">
        {item.tags.slice(0, 2).map((tag, index) => (
          <span key={index} className="tag-small">
            {tag}
          </span>
        ))}
        {item.tags.length > 2 && (
          <span className="tag-more">+{item.tags.length - 2}</span>
        )}
      </div>

      <div className="row-actions">
        <button
          className={`favorite-btn ${item.isFavorite ? "active" : ""}`}
          onClick={() => toggleFavorite(item.id)}
        >
          {item.isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
        <button className="action-btn-small">
          <FaEye />
        </button>
        <button className="action-btn-small">
          <FaDownload />
        </button>
        <button className="action-btn-small danger">
          <FaTrash />
        </button>
      </div>
    </div>
  );

  return (
    <div className="vault-container">
      {/* ✅ SHOW TRIAL STATUS BANNER */}
      {subscriptionStatus?.isTrialActive && (
        <div
          className="trial-status-banner"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            textAlign: "center",
            fontSize: "0.9rem",
            fontWeight: "500",
          }}
        >
          🎉 Free Trial Active - {subscriptionStatus.daysRemaining} days
          remaining
        </div>
      )}

      <div className="vault-header">
        <div className="header-content">
          <h1>Document Vault</h1>
          <p>
            Manage all your saved documents, chats, and references in one place
          </p>
        </div>

        <div className="header-actions">
          <button className="upload-btn" onClick={handleUploadClick}>
            <FaPlus />
            Add to Vault
          </button>
        </div>
      </div>

      <div className="vault-controls">
        <div className="search-section">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search vault items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="vault-content">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaFolder />
            </div>
            <h3>No items found</h3>
            <p>Try adjusting your search or add new items to your vault</p>
            <button className="empty-action-btn" onClick={handleUploadClick}>
              <FaPlus />
              Add First Item
            </button>
          </div>
        ) : (
          <div className="vault-items list-view">
            {filteredItems.map((item) => (
              <VaultItemRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <div
          className="upload-modal-overlay"
          onClick={() => setShowUploadModal(false)}
        >
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add to Vault</h3>
              <button
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="upload-options">
                <button
                  className="upload-option"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaUpload />
                  <span>Upload Files</span>
                  <p>Upload documents, images, or PDFs</p>
                </button>

                <button className="upload-option">
                  <FaStickyNote />
                  <span>Create Note</span>
                  <p>Add a quick note or memo</p>
                </button>

                <button className="upload-option">
                  <FaCopy />
                  <span>Save from Clipboard</span>
                  <p>Save text from clipboard</p>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx,.txt,.jpg,.png,.gif"
              />
            </div>
          </div>
        </div>
      )}

      {/* ✅ Subscription Blocker - Only shows when trial expired AND not subscribed */}
      <SubscriptionBlocker
        isOpen={showBlocker}
        onClose={() => setShowBlocker(false)}
        featureName="Document Upload"
      />
    </div>
  );
};

export default DocumentVault;
