// Add this temporarily to your UserPanel to debug

import React from "react";
import { useAuth } from "../context/AuthContext";

const DebugUserInfo = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        backgroundColor: "#fef3c7",
        border: "2px solid #f59e0b",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
        fontFamily: "monospace",
        fontSize: "12px",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#92400e" }}>🔍 DEBUG: User Data</h3>
      <pre
        style={{
          backgroundColor: "white",
          padding: "12px",
          borderRadius: "4px",
          overflow: "auto",
          maxHeight: "300px",
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>
      <div style={{ marginTop: "12px", color: "#92400e" }}>
        <strong>Key Fields:</strong>
        <br />• onboardingCompleted: {String(user?.onboardingCompleted)}
        <br />• fullName: {user?.fullName || "NOT SET"}
        <br />• phoneNumber: {user?.phoneNumber || "NOT SET"}
        <br />• profilePicture: {user?.profilePicture || "NOT SET"}
      </div>
    </div>
  );
};

export default DebugUserInfo;

// Usage in UserPanel.jsx DashboardWithArticles:
// <DebugUserInfo />
// <ProfileCard userData={user} />
