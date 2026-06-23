// EditCase.jsx - Fixed with Proper Free Trial Access
import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { casesAPI } from "../../services/api";
import SubscriptionBlocker from "../../components/SubscriptionBlocker";
import useSubscriptionCheck from "../../hooks/useSubscriptionCheck";
import "../Style/AddCase.css";

const EditCase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { caseData } = location.state || {};
  const { canAccessFeature, subscriptionStatus } = useSubscriptionCheck();
  const [showBlocker, setShowBlocker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  // Populate form with case data when component mounts
  useEffect(() => {
    if (caseData) {
      setFormData({
        title: caseData.title || "",
        courtName: caseData.court?.name || caseData.courtName || "",
        type: caseData.caseType || caseData.type || "",
        caseNo: caseData.caseNo || "",
        caseYear: caseData.caseYear || new Date().getFullYear(),
        onBehalfOf: caseData.onBehalfOf || "",
        partyName: caseData.client?.name || caseData.partyName || "",
        contactNumber: caseData.client?.contact || caseData.contactNumber || "",
        respondent: caseData.respondent || "",
        lawyer: caseData.lawyer || "",
        advocateContactNumber: caseData.advocateContactNumber || "",
        adversePartyAdvocateName: caseData.adversePartyAdvocateName || "",
        description: caseData.description || "",
        nextHearing: caseData.nextHearing
          ? new Date(caseData.nextHearing).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: caseData.status || "pending",
      });
    }
  }, [caseData]);

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
        : "other";

      const onBehalf = normalizeEnum(formData.onBehalfOf);
      const onBehalfOf = allowedOnBehalfOf.has(onBehalf) ? onBehalf : "petitioner";

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

      const caseId = caseData?._id || caseData?.id;
      await casesAPI.update(caseId, payload);
      alert("Case updated successfully!");
      navigate("/user-panel/cases");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update case. Please try again."
      );
      console.error("Error updating case:", err);
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

      {error && (
        <div className="error-message">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      <div className="add-case-header">
        <button
          className="back-btn"
          onClick={() => navigate("/user-panel/cases")}
        >
          <FaArrowLeft /> Back to Cases
        </button>
        <h2>Edit Case</h2>
        <div className="header-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            <FaTimes /> Cancel
          </button>
          <button className="save-btn" type="submit" disabled={loading}>
            {loading ? (
              "Updating..."
            ) : (
              <>
                <FaSave /> Update Case
              </>
            )}
          </button>
        </div>
      </div>

      <form className="case-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Case Information</h3>
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

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="hearing">Hearing</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Party Information</h3>
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

        <div className="form-section">
          <h3>Advocate Information</h3>
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
          </div>
        </div>

        <div className="form-section">
          <h3>Case Description</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
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
      </form>

      {/* Subscription Blocker - Only shows when trial expired AND not subscribed */}
      <SubscriptionBlocker
        isOpen={showBlocker}
        onClose={() => setShowBlocker(false)}
        featureName="Edit Case"
      />
    </div>
  );
};

export default EditCase;
