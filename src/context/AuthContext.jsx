// client/src/context/AuthContext.jsx - ABSOLUTE FINAL FIX
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_V1_BASE } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("voicelaw_user"));
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem("voicelaw_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("voicelaw_user");
    }
  }, [user]);

  const login = async (email, password) => {
    // ✅ CRITICAL: Clear ALL old user data BEFORE login
    console.log("🔄 Clearing old user data before login...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("voicelaw_user");

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

    console.log("✅ Login response:", data.user);

    // ✅ Store the NEW user data
    const userData = {
      ...data.user,
      token: data.token,
    };

    // ✅ Store in ALL possible localStorage keys
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("voicelaw_user", JSON.stringify(userData));

    console.log("✅ Stored new user data in localStorage");

    setUser(userData);

    // ✅ Navigate to correct routes
    if (data.user.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/user-panel", { replace: true });
    }

    return userData;
  };

  const logout = () => {
    console.log("🔄 Logging out and clearing ALL user data...");

    // ✅ Clear ALL localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("voicelaw_user");

    // ✅ Also clear any other cached data
    localStorage.clear();

    setUser(null);

    navigate("/", { replace: true });

    console.log("✅ Logout complete");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser: (next) => setUser(next),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
