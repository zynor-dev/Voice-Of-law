import React from "react";
import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <div
      style={{
        background: "#0f0f0f",
        minHeight: "100vh",
        color: "#e5e5e5",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#1a1a1a",
          borderBottom: "1px solid #2a2a2a",
          padding: "16px 0",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            to="/"
            style={{
              color: "#A67C2E",
              fontWeight: 800,
              fontSize: 20,
              textDecoration: "none",
              letterSpacing: 1,
            }}
          >
            VOICE OF LAW
          </Link>
          <Link
            to="/"
            style={{ color: "#999", fontSize: 13, textDecoration: "none" }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <div
        style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}
      >
        <p
          style={{
            color: "#A67C2E",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: "0 0 8px",
          }}
        >
          Legal
        </p>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 8px",
          }}
        >
          Terms & Conditions
        </h1>
        <p style={{ color: "#666", fontSize: 13, margin: "0 0 40px" }}>
          Last updated:{" "}
          {new Date().toLocaleDateString("en-PK", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div
          style={{
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 12,
            padding: "28px 32px",
            marginBottom: 32,
          }}
        >
          <p
            style={{ color: "#bbb", lineHeight: 1.8, fontSize: 14, margin: 0 }}
          >
            Welcome to{" "}
            <strong style={{ color: "#A67C2E" }}>Voice of Law</strong>. By
            accessing or using our platform, you agree to be bound by these
            Terms and Conditions. Please read them carefully before using our
            services. These terms apply to all users including lawyers, legal
            professionals, and visitors.
          </p>
        </div>

        {[
          {
            title: "1. Acceptance of Terms",
            content: [
              "By creating an account or using Voice of Law, you confirm that you are at least 18 years old.",
              "You agree to these Terms & Conditions and our Privacy Policy.",
              "If you do not agree with any part of these terms, you must not use our services.",
              "We reserve the right to update these terms at any time with notice to registered users.",
            ],
          },
          {
            title: "2. Description of Services",
            content: [
              "Voice of Law provides a legal case management platform, AI legal assistant, document drafting tools, legal library, and case tracking features.",
              "Our AI assistant provides general legal information and assistance — it does not constitute formal legal advice.",
              "Services are available to registered and verified legal professionals in Pakistan.",
              "We reserve the right to modify, suspend, or discontinue any service at any time.",
            ],
          },
          {
            title: "3. Account Registration",
            content: [
              "You must provide accurate and complete information during registration.",
              "You are responsible for maintaining the confidentiality of your account credentials.",
              "You must notify us immediately of any unauthorized access to your account.",
              "One account per person — creating multiple accounts is not permitted.",
              "We reserve the right to suspend or terminate accounts that violate these terms.",
            ],
          },
          {
            title: "4. Subscription & Payment",
            content: [
              "New users receive a 7-day free trial with full access to all features.",
              "After the trial period, continued access requires an active paid subscription.",
              "Subscription plans: Monthly (Rs. 750/month) and Yearly (Rs. 7,999/year).",
              "Payments are processed securely through our payment gateway.",
              "Subscriptions are non-transferable and linked to a single user account.",
              "We reserve the right to change subscription prices with 30 days prior notice.",
            ],
          },
          {
            title: "5. Acceptable Use",
            content: [
              "You agree to use Voice of Law only for lawful purposes.",
              "You must not upload illegal, fraudulent, or harmful content.",
              "You must not attempt to gain unauthorized access to other users' data.",
              "You must not use our AI assistant to generate content that violates Pakistani law.",
              "You must not reverse engineer, copy, or redistribute our platform.",
              "Violation of these rules may result in immediate account suspension.",
            ],
          },
          {
            title: "6. Intellectual Property",
            content: [
              "All content, features, and functionality of Voice of Law are owned by Voice of Law and protected by applicable laws.",
              "You retain ownership of the case data and documents you upload.",
              "By uploading content, you grant us a limited license to store and display it for service operation.",
              "You may not copy, reproduce, or distribute our platform's content without permission.",
            ],
          },
          {
            title: "7. AI Legal Assistant Disclaimer",
            content: [
              "Our AI assistant provides general legal information only — not formal legal advice.",
              "Do not rely solely on AI responses for critical legal decisions.",
              "Always consult a qualified lawyer for specific legal matters.",
              "We are not liable for any decisions made based on AI-generated content.",
            ],
          },
          {
            title: "8. Limitation of Liability",
            content: [
              "Voice of Law is provided 'as is' without warranties of any kind.",
              "We are not liable for any indirect, incidental, or consequential damages.",
              "Our total liability shall not exceed the amount paid by you in the last 3 months.",
              "We are not responsible for data loss due to technical failures beyond our control.",
            ],
          },
          {
            title: "9. Governing Law",
            content: [
              "These terms are governed by the laws of the Islamic Republic of Pakistan.",
              "Any disputes shall be resolved in the courts of Punjab, Pakistan.",
              "We encourage resolving disputes amicably through our support channels first.",
            ],
          },
          {
            title: "10. Contact",
            content: [
              "Email: info@voiceoflaw.com",
              "Address: Chiniot, Punjab, Pakistan",
              "Phone: +92 XXX XXXXXXX",
            ],
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2
              style={{
                color: "#A67C2E",
                fontSize: 18,
                fontWeight: 700,
                margin: "0 0 14px",
                borderLeft: "3px solid #A67C2E",
                paddingLeft: 14,
              }}
            >
              {section.title}
            </h2>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {section.content.map((item, j) => (
                <li
                  key={j}
                  style={{
                    color: "#bbb",
                    fontSize: 14,
                    lineHeight: 1.8,
                    marginBottom: 6,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
