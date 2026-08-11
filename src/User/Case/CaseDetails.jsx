import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FaArrowLeft,
  FaEdit,
  FaGavel,
  FaUserTie,
  FaCalendarAlt,
  FaBalanceScale,
  FaFolderOpen,
  FaGavel as FaOrders,
  FaStickyNote,
  FaCloudUploadAlt,
  FaTrash,
  FaDownload,
  FaFilePdf,
  FaFileAlt,
  FaPlus,
  FaDownload as FaCasePdf,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  casesAPI,
  filesAPI,
  draftsAPI,
  getServerOrigin,
  handleApiError,
} from "../../services/api";
import "../Style/CaseDetails.css";

const Field = ({ label, value }) => (
  <div className="case-preview-field">
    <span>{label}</span>
    <strong>{value || "—"}</strong>
  </div>
);

const isImageFile = (item) => {
  const name =
    item.originalName || item.name || item.fileName || item.url || "";
  const mime = item.mimetype || item.type || "";
  if (mime.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(name);
};

const getItemUrl = (item) =>
  filesAPI.getFileUrl(item.url || item.path || item.filePath || item.fileUrl);
const getItemName = (item) =>
  item.originalName || item.name || item.fileName || "File";

// ─── Preview + list used for both Evidence and Case Orders ────
// (The dropzone itself now lives in the hero — see CompactDropzone)
function AttachmentSection({
  caseId,
  sectionType,
  items,
  onChange,
  emptyLabel,
  uploadError,
}) {
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const imageItems = items.filter(isImageFile);
  const fileItems = items.filter((i) => !isImageFile(i));

  useEffect(() => {
    if (activeIndex >= imageItems.length) setActiveIndex(0);
  }, [imageItems.length, activeIndex]);

  const handleDelete = async (itemId) => {
    if (!window.confirm("Remove this attachment?")) return;
    try {
      const res = await casesAPI.deleteItem(
        caseId,
        itemId,
        sectionType,
        "attachment",
      );
      const updated = res.data?.data || res.data;
      onChange(updated);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="upload-section-container">
      {(error || uploadError) && (
        <div className="error-message" style={{ marginBottom: "1rem" }}>
          {error || uploadError}
        </div>
      )}

      {/* Full-bleed photo viewer + thumbnail rail */}
      {imageItems.length > 0 && (
        <div className="evidence-viewer">
          <div className="evidence-preview-main">
            <img
              src={getItemUrl(imageItems[activeIndex])}
              alt={getItemName(imageItems[activeIndex])}
            />
            <button
              type="button"
              className="evidence-preview-delete"
              onClick={() =>
                handleDelete(
                  imageItems[activeIndex]._id || imageItems[activeIndex].id,
                )
              }
              title="Remove this photo"
            >
              <FaTrash />
            </button>
          </div>
          <div className="evidence-thumb-rail">
            {imageItems.map((item, idx) => (
              <button
                type="button"
                key={item._id || item.id || idx}
                className={`evidence-thumb ${idx === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(idx)}
              >
                <img src={getItemUrl(item)} alt={getItemName(item)} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Non-image documents */}
      {fileItems.length > 0 && (
        <div className="uploaded-items-section" style={{ marginTop: "1.5rem" }}>
          <h3>Documents</h3>
          <div className="uploaded-items-list">
            {fileItems.map((item, idx) => (
              <div className="uploaded-item" key={item._id || item.id || idx}>
                <div className="item-icon">
                  <FaFilePdf />
                </div>
                <div className="item-details">
                  <h4>{getItemName(item)}</h4>
                  <p>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
                <div className="item-actions">
                  <a
                    className="action-btn"
                    href={getItemUrl(item)}
                    target="_blank"
                    rel="noreferrer"
                    title="Download"
                  >
                    <FaDownload />
                  </a>
                  <button
                    className="action-btn"
                    onClick={() => handleDelete(item._id || item.id)}
                    title="Remove"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && <p className="no-items-message">{emptyLabel}</p>}
    </div>
  );
}

// ─── Compact dropzone — sits in the hero, between title and hearing ──
function CompactDropzone({ uploading, onFiles, fileInputRef }) {
  const onDrop = (e) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files);
  };

  return (
    <div
      className="hero-dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <FaCloudUploadAlt className="hero-dropzone-icon" />
      <div className="hero-dropzone-text">
        <strong>
          {uploading ? "Uploading..." : "Click or drag files here"}
        </strong>
        <span>Photos and documents supported</span>
      </div>
      <button type="button" className="hero-dropzone-btn" disabled={uploading}>
        {uploading ? "Please wait..." : "Choose Files"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />
    </div>
  );
}

// ─── Notes / Timeline section ──────────────────────────────────
function NotesSection({ caseId, notes, onChange }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await casesAPI.createNote(caseId, "notes", title.trim());
      const updated = res.data?.data || res.data;
      onChange(updated);
      setTitle("");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await casesAPI.deleteItem(caseId, itemId, "notes", "note");
      const updated = res.data?.data || res.data;
      onChange(updated);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="upload-section-container">
      {error && (
        <div className="error-message" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a note or timeline entry..."
          style={{
            flex: 1,
            padding: "0.8rem",
            border: "1px solid var(--border-grey)",
            borderRadius: "6px",
            background: "#f8f9fa",
          }}
        />
        <button
          type="submit"
          className="upload-option-btn"
          disabled={saving || !title.trim()}
        >
          <FaPlus style={{ marginRight: 6 }} />
          {saving ? "Adding..." : "Add"}
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="no-items-message">No notes added yet.</p>
      ) : (
        <div className="uploaded-items-list">
          {notes
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((note, idx) => (
              <div className="uploaded-item" key={note._id || note.id || idx}>
                <div className="item-icon">
                  <FaStickyNote />
                </div>
                <div className="item-details">
                  <h4>{note.title}</h4>
                  <p>
                    {note.createdAt
                      ? new Date(note.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
                <div className="item-actions">
                  <button
                    className="action-btn"
                    onClick={() => handleDelete(note._id || note.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Drafting section — case-linked drafts ─────────────────────
function DraftingSection({ caseId, drafts, onChange }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleDelete = async (draftId) => {
    if (!window.confirm("Delete this draft?")) return;
    try {
      await draftsAPI.delete(draftId);
      onChange({
        drafts: drafts.filter((d) => (d._id || d.id) !== draftId),
      });
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  return (
    <div className="upload-section-container">
      {error && (
        <div className="error-message" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <div
        className="upload-option-card"
        onClick={() => navigate("/user-panel/drafting", { state: { caseId } })}
        style={{ cursor: "pointer" }}
      >
        <div className="upload-icon">
          <FaFileAlt />
        </div>
        <h3>Create a new draft</h3>
        <p>Opens the drafting tool for this case</p>
        <button type="button" className="upload-option-btn">
          Start Drafting
        </button>
      </div>

      {drafts.length > 0 && (
        <div className="uploaded-items-section" style={{ marginTop: "1.5rem" }}>
          <h3>Case Drafts</h3>
          <div className="uploaded-items-list">
            {drafts.map((draft) => {
              const latestExport =
                draft.exportedFormats?.[draft.exportedFormats.length - 1];
              return (
                <div className="uploaded-item" key={draft._id || draft.id}>
                  <div className="item-icon">
                    <FaFilePdf />
                  </div>
                  <div className="item-details">
                    <h4>{draft.title}</h4>
                    <p>
                      {draft.status}
                      {draft.updatedAt
                        ? ` · ${new Date(draft.updatedAt).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <div className="item-actions">
                    {latestExport?.fileUrl && (
                      <a
                        className="action-btn"
                        href={filesAPI.getFileUrl(latestExport.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        title="Download"
                      >
                        <FaDownload />
                      </a>
                    )}
                    <button
                      className="action-btn"
                      onClick={() => handleDelete(draft._id || draft.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {drafts.length === 0 && (
        <p className="no-items-message">No drafts created for this case yet.</p>
      )}
    </div>
  );
}

export default function CaseDetails() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const load = useCallback(() => {
    return casesAPI
      .getById(caseId)
      .then((res) =>
        setCaseData(
          res.data?.case || res.data?.data?.case || res.data?.data || null,
        ),
      )
      .catch((err) => setError(handleApiError(err)));
  }, [caseId]);

  useEffect(() => {
    load();
  }, [load]);

  if (error)
    return (
      <div className="case-preview-page">
        <div className="case-preview-error">
          {error}
          <button onClick={() => navigate("/user-panel/cases")}>
            Back to cases
          </button>
        </div>
      </div>
    );
  if (!caseData)
    return (
      <div className="case-preview-page">
        <div className="case-preview-loading">Loading case preview…</div>
      </div>
    );

  const hearing = caseData.nextHearing
    ? new Date(caseData.nextHearing).toLocaleDateString()
    : "Not scheduled";

  const evidence = caseData.evidence || caseData.evidenceFiles || [];
  const orders = caseData.orders || caseData.caseOrders || [];
  const notes = caseData.notes || caseData.timeline || [];
  const drafts = caseData.drafts || [];

  const applyUpdatedCase = (updated) => {
    if (updated && typeof updated === "object") {
      setCaseData((prev) => ({ ...prev, ...updated }));
    } else {
      load();
    }
  };

  const toggleCaseBookmark = async () => {
    try {
      const response = await casesAPI.toggleBookmark(caseId);
      const isBookmarked = Boolean(response.data?.data?.isBookmarked ?? response.data?.isBookmarked);
      setCaseData((current) => ({ ...current, isBookmarked }));
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const downloadCasePdf = async () => {
    try {
      const response = await casesAPI.exportPdf(caseId);
      const fileUrl = response.data?.fileUrl;
      if (!fileUrl) throw new Error("PDF was not created.");
      const url = fileUrl.startsWith("http") ? fileUrl : `${getServerOrigin()}${fileUrl}`;
      window.open(url, "_blank", "noopener");
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleHeroUpload = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setUploading(true);
    setUploadError("");
    try {
      const res = await casesAPI.uploadFiles(caseId, files, activeTab);
      const updated = res.data?.data || res.data;
      applyUpdatedCase(updated);
    } catch (err) {
      setUploadError(handleApiError(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const showHeroDropzone = activeTab === "evidence" || activeTab === "orders";

  const tabs = [
    { id: "overview", name: "Case Information", icon: <FaGavel /> },
    {
      id: "evidence",
      name: "Evidence",
      icon: <FaFolderOpen />,
      count: evidence.length,
    },
    {
      id: "orders",
      name: "Case Orders",
      icon: <FaOrders />,
      count: orders.length,
    },
    {
      id: "notes",
      name: "Notes / Timeline",
      icon: <FaStickyNote />,
      count: notes.length,
    },
    {
      id: "drafting",
      name: "Drafting",
      icon: <FaFileAlt />,
      count: drafts.length,
    },
  ];

  return (
    <div className="case-preview-page">
      <header className="case-preview-header">
        <button
          className="case-preview-back"
          onClick={() => navigate("/user-panel/cases")}
        >
          <FaArrowLeft /> Cases
        </button>
        <div className="case-preview-actions">
          <button className="case-preview-edit" onClick={downloadCasePdf}><FaCasePdf /> Download PDF</button>
          <button className="case-preview-edit" onClick={toggleCaseBookmark}>
            {caseData.isBookmarked ? <FaStar /> : <FaRegStar />}
            {caseData.isBookmarked ? "Favourited" : "Add to favourites"}
          </button>
          <button
            className="case-preview-edit"
            onClick={() =>
              navigate("/user-panel/cases/edit", { state: { caseData } })
            }
          >
            <FaEdit /> Edit case
          </button>
        </div>
      </header>

      <main className="case-preview-content">
        <section className="case-preview-hero">
          <div>
            <p>CASE PREVIEW</p>
            <h1>{caseData.title}</h1>
            <span className={`case-preview-status ${caseData.status}`}>
              {caseData.status}
            </span>
          </div>

          {showHeroDropzone && (
            <CompactDropzone
              uploading={uploading}
              onFiles={handleHeroUpload}
              fileInputRef={fileInputRef}
            />
          )}

          <div className="case-preview-hearing">
            <FaCalendarAlt />
            <div>
              <span>Next hearing</span>
              <strong>{hearing}</strong>
            </div>
          </div>
        </section>

        {/* Tab navigation */}
        <div className="case-detail-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`case-detail-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.icon}
              <span>{tab.name}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span className="case-detail-tab-count">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <section className="case-preview-grid">
            <article className="case-preview-card">
              <h2>
                <FaGavel /> Case information
              </h2>
              <div className="case-preview-fields">
                <Field
                  label="Case number"
                  value={`${caseData.caseNo || "—"}${caseData.caseYear ? ` / ${caseData.caseYear}` : ""}`}
                />
                <Field label="Case type" value={caseData.caseType} />
                <Field label="Priority" value={caseData.priority} />
                <Field label="Status" value={caseData.status} />
                <Field label="Court" value={caseData.court?.name} />
                <Field
                  label="Court location"
                  value={caseData.court?.location}
                />
              </div>
            </article>
            <article className="case-preview-card">
              <h2>
                <FaUserTie /> Parties & client
              </h2>
              <div className="case-preview-fields">
                <Field label="Client" value={caseData.client?.name} />
                <Field
                  label="Client contact"
                  value={caseData.client?.contact}
                />
                <Field label="Petitioner" value={caseData.petitioner} />
                <Field label="Respondent" value={caseData.respondent} />
                <Field label="Representing" value={caseData.onBehalfOf} />
                <Field label="Client email" value={caseData.client?.email} />
              </div>
            </article>
            <article className="case-preview-card case-preview-card-wide">
              <h2>
                <FaBalanceScale /> Case summary
              </h2>
              <p className="case-preview-description">
                {caseData.description ||
                  "No description has been added to this case."}
              </p>
              {caseData.relevantLaws?.length > 0 && (
                <div className="case-preview-laws">
                  {caseData.relevantLaws.map((law) => (
                    <span key={law}>{law}</span>
                  ))}
                </div>
              )}
            </article>
          </section>
        )}

        {activeTab === "evidence" && (
          <AttachmentSection
            caseId={caseId}
            sectionType="evidence"
            items={evidence}
            onChange={applyUpdatedCase}
            emptyLabel="No evidence uploaded yet."
            uploadError={uploadError}
          />
        )}

        {activeTab === "orders" && (
          <AttachmentSection
            caseId={caseId}
            sectionType="orders"
            items={orders}
            onChange={applyUpdatedCase}
            emptyLabel="No case orders uploaded yet."
            uploadError={uploadError}
          />
        )}

        {activeTab === "notes" && (
          <NotesSection
            caseId={caseId}
            notes={notes}
            onChange={applyUpdatedCase}
          />
        )}

        {activeTab === "drafting" && (
          <DraftingSection
            caseId={caseId}
            drafts={drafts}
            onChange={applyUpdatedCase}
          />
        )}
      </main>
    </div>
  );
}
