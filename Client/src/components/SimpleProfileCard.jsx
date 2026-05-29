import React from "react";
import { FaUser, FaEnvelope, FaCrown } from "react-icons/fa";

const SimpleProfileCard = ({ userData }) => {
  if (!userData) return null;

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "24px",
        marginBottom: "24px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Profile Picture */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "32px",
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          {userData.fullName?.charAt(0).toUpperCase() ||
            userData.email?.charAt(0).toUpperCase() ||
            "U"}
        </div>

        {/* Profile Info */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1f2937",
                margin: 0,
              }}
            >
              {userData.fullName || userData.email?.split("@")[0] || "User"}
            </h2>
            {userData.role === "admin" && (
              <FaCrown style={{ color: "#f59e0b", fontSize: "20px" }} />
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#6b7280",
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            <FaEnvelope style={{ fontSize: "12px" }} />
            <span>{userData.email}</span>
          </div>

          {/* Additional Info */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            {userData.phoneNumber && (
              <div>
                <span style={{ color: "#9ca3af" }}>Phone: </span>
                <span style={{ fontWeight: "500" }}>
                  {userData.phoneNumber}
                </span>
              </div>
            )}
            {(userData.city || userData.province) && (
              <div>
                <span style={{ color: "#9ca3af" }}>Location: </span>
                <span style={{ fontWeight: "500" }}>
                  {[userData.city, userData.province]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
            {userData.courtName && (
              <div>
                <span style={{ color: "#9ca3af" }}>Court: </span>
                <span style={{ fontWeight: "500" }}>{userData.courtName}</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div style={{ marginTop: "12px" }}>
            {userData.isSubscribed || userData.isPaid ? (
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  backgroundColor: "#d1fae5",
                  color: "#065f46",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                ✓ Active Subscription
              </span>
            ) : (
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Trial Period
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfileCard;
