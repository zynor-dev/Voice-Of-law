import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Bot,
  Briefcase,
  BookOpen,
  Scale,
  FolderLock,
  StickyNote,
  Newspaper,
  Calendar,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import MyCases from "./Case/MyCases";
import AddCase from "./Case/AddCase";
import EditCase from "./Case/EditCase";
import CaseDetails from "./Case/CaseDetails";
import DocumentVault from "./DocumentVault/DocumentVault";
import Notepad from "./Notepad/Notepad";
import LegalLibrary from "./LegalLibrary/LegalLibrary";
import LegalDraftingPage from "./Drafting/LegalDraftingPage";
import Chatbot from "../components/AssistantAi/Chatbot";
import DashboardFeed from "../components/Articles/DashboardFeed";
import FullArticleDetail from "../components/Articles/FullArticleDetail";
import DashboardArticlesFeed from "../components/Articles/DashboardArticlesFeed";
import ModernDashboardContent from "../Admin/ModernDashboardContent";
import SettingsPage from "./Setting/Settings";
import DashboardProfileCard from "../components/user-panel/DashboardProfileCard";
import LawyerCalendarPage from "../components/user-panel/LawyerCalendarPage";
import NotificationPopover from "../components/user-panel/NotificationPopover";
import OnboardingGuard from "../components/OnboardingGuard";
import JotformAgent from "./JotformAgent";
import logo from "../assets/image/logo.png";

const MENU = [
  { name: "Dashboard", path: "/user-panel", icon: LayoutDashboard, end: true },
  { name: "AI Legal Assistant", path: "/user-panel/chatbot", icon: Bot },
  { name: "My Cases", path: "/user-panel/cases", icon: Briefcase },
  { name: "Legal Library", path: "/user-panel/library", icon: BookOpen },
  { name: "Legal Drafting", path: "/user-panel/drafting", icon: Scale },
  { name: "Document Vault", path: "/user-panel/vault", icon: FolderLock },
  { name: "Jotform AI Agent", path: "/user-panel/jotform-agent", icon: Bot },
  { name: "Notepad", path: "/user-panel/notepad", icon: StickyNote },
  { name: "Legal News", path: "/user-panel/articles", icon: Newspaper },
  { name: "Calendar", path: "/user-panel/calendar", icon: Calendar },
  { name: "Settings", path: "/user-panel/settings", icon: Settings },
];

function pathMatch(pathname, item) {
  if (item.end)
    return pathname === "/user-panel" || pathname === "/user-panel/";
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

// ─── Gold accent color ────────────────────────────────────────
const GOLD = "#C79F44";
const GOLD_DIM = "rgba(199,159,68,0.15)";
const GOLD_RING = "rgba(199,159,68,0.35)";

export default function UserPanel() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop: sidebar collapsed (icon-only) or expanded
  const [collapsed, setCollapsed] = useState(false);
  // Mobile: sidebar drawer open/close
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 1024 : false,
  );
  const [profileOpen, setProfileOpen] = useState(false);

  const sidebarRef = useRef(null);
  const profileRef = useRef(null);

  // Sidebar width tokens
  const SIDEBAR_EXPANDED = 220;
  const SIDEBAR_COLLAPSED = 60;
  const sidebarW = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Click-outside for profile dropdown
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (
        isMobile &&
        drawerOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest?.("[data-sidebar-toggle]")
      )
        setDrawerOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile, drawerOpen]);

  // Refresh → redirect to dashboard root
  useEffect(() => {
    try {
      const key = "vol_userpanel_session_initialized";
      if (sessionStorage.getItem(key) === "1") return;
      const navType = performance.getEntriesByType?.("navigation")[0]?.type;
      sessionStorage.setItem(key, "1");
      if (
        navType === "reload" &&
        location.pathname.startsWith("/user-panel/") &&
        location.pathname !== "/user-panel/"
      )
        navigate("/user-panel", { replace: true });
    } catch {
      /* ignore */
    }
  }, []);

  const go = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const initials = useCallback(
    () =>
      user?.fullName?.charAt(0)?.toUpperCase() ||
      user?.email?.charAt(0)?.toUpperCase() ||
      "U",
    [user],
  );

  // ─── Sidebar inner content (shared between desktop & mobile) ──
  const SidebarNav = ({ forceExpanded = false }) => {
    const expanded = forceExpanded || !collapsed;
    return (
      <nav className="flex h-full flex-col py-3 overflow-y-auto overflow-x-hidden">
        {/* Logo area */}
        <div
          className="flex items-center gap-2.5 px-3 mb-5 min-h-[36px]"
          style={{ justifyContent: expanded ? "flex-start" : "center" }}
        >
          <img
            src={logo}
            alt="VOL"
            className="h-7 w-auto shrink-0 object-contain"
          />
          {expanded && (
            <span
              className="text-xs font-bold tracking-widest uppercase truncate"
              style={{ color: GOLD }}
            >
              Voice of Law
            </span>
          )}
        </div>

        {/* Nav items */}
        <ul className="flex-1 space-y-0.5 px-1.5">
          {MENU.map((item) => {
            const active = pathMatch(location.pathname, item);
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <button
                  type="button"
                  title={!expanded ? item.name : undefined}
                  onClick={() => go(item.path)}
                  className="group flex w-full items-center rounded-lg transition-all duration-150 outline-none"
                  style={{
                    gap: expanded ? "10px" : "0",
                    justifyContent: expanded ? "flex-start" : "center",
                    padding: expanded ? "8px 10px" : "9px 0",
                    background: active ? GOLD_DIM : "transparent",
                    boxShadow: active ? `inset 0 0 0 1px ${GOLD_RING}` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon
                    size={15}
                    className="shrink-0 transition-colors"
                    style={{ color: active ? GOLD : "rgba(255,255,255,0.45)" }}
                  />
                  {expanded && (
                    <span
                      className="text-[11.5px] font-medium leading-snug truncate"
                      style={{
                        color: active ? "#f5e8c5" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {item.name}
                    </span>
                  )}
                  {/* Active indicator bar */}
                  {active && (
                    <span
                      className="absolute right-0 h-5 w-[3px] rounded-l-full"
                      style={{ background: GOLD }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bottom: collapse toggle (desktop only) */}
        {!isMobile && (
          <div
            className="px-1.5 pt-2 border-t"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="flex w-full items-center rounded-lg px-2 py-2 transition"
              style={{
                justifyContent: expanded ? "flex-start" : "center",
                gap: expanded ? "8px" : "0",
                color: "rgba(255,255,255,0.35)",
              }}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.35)")
              }
            >
              {collapsed ? (
                <ChevronRight size={14} />
              ) : (
                <>
                  <ChevronLeft size={14} />
                  {expanded && <span className="text-[10px]">Collapse</span>}
                </>
              )}
            </button>
          </div>
        )}
      </nav>
    );
  };

  const DashboardHome = () => (
    <div className="mx-auto max-w-6xl px-3 pb-8 pt-1 sm:px-4">
      <DashboardProfileCard user={user} setUser={setUser} />
      <ModernDashboardContent
        setActiveMenu={(menu) => {
          const m = MENU.find((x) => x.name === menu);
          if (m) navigate(m.path);
        }}
      />
      <div className="mt-6 border-t border-slate-200/80 pt-5">
        <DashboardArticlesFeed />
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh text-slate-900" style={{ background: "#f4f5f7" }}>
      {/* ── TOP HEADER ─────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[100] flex h-13 items-center justify-between gap-2 px-3 shadow-md"
        style={{
          height: "52px",
          background: "#1a1a1a",
          borderBottom: `1px solid ${GOLD_RING}`,
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-2 min-w-0">
          {isMobile && (
            <button
              type="button"
              data-sidebar-toggle
              onClick={() => setDrawerOpen((s) => !s)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition"
              style={{ color: "rgba(255,255,255,0.7)" }}
              aria-label="Toggle menu"
            >
              {drawerOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={logo}
              alt=""
              className="h-7 w-auto shrink-0 object-contain"
            />
            <span
              className="hidden sm:block text-xs font-bold tracking-widest uppercase truncate"
              style={{ color: GOLD }}
            >
              Voice of Law
            </span>
          </div>
        </div>

        {/* Right: notifications + avatar */}
        <div className="flex items-center gap-1.5 shrink-0">
          <NotificationPopover />
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((p) => !p)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold shadow-sm transition"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, #a07830)`,
                color: "#1a1a1a",
                boxShadow: `0 0 0 2px ${GOLD_RING}`,
              }}
              aria-label="Account menu"
            >
              {initials()}
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-[150] mt-2 w-52 rounded-xl overflow-hidden shadow-2xl"
                  style={{
                    border: `1px solid ${GOLD_RING}`,
                    background: "#1e1e1e",
                  }}
                >
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <p className="text-xs font-semibold text-white truncate">
                      {user?.fullName || user?.email?.split("@")[0] || "User"}
                    </p>
                    <p
                      className="text-[10px] truncate"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {user?.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-[11px] transition"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                    }}
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/user-panel/settings");
                    }}
                  >
                    Settings
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-[11px] transition"
                    style={{ color: "#e05c5c" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(224,92,92,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* ── MOBILE OVERLAY ──────────────────────────────────────── */}
      <AnimatePresence>
        {isMobile && drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── DESKTOP SIDEBAR (persistent, collapsible) ───────────── */}
      {!isMobile && (
        <aside
          className="fixed bottom-0 left-0 top-[52px] z-[90] transition-all duration-300"
          style={{
            width: `${sidebarW}px`,
            background: "#1a1a1a",
            borderRight: `1px solid rgba(255,255,255,0.06)`,
          }}
        >
          <SidebarNav />
        </aside>
      )}

      {/* ── MOBILE SIDEBAR DRAWER ───────────────────────────────── */}
      {isMobile && (
        <AnimatePresence>
          {drawerOpen && (
            <motion.aside
              ref={sidebarRef}
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 top-[52px] z-[90] w-[220px]"
              style={{
                background: "#1a1a1a",
                borderRight: `1px solid rgba(255,255,255,0.06)`,
              }}
            >
              <SidebarNav forceExpanded />
            </motion.aside>
          )}
        </AnimatePresence>
      )}

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main
        className="min-h-dvh transition-all duration-300"
        style={{
          paddingTop: "52px",
          paddingLeft: isMobile ? "0" : `${sidebarW}px`,
        }}
      >
        <OnboardingGuard>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Routes>
                <Route index element={<DashboardHome />} />
                <Route path="chatbot" element={<Chatbot />} />
                <Route path="jotform-agent" element={<JotformAgent />} />
                <Route path="calendar" element={<LawyerCalendarPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="cases/*">
                  <Route index element={<MyCases />} />
                  <Route path="add" element={<AddCase />} />
                  <Route path="edit" element={<EditCase />} />
                  <Route path=":caseId" element={<CaseDetails />} />
                </Route>
                <Route path="library" element={<LegalLibrary />} />
                <Route path="drafting" element={<LegalDraftingPage />} />
                <Route path="vault" element={<DocumentVault />} />
                <Route path="notepad" element={<Notepad />} />
                <Route path="articles/*">
                  <Route index element={<DashboardFeed />} />
                  <Route path=":id" element={<FullArticleDetail />} />
                </Route>
              </Routes>
            </motion.div>
          </AnimatePresence>
        </OnboardingGuard>
      </main>
    </div>
  );
}
