// client/src/context/AuthContext.jsx — Fresh user data always verified with backend
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_V1_BASE } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we've verified with backend
  const navigate = useNavigate();

  // ─── On app load: ALWAYS verify token with backend ──────────
  // This guarantees the displayed user always matches the
  // person who is actually logged in on THIS device right now —
  // never a stale/cached user from a previous session.
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        clearAllUserStorage();
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_V1_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Token invalid/expired — force clean logout
          clearAllUserStorage();
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const freshUser = { ...data.user, token };

        // Overwrite any stale cached data with the verified, fresh user
        localStorage.setItem("user", JSON.stringify(freshUser));
        localStorage.setItem("voicelaw_user", JSON.stringify(freshUser));
        setUser(freshUser);
      } catch (err) {
        console.error("Session verification failed:", err);
        clearAllUserStorage();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAllUserStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("voicelaw_user");
  };

  const login = async (email, password) => {
    // Always clear old data BEFORE attempting a new login —
    // prevents any chance of showing a previous user's info.
    clearAllUserStorage();

    const res = await fetch(`${API_V1_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Login failed");
    }

    const data = await res.json();
    const userData = { ...data.user, token: data.token };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("voicelaw_user", JSON.stringify(userData));

    setUser(userData);

    if (data.user.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/user-panel", { replace: true });
    }

    return userData;
  };

  const logout = () => {
    clearAllUserStorage();
    setUser(null);
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser: (next) => setUser(next),
        login,
        logout,
        loading, // components can show a spinner until session check finishes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
