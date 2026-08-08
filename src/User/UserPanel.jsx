/**
 * Voice of Law AI — Premium Dashboard
 * Matches designer mockups exactly:
 *  - Colors: #A67C2E (gold), #1E1E22 (dark bg)
 *  - Desktop: fixed dark sidebar (left) + top nav + content area
 *  - Mobile: fixed bottom navigation bar (Android APK style)
 *  - Screen-based navigation (no page scroll, 100vh viewport)
 *
 * DROP-IN REPLACEMENT for UserPanel.jsx
 * Requires: framer-motion, lucide-react, react-router-dom
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Bot, Briefcase, BookOpen, Scale,
  FolderLock, StickyNote, Newspaper, Calendar, Settings,
  Bell, Search, Plus, Phone, Mail, Building2, MapPin,
  ChevronRight, LogOut, User, X, Menu,
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


import SettingsPage from "./Setting/Settings";
import DashboardProfileCard from "../components/user-panel/DashboardProfileCard";
import LawyerCalendarPage from "../components/user-panel/LawyerCalendarPage";
import NotificationPopover from "../components/user-panel/NotificationPopover";
import OnboardingGuard from "../components/OnboardingGuard";
import logo from "../assets/image/logo.png";

/* ─── Brand tokens ─────────────────────────────────────────── */
const GOLD   = "#A67C2E";
const GOLD2  = "#C9983A";   // slightly lighter for hover/glow
const DARK   = "#1E1E22";
const DARK2  = "#26262B";   // sidebar item hover
const DARK3  = "#2E2E35";   // card/input bg
const WHITE  = "#FFFFFF";
const MUTED  = "#9B9BA8";
const LIGHT  = "#F5F5F7";   // main content bg

/* ─── Nav items ─────────────────────────────────────────────── */
const SIDEBAR_ITEMS = [
  { name: "Dashboard",            path: "/user-panel",              icon: LayoutDashboard, end: true  },
  { name: "AI Assistant",         path: "/user-panel/chatbot",      icon: Bot                         },
  { name: "Case Handling",        path: "/user-panel/cases",        icon: Briefcase                   },
  { name: "Library",              path: "/user-panel/library",      icon: BookOpen                    },
  { name: "Legal Drafting",       path: "/user-panel/drafting",     icon: Scale                       },
  { name: "Vault",                path: "/user-panel/vault",        icon: FolderLock                  },
   { name: "Notepad",              path: "/user-panel/notepad",      icon: StickyNote                  },
  { name: "Calendar",             path: "/user-panel/calendar",     icon: Calendar                    },
  { name: "Settings",             path: "/user-panel/settings",     icon: Settings                    },
];

/* Bottom nav (mobile — 5 primary items matching mockup) */
const BOTTOM_NAV = [
  { name: "Home",    path: "/user-panel",         icon: LayoutDashboard, end: true },
  { name: "Calendar",  path: "/user-panel/calendar",   icon: Calendar                     },
  { name: "AI Chat", path: "/user-panel/chatbot", icon: Bot,     center: true      },
  { name: "Cases",    path: "/user-panel/cases",icon: Briefcase                  },
  { name: "Account", path: "/user-panel/settings",icon: User                       },
];

/* Top nav tabs (desktop) */
const TOP_TABS = [
  { name: "Dashboard", path: "/user-panel", end: true },
  { name: "Research",  path: "/user-panel/library"   },
  { name: "Drafting",  path: "/user-panel/drafting"  },
  { name: "Analytics", path: "/user-panel/cases"     },
];

function pathMatch(pathname, item) {
  if (item.end) return pathname === "/user-panel" || pathname === "/user-panel/";
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

/* ─── Quick action nav pill ─────────────────────────────────── */
const NAV_PILLS = [
  { label: "AI Assistant",   icon: Bot,        path: "/user-panel/chatbot"  },
  { label: "Case Handling",  icon: Briefcase,  path: "/user-panel/cases"   },
  { label: "Library",        icon: BookOpen,   path: "/user-panel/library" },
  { label: "Vault",          icon: FolderLock, path: "/user-panel/vault"   },
];

/* ─── Profile info fields ───────────────────────────────────── */
function InfoField({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <Icon size={18} style={{ color: GOLD, marginTop: 2, flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
          color: MUTED, textTransform: "uppercase", margin: 0 }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a", margin: "2px 0 0" }}>{value || "—"}</p>
      </div>
    </div>
  );
}

/* ─── Dashboard Home (matches both mockup screens) ─────────── */
function DashboardHome({ user, navigate }) {
  const [aiQuery, setAiQuery] = useState("");

  const initials = (user?.fullName || user?.email || "U")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleAiSubmit = () => {
    if (aiQuery.trim()) navigate("/user-panel/chatbot");
  };

  return (
    <div style={{
      height: "100%", overflowY: "auto", background: LIGHT,
      padding: "20px",
    }}>
      {/* ── AI Intelligence Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
        style={{
          background: DARK, borderRadius: 16, padding: "18px 20px",
          display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {/* Bot icon badge */}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: GOLD, display: "flex", alignItems: "center",
          justifyContent: "center", flexShrink: 0,
        }}>
          <Bot size={22} color={DARK} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 120 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: GOLD }}>
            Intelligence Engine
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#9B9BA8", marginTop: 2 }}>
            How can I assist your case today?
          </p>
        </div>
        {/* Search input */}
        <div style={{
          display: "flex", alignItems: "center", flex: 1,
          minWidth: 200, background: DARK3, borderRadius: 12,
          overflow: "hidden", border: `1px solid ${DARK3}`,
        }}>
          <input
            value={aiQuery}
            onChange={e => setAiQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAiSubmit()}
            placeholder="Search case law or draft motion..."
            style={{
              flex: 1, background: "transparent", border: "none",
              outline: "none", color: WHITE, padding: "10px 14px",
              fontSize: 13,
            }}
          />
          <button
            onClick={handleAiSubmit}
            style={{
              width: 42, height: 42, background: GOLD,
              border: "none", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <ChevronRight size={18} color={DARK} />
          </button>
        </div>
        {/* Desktop: Prompt AI button */}
        <button
          onClick={() => navigate("/user-panel/chatbot")}
          className="vol-prompt-btn"
          style={{
            background: GOLD, color: DARK, border: "none",
            borderRadius: 10, padding: "10px 20px", fontWeight: 700,
            fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
            display: "none",
          }}
        >
          Prompt AI
        </button>
      </motion.div>

      {/* ── Profile Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.22,1,0.36,1] }}
        style={{
          background: WHITE, borderRadius: 20, overflow: "hidden",
          marginBottom: 20, boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
          border: "1px solid #ebebeb",
        }}
      >
        {/* Avatar */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 32 }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            border: `3px solid ${GOLD}`, overflow: "hidden",
            background: DARK3, display: "flex", alignItems: "center",
            justifyContent: "center", position: "relative",
          }}>
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 32, fontWeight: 700, color: GOLD }}>{initials}</span>
            )}
            {/* Online dot */}
            <span style={{
              position: "absolute", bottom: 5, right: 5,
              width: 14, height: 14, borderRadius: "50%",
              background: "#22C55E", border: "2px solid white",
            }} />
          </div>
        </div>

        {/* Name */}
        <div style={{ textAlign: "center", padding: "14px 24px 0" }}>
          <h2 style={{
            margin: 0, fontSize: 22, fontWeight: 800,
            color: "#0f0f0f", letterSpacing: "-0.3px",
          }}>
            {user?.fullName ? ` ${user.fullName}` : ""}
          </h2>
          {(user?.barCouncilNumber || user?.courtName) && (
            <p style={{
              margin: "6px 0 0", fontSize: 11, fontWeight: 700,
              color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase",
            }}>
              {user?.barCouncilNumber ? `Bar No. ${user.barCouncilNumber}` : ""}
              {user?.courtName && `  ${user.courtName}`}
            </p>
          )}
        </div>

        <hr style={{ margin: "18px 24px", border: "none", borderTop: "1px solid #f0f0f0" }} />

        {/* Info grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 20, padding: "0 28px 28px",
        }}>
          <InfoField icon={Phone} label="Contact Number"
            value={user?.phoneNumber} />
          <InfoField icon={Mail} label="Email Address"
            value={user?.email} />
          <InfoField icon={Building2} label="Court Name"
            value={user?.courtName} />
          <InfoField icon={MapPin} label="City"
            value={user?.city} />
          {user?.province && (
            <InfoField icon={MapPin} label="Province"
              value={user?.province} />
          )}
        </div>
      </motion.div>

      {/* ── Quick Actions (mobile pill row) ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: [0.22,1,0.36,1] }}
        style={{
          display: "flex", gap: 10, overflowX: "auto",
          paddingBottom: 4, marginBottom: 20,
        }}
      >
        {NAV_PILLS.map(p => (
          <button
            key={p.path}
            onClick={() => navigate(p.path)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: DARK, color: WHITE, border: "none",
              borderRadius: 40, padding: "10px 18px",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            <p.icon size={15} />
            {p.label}
          </button>
        ))}
        <button
          onClick={() => navigate("/user-panel/drafting")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "transparent", color: DARK,
            border: `1.5px solid ${DARK}`, borderRadius: 40,
            padding: "10px 18px", fontSize: 13, fontWeight: 600,
            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          <Plus size={15} />
          New Brief
        </button>
      </motion.div>

    
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN UserPanel
══════════════════════════════════════════════════════════════ */
export default function UserPanel() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  /* Session redirect on reload */
  useEffect(() => {
    try {
      const key = "vol_session_init";
      if (sessionStorage.getItem(key) === "1") return;
      const nav = performance.getEntriesByType?.("navigation")?.[0];
      sessionStorage.setItem(key, "1");
      if (nav?.type === "reload" &&
          location.pathname.startsWith("/user-panel/") &&
          location.pathname !== "/user-panel") {
        navigate("/user-panel", { replace: true });
      }
    } catch {}
  }, []);

  /* Close overlays on outside click */
  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const initials = useCallback(() =>
    (user?.fullName?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase()
  , [user]);

  const isActive = (item) => pathMatch(location.pathname, item);

  /* ─── Sidebar nav item ─────────────────────────────────────── */
  const SidebarItem = ({ item }) => {
    const active = isActive(item);
    const Icon = item.icon;
    return (
      <button
        onClick={() => navigate(item.path)}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          width: "100%", padding: "10px 16px",
          background: active ? `${GOLD}22` : "transparent",
          border: active ? `1px solid ${GOLD}44` : "1px solid transparent",
          borderRadius: 10, cursor: "pointer",
          transition: "all 0.18s ease",
          borderLeft: active ? `3px solid ${GOLD}` : "3px solid transparent",
          marginBottom: 2,
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = DARK2; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
      >
        <Icon size={17} style={{ color: active ? GOLD : MUTED, flexShrink: 0 }} />
        <span style={{
          fontSize: 13, fontWeight: active ? 600 : 400,
          color: active ? WHITE : MUTED,
          whiteSpace: "nowrap",
        }}>
          {item.name}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* ── Global styles injected once ── */}
      <style>{`
        .vol-layout { display:flex; height:100dvh; overflow:hidden; background:${LIGHT}; }

        /* Desktop sidebar */
        .vol-sidebar {
          width: 220px; flex-shrink:0; background:${DARK};
          display:flex; flex-direction:column; overflow:hidden;
          border-right:1px solid ${DARK3};
        }

        /* Main area */
        .vol-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }

        /* Top bar (desktop only) */
        .vol-topbar {
          height: 52px; background:${WHITE}; border-bottom:1px solid #ebebeb;
          display:flex; align-items:center; padding:0 24px; gap:24px;
          flex-shrink:0;
        }

        /* Content */
        .vol-content { flex:1; min-height:0; overflow:hidden; }

        /* Bottom nav (mobile only) */
        .vol-bottom-nav {
          display:none; position:fixed; bottom:0; left:0; right:0;
          background:${DARK}; height:60px; z-index:200;
          align-items:center; justify-content:space-around;
          border-top:1px solid ${DARK3};
        }

        /* Mobile header */
        .vol-mobile-header {
          display:none; position:fixed; top:0; left:0; right:0;
          background:${DARK}; height:52px; z-index:200;
          align-items:center; justify-content:space-between;
          padding:0 16px;
        }

        @media (max-width: 768px) {
          .vol-sidebar    { display:none; }
          .vol-topbar     { display:none; }
          .vol-main       { padding-top:52px; padding-bottom:60px; min-height:0; }
          .vol-bottom-nav { display:flex; }
          .vol-mobile-header { display:flex; }
          .vol-prompt-btn { display:none !important; }
        }

        @media (min-width: 769px) {
          .vol-prompt-btn { display:flex !important; }
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:${DARK3}; border-radius:4px; }

        /* Search input dark */
        .vol-search-inp {
          background:${DARK3}; border:1px solid #3a3a42;
          border-radius:20px; padding:7px 14px 7px 36px;
          color:${WHITE}; font-size:13px; outline:none; width:200px;
          transition:width 0.2s;
        }
        .vol-search-inp:focus { width:260px; border-color:${GOLD}; }
        .vol-search-inp::placeholder { color:${MUTED}; }
      `}</style>

      <div className="vol-layout">

        {/* ══ SIDEBAR (Desktop) ══════════════════════════════ */}
        <aside className="vol-sidebar">
          {/* Logo */}
          <div style={{
            padding: "20px 16px 16px", borderBottom: `1px solid ${DARK3}`,
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={logo} alt="VOL" style={{ height: 32, objectFit: "contain" }} />
              <div>
                <p style={{ margin:0, fontWeight:800, fontSize:13,
                  color:WHITE, letterSpacing:"0.01em" }}>Voice Of Law AI</p>
                <p style={{ margin:0, fontSize:9, color:GOLD,
                  letterSpacing:"0.12em", fontWeight:600 }}>PREMIUM INTELLIGENCE</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav style={{ flex:1, overflowY:"auto", padding:"12px 10px" }}>
            {SIDEBAR_ITEMS.map(item => (
              <SidebarItem key={item.path} item={item} />
            ))}
          </nav>

          {/* User chip at bottom */}
          <div style={{
            padding:"12px 16px", borderTop:`1px solid ${DARK3}`,
            display:"flex", alignItems:"center", gap:10, flexShrink:0,
          }}>
            <div style={{
              width:34, height:34, borderRadius:"50%",
              background:GOLD, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:13, fontWeight:700,
              color:DARK, border:`2px solid ${GOLD2}`,
            }}>
              {initials()}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ margin:0, fontSize:12, fontWeight:600, color:WHITE,
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {user?.fullName || user?.email?.split("@")[0] || ""}
              </p>
              <p style={{ margin:0, fontSize:10, color:MUTED }}>Senior Partner</p>
            </div>
            <button onClick={() => { logout(); navigate("/"); }}
              style={{ background:"none", border:"none", cursor:"pointer",
                padding:4, color:MUTED }}
              title="Log out">
              <LogOut size={15} />
            </button>
          </div>
        </aside>

        {/* ══ MAIN ═══════════════════════════════════════════ */}
        <div className="vol-main">

          {/* ── Top bar (Desktop) ── */}
          <header className="vol-topbar">
            {/* Tab nav */}
            <nav style={{ display:"flex", gap:4, flex:1 }}>
              {TOP_TABS.map(tab => {
                const active = pathMatch(location.pathname, tab);
                return (
                  <button key={tab.path} onClick={() => navigate(tab.path)}
                    style={{
                      background:"none", border:"none", cursor:"pointer",
                      padding:"6px 14px", fontSize:13, fontWeight: active ? 600 : 400,
                      color: active ? DARK : MUTED,
                      borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
                      transition:"all 0.18s",
                    }}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </nav>

            {/* Search */}
            <div ref={searchRef} style={{ position:"relative" }}>
              <Search size={14} style={{
                position:"absolute", left:12, top:"50%",
                transform:"translateY(-50%)", color:MUTED,
              }} />
              <input
                className="vol-search-inp"
                placeholder="Global Search..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
            </div>

            {/* Bell */}
            <div style={{ position:"relative" }}>
              <NotificationPopover />
            </div>

            {/* Settings */}
            <button onClick={() => navigate("/user-panel/settings")}
              style={{ background:"none", border:"none", cursor:"pointer",
                color:MUTED, padding:4 }}>
              <Settings size={18} />
            </button>

            {/* Avatar */}
            <div ref={profileRef} style={{ position:"relative" }}>
              <button onClick={() => setProfileOpen(p => !p)}
                style={{
                  width:36, height:36, borderRadius:"50%",
                  background:GOLD, border:`2px solid ${GOLD2}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:13, fontWeight:700, color:DARK, cursor:"pointer",
                }}
              >
                {initials()}
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-6 }} transition={{ duration:0.15 }}
                    style={{
                      position:"absolute", right:0, top:"calc(100% + 8px)",
                      background:WHITE, borderRadius:14, minWidth:200,
                      boxShadow:"0 8px 32px rgba(0,0,0,0.14)",
                      border:"1px solid #ebebeb", overflow:"hidden", zIndex:300,
                    }}
                  >
                    <div style={{ padding:"12px 16px", borderBottom:"1px solid #f0f0f0" }}>
                      <p style={{ margin:0, fontWeight:700, fontSize:13, color:"#111" }}>
                        {user?.fullName || user?.email?.split("@")[0] || "User"}
                      </p>
                      <p style={{ margin:0, fontSize:11, color:MUTED }}>{user?.email}</p>
                    </div>
                    {[
                      { label:"Settings", action: () => { setProfileOpen(false); navigate("/user-panel/settings"); }},
                      { label:"Log out", action: () => { logout(); navigate("/"); }, danger: true },
                    ].map(item => (
                      <button key={item.label} onClick={item.action}
                        style={{
                          display:"block", width:"100%", padding:"10px 16px",
                          background:"none", border:"none", cursor:"pointer",
                          textAlign:"left", fontSize:13,
                          color: item.danger ? "#DC2626" : "#333",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = item.danger ? "#FEF2F2" : "#f9f9f9"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>

          {/* ── Content ── */}
          <div className="vol-content">
            <OnboardingGuard>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity:0, y:8 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-6 }}
                  transition={{ duration:0.2, ease:[0.22,1,0.36,1] }}
                  style={{ height:"100%" }}
                >
                  <Routes>
                    <Route index element={
                      <DashboardHome user={user} navigate={navigate} />
                    } />
                    <Route path="chatbot"      element={<Chatbot />} />
                    <Route path="calendar"     element={<LawyerCalendarPage />} />
                    <Route path="settings"     element={<SettingsPage />} />
                    <Route path="cases/*">
                      <Route index element={<MyCases />} />
                      <Route path="add"      element={<AddCase />} />
                      <Route path="edit"     element={<EditCase />} />
                      <Route path=":caseId"  element={<CaseDetails />} />
                    </Route>
                    <Route path="library"  element={<LegalLibrary />} />
                    <Route path="drafting" element={<LegalDraftingPage />} />
                    <Route path="vault"    element={<DocumentVault />} />
                    <Route path="notepad"  element={<Notepad />} />
                   
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </OnboardingGuard>
          </div>
        </div>
      </div>

      {/* ══ MOBILE HEADER ════════════════════════════════════ */}
      <header className="vol-mobile-header">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src={logo} alt="VOL" style={{ height:26, objectFit:"contain" }} />
          <div>
            <p style={{ margin:0, fontWeight:800, fontSize:12, color:WHITE }}>Voice Of Law AI</p>
            <p style={{ margin:0, fontSize:8, color:GOLD,
              letterSpacing:"0.1em", fontWeight:600 }}>PREMIUM INTELLIGENCE</p>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button style={{ background:"none", border:"none", cursor:"pointer",
            color:MUTED, padding:4, position:"relative" }}>
            <Bell size={20} color={GOLD} />
            <span style={{
              position:"absolute", top:2, right:2, width:7, height:7,
              background:GOLD, borderRadius:"50%", border:`1.5px solid ${DARK}`,
            }} />
          </button>
          <button onClick={() => setProfileOpen(p => !p)}
            style={{
              width:36, height:36, borderRadius:"50%",
              background:GOLD, border:`2px solid ${GOLD2}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, fontWeight:700, color:DARK, cursor:"pointer",
              overflow:"hidden",
            }}
          >
            {user?.profilePicture
              ? <img src={user.profilePicture} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : initials()
            }
          </button>
        </div>
      </header>

      {/* ══ MOBILE BOTTOM NAV ════════════════════════════════ */}
      <nav className="vol-bottom-nav">
        {BOTTOM_NAV.map(item => {
          const active = isActive(item);
          const Icon = item.icon;
          if (item.center) {
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{
                  width:54, height:54, borderRadius:"50%",
                  background:GOLD, border:"none", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 4px 16px ${GOLD}66`, marginTop:-10,
                }}
              >
                <Icon size={24} color={DARK} />
              </button>
            );
          }
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              style={{
                background:"none", border:"none", cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center",
                gap:3, padding:"6px 12px",
              }}
            >
              <Icon size={20} color={active ? GOLD : MUTED} />
              <span style={{ fontSize:10, color: active ? GOLD : MUTED,
                fontWeight: active ? 600 : 400 }}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

    </>
  );
}
