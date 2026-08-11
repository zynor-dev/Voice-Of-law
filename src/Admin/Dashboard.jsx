// Dashboard.jsx - COMPLETE FIX with proper error handling and data loading
import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaBars,
  FaChartBar,
  FaFileAlt,
  FaBell,
  FaBook,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import "./Style/Dashboard.css";
import DraftingTemplateManager from "./DraftingTemplateManager";

const API_BASE_URL = "https://api.voiceoflaws.com/api";

// ============================================
// COMPLETE API SERVICE WITH ERROR HANDLING
// ============================================
const api = {
  // Helper function to get auth token
  getAuthToken: () => {
    return localStorage.getItem("token");
  },

  // Helper function to create headers
  getHeaders: (isFormData = false) => {
    const token = api.getAuthToken();
    const headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  },

  // Generic fetch with error handling
  fetchWithAuth: async (url, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...api.getHeaders(options.body instanceof FormData),
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${url}):`, error);
      throw error;
    }
  },

  // More About Cards
  moreAbout: {
    getAll: () => api.fetchWithAuth("/more-about-cards"),
    create: (formData) =>
      api.fetchWithAuth("/more-about-cards", {
        method: "POST",
        body: formData,
      }),
    update: (id, formData) =>
      api.fetchWithAuth(`/more-about-cards/${id}`, {
        method: "PUT",
        body: formData,
      }),
    delete: (id) =>
      api.fetchWithAuth(`/more-about-cards/${id}`, {
        method: "DELETE",
      }),
  },

  // Latest Updates
  latestUpdates: {
    getAll: () => api.fetchWithAuth("/latest-updates"),
    create: (formData) =>
      api.fetchWithAuth("/latest-updates", {
        method: "POST",
        body: formData,
      }),
    update: (id, formData) =>
      api.fetchWithAuth(`/latest-updates/${id}`, {
        method: "PUT",
        body: formData,
      }),
    delete: (id) =>
      api.fetchWithAuth(`/latest-updates/${id}`, {
        method: "DELETE",
      }),
  },

  // Announcements
  announcements: {
    getAll: () => api.fetchWithAuth("/announcements"),
    create: (data) =>
      api.fetchWithAuth("/announcements", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id, data) =>
      api.fetchWithAuth(`/announcements/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      api.fetchWithAuth(`/announcements/${id}`, {
        method: "DELETE",
      }),
  },

  // Books
  books: {
    getAll: () => api.fetchWithAuth("/v1/admin/library"),
    create: (formData) =>
      api.fetchWithAuth("/v1/admin/library", {
        method: "POST",
        body: formData,
      }),
    update: (id, formData) =>
      api.fetchWithAuth(`/v1/admin/library/${id}`, {
        method: "PUT",
        body: formData,
      }),
    delete: (id) =>
      api.fetchWithAuth(`/v1/admin/library/${id}`, {
        method: "DELETE",
      }),
  },

  // Dashboard Stats
  stats: {
    get: () => api.fetchWithAuth("/dashboard-stats"),
  },
};

// ============================================
// MODAL COMPONENT
// ============================================
const Modal = ({
  show,
  onClose,
  type,
  item,
  onSave,
  loading,
  formData,
  setFormData,
  setImageFile,
  setPdfFile,
}) => {
  if (!show) return null;

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePdfChange = (e) => {
    if (e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const renderForm = () => {
    if (type === "book") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={formData.category || "Books"}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option>Books</option>
              <option>Case Laws / Judgements</option>
              <option>Acts & Rules</option>
              <option>Research Papers / Articles</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description *
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <input
              type="text"
              value={formData.author || ""}
              onChange={(e) => handleInputChange("author", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Book Cover Image {!item && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required={!item}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              PDF File {!item && "*"}
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required={!item}
            />
          </div>
        </div>
      );
    }

    if (type === "moreAbout") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={formData.category || "Law"}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option>Law</option>
              <option>Cases</option>
              <option>Books</option>
              <option>ACTS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description *
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              value={formData.date?.split("T")[0] || ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Image {!item && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isLocked"
              checked={formData.isLocked || false}
              onChange={(e) => handleInputChange("isLocked", e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isLocked">Locked Content</label>
          </div>
        </div>
      );
    }

    if (type === "latestUpdate") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Summary *</label>
            <input
              type="text"
              value={formData.summary || ""}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Details *</label>
            <textarea
              value={formData.details || ""}
              onChange={(e) => handleInputChange("details", e.target.value)}
              rows="4"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="text"
              value={formData.date || ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="e.g., 2 days ago"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              value={formData.type || "Feature"}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option>Feature</option>
              <option>Security</option>
              <option>Update</option>
              <option>Bug Fix</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Image {!item && "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>
      );
    }

    if (type === "announcement") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              type="date"
              value={formData.date?.split("T")[0] || ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              value={formData.type || "Tender"}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option>Tender</option>
              <option>Notification</option>
              <option>Press Release</option>
              <option>News</option>
              <option>Event</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <textarea
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              rows="3"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={formData.category || "TENDERS"}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option>TENDERS</option>
              <option>NOTIFICATIONS</option>
              <option>PRESS_RELEASE</option>
              <option>NEWS</option>
              <option>EVENTS</option>
              <option>DOWNLOADS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority *</label>
            <select
              value={formData.priority || "medium"}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      );
    }
  };

  const getModalTitle = () => {
    const titles = {
      book: "Book",
      moreAbout: "More About Card",
      latestUpdate: "Latest Update",
      announcement: "Announcement",
    };
    return `${item ? "Edit" : "Add"} ${titles[type] || ""}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {getModalTitle()}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>
          {renderForm()}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <FaSave /> <span>{loading ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`bg-gradient-to-br from-${color}-500 to-${color}-600 text-white p-6 rounded-xl shadow-lg`}
  >
    <div className="flex items-center">
      <Icon className="text-3xl mr-4" />
      <div>
        <p className={`text-${color}-100 text-sm`}>{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

// ============================================
// ALERT COMPONENT
// ============================================
const Alert = ({ type, message, onRetry }) => {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const icons = {
    error: FaExclamationTriangle,
    success: FaCheckCircle,
    warning: FaExclamationTriangle,
  };

  const Icon = icons[type];

  return (
    <div className={`${styles[type]} border rounded-lg p-4 flex items-start`}>
      <Icon className="mt-1 mr-3" />
      <div className="flex-1">
        <p>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [moreAboutCards, setMoreAboutCards] = useState([]);
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data with individual error handling
      const [cardsRes, updatesRes, announcementsRes, booksRes, statsRes] =
        await Promise.all([
          api.moreAbout
            .getAll()
            .then((data) => ({ success: true, data }))
            .catch((err) => {
              console.warn("Failed to load cards:", err);
              return { success: false, data: [] };
            }),
          api.latestUpdates
            .getAll()
            .then((data) => ({ success: true, data }))
            .catch((err) => {
              console.warn("Failed to load updates:", err);
              return { success: false, data: [] };
            }),
          api.announcements
            .getAll()
            .then((data) => ({ success: true, data }))
            .catch((err) => {
              console.warn("Failed to load announcements:", err);
              return { success: false, data: [] };
            }),
          api.books
            .getAll()
            .then((data) => ({ success: true, data }))
            .catch((err) => {
              console.warn("Failed to load books:", err);
              return { success: false, data: { data: [] } };
            }),
          api.stats
            .get()
            .then((data) => ({ success: true, data }))
            .catch((err) => {
              console.warn("Failed to load stats:", err);
              return {
                success: false,
                data: {
                  totalMoreAboutCards: 0,
                  totalLatestUpdates: 0,
                  totalAnnouncements: 0,
                  totalBooks: 0,
                },
              };
            }),
        ]);

      setMoreAboutCards(Array.isArray(cardsRes.data) ? cardsRes.data : []);
      setLatestUpdates(Array.isArray(updatesRes.data) ? updatesRes.data : []);
      setAnnouncements(
        Array.isArray(announcementsRes.data) ? announcementsRes.data : [],
      );
      setBooks(Array.isArray(booksRes.data?.books) ? booksRes.data.books : []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error("Load data error:", error);
      setError(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || getEmptyFormData(type));
    setImageFile(null);
    setPdfFile(null);
    setShowModal(true);
    setSaveSuccess(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setImageFile(null);
    setPdfFile(null);
  };

  const getEmptyFormData = (type) => {
    switch (type) {
      case "book":
        return {
          category: "Books",
          title: "",
          description: "",
          author: "",
        };
      case "moreAbout":
        return {
          category: "Law",
          title: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          isLocked: false,
        };
      case "latestUpdate":
        return {
          title: "",
          summary: "",
          details: "",
          date: "",
          type: "Feature",
        };
      case "announcement":
        return {
          date: new Date().toISOString().split("T")[0],
          type: "Tender",
          title: "",
          category: "TENDERS",
          priority: "medium",
        };
      default:
        return {};
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const isFormDataRequest =
        modalType === "moreAbout" ||
        modalType === "latestUpdate" ||
        modalType === "book";
      let dataPayload;

      if (isFormDataRequest) {
        dataPayload = new FormData();
        Object.keys(formData).forEach((key) => {
          if (
            key !== "_id" &&
            key !== "__v" &&
            key !== "image" &&
            key !== "pdfFile" &&
            key !== "fileSize" &&
            key !== "downloads" &&
            key !== "createdAt" &&
            key !== "updatedAt"
          ) {
            dataPayload.append(key, formData[key]);
          }
        });
        if (modalType === "book") {
          if (imageFile) dataPayload.append("coverImage", imageFile);
          if (pdfFile) dataPayload.append("bookFile", pdfFile);
        } else {
          if (imageFile) dataPayload.append("image", imageFile);
          if (pdfFile) dataPayload.append("pdfFile", pdfFile);
        }
      } else {
        dataPayload = formData;
      }

      let response;
      if (editingItem) {
        switch (modalType) {
          case "book":
            response = await api.books.update(editingItem._id, dataPayload);
            break;
          case "moreAbout":
            response = await api.moreAbout.update(editingItem._id, dataPayload);
            break;
          case "latestUpdate":
            response = await api.latestUpdates.update(
              editingItem._id,
              dataPayload,
            );
            break;
          case "announcement":
            response = await api.announcements.update(
              editingItem._id,
              dataPayload,
            );
            break;
        }
      } else {
        switch (modalType) {
          case "book":
            response = await api.books.create(dataPayload);
            break;
          case "moreAbout":
            response = await api.moreAbout.create(dataPayload);
            break;
          case "latestUpdate":
            response = await api.latestUpdates.create(dataPayload);
            break;
          case "announcement":
            response = await api.announcements.create(dataPayload);
            break;
        }
      }

      const updatedItem = response.book || response.data?.book || response.data || response;

      // Update local state
      if (modalType === "book") {
        setBooks((prev) =>
          editingItem
            ? prev.map((i) => (i._id === editingItem._id ? updatedItem : i))
            : [...prev, updatedItem],
        );
      } else if (modalType === "moreAbout") {
        setMoreAboutCards((prev) =>
          editingItem
            ? prev.map((i) => (i._id === editingItem._id ? updatedItem : i))
            : [...prev, updatedItem],
        );
      } else if (modalType === "latestUpdate") {
        setLatestUpdates((prev) =>
          editingItem
            ? prev.map((i) => (i._id === editingItem._id ? updatedItem : i))
            : [...prev, updatedItem],
        );
      } else if (modalType === "announcement") {
        setAnnouncements((prev) =>
          editingItem
            ? prev.map((i) => (i._id === editingItem._id ? updatedItem : i))
            : [...prev, updatedItem],
        );
      }

      setSaveSuccess(true);
      setTimeout(() => {
        closeModal();
        loadAllData(); // Reload stats
      }, 1000);
    } catch (error) {
      console.error("Save error:", error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      switch (type) {
        case "book":
          await api.books.delete(id);
          setBooks((prev) => prev.filter((i) => i._id !== id));
          break;
        case "moreAbout":
          await api.moreAbout.delete(id);
          setMoreAboutCards((prev) => prev.filter((i) => i._id !== id));
          break;
        case "latestUpdate":
          await api.latestUpdates.delete(id);
          setLatestUpdates((prev) => prev.filter((i) => i._id !== id));
          break;
        case "announcement":
          await api.announcements.delete(id);
          setAnnouncements((prev) => prev.filter((i) => i._id !== id));
          break;
      }

      await loadAllData(); // Reload stats
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Failed to delete: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FaChartBar className="text-white" />
          </div>
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          )}
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: FaChartBar },
              { id: "books", label: "Library Books", icon: FaBook },
              { id: "draftTemplates", label: "Drafting Templates", icon: FaFileAlt },
              { id: "moreAbout", label: "More About Cards", icon: FaBook },
              { id: "updates", label: "Latest Updates", icon: FaFileAlt },
              { id: "announcements", label: "Announcements", icon: FaBell },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FaBars />
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-800">Administrator</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <Alert type="error" message={error} onRetry={loadAllData} />
          )}
          {saveSuccess && (
            <Alert type="success" message="Successfully saved!" />
          )}

          {loading &&
          activeTab === "dashboard" &&
          moreAboutCards.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Dashboard Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="More About Cards"
                      value={stats.totalMoreAboutCards || 0}
                      icon={FaBook}
                      color="blue"
                    />
                    <StatCard
                      title="Latest Updates"
                      value={stats.totalLatestUpdates || 0}
                      icon={FaFileAlt}
                      color="green"
                    />
                    <StatCard
                      title="Announcements"
                      value={stats.totalAnnouncements || 0}
                      icon={FaBell}
                      color="orange"
                    />
                    <StatCard
                      title="Library Books"
                      value={stats.totalBooks || 0}
                      icon={FaBook}
                      color="purple"
                    />
                  </div>
                </div>
              )}

              {activeTab === "books" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                      Legal Library Books
                    </h2>
                    <button
                      onClick={() => openModal("book")}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                    >
                      <FaPlus /> <span>Add New Book</span>
                    </button>
                  </div>
                  {books.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No books available. Add your first book!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {books.map((book) => (
                        <div
                          key={book._id}
                          className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                          <img
                            src={`${API_BASE_URL}${book.image}`}
                            alt={book.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400x300?text=Book+Cover";
                            }}
                          />
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                {book.category}
                              </span>
                              {book.downloads > 0 && (
                                <span className="text-gray-500 text-xs">
                                  🔥 {book.downloads}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {book.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {book.description}
                            </p>
                            {book.author && (
                              <p className="text-gray-500 text-xs mb-2">
                                Author: {book.author}
                              </p>
                            )}
                            {book.fileSize && (
                              <p className="text-gray-500 text-xs mb-3">
                                Size: {book.fileSize}
                              </p>
                            )}
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openModal("book", book)}
                                className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 flex items-center justify-center space-x-1"
                              >
                                <FaEdit /> <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete("book", book._id)}
                                className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 flex items-center justify-center space-x-1"
                              >
                                <FaTrash /> <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "draftTemplates" && <DraftingTemplateManager />}

              {activeTab === "moreAbout" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                      More About Cards
                    </h2>
                    <button
                      onClick={() => openModal("moreAbout")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <FaPlus /> <span>Add New Card</span>
                    </button>
                  </div>
                  {moreAboutCards.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No cards available. Add your first card!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {moreAboutCards.map((card) => (
                        <div
                          key={card._id}
                          className="bg-white rounded-xl shadow-lg overflow-hidden"
                        >
                          <img
                            src={`${API_BASE_URL}${card.image}`}
                            alt={card.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400x300?text=Card+Image";
                            }}
                          />
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {card.category}
                              </span>
                              {card.isLocked && (
                                <span className="text-yellow-500">🔒</span>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {card.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                              {card.description}
                            </p>
                            <p className="text-gray-500 text-xs mb-4">
                              {new Date(card.date).toLocaleDateString()}
                            </p>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openModal("moreAbout", card)}
                                className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 flex items-center justify-center space-x-1"
                              >
                                <FaEdit /> <span>Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete("moreAbout", card._id)
                                }
                                className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 flex items-center justify-center space-x-1"
                              >
                                <FaTrash /> <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "updates" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                      Latest Updates
                    </h2>
                    <button
                      onClick={() => openModal("latestUpdate")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <FaPlus /> <span>Add New Update</span>
                    </button>
                  </div>
                  {latestUpdates.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No updates available. Add your first update!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {latestUpdates.map((update) => (
                        <div
                          key={update._id}
                          className="bg-white rounded-xl shadow-lg p-6"
                        >
                          <div className="flex items-start space-x-4">
                            <img
                              src={`${API_BASE_URL}${update.image}`}
                              alt={update.title}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/100?text=Update";
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-lg">
                                  {update.title}
                                </h3>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {update.type}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-2">
                                {update.summary}
                              </p>
                              <p className="text-gray-700 text-sm mb-3">
                                {update.details}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {update.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <button
                              onClick={() => openModal("latestUpdate", update)}
                              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center space-x-1"
                            >
                              <FaEdit /> <span>Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                handleDelete("latestUpdate", update._id)
                              }
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center space-x-1"
                            >
                              <FaTrash /> <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "announcements" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                      Announcements & Alerts
                    </h2>
                    <button
                      onClick={() => openModal("announcement")}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2"
                    >
                      <FaPlus /> <span>Add New Announcement</span>
                    </button>
                  </div>
                  {announcements.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">
                        No announcements available. Add your first announcement!
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Title
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Category
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Priority
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {announcements.map((announcement) => (
                              <tr
                                key={announcement._id}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(
                                    announcement.date,
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {announcement.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                                  <div className="line-clamp-2">
                                    {announcement.title}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    {announcement.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      announcement.priority === "high"
                                        ? "bg-red-100 text-red-800"
                                        : announcement.priority === "medium"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {announcement.priority}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() =>
                                        openModal("announcement", announcement)
                                      }
                                      className="text-yellow-600 hover:text-yellow-900"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDelete(
                                          "announcement",
                                          announcement._id,
                                        )
                                      }
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Modal
        show={showModal}
        onClose={closeModal}
        type={modalType}
        item={editingItem}
        onSave={handleSave}
        loading={loading}
        formData={formData}
        setFormData={setFormData}
        setImageFile={setImageFile}
        setPdfFile={setPdfFile}
      />
    </div>
  );
};

export default Dashboard;
