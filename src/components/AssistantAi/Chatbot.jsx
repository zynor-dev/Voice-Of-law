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

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
            color: "#a8842f",
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
            color: "#a8842f",
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
          <span style={{ color: "#a8842f", marginTop: "1px", flexShrink: 0 }}>
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
              color: "#a8842f",
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
        <strong key={i} style={{ color: "#8b6f1f" }}>
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

const MOBILE_BREAKPOINT = 768;

// ─── Main Chatbot Component ───────────────────────────────────
export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= MOBILE_BREAKPOINT,
  );
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth > MOBILE_BREAKPOINT,
  );
  const [loadingHistory, setLoadingHistory] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Keep mobile/desktop state in sync with viewport, and give the
  // sidebar sensible default behavior when the breakpoint is crossed.
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile((prevMobile) => {
        if (prevMobile !== mobile) {
          setSidebarOpen(!mobile); // open on desktop, closed on mobile
        }
        return mobile;
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const closeSidebarOnMobile = () => {
    if (isMobile) setSidebarOpen(false);
  };

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
    } finally {
      closeSidebarOnMobile();
    }
  };

  // Start new chat
  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setInput("");
    closeSidebarOnMobile();
    setTimeout(() => inputRef.current?.focus(), 0);
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
    if (inputRef.current) inputRef.current.style.height = "auto";
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .vol-chatbot * { box-sizing: border-box; margin: 0; padding: 0; }

        .vol-chatbot {
          position: relative;
          display: flex;
          height: 100%;
          min-height: 0;
          background: #f5f5f2;
          font-family: 'DM Sans', sans-serif;
          color: #24242a;
          overflow: hidden;
        }

        /* ── Sidebar (chat history) ─────────────────────────── */
        .vol-chat-sidebar {
          width: 270px;
          min-width: 270px;
          background: #ffffff;
          border-right: 1px solid #e6e2d8;
          display: flex;
          flex-direction: column;
          transition: width 0.25s ease, min-width 0.25s ease, transform 0.25s ease;
          overflow: hidden;
        }
        .vol-chat-sidebar.closed {
          width: 0;
          min-width: 0;
          border-right: none;
        }

        .vol-chat-sidebar-top {
          padding: 18px 16px 12px;
          border-bottom: 1px solid #e6e2d8;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .vol-sidebar-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .vol-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #a8842f;
        }
        .vol-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          white-space: nowrap;
          color: #24242a;
        }

        .vol-sidebar-close {
          display: none;
          background: none;
          border: none;
          color: #746f66;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .vol-sidebar-close:hover { color: #a8842f; background: #f7f3ea; }

        .vol-new-btn {
          width: 100%;
          padding: 9px 14px;
          background: linear-gradient(135deg, #c9a84c 0%, #a8882e 100%);
          border: none;
          border-radius: 8px;
          color: #1a1408;
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
          scrollbar-color: #d8d1c2 transparent;
        }
        .vol-chat-history::-webkit-scrollbar { width: 4px; }
        .vol-chat-history::-webkit-scrollbar-thumb { background: #d8d1c2; border-radius: 2px; }

        .vol-history-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #948e80;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 8px 8px;
          white-space: nowrap;
        }

        .vol-empty-hint {
          padding: 12px 8px;
          color: #948e80;
          font-size: 0.75rem;
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
          border-left: 2px solid transparent;
        }
        .vol-conv-item:hover { background: #f7f3ea; }
        .vol-conv-item.active { background: #f7f3ea; border-left: 2px solid #c9a84c; }

        .vol-conv-icon { color: #b3ac9d; flex-shrink: 0; }
        .vol-conv-item.active .vol-conv-icon { color: #a8842f; }

        .vol-conv-title {
          font-size: 0.8rem;
          color: #56514a;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vol-conv-item.active .vol-conv-title { color: #24242a; font-weight: 600; }

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
          color: #a39c8c;
          cursor: pointer;
          padding: 3px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .vol-conv-action-btn:hover { color: #a8842f; }
        .vol-conv-action-btn.bookmarked { color: #a8842f; display: flex !important; }

        /* ── Mobile backdrop ─────────────────────────────────── */
        .vol-backdrop {
          display: none;
        }

        /* ── Main area ───────────────────────────────────────── */
        .vol-chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #ffffff;
          min-width: 0;
        }

        /* Header */
        .vol-header {
          padding: 14px 20px;
          border-bottom: 1px solid #e6e2d8;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          flex-shrink: 0;
        }

        .vol-menu-btn {
          background: none;
          border: none;
          color: #56514a;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: color 0.15s, background 0.15s;
          flex-shrink: 0;
        }
        .vol-menu-btn:hover { color: #a8842f; background: #f7f3ea; }

        .vol-header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #24242a;
          letter-spacing: 0.03em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
          scrollbar-color: #e6e2d8 transparent;
          background: #f9f8f5;
        }
        .vol-messages::-webkit-scrollbar { width: 5px; }
        .vol-messages::-webkit-scrollbar-thumb { background: #e6e2d8; border-radius: 3px; }

        /* Empty state */
        .vol-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 16px;
          color: #a39c8c;
          text-align: center;
        }
        .vol-empty-icon { color: #c9a84c; }
        .vol-empty h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 500;
          color: #24242a;
          letter-spacing: 0.02em;
        }
        .vol-empty p {
          font-size: 0.85rem;
          color: #746f66;
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
          background: #ffffff;
          border: 1px solid #e6e2d8;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.76rem;
          color: #56514a;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .vol-suggestion:hover {
          border-color: #c9a84c;
          color: #8b6f1f;
          background: #fbf6e9;
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
          font-size: 0.68rem;
          font-weight: 700;
          margin-top: 2px;
        }
        .vol-avatar.ai {
          background: #fbf3df;
          border: 1px solid #e8d5a3;
          color: #8b6f1f;
        }
        .vol-avatar.user-av {
          background: #eaf1fb;
          border: 1px solid #c6dbf2;
          color: #2f6aa8;
        }

        .vol-bubble {
          max-width: min(600px, 75%);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.87rem;
          line-height: 1.6;
        }
        .vol-msg.user .vol-bubble {
          background: #eaf1fb;
          border: 1px solid #cfe0f2;
          color: #1c3a56;
          border-radius: 12px 12px 2px 12px;
        }
        .vol-msg.assistant .vol-bubble {
          background: #ffffff;
          border: 1px solid #e6e2d8;
          color: #2c2c2c;
          border-radius: 2px 12px 12px 12px;
        }
        .vol-msg.assistant .vol-bubble.error {
          background: #fdf1f0;
          border-color: #f0c9c6;
          color: #a13d36;
        }

        .vol-sources {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #eee9dd;
        }
        .vol-sources-label {
          font-size: 0.68rem;
          color: #948e80;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .vol-source-tag {
          display: inline-block;
          background: #fbf3df;
          border: 1px solid #e8d5a3;
          border-radius: 4px;
          padding: 2px 8px;
          font-size: 0.68rem;
          color: #8b6f1f;
          margin: 2px 3px 2px 0;
        }

        /* ── Input area — single, clean box (no nested box) ──── */
        .vol-input-wrap {
          padding: 14px 20px 18px;
          background: #ffffff;
          flex-shrink: 0;
        }

        .vol-input-box {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: #ffffff;
          border: 1.5px solid #d8d1c2;
          border-radius: 14px;
          padding: 10px 10px 10px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 2px rgba(20, 18, 10, 0.03);
        }
        .vol-input-box:focus-within {
          border-color: #c9a84c;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.12);
        }

        .vol-textarea {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: #24242a;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          resize: none;
          max-height: 120px;
          min-height: 24px;
          line-height: 1.5;
          scrollbar-width: thin;
        }
        .vol-textarea::placeholder { color: #9a948a; }

        .vol-send-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #c9a84c, #a8882e);
          border: none;
          color: #1a1408;
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
          color: #a39c8c;
          text-align: center;
          margin-top: 8px;
        }

        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* ══════════════════ MOBILE (drawer sidebar) ══════════════════ */
        @media (max-width: 768px) {
          .vol-chatbot { overflow: visible; }

          .vol-chat-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 82vw;
            max-width: 300px;
            min-width: 0;
            z-index: 60;
            box-shadow: 14px 0 34px rgba(20, 18, 10, 0.18);
            transform: translateX(-100%);
          }
          .vol-chat-sidebar:not(.closed) { transform: translateX(0); }
          .vol-chat-sidebar.closed { width: 82vw; max-width: 300px; border-right: 1px solid #e6e2d8; }

          .vol-sidebar-close { display: flex; }

          .vol-backdrop.open {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(20, 18, 10, 0.35);
            z-index: 55;
            animation: fadeIn 0.2s ease;
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

          .vol-header { padding: 12px 14px; }
          .vol-header-title { font-size: 1rem; }

          .vol-messages { padding: 16px 14px; }
          .vol-bubble { max-width: 86%; font-size: 0.85rem; }

          .vol-suggestions { max-width: 100%; }
          .vol-suggestion { font-size: 0.72rem; padding: 7px 12px; }

          .vol-input-wrap { padding: 10px 12px calc(12px + env(safe-area-inset-bottom, 0px)); }
          .vol-input-box { border-radius: 12px; padding: 8px 8px 8px 14px; }
          .vol-textarea { font-size: 16px; } /* prevents iOS auto-zoom on focus */
          .vol-send-btn { width: 34px; height: 34px; }
        }

        @media (max-width: 380px) {
          .vol-empty h2 { font-size: 1.35rem; }
          .vol-empty p { font-size: 0.78rem; }
        }
      `}</style>

      <div className="vol-chatbot">
        {/* Mobile backdrop */}
        <div
          className={`vol-backdrop ${isMobile && sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className={`vol-chat-sidebar ${sidebarOpen ? "" : "closed"}`}>
          <div className="vol-chat-sidebar-top">
            <div className="vol-sidebar-top-row">
              <div className="vol-logo">
                <ScaleIcon />
                <span className="vol-logo-text">Voice of Law</span>
              </div>
              <button
                className="vol-sidebar-close"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
            <button className="vol-new-btn" onClick={startNewChat}>
              <PlusIcon />
              New Conversation
            </button>
          </div>

          <div className="vol-chat-history">
            <div className="vol-history-label">Recent Chats</div>
            {loadingHistory && <div className="vol-empty-hint">Loading...</div>}
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
              <div className="vol-empty-hint">No conversations yet.</div>
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
              aria-label={
                sidebarOpen ? "Close chat history" : "Open chat history"
              }
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

          {/* Input — single box, no nested wrapper look */}
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
            <div className="vol-input-hint">
              Press Enter to send · Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
