import React, { useState, useRef, useEffect, useCallback } from "react";
import api from "../../services/api";

// ─── Icons ────────────────────────────────────────────────────
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 2L11 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 2L15 22L11 13L2 9L22 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5V19M5 12H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ChatIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
  >
    <path
      d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6H21M8 6V4H16V6M19 6L18 20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20L5 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ScaleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3V21M3 6L12 3L21 6M3 6L7.5 18H3M21 6L16.5 18H21M7.5 18H16.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 12H21M3 6H21M3 18H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Markdown-like renderer ────────────────────────────────────
function renderMessageText(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={i}
          style={{
            color: "#c9a84c",
            fontSize: "0.85rem",
            fontWeight: 700,
            margin: "10px 0 4px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          style={{
            color: "#c9a84c",
            fontSize: "0.95rem",
            fontWeight: 700,
            margin: "12px 0 5px",
          }}
        >
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} style={{ fontWeight: 700, margin: "6px 0" }}>
          {line.slice(2, -2)}
        </p>,
      );
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <div
          key={i}
          style={{
            display: "flex",
            gap: "8px",
            margin: "3px 0",
            paddingLeft: "4px",
          }}
        >
          <span style={{ color: "#c9a84c", marginTop: "1px", flexShrink: 0 }}>
            ›
          </span>
          <span>{formatInline(line.slice(2))}</span>
        </div>,
      );
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)[1];
      elements.push(
        <div
          key={i}
          style={{
            display: "flex",
            gap: "8px",
            margin: "3px 0",
            paddingLeft: "4px",
          }}
        >
          <span
            style={{
              color: "#c9a84c",
              fontWeight: 600,
              minWidth: "18px",
              flexShrink: 0,
            }}
          >
            {num}.
          </span>
          <span>{formatInline(line.replace(/^\d+\.\s/, ""))}</span>
        </div>,
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "6px" }} />);
    } else {
      elements.push(
        <p key={i} style={{ margin: "4px 0", lineHeight: "1.65" }}>
          {formatInline(line)}
        </p>,
      );
    }
    i++;
  }
  return elements;
}

function formatInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ color: "#e8d5a3" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// ─── Typing Dots ──────────────────────────────────────────────
const TypingDots = () => (
  <div
    style={{
      display: "flex",
      gap: "5px",
      alignItems: "center",
      padding: "4px 0",
    }}
  >
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: "#c9a84c",
          animation: "typingBounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

// ─── Main Chatbot Component ───────────────────────────────────
export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 640);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load conversation list
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const res = await api.get("/ai/conversations");
      setConversations(res.data?.data || res.data?.conversations || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load a specific conversation
  const loadConversation = async (id) => {
    try {
      const res = await api.get(`/ai/conversations/${id}`);
      const conv = res.data?.data?.conversation || res.data?.conversation;
      if (conv) {
        setConversationId(conv._id);
        setMessages(
          conv.messages.map((m) => ({
            role: m.role,
            content: m.content,
            sources: m.sources || [],
          })),
        );
      }
    } catch (err) {
      console.error("Failed to load conversation:", err);
    }
  };

  // Start new chat
  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setInput("");
    inputRef.current?.focus();
  };

  // Delete conversation
  const deleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/conversations/${id}`);
      if (conversationId === id) startNewChat();
      setConversations((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Toggle bookmark
  const toggleBookmark = async (e, id) => {
    e.stopPropagation();
    try {
      await api.patch(`/ai/conversations/${id}/bookmark`);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isBookmarked: !c.isBookmarked } : c,
        ),
      );
    } catch (err) {
      console.error("Bookmark failed:", err);
    }
  };

  // Send message
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: text,
        conversationId: conversationId || undefined,
      });

      const data = res.data?.data || res.data;
      const aiText = data?.response || "No response received.";
      const sources = data?.sources || [];
      const newConvId = data?.conversationId;

      if (newConvId && !conversationId) {
        setConversationId(newConvId);
        fetchConversations(); // Refresh sidebar
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiText, sources },
      ]);
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Connection error. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errMsg, isError: true },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .vol-chatbot * { box-sizing: border-box; margin: 0; padding: 0; }

        .vol-chatbot {
          display: flex;
          height: 100%;
          min-height: 0;
          background: #f5f5f7;
          font-family: 'DM Sans', sans-serif;
          color: #24242a;
          overflow: hidden;
        }

        /* Sidebar */
        .vol-chat-sidebar {
          width: 270px;
          min-width: 270px;
          background: #111113;
          border-right: 1px solid #1e1e22;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease, min-width 0.3s ease;
          overflow: hidden;
        }
        .vol-chat-sidebar.closed {
          width: 0;
          min-width: 0;
          border-right: none;
        }

        .vol-chat-sidebar-top {
          padding: 20px 16px 12px;
          border-bottom: 1px solid #1e1e22;
        }

        .vol-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          color: #c9a84c;
        }
        .vol-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .vol-new-btn {
          width: 100%;
          padding: 9px 14px;
          background: linear-gradient(135deg, #c9a84c 0%, #a8882e 100%);
          border: none;
          border-radius: 8px;
          color: #0d0d0f;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: opacity 0.2s;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .vol-new-btn:hover { opacity: 0.88; }

        .vol-chat-history {
          flex: 1;
          overflow-y: auto;
          padding: 12px 8px;
          scrollbar-width: thin;
          scrollbar-color: #2a2a30 transparent;
        }
        .vol-history::-webkit-scrollbar { width: 4px; }
        .vol-history::-webkit-scrollbar-thumb { background: #2a2a30; border-radius: 2px; }

        .vol-history-label {
          font-size: 0.65rem;
          font-weight: 600;
          color: #4a4a55;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 8px 8px;
          white-space: nowrap;
        }

        .vol-conv-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 10px;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.15s;
          margin-bottom: 2px;
        }
        .vol-conv-item:hover { background: #1a1a1f; }
        .vol-conv-item.active { background: #1a1a1f; border-left: 2px solid #c9a84c; }

        .vol-conv-icon { color: #3a3a45; flex-shrink: 0; }
        .vol-conv-item.active .vol-conv-icon { color: #c9a84c; }

        .vol-conv-title {
          font-size: 0.78rem;
          color: #9090a0;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vol-conv-item.active .vol-conv-title { color: #e8e0d0; }

        .vol-conv-actions {
          display: none;
          gap: 4px;
          align-items: center;
          flex-shrink: 0;
        }
        .vol-conv-item:hover .vol-conv-actions { display: flex; }

        .vol-conv-action-btn {
          background: none;
          border: none;
          color: #4a4a55;
          cursor: pointer;
          padding: 3px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .vol-conv-action-btn:hover { color: #c9a84c; }
        .vol-conv-action-btn.bookmarked { color: #c9a84c; display: flex !important; }

        /* Main area */
        .vol-chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #0d0d0f;
        }

        /* Header */
        .vol-header {
          padding: 14px 20px;
          border-bottom: 1px solid #1a1a1f;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #0d0d0f;
          flex-shrink: 0;
        }

        .vol-menu-btn {
          background: none;
          border: none;
          color: #5a5a65;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .vol-menu-btn:hover { color: #c9a84c; }

        .vol-header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #c9a84c;
          letter-spacing: 0.03em;
        }

        .vol-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4caf78;
          box-shadow: 0 0 6px #4caf7888;
          margin-left: 2px;
          flex-shrink: 0;
        }

        /* Messages */
        .vol-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px 20px;
          scrollbar-width: thin;
          scrollbar-color: #1e1e22 transparent;
        }
        .vol-messages::-webkit-scrollbar { width: 5px; }
        .vol-messages::-webkit-scrollbar-thumb { background: #1e1e22; border-radius: 3px; }

        /* Empty state */
        .vol-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 16px;
          color: #3a3a45;
        }
        .vol-empty-icon { color: #2a2a35; }
        .vol-empty h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 500;
          color: #4a4a55;
          letter-spacing: 0.02em;
        }
        .vol-empty p {
          font-size: 0.82rem;
          color: #3a3a45;
          text-align: center;
          max-width: 320px;
          line-height: 1.6;
        }

        .vol-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          max-width: 480px;
          margin-top: 8px;
        }
        .vol-suggestion {
          background: #111113;
          border: 1px solid #1e1e22;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.75rem;
          color: #6a6a78;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .vol-suggestion:hover {
          border-color: #c9a84c44;
          color: #c9a84c;
          background: #c9a84c0a;
        }

        /* Message bubbles */
        .vol-msg {
          display: flex;
          margin-bottom: 18px;
          gap: 12px;
          animation: msgFadeIn 0.25s ease;
        }
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .vol-msg.user { flex-direction: row-reverse; }

        .vol-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          margin-top: 2px;
        }
        .vol-avatar.ai {
          background: linear-gradient(135deg, #1e1a12, #2a2310);
          border: 1px solid #c9a84c44;
          color: #c9a84c;
        }
        .vol-avatar.user-av {
          background: linear-gradient(135deg, #1a2a3a, #0f1e2e);
          border: 1px solid #4a90d944;
          color: #7ab8e8;
          font-size: 0.65rem;
        }

        .vol-bubble {
          max-width: min(600px, 75%);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.84rem;
          line-height: 1.6;
        }
        .vol-msg.user .vol-bubble {
          background: #1a2535;
          border: 1px solid #243550;
          color: #d0e8ff;
          border-radius: 12px 12px 2px 12px;
        }
        .vol-msg.assistant .vol-bubble {
          background: #111113;
          border: 1px solid #1e1e22;
          color: #d8d0c0;
          border-radius: 2px 12px 12px 12px;
        }
        .vol-msg.assistant .vol-bubble.error {
          background: #1a0f0f;
          border-color: #3a1515;
          color: #c08080;
        }

        .vol-sources {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #2a2a2f;
        }
        .vol-sources-label {
          font-size: 0.68rem;
          color: #4a4a55;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .vol-source-tag {
          display: inline-block;
          background: #1a1a0f;
          border: 1px solid #c9a84c33;
          border-radius: 4px;
          padding: 2px 8px;
          font-size: 0.68rem;
          color: #c9a84c;
          margin: 2px 3px 2px 0;
        }

        /* Input area */
        .vol-input-wrap {
          padding: 14px 20px 18px;
          background: #0d0d0f;
          border-top: 1px solid #1a1a1f;
          flex-shrink: 0;
        }

        .vol-input-box {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: #111113;
          border: 1px solid #222228;
          border-radius: 12px;
          padding: 10px 12px;
          transition: border-color 0.2s;
        }
        .vol-input-box:focus-within { border-color: #c9a84c55; }

        .vol-textarea {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: #e8e0d0;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          resize: none;
          max-height: 120px;
          min-height: 22px;
          line-height: 1.5;
          scrollbar-width: thin;
        }
        .vol-textarea::placeholder { color: #3a3a45; }

        .vol-send-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: linear-gradient(135deg, #c9a84c, #a8882e);
          border: none;
          color: #0d0d0f;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s, transform 0.15s;
        }
        .vol-send-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(1.05); }
        .vol-send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

        .vol-input-hint {
          font-size: 0.68rem;
          color: #2a2a35;
          text-align: center;
          margin-top: 8px;
        }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Dashboard-aligned light surface: keeps the existing gold brand, without a dark chat screen. */
        .vol-chatbot { background: #f5f5f7; color: #24242a; }
        .vol-chat-sidebar { background: #fff; border-right-color: #e6e2d8; }
        .vol-chat-sidebar-top { border-bottom-color: #e6e2d8; }
        .vol-chat-history { scrollbar-color: #d8d1c2 transparent; }
        .vol-chat-main, .vol-header, .vol-input-wrap { background: #fff; }
        .vol-header, .vol-input-wrap { border-color: #e6e2d8; }
        .vol-header-title { color: #24242a; }
        .vol-menu-btn { color: #625d68; }
        .vol-messages { background: #f5f5f7; }
        .vol-empty h2 { color: #24242a; }
        .vol-empty p { color: #746f7c; }
        .vol-suggestion, .vol-bubble { background: #fff; border-color: #e6e2d8; color: #302d35; }
        .vol-msg.assistant .vol-bubble { background: #fff; border-color: #e6e2d8; color: #302d35; }
        .vol-conv-item:hover, .vol-conv-item.active { background: #f7f3ea; }
        .vol-conv-title { color: #625d68; }
        .vol-conv-item.active .vol-conv-title { color: #24242a; }
        .vol-input-box { background: #fff; border-color: #d8d1c2; }
        .vol-textarea { color: #24242a; }
        .vol-textarea::placeholder { color: #8d8792; }
        .vol-input-hint { color: #8d8792; }

        /* Mobile */
        @media (max-width: 640px) {
          .vol-chat-sidebar { position: absolute; z-index: 50; height: 100%; box-shadow: 12px 0 30px rgba(0,0,0,.12); }
          .vol-chat-sidebar.closed { width: 0; }
          .vol-bubble { max-width: 88%; }
          .vol-header { padding: 12px 14px; }
          .vol-messages { padding: 16px 14px; }
          .vol-input-wrap { padding: 10px 12px 12px; }
        }
      `}</style>

      <div className="vol-chatbot">
        {/* Sidebar */}
        <div className={`vol-chat-sidebar ${sidebarOpen ? "" : "closed"}`}>
          <div className="vol-chat-sidebar-top">
            <div className="vol-logo">
              <ScaleIcon />
              <span className="vol-logo-text">Voice of Law</span>
            </div>
            <button className="vol-new-btn" onClick={startNewChat}>
              <PlusIcon />
              New Conversation
            </button>
          </div>

          <div className="vol-chat-history">
            <div className="vol-history-label">Recent Chats</div>
            {loadingHistory && (
              <div
                style={{
                  padding: "12px 8px",
                  color: "#3a3a45",
                  fontSize: "0.75rem",
                }}
              >
                Loading...
              </div>
            )}
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={`vol-conv-item ${conv._id === conversationId ? "active" : ""}`}
                onClick={() => loadConversation(conv._id)}
              >
                <span className="vol-conv-icon">
                  <ChatIcon />
                </span>
                <span className="vol-conv-title">
                  {conv.title || "Untitled"}
                </span>
                <div className="vol-conv-actions">
                  <button
                    className={`vol-conv-action-btn ${conv.isBookmarked ? "bookmarked" : ""}`}
                    onClick={(e) => toggleBookmark(e, conv._id)}
                    title="Bookmark"
                  >
                    <BookmarkIcon filled={conv.isBookmarked} />
                  </button>
                  <button
                    className="vol-conv-action-btn"
                    onClick={(e) => deleteConversation(e, conv._id)}
                    title="Delete"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
            {!loadingHistory && conversations.length === 0 && (
              <div
                style={{
                  padding: "12px 8px",
                  color: "#3a3a45",
                  fontSize: "0.75rem",
                }}
              >
                No conversations yet.
              </div>
            )}
          </div>
        </div>

        {/* Main */}
        <div className="vol-chat-main">
          {/* Header */}
          <div className="vol-header">
            <button
              className="vol-menu-btn"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Open chat history"
            >
              <MenuIcon />
            </button>
            <span className="vol-header-title">Legal AI Assistant</span>
            <div className="vol-status-dot" title="Online" />
          </div>

          {/* Messages */}
          <div className="vol-messages">
            {messages.length === 0 ? (
              <div className="vol-empty">
                <div className="vol-empty-icon">
                  <ScaleIcon />
                </div>
                <h2>Voice of Law AI</h2>
                <p>
                  Ask any question about Pakistani law. I'll provide accurate,
                  structured legal guidance.
                </p>
                <div className="vol-suggestions">
                  {[
                    "What are my rights if arrested?",
                    "How to file a civil suit in Pakistan?",
                    "Explain Section 302 PPC",
                    "Property transfer procedure",
                  ].map((s) => (
                    <div
                      key={s}
                      className="vol-suggestion"
                      onClick={() => {
                        setInput(s);
                        inputRef.current?.focus();
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`vol-msg ${msg.role}`}>
                  <div
                    className={`vol-avatar ${msg.role === "user" ? "user-av" : "ai"}`}
                  >
                    {msg.role === "user" ? "YOU" : "AI"}
                  </div>
                  <div className={`vol-bubble ${msg.isError ? "error" : ""}`}>
                    {msg.role === "assistant" ? (
                      renderMessageText(msg.content)
                    ) : (
                      <p>{msg.content}</p>
                    )}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="vol-sources">
                        <div className="vol-sources-label">References</div>
                        {msg.sources.map((s, si) => (
                          <span key={si} className="vol-source-tag">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="vol-msg assistant">
                <div className="vol-avatar ai">AI</div>
                <div className="vol-bubble">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="vol-input-wrap">
            <div className="vol-input-box">
              <textarea
                ref={inputRef}
                className="vol-textarea"
                rows={1}
                value={input}
                placeholder="Ask a legal question..."
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKeyDown}
              />
              <button
                className="vol-send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
