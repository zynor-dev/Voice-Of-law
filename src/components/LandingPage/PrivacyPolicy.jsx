import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#e5e5e5", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", padding: "16px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ color: "#A67C2E", fontWeight: 800, fontSize: 20, textDecoration: "none", letterSpacing: 1 }}>
            VOICE OF LAW
          </Link>
          <Link to="/" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ color: "#A67C2E", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>Legal</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Privacy Policy</h1>
        <p style={{ color: "#666", fontSize: 13, margin: "0 0 40px" }}>Last updated: {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: "28px 32px", marginBottom: 24 }}>
          <p style={{ color: "#bbb", lineHeight: 1.8, fontSize: 14, margin: 0 }}>
            Voice of Law ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our legal case management and AI assistant platform
            available at <strong style={{ color: "#A67C2E" }}>voiceoflaw.com</strong>. By using our services, you agree to the terms of this policy.
          </p>
        </div>

        {[
          {
            title: "1. Information We Collect",
            content: [
              "Personal Information: Full name, email address, phone number, CNIC (optional), city, province, court name, bar council number, and chamber name provided during registration.",
              "Profile Information: Profile picture, bio, and professional details you add to your account.",
              "Case Data: Legal case information, documents, notes, hearings, and evidence files you upload.",
              "Usage Data: Login history, device information, IP address, browser type, and pages visited.",
              "Payment Information: Subscription payment details processed securely through our payment gateway. We do not store full card numbers.",
              "Communications: Messages sent through our contact form or support channels.",
            ]
          },
          {
            title: "2. How We Use Your Information",
            content: [
              "To provide, operate, and maintain our legal case management services.",
              "To process your subscription payments and manage your account.",
              "To send verification codes, notifications, and important service updates via email.",
              "To personalize your experience and provide AI-powered legal assistance.",
              "To improve our platform, fix bugs, and develop new features.",
              "To comply with legal obligations and resolve disputes.",
              "To detect and prevent fraudulent or unauthorized activity.",
            ]
          },
          {
            title: "3. Data Security",
            content: [
              "All data is encrypted in transit using SSL/TLS technology.",
              "Passwords are hashed using bcrypt — we never store plain text passwords.",
              "Access to your data is protected by JWT authentication tokens.",
              "Case files and documents are stored securely on cloud storage (Cloudinary).",
              "We conduct regular security reviews to protect your information.",
              "Despite our security measures, no method of transmission over the internet is 100% secure.",
            ]
          },
          {
            title: "4. Data Sharing",
            content: [
              "We do NOT sell, trade, or rent your personal information to third parties.",
              "We may share data with trusted service providers (MongoDB, Cloudinary, email services) strictly to operate our platform.",
              "We may disclose information if required by Pakistani law, court order, or government authority.",
              "In case of a business merger or acquisition, user data may be transferred with prior notice.",
            ]
          },
          {
            title: "5. Cookies",
            content: [
              "We use cookies and local storage to maintain your login session and preferences.",
              "Google reCAPTCHA is used on certain pages to prevent bot activity — this is governed by Google's Privacy Policy.",
              "You may disable cookies in your browser settings, but this may affect platform functionality.",
            ]
          },
          {
            title: "6. Your Rights",
            content: [
              "Access: You may request a copy of all personal data we hold about you.",
              "Correction: You may update your profile information at any time from your dashboard settings.",
              "Deletion: You may request deletion of your account and all associated data by contacting us.",
              "Portability: You may request an export of your case data and profile information.",
              "To exercise any of these rights, contact us at info@voiceoflaw.com.",
            ]
          },
          {
            title: "7. Data Retention",
            content: [
              "We retain your account data for as long as your account is active.",
              "If you delete your account, your data is permanently removed within 30 days.",
              "Audit logs may be retained for up to 1 year for security purposes.",
            ]
          },
          {
            title: "8. Children's Privacy",
            content: [
              "Voice of Law is intended for legal professionals aged 18 and above.",
              "We do not knowingly collect information from minors.",
            ]
          },
          {
            title: "9. Changes to This Policy",
            content: [
              "We may update this Privacy Policy from time to time.",
              "Changes will be communicated via email or a notice on our platform.",
              "Continued use of the platform after changes constitutes acceptance of the updated policy.",
            ]
          },
          {
            title: "10. Contact Us",
            content: [
              "If you have any questions about this Privacy Policy, contact us:",
              "Email: info@voiceoflaw.com",
              "Address: Chiniot, Punjab, Pakistan",
              "Phone: +92 XXX XXXXXXX",
            ]
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#A67C2E", fontSize: 18, fontWeight: 700, margin: "0 0 14px", borderLeft: "3px solid #A67C2E", paddingLeft: 14 }}>
              {section.title}
            </h2>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {section.content.map((item, j) => (
                <li key={j} style={{ color: "#bbb", fontSize: 14, lineHeight: 1.8, marginBottom: 6 }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}