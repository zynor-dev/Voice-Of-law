// DocumentVault.jsx - COMPLETE WITH ALL FIXES
import React, { useEffect, useState, useRef } from "react";
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
import "../Style/Vault.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const DocumentVault = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVault = async () => {
    try {
      setLoading(true);
      const response = await api.get("/vault");
      setVaultItems(response.data?.data?.items || response.data?.items || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your Document Vault.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadVault(); }, []);

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

  const toggleFavorite = async (item) => {
    try {
      if (item.entityType === "conversation") {
        await api.patch(`/ai/conversations/${item.target.conversationId}/bookmark`);
      } else if (item.entityType === "message") {
        await api.patch(`/ai/conversations/${item.target.conversationId}/messages/${item.target.messageId}/bookmark`);
      } else if (item.entityType === "case") {
        await api.patch(`/cases/${item.target.caseId}/bookmark`);
      } else {
        await api.patch(`/vault/${item.id.replace("vault-", "")}/favorite`);
      }
      await loadVault();
    } catch (err) { setError(err.response?.data?.message || "Could not update favourite."); }
  };

  const filteredItems = vaultItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags || []).some((tag) =>
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

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    try {
      await api.post("/vault/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setShowUploadModal(false);
      event.target.value = "";
      await loadVault();
    } catch (err) { setError(err.response?.data?.message || "Upload failed. Please try again."); }
  };

  const openItem = async (item) => {
    if (item.entityType === "conversation" || item.entityType === "message") {
      navigate("/user-panel/chatbot", { state: item.target });
      return;
    }
    if (item.entityType === "case") {
      navigate(`/user-panel/cases/${item.target.caseId}`);
      return;
    }
    if (item.externalUrl) return window.open(item.externalUrl, "_blank", "noopener");
    if (!item.fileEndpoint) return;
    try {
      const response = await api.get(item.fileEndpoint, { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      window.open(url, "_blank", "noopener");
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) { setError("Could not open this document."); }
  };

  const deleteItem = async (item) => {
    if (item.source !== "vault" || !window.confirm("Delete this document from your Vault?")) return;
    try {
      await api.delete(`/vault/${item.id.replace("vault-", "")}`);
      setVaultItems((items) => items.filter((entry) => entry.id !== item.id));
    } catch (err) { setError(err.response?.data?.message || "Could not delete this document."); }
  };

  const formatSize = (size) => size ? `${(size / (1024 * 1024)).toFixed(size >= 1024 * 1024 ? 1 : 2)} MB` : "—";

  const handleUploadClick = () => {
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
          {item.sizeBytes && (
            <>
              <span>•</span>
              <span>{formatSize(item.sizeBytes)}</span>
            </>
          )}
        </div>
      </div>

      <div className="row-tags">
        {(item.tags || []).slice(0, 2).map((tag, index) => (
          <span key={index} className="tag-small">
            {tag}
          </span>
        ))}
        {(item.tags || []).length > 2 && (
          <span className="tag-more">+{item.tags.length - 2}</span>
        )}
      </div>

      <div className="row-actions">
        <button
          className={`favorite-btn ${item.isFavorite ? "active" : ""}`}
          onClick={() => toggleFavorite(item)}
          aria-label={item.isFavorite ? "Remove from favourites" : "Add to favourites"}
        >
          {item.isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
        <button className="action-btn-small" onClick={() => openItem(item)}>
          <FaEye />
        </button>
        <button className="action-btn-small" onClick={() => openItem(item)}>
          <FaDownload />
        </button>
        <button className="action-btn-small danger" onClick={() => deleteItem(item)} disabled={item.source !== "vault"}>
          <FaTrash />
        </button>
      </div>
    </div>
  );

  return (
    <div className="vault-container">
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
        {error && <div className="vault-error" role="alert">{error}</div>}
        {loading ? (
          <div className="empty-state"><h3>Loading your documents…</h3></div>
        ) : filteredItems.length === 0 ? (
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
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVault;
