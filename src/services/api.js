// client/src/services/api.js — base URL aligns with server mount `/api/v1`
import axios from "axios";

function normalizeApiV1Base(raw) {
  const trimmed = (raw || "").replace(/\/$/, "");
  if (!trimmed) {
    // 👇 Live URL ko hata kar local port daal diya
    return "https://api.voiceoflaws.com/api/v1";
  }
  if (trimmed.endsWith("/v1")) return trimmed;
  if (trimmed.endsWith("/api")) return `${trimmed}/v1`;
  return `${trimmed}/api/v1`;
}

/** Use for axios and for building absolute asset URLs (uploads). */
export const API_V1_BASE = normalizeApiV1Base(import.meta.env.VITE_API_URL);

export function getServerOrigin() {
  try {
    const u = new URL(
      API_V1_BASE.startsWith("http") ? API_V1_BASE : `https://${API_V1_BASE}`,
    );
    return `${u.protocol}//${u.host}`;
  } catch {
    return "https://api.voiceoflaws.com"; // Fallback to the backend URL if URL parsing fails
  }
}

const api = axios.create({
  baseURL: API_V1_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("voicelaw_user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

// === AUTH APIs ===
export const authAPI = {
  register: (email, password) =>
    api.post("/auth/register", { email, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
  getProfile: () => api.get("/auth/me"),
};

// === USER / PROFILE ===
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (body) => api.put("/users/profile", body),
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return api.post("/users/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  changePassword: (currentPassword, newPassword) =>
    api.patch("/users/password", { currentPassword, newPassword }),
};

// === NOTIFICATIONS ===
export const notificationsAPI = {
  list: (params) => api.get("/notifications", { params }),
  unreadCount: () => api.get("/notifications/count"),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};

// === ADMIN (requires admin role) ===
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  listUsers: (params) => api.get("/admin/users", { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, body) => api.put(`/admin/users/${id}`, body),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  changeUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
  listDraftTemplates: () => api.get("/admin/templates"),
  createDraftTemplate: (body) => api.post("/admin/templates", body),
  updateDraftTemplate: (id, body) => api.put(`/admin/templates/${id}`, body),
  deleteDraftTemplate: (id) => api.delete(`/admin/templates/${id}`),
};

// === CALENDAR ===
export const calendarAPI = {
  getEvents: (params) => api.get("/calendar", { params }),
  getUpcoming: () => api.get("/calendar/upcoming"),
  createEvent: (body) => api.post("/calendar", body),
  updateEvent: (id, body) => api.put(`/calendar/${id}`, body),
  deleteEvent: (id) => api.delete(`/calendar/${id}`),
  syncCases: () => api.post("/calendar/sync-cases"),
};

// === CASES APIs ===
export const casesAPI = {
  getAll: (params) => api.get("/cases", { params }),
  getById: (id) => api.get(`/cases/${id}`),
  create: (caseData) => api.post("/cases", caseData),
  update: (id, caseData) => api.put(`/cases/${id}`, caseData),
  updateStatus: (id, status) => api.patch(`/cases/${id}/status`, { status }),
  toggleBookmark: (id) => api.patch(`/cases/${id}/bookmark`),
  exportPdf: (id) => api.post(`/cases/${id}/export-pdf`),
  delete: (id) => api.delete(`/cases/${id}`),

  // File and note operations
  uploadFiles: (caseId, files, sectionType) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return api.post(`/cases/${caseId}/upload/${sectionType}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  createNote: (caseId, sectionType, title) =>
    api.post(`/cases/${caseId}/note/${sectionType}`, { title }),

  deleteItem: (caseId, itemId, sectionType, itemType) =>
    api.delete(`/cases/${caseId}/item/${itemId}/${sectionType}/${itemType}`),
};

// === NOTES APIs ===
export const notesAPI = {
  updateNote: (noteId, title, content) =>
    api.put(`/notes/${noteId}`, { title, content }),
};

// === FILES APIs ===
export const filesAPI = {
  getFileUrl: (filePath) => {
    if (!filePath) return "";
    if (filePath.startsWith("http")) return filePath;
    return `${getServerOrigin()}${filePath}`;
  },
};

// === BLOG/POSTS APIs ===
export const postsAPI = {
  getBlogData: () => api.get("/blog-data"),
  getPost: (id) => api.get(`/posts/${id}`),
};

// === ADMIN - MORE ABOUT APIs ===
export const moreAboutAPI = {
  getAll: () => api.get("/more-about-cards"),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image" && data[key] instanceof File) {
        formData.append("image", data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post("/more-about-cards", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image" && data[key] instanceof File) {
        formData.append("image", data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/more-about-cards/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => api.delete(`/more-about-cards/${id}`),
};

// === ADMIN - LATEST UPDATES APIs ===
export const latestUpdatesAPI = {
  getAll: () => api.get("/latest-updates"),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image" && data[key] instanceof File) {
        formData.append("image", data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post("/latest-updates", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image" && data[key] instanceof File) {
        formData.append("image", data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/latest-updates/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => api.delete(`/latest-updates/${id}`),
};

// === ADMIN - ANNOUNCEMENTS APIs ===
export const announcementsAPI = {
  getAll: (category) => {
    const params = category ? { category } : {};
    return api.get("/announcements", { params });
  },
  create: (data) => api.post("/announcements", data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

// === ADMIN - BOOKS APIs ===
export const booksAPI = {
  getAll: (category, search) => {
    const params = {};
    if (category && category !== "Books") params.category = category;
    if (search) params.search = search;
    return api.get("/library", { params });
  },
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if ((key === "image" || key === "coverImage") && data[key] instanceof File) {
        formData.append("coverImage", data[key]);
      } else if ((key === "pdfFile" || key === "bookFile") && data[key] instanceof File) {
        formData.append("bookFile", data[key]);
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.post("/admin/library", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if ((key === "image" || key === "coverImage") && data[key] instanceof File) {
        formData.append("coverImage", data[key]);
      } else if ((key === "pdfFile" || key === "bookFile") && data[key] instanceof File) {
        formData.append("bookFile", data[key]);
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.put(`/admin/library/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => api.delete(`/admin/library/${id}`),
  download: (id) => api.get(`/library/${id}/download`),
};

// === DASHBOARD STATS APIs ===
export const dashboardAPI = {
  getStats: () => api.get("/dashboard-stats"),
};

// === ARTICLES APIs ===
export const articlesAPI = {
  getAll: (params) => api.get("/articles", { params }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) =>
    api.post("/articles", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    api.put(`/articles/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/articles/${id}`),
  search: (query) => api.get("/articles/search", { params: { q: query } }),
};
// === JOTFORM AI API ===
export const jotformAiAPI = {
  chat: (userMessage) => api.post("/jotform-ai/chat", { userMessage }),
};

// === AI CHAT API ===
// Add this block in your api.js file (alongside other API modules)
export const aiAPI = {
  // Send a message, optionally continuing an existing conversation
  chat: (message, conversationId = null) =>
    api.post("/ai/chat", { message, conversationId }),

  // List all conversations for current user
  listConversations: (params) => api.get("/ai/conversations", { params }),

  // Get full conversation with all messages
  getConversation: (id) => api.get(`/ai/conversations/${id}`),

  // Delete a conversation
  deleteConversation: (id) => api.delete(`/ai/conversations/${id}`),

  // Toggle bookmark on a conversation
  toggleBookmark: (id) => api.patch(`/ai/conversations/${id}/bookmark`),

  // Upload knowledge base files (Admin only) — send FormData with 'files' field
  uploadKnowledgeBase: (formData) =>
    api.post("/ai/knowledge-base", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Check knowledge base status (Admin only)
  getKnowledgeBaseStatus: () => api.get("/ai/knowledge-base/status"),
};
// === DRAFTS APIs ===
// NEW — used by the Drafting tab in CaseDetails.jsx
export const draftsAPI = {
  getAll: (params) => api.get("/drafts", { params }),
  getById: (id) => api.get(`/drafts/${id}`),
  create: (data) => api.post("/drafts", data),
  update: (id, data) => api.put(`/drafts/${id}`, data),
  delete: (id) => api.delete(`/drafts/${id}`),
  generate: (data) => api.post("/drafts/generate", data),
  generateAi: (data) => api.post("/drafts/generate-ai", data),
  export: (id, format) => api.post(`/drafts/${id}/export`, { format }),
  listTemplates: (params) => api.get("/drafts/templates", { params }),
  getTemplate: (id) => api.get(`/drafts/templates/${id}`),
  toggleFavorite: (id) => api.post(`/drafts/${id}/favorite`),
  listVersions: (id) => api.get(`/drafts/${id}/versions`),
  restoreVersion: (id, versionId) => api.post(`/drafts/${id}/versions/${versionId}/restore`),
};

// === UTILITY FUNCTIONS ===
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.message || "An error occurred";
  } else if (error.request) {
    return "No response from server";
  } else {
    return error.message || "An error occurred";
  }
};

export const validateFile = (file, maxSize = 10 * 1024 * 1024) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: "Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export default api;
