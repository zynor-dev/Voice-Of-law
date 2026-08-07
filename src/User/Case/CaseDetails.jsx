import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEdit, FaGavel, FaUserTie, FaCalendarAlt, FaBalanceScale } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { casesAPI, handleApiError } from "../../services/api";
import "../Style/CaseDetails.css";

const Field = ({ label, value }) => (
  <div className="case-preview-field">
    <span>{label}</span>
    <strong>{value || "—"}</strong>
  </div>
);

export default function CaseDetails() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    casesAPI.getById(caseId)
      .then((res) => active && setCaseData(res.data?.case || res.data?.data?.case || null))
      .catch((err) => active && setError(handleApiError(err)));
    return () => { active = false; };
  }, [caseId]);

  if (error) return <div className="case-preview-page"><div className="case-preview-error">{error}<button onClick={() => navigate("/user-panel/cases")}>Back to cases</button></div></div>;
  if (!caseData) return <div className="case-preview-page"><div className="case-preview-loading">Loading case preview…</div></div>;

  const hearing = caseData.nextHearing ? new Date(caseData.nextHearing).toLocaleDateString() : "Not scheduled";
  return (
    <div className="case-preview-page">
      <header className="case-preview-header">
        <button className="case-preview-back" onClick={() => navigate("/user-panel/cases")}><FaArrowLeft /> Cases</button>
        <div className="case-preview-actions">
          <button className="case-preview-edit" onClick={() => navigate("/user-panel/cases/edit", { state: { caseData } })}><FaEdit /> Edit case</button>
        </div>
      </header>

      <main className="case-preview-content">
        <section className="case-preview-hero">
          <div>
            <p>CASE PREVIEW</p>
            <h1>{caseData.title}</h1>
            <span className={`case-preview-status ${caseData.status}`}>{caseData.status}</span>
          </div>
          <div className="case-preview-hearing"><FaCalendarAlt /><div><span>Next hearing</span><strong>{hearing}</strong></div></div>
        </section>

        <section className="case-preview-grid">
          <article className="case-preview-card"><h2><FaGavel /> Case information</h2><div className="case-preview-fields"><Field label="Case number" value={`${caseData.caseNo || "—"}${caseData.caseYear ? ` / ${caseData.caseYear}` : ""}`} /><Field label="Case type" value={caseData.caseType} /><Field label="Priority" value={caseData.priority} /><Field label="Status" value={caseData.status} /><Field label="Court" value={caseData.court?.name} /><Field label="Court location" value={caseData.court?.location} /></div></article>
          <article className="case-preview-card"><h2><FaUserTie /> Parties & client</h2><div className="case-preview-fields"><Field label="Client" value={caseData.client?.name} /><Field label="Client contact" value={caseData.client?.contact} /><Field label="Petitioner" value={caseData.petitioner} /><Field label="Respondent" value={caseData.respondent} /><Field label="Representing" value={caseData.onBehalfOf} /><Field label="Client email" value={caseData.client?.email} /></div></article>
          <article className="case-preview-card case-preview-card-wide"><h2><FaBalanceScale /> Case summary</h2><p className="case-preview-description">{caseData.description || "No description has been added to this case."}</p>{caseData.relevantLaws?.length > 0 && <div className="case-preview-laws">{caseData.relevantLaws.map((law) => <span key={law}>{law}</span>)}</div>}</article>
        </section>
      </main>
    </div>
  );
}
