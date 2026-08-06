import React from "react";
import { Link } from "react-router-dom";

export default function RefundPolicy() {
  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#e5e5e5", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", padding: "16px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ color: "#A67C2E", fontWeight: 800, fontSize: 20, textDecoration: "none", letterSpacing: 1 }}>VOICE OF LAW</Link>
          <Link to="/" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ color: "#A67C2E", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>Legal</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Cancellation & Refund Policy</h1>
        <p style={{ color: "#666", fontSize: 13, margin: "0 0 40px" }}>Last updated: {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: "28px 32px", marginBottom: 32 }}>
          <p style={{ color: "#bbb", lineHeight: 1.8, fontSize: 14, margin: 0 }}>
            At <strong style={{ color: "#A67C2E" }}>Voice of Law</strong>, we want you to be completely satisfied with our services.
            This policy explains our cancellation and refund process clearly and fairly.
          </p>
        </div>

        {[
          {
            title: "1. Free Trial",
            content: [
              "All new users receive a 7-day free trial with full access to all platform features.",
              "No payment is required during the free trial period.",
              "You may cancel at any time during the trial without any charge.",
              "After the trial ends, your account will be restricted to basic features until a subscription is purchased.",
            ]
          },
          {
            title: "2. Subscription Cancellation",
            content: [
              "You may cancel your subscription at any time from your account settings.",
              "Cancellation takes effect at the end of the current billing period.",
              "After cancellation, you retain access to premium features until the period ends.",
              "We do not charge any cancellation fees.",
            ]
          },
          {
            title: "3. Refund Policy",
            content: [
              "Monthly subscriptions: Refund requests submitted within 3 days of payment are eligible for a full refund.",
              "Yearly subscriptions: Refund requests submitted within 7 days of payment are eligible for a full refund.",
              "After the refund window, no refunds will be issued for the current billing period.",
              "Refunds are not provided for partial months/years of unused service.",
              "Refunds will be processed to the original payment method within 7-10 business days.",
            ]
          },
          {
            title: "4. Non-Refundable Cases",
            content: [
              "Accounts terminated due to violation of our Terms & Conditions are not eligible for refunds.",
              "Refunds are not provided if the service was used substantially during the billing period.",
              "Free trial users are not eligible for monetary refunds.",
            ]
          },
          {
            title: "5. How to Request a Refund",
            content: [
              "Send an email to info@voiceoflaw.com with subject: 'Refund Request'.",
              "Include your registered email address and reason for refund.",
              "Our team will respond within 2 business days.",
              "Approved refunds are processed within 7-10 business days.",
            ]
          },
          {
            title: "6. Service Downtime",
            content: [
              "If our platform experiences significant downtime (more than 24 hours), affected users may be eligible for a service credit.",
              "Service credits are applied to the next billing cycle — not refunded as cash.",
            ]
          },
          {
            title: "7. Contact Us",
            content: [
              "Email: info@voiceoflaw.com",
              "Address: Chiniot, Punjab, Pakistan",
              "Phone: +92 XXX XXXXXXX",
              "Support hours: Monday to Friday, 9 AM to 6 PM PKT",
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
EOF

cat > /mnt/user-data/outputs/OwnershipStatement.jsx << 'EOF'
import React from "react";
import { Link } from "react-router-dom";

export default function OwnershipStatement() {
  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#e5e5e5", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", padding: "16px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ color: "#A67C2E", fontWeight: 800, fontSize: 20, textDecoration: "none", letterSpacing: 1 }}>VOICE OF LAW</Link>
          <Link to="/" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ color: "#A67C2E", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>Legal</p>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Ownership Statement</h1>
        <p style={{ color: "#666", fontSize: 13, margin: "0 0 40px" }}>Last updated: {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        {[
          {
            title: "Platform Owner",
            content: [
              "Platform Name: Voice of Law",
              "Website: voiceoflaw.com (hosted on Vercel)",
              "Country of Operation: Islamic Republic of Pakistan",
              "City: Chiniot, Punjab, Pakistan",
              "Contact Email: info@voiceoflaw.com",
            ]
          },
          {
            title: "Nature of Business",
            content: [
              "Voice of Law is a legal technology (LegalTech) platform providing AI-powered legal case management services to lawyers and legal professionals in Pakistan.",
              "Services include: Legal case management, AI legal assistant, document drafting, legal library, and calendar management.",
              "The platform operates as a Software-as-a-Service (SaaS) product with subscription-based pricing.",
            ]
          },
          {
            title: "Intellectual Property",
            content: [
              "All software, design, content, and branding of Voice of Law is the intellectual property of its owner.",
              "Unauthorized reproduction or distribution of our platform content is strictly prohibited.",
              "Third-party tools and libraries used are credited and used under their respective licenses.",
            ]
          },
          {
            title: "Payment Processing",
            content: [
              "Payments are processed through licensed and regulated payment gateways operating in Pakistan.",
              "We comply with all applicable Pakistani financial regulations for online transactions.",
              "All transactions are conducted in Pakistani Rupees (PKR).",
            ]
          },
          {
            title: "Data Responsibility",
            content: [
              "Voice of Law is the data controller for all user information collected through the platform.",
              "Data is stored on secure cloud servers with encryption.",
              "We comply with applicable Pakistani data protection guidelines.",
              "For data-related requests, contact: info@voiceoflaw.com",
            ]
          },
          {
            title: "Legal Compliance",
            content: [
              "Voice of Law operates in compliance with the laws of the Islamic Republic of Pakistan.",
              "We are committed to maintaining a lawful, ethical, and transparent business.",
              "Any legal notices should be sent to: info@voiceoflaw.com",
              "Address: Chiniot, Punjab, Pakistan",
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