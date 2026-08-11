import React, { useState } from "react";
import "../styles/Contact.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { API_V1_BASE } from "../services/api";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: string }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_V1_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({
          type: "success",
          text: "Message sent! We'll get back to you shortly.",
        });
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus({
          type: "error",
          text:
            data.message || "Could not send your message. Please try again.",
        });
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-us-container">
      <div className="contact-wrapper">
        {/* Left Side: Contact Information */}
        <div className="contact-info-column">
          <h2 className="info-main-heading">Contact Information</h2>
          <p className="info-description">
            Feel free to reach out to us for any legal queries or assistance.
            Our team is ready to help you.
          </p>
          <div className="contact-details">
            {/* <div className="contact-item">
              <FaPhone className="contact-icon" />
              <p>+92 XXX XXXXXXX</p>
            </div> */}
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <p>voiceoflaw.ai@gmail.com</p>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <p>Pakistan</p>
            </div>
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="message-form-column">
          <h2 className="form-main-heading">Send us a Message</h2>
          <p className="form-description">
            We'd love to hear from you! Please fill out the form below and we'll
            get back to you shortly.
          </p>

          {status && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "14px",
                borderLeft: `4px solid ${status.type === "success" ? "#16a34a" : "#b91c1c"}`,
                background: status.type === "success" ? "#f0fdf4" : "#fef2f2",
                color: status.type === "success" ? "#15803d" : "#b91c1c",
              }}
            >
              {status.text}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Type your message here..."
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="send-message-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
