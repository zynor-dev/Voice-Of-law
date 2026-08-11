// src/App.jsx - UPDATED WITH NEW ARTICLE ROUTES
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Components
import Navbar from "./components/LandingPage/Navbar";
import Footer from "./components/LandingPage/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import FaqPage from "./pages/FaqPage";
import DetailPage from "./pages/DetailPage";
import JotformAgent from "./User/JotformAgent";

// Auth Pages
import EnhancedAuthPage from "./pages/EnhancedAuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { AuthProvider } from "./context/AuthContext";

// User Panel
import UserPanel from "./User/UserPanel";

// Admin Panel
import Dashboard from "./Admin/Dashboard";

// ============================================
// NEW ARTICLE COMPONENTS
// ============================================
import PublicArticlePreview from "./components/Articles/PublicArticlePreview";
import FullArticleDetail from "./components/Articles/FullArticleDetail";
import DashboardFeed from "./components/Articles/DashboardFeed";

const MainLayout = () => {
  const location = useLocation();
  const showNavbar = location.pathname === "/";

  return (
    <>
      {showNavbar && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location}>
          {/* ======================================== */}
          {/* PUBLIC ROUTES */}
          {/* ======================================== */}
          <Route path="/" element={<Home />} />

          {/* ======================================== */}
          {/* NEW: PUBLIC ARTICLE PREVIEW (No Auth Required) */}
          {/* ======================================== */}
          <Route
            path="/articles/:id/preview"
            element={<PublicArticlePreview />}
          />

          {/* Auth Routes */}
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route path="/auth/:mode" element={<EnhancedAuthPage />} />

          {/* Other Public Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/posts/:id" element={<DetailPage />} />

          {/* ======================================== */}
          {/* PROTECTED USER ROUTES */}
          {/* ======================================== */}
          <Route element={<ProtectedRoute />}>
            {/* User Panel - Base Routes */}
            <Route path="/user-panel/*" element={<UserPanel />} />

            {/* NEW: Full Article Detail (Auth Required) */}
            <Route path="jotform-agent" element={<JotformAgent />} />
            <Route
              path="/user-panel/legal-news-articles/:id"
              element={<FullArticleDetail />}
            />

            {/* Articles Feed (In User Panel) */}
            <Route
              path="/user-panel/legal-news-articles"
              element={<DashboardFeed />}
            />
          </Route>

          {/* ======================================== */}
          {/* PROTECTED ADMIN ROUTES */}
          {/* ======================================== */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </Router>
  );
};

export default App;
