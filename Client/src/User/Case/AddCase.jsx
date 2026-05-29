// AddCase.jsx - Fixed with Proper Free Trial Access
import React, { useState } from "react";
import {
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaGavel,
  FaUserTie,
  FaFileAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { casesAPI } from "../../services/api";
import SubscriptionBlocker from "../../components/SubscriptionBlocker";
import useSubscriptionCheck from "../../hooks/useSubscriptionCheck";
import "../Style/AddCase.css";

const AddCase = () => {
  const navigate = useNavigate();
  const { canAccessFeature, subscriptionStatus } = useSubscriptionCheck();
  const [showBlocker, setShowBlocker] = useState(false);
  const [dailyLimitMessage, setDailyLimitMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    courtName: "",
    type: "",
    caseNo: "",
    caseYear: new Date().getFullYear(),
    onBehalfOf: "",
    partyName: "",
    contactNumber: "",
    respondent: "",
    lawyer: "",
    advocateContactNumber: "",
    adversePartyAdvocateName: "",
    description: "",
    nextHearing: new Date().toISOString().split("T")[0],
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("case-info");

  const caseTypes = [
    "Criminal",
    "Civil",
    "Family",
    "Property",
    "Corporate",
    "Labor",
    "Tax",
    "Constitutional",
  ];

  const onBehalfOfOptions = [
    "Petitioner",
    "Respondent",
    "Complainant",
    "Accused",
    "Plantiff",
    "DHR",
    "JDR",
    "Appellant",
  ];

  const sections = [
    {
      id: "case-info",
      name: "Case Information",
      icon: <FaGavel />,
    },
    {
      id: "party-info",
      name: "Party Information",
      icon: <FaUserTie />,
    },
    {
      id: "advocate-info",
      name: "Advocate Information",
      icon: <FaFileAlt />,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ CHECK: Block only if BOTH trial expired AND not subscribed
    if (!canAccessFeature()) {
      setShowBlocker(true);
      return;
    }

    setLoading(true);
    setError("");
    setDailyLimitMessage("");

    try {
      const normalizeEnum = (s) => String(s || "").trim().toLowerCase();
      const allowedCaseTypes = new Set([
        "civil",
        "criminal",
        "family",
        "corporate",
        "constitutional",
        "tax",
        "other",
      ]);
      const allowedOnBehalfOf = new Set([
        "petitioner",
        "respondent",
        "complainant",
        "accused",
        "appellant",
      ]);

      const caseTypeGuess = normalizeEnum(formData.type);
      const caseType = allowedCaseTypes.has(caseTypeGuess)
        ? caseTypeGuess
        : caseTypeGuess.includes("criminal")
          ? "criminal"
          : caseTypeGuess.includes("civil")
            ? "civil"
            : caseTypeGuess.includes("family")
              ? "family"
              : caseTypeGuess.includes("corporate")
                ? "corporate"
                : caseTypeGuess.includes("constitutional")
                  ? "constitutional"
                  : caseTypeGuess.includes("tax")
                    ? "tax"
                    : "other";

      const onBehalf = normalizeEnum(formData.onBehalfOf);
      const onBehalfOf = allowedOnBehalfOf.has(onBehalf) ? onBehalf : "petitioner";

      // Map legacy UI fields to real backend schema (no mock)
      const payload = {
        title: formData.title,
        caseNo: formData.caseNo,
        caseYear: Number(formData.caseYear),
        caseType,
        client: {
          name: formData.partyName,
          contact: formData.contactNumber || "",
        },
        petitioner: formData.partyName,
        respondent: formData.respondent,
        onBehalfOf,
        court: {
          name: formData.courtName,
        },
        description: formData.description || "",
        nextHearing: formData.nextHearing ? new Date(formData.nextHearing) : undefined,
        status: formData.status || "pending",
      };

      await casesAPI.create(payload);
      alert("Case added successfully!");
      navigate("/user-panel/cases");
    } catch (err) {
      // ✅ Handle daily limit error (only for free trial users)
      if (
        err.response?.status === 403 &&
        err.response?.data?.limitType === "cases"
      ) {
        setDailyLimitMessage(
          `Daily Limit Reached: You've created ${err.response.data.usedToday}/${err.response.data.dailyLimit} cases today. ` +
            `Upgrade to premium for unlimited access!`
        );
        setError(err.response.data.error);
      } else {
        setError(
          err.response?.data?.message || "Failed to add case. Please try again."
        );
      }
      console.error("Error adding case:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All changes will be lost."
      )
    ) {
      navigate("/user-panel/cases");
    }
  };

  const renderFormSection = () => {
    switch (activeSection) {
      case "case-info":
        return (
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Case Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="courtName">Court Name *</label>
                <input
                  type="text"
                  id="courtName"
                  name="courtName"
                  value={formData.courtName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Case Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Case Type</option>
                  {caseTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="caseNo">Case Number *</label>
                <input
                  type="text"
                  id="caseNo"
                  name="caseNo"
                  value={formData.caseNo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="caseYear">Case Year *</label>
                <input
                  type="number"
                  id="caseYear"
                  name="caseYear"
                  value={formData.caseYear}
                  onChange={handleInputChange}
                  required
                  min="2000"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div className="form-group">
                <label htmlFor="onBehalfOf">On Behalf Of *</label>
                <select
                  id="onBehalfOf"
                  name="onBehalfOf"
                  value={formData.onBehalfOf}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Option</option>
                  {onBehalfOfOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="nextHearing">Next Hearing Date *</label>
                <input
                  type="date"
                  id="nextHearing"
                  name="nextHearing"
                  value={formData.nextHearing}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case "party-info":
        return (
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="partyName">Party Name *</label>
                <input
                  type="text"
                  id="partyName"
                  name="partyName"
                  value={formData.partyName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number *</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="respondent">Respondent Name *</label>
                <input
                  type="text"
                  id="respondent"
                  name="respondent"
                  value={formData.respondent}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );

      case "advocate-info":
        return (
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="lawyer">Lawyer Name *</label>
                <input
                  type="text"
                  id="lawyer"
                  name="lawyer"
                  value={formData.lawyer}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="advocateContactNumber">
                  Advocate Contact Number
                </label>
                <input
                  type="tel"
                  id="advocateContactNumber"
                  name="advocateContactNumber"
                  value={formData.advocateContactNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adversePartyAdvocateName">
                  Adverse Party Advocate Name
                </label>
                <input
                  type="text"
                  id="adversePartyAdvocateName"
                  name="adversePartyAdvocateName"
                  value={formData.adversePartyAdvocateName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Case Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Enter case description..."
                ></textarea>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="add-case-container">
      {/* ✅ Show trial status banner if on trial */}
      {subscriptionStatus?.isTrialActive && (
        <div
          className="trial-status-banner"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "0.75rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          🎉 Free Trial Active - {subscriptionStatus.daysRemaining} days
          remaining
        </div>
      )}

      {/* ✅ Daily Limit Warning */}
      {dailyLimitMessage && (
        <div
          className="daily-limit-warning"
          style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          <strong>{dailyLimitMessage}</strong>
          <button
            onClick={() => navigate("/subscription")}
            style={{
              marginLeft: "1rem",
              padding: "0.5rem 1rem",
              background: "white",
              color: "#f5576c",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Upgrade Now
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      <div className="add-case-topbar">
        <div className="topbar-left">
          <button
            className="back-btn"
            onClick={() => navigate("/user-panel/cases")}
          >
            <FaArrowLeft />
          </button>
          <div className="case-title-section">
            <h2>Add New Case</h2>
            <span className="case-status pending">NEW</span>
          </div>
        </div>

        <div className="topbar-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-btn ${
                activeSection === section.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.icon}
              <span>{section.name}</span>
            </button>
          ))}
        </div>

        <div className="topbar-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            <FaTimes /> Cancel
          </button>
          <button
            className="save-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <FaSave /> Save Case
              </>
            )}
          </button>
        </div>
      </div>

      <div className="add-case-content-area">
        <div className="content-wrapper">
          <div className="add-case-content">
            <div className="case-sidebar">
              <h3 className="sidebar-title">
                {sections.find((s) => s.id === activeSection)?.name ||
                  "Case Details"}
              </h3>
              <div className="form-progress">
                <div
                  className={`progress-item ${
                    activeSection === "case-info" ? "active" : ""
                  }`}
                >
                  <span>Case Information</span>
                </div>
                <div
                  className={`progress-item ${
                    activeSection === "party-info" ? "active" : ""
                  }`}
                >
                  <span>Party Information</span>
                </div>
                <div
                  className={`progress-item ${
                    activeSection === "advocate-info" ? "active" : ""
                  }`}
                >
                  <span>Advocate Information</span>
                </div>
              </div>
            </div>

            <div className="case-main-content">
              <div className="case-form-container">
                <form className="case-form" onSubmit={handleSubmit}>
                  {renderFormSection()}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Blocker - Only shows when trial expired AND not subscribed */}
      <SubscriptionBlocker
        isOpen={showBlocker}
        onClose={() => setShowBlocker(false)}
        featureName="Case Creation"
      />
    </div>
  );
};

export default AddCase;
