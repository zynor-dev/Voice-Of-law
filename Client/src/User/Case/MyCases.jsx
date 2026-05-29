// MyCases.jsx — Fully rebuilt, professional VOL theme
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaEye,
  FaExclamationTriangle,
  FaCheck,
  FaClock,
  FaGavel,
  FaSync,
  FaInfoCircle,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { casesAPI, handleApiError } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import SubscriptionBlocker from "../../components/SubscriptionBlocker";
import useSubscriptionCheck from "../../hooks/useSubscriptionCheck";

// ── Theme tokens ────────────────────────────────────────────────
const G = "#C79F44";
const G_DIM = "rgba(199,159,68,0.10)";
const G_RING = "rgba(199,159,68,0.25)";
const DARK = "#1a1a1a";
const CARD_BG = "#ffffff";

// ── Status config ────────────────────────────────────────────────
const STATUS = {
  pending: {
    label: "Pending",
    color: "#b45309",
    bg: "rgba(180,83,9,0.08)",
    dot: "#f59e0b",
  },
  hearing: {
    label: "Hearing",
    color: "#1d4ed8",
    bg: "rgba(29,78,216,0.08)",
    dot: "#3b82f6",
  },
  disposed: {
    label: "Disposed",
    color: "#166534",
    bg: "rgba(22,101,52,0.08)",
    dot: "#22c55e",
  },
  reserved: {
    label: "Reserved",
    color: "#6b21a8",
    bg: "rgba(107,33,168,0.08)",
    dot: "#a855f7",
  },
  appealed: {
    label: "Appealed",
    color: "#9a3412",
    bg: "rgba(154,52,18,0.08)",
    dot: "#f97316",
  },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: s.bg, color: s.color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ background: s.dot }}
      />
      {s.label}
    </span>
  );
};

const Spinner = ({ size = 16 }) => (
  <span
    className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
    style={{ width: size, height: size }}
  />
);

export default function MyCases() {
  const [cases, setCases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState({});
  const [actionMsg, setActionMsg] = useState(null);
  const [sortConfig, setSort] = useState({ key: null, dir: "asc" });
  const [selectedCase, setSelectedCase] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  const { canAccessFeature, subscriptionStatus } = useSubscriptionCheck();
  const [showBlocker, setShowBlocker] = useState(false);
  const [blockedAction, setBlockedAction] = useState("");

  const statusCounts = useMemo(
    () => ({
      all: cases.length,
      pending: cases.filter((c) => c.status === "pending").length,
      hearing: cases.filter((c) => c.status === "hearing").length,
      disposed: cases.filter((c) => c.status === "disposed").length,
    }),
    [cases],
  );

  const fetchCases = useCallback(async (showLoad = true) => {
    try {
      if (showLoad) setLoading(true);
      setError("");
      const res = await casesAPI.getAll({ page: 1, limit: 100 });
      const list = res.data?.data || [];
      setCases(list);
      setFiltered(list);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      if (showLoad) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Filter + sort
  useEffect(() => {
    let r = [...cases];
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      r = r.filter(
        (c) =>
          c.title?.toLowerCase().includes(t) ||
          c.caseNo?.toLowerCase().includes(t) ||
          (c.client?.name || c.partyName || "").toLowerCase().includes(t) ||
          String(c.court?.name || c.court || "")
            .toLowerCase()
            .includes(t),
      );
    }
    if (filterStatus !== "all") r = r.filter((c) => c.status === filterStatus);
    if (sortConfig.key) {
      r.sort((a, b) => {
        let av =
          sortConfig.key === "nextHearing"
            ? new Date(a[sortConfig.key])
            : a[sortConfig.key];
        let bv =
          sortConfig.key === "nextHearing"
            ? new Date(b[sortConfig.key])
            : b[sortConfig.key];
        return av < bv
          ? sortConfig.dir === "asc"
            ? -1
            : 1
          : av > bv
            ? sortConfig.dir === "asc"
              ? 1
              : -1
            : 0;
      });
    }
    setFiltered(r);
  }, [searchTerm, filterStatus, cases, sortConfig]);

  const requestSort = (key) => {
    setSort((s) => ({
      key,
      dir: s.key === key && s.dir === "asc" ? "desc" : "asc",
    }));
  };
  const SortIcon = ({ k }) => {
    if (sortConfig.key !== k)
      return <FaSort style={{ fontSize: 9, opacity: 0.4 }} />;
    return sortConfig.dir === "asc" ? (
      <FaSortUp style={{ fontSize: 9, color: G }} />
    ) : (
      <FaSortDown style={{ fontSize: 9, color: G }} />
    );
  };

  const handleStatusUpdate = async (caseId, newStatus, currentStatus) => {
    if (!canAccessFeature()) {
      setBlockedAction("Update Case Status");
      setShowBlocker(true);
      return;
    }
    if (currentStatus === newStatus) return;
    try {
      setStatusUpdating((p) => ({ ...p, [caseId]: newStatus }));
      await casesAPI.updateStatus(caseId, newStatus);
      setCases((p) =>
        p.map((c) => (c._id === caseId ? { ...c, status: newStatus } : c)),
      );
      setActionMsg(`Status updated to ${STATUS[newStatus]?.label}`);
      setTimeout(() => setActionMsg(null), 2500);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setStatusUpdating((p) => {
        const u = { ...p };
        delete u[caseId];
        return u;
      });
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirm !== "DELETE") return;
    try {
      setLoading(true);
      await casesAPI.delete(deleteTarget.id);
      setCases((p) => p.filter((c) => c._id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleteConfirm("");
      setActionMsg("Case deleted successfully.");
      setTimeout(() => setActionMsg(null), 2500);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const gate = (action, fn) => () => {
    if (!canAccessFeature()) {
      setBlockedAction(action);
      setShowBlocker(true);
      return;
    }
    fn();
  };

  const formatDate = (d) => {
    if (!d) return "Not scheduled";
    return new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const isOverdue = (d) => {
    if (!d) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const h = new Date(d);
    h.setHours(0, 0, 0, 0);
    return h < today;
  };
  const daysUntil = (d) => {
    if (!d) return null;
    return Math.ceil((new Date(d) - new Date()) / 86400000);
  };

  // ── Loading state ──────────────────────────────────────────────
  if (loading && cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size={32} />
        <p className="text-sm" style={{ color: "rgba(0,0,0,0.4)" }}>
          Loading your legal cases…
        </p>
      </div>
    );
  }

  // ── Stat card ──────────────────────────────────────────────────
  const StatCard = ({ label, value, icon: Icon, accent }) => (
    <div
      className="rounded-xl p-4 flex items-center gap-3"
      style={{
        background: CARD_BG,
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent || G_DIM }}
      >
        <Icon style={{ color: G, fontSize: 14 }} />
      </div>
      <div>
        <p
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "rgba(0,0,0,0.38)" }}
        >
          {label}
        </p>
        <p className="text-xl font-bold text-gray-900 leading-none mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-5">
      {/* ── Trial banner ──────────────────────────────────────── */}
      {subscriptionStatus?.isTrialActive && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: G_DIM, border: `1px solid ${G_RING}` }}
        >
          <p className="text-xs font-semibold" style={{ color: G }}>
            🎉 Free Trial — {subscriptionStatus.daysRemaining} days remaining
          </p>
          <button
            onClick={() => navigate("/user-panel/subscription")}
            className="text-[11px] font-bold px-3 py-1 rounded-lg transition"
            style={{ background: G, color: DARK }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#d4aa55")}
            onMouseLeave={(e) => (e.currentTarget.style.background = G)}
          >
            Upgrade
          </button>
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: G_DIM }}
            >
              <FaGavel style={{ color: G, fontSize: 13 }} />
            </div>
            <h1 className="text-lg font-bold text-gray-900">My Legal Cases</h1>
            <button
              onClick={() => fetchCases(true)}
              title="Refresh"
              className="flex h-7 w-7 items-center justify-center rounded-lg transition"
              style={{ color: "rgba(0,0,0,0.3)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = G_DIM;
                e.currentTarget.style.color = G;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(0,0,0,0.3)";
              }}
            >
              <FaSync style={{ fontSize: 11 }} />
            </button>
          </div>
          <p className="text-xs mt-1" style={{ color: "rgba(0,0,0,0.4)" }}>
            Manage and track all your legal proceedings
          </p>
        </div>
        <button
          onClick={gate("Create New Case", () =>
            navigate("/user-panel/cases/add"),
          )}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0"
          style={{ background: DARK, color: "#fff" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2c2c2c")}
          onMouseLeave={(e) => (e.currentTarget.style.background = DARK)}
        >
          <FaPlus style={{ fontSize: 10 }} /> Add New Case
        </button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total" value={statusCounts.all} icon={FaGavel} />
        <StatCard
          label="Pending"
          value={statusCounts.pending}
          icon={FaClock}
          accent="rgba(180,83,9,0.08)"
        />
        <StatCard
          label="Hearing"
          value={statusCounts.hearing}
          icon={FaCalendarAlt}
          accent="rgba(29,78,216,0.08)"
        />
        <StatCard
          label="Disposed"
          value={statusCounts.disposed}
          icon={FaCheck}
          accent="rgba(22,101,52,0.08)"
        />
      </div>

      {/* ── Toast ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {actionMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold"
            style={{
              background: G_DIM,
              color: G,
              border: `1px solid ${G_RING}`,
            }}
          >
            <FaInfoCircle style={{ fontSize: 11 }} /> {actionMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error ─────────────────────────────────────────────── */}
      {error && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs"
          style={{
            background: "rgba(220,38,38,0.07)",
            border: "1px solid rgba(220,38,38,0.18)",
            color: "#b91c1c",
          }}
        >
          <FaExclamationTriangle className="shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError("")}>
            <FaTimes style={{ fontSize: 10 }} />
          </button>
        </div>
      )}

      {/* ── Search + Filters ──────────────────────────────────── */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{
          background: CARD_BG,
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Search */}
        <div className="relative">
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgba(0,0,0,0.25)", fontSize: 11 }}
          />
          <input
            type="text"
            placeholder="Search by title, case no., party or court…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-8 py-2.5 rounded-lg text-xs outline-none transition"
            style={{
              background: "#f7f7f7",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "#111",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = G;
              e.target.style.boxShadow = `0 0 0 2px ${G_DIM}`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0,0,0,0.08)";
              e.target.style.boxShadow = "none";
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(0,0,0,0.3)" }}
            >
              <FaTimes style={{ fontSize: 10 }} />
            </button>
          )}
        </div>

        {/* Filter + Sort row */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center sm:justify-between">
          {/* Status filters */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: "all", label: `All (${statusCounts.all})` },
              { key: "pending", label: `Pending (${statusCounts.pending})` },
              { key: "hearing", label: `Hearing (${statusCounts.hearing})` },
              { key: "disposed", label: `Disposed (${statusCounts.disposed})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition"
                style={{
                  background: filterStatus === key ? DARK : "#f3f3f3",
                  color: filterStatus === key ? "#fff" : "rgba(0,0,0,0.5)",
                  border:
                    filterStatus === key
                      ? `1px solid ${DARK}`
                      : "1px solid rgba(0,0,0,0.08)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="text-[10px] font-semibold"
              style={{ color: "rgba(0,0,0,0.35)" }}
            >
              Sort:
            </span>
            {[
              { k: "nextHearing", l: "Hearing" },
              { k: "title", l: "Title" },
              { k: "caseNo", l: "No." },
            ].map(({ k, l }) => (
              <button
                key={k}
                onClick={() => requestSort(k)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition"
                style={{
                  background: sortConfig.key === k ? G_DIM : "#f3f3f3",
                  color: sortConfig.key === k ? G : "rgba(0,0,0,0.5)",
                  border:
                    sortConfig.key === k
                      ? `1px solid ${G_RING}`
                      : "1px solid rgba(0,0,0,0.08)",
                }}
              >
                {l} <SortIcon k={k} />
              </button>
            ))}
          </div>
        </div>

        {/* Results line */}
        <p className="text-[11px]" style={{ color: "rgba(0,0,0,0.35)" }}>
          Showing {filtered.length} of {cases.length} cases
          {searchTerm && ` matching "${searchTerm}"`}
          {filterStatus !== "all" && ` · ${filterStatus}`}
          {(searchTerm || filterStatus !== "all") && (
            <button
              className="ml-2 underline font-semibold"
              style={{ color: G }}
              onClick={() => {
                setSearchTerm("");
                setFilter("all");
                setSort({ key: null, dir: "asc" });
              }}
            >
              Clear all
            </button>
          )}
        </p>
      </div>

      {/* ── Cases Grid ────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map((c, i) => {
              const overdue = isOverdue(c.nextHearing);
              const days = daysUntil(c.nextHearing);
              const isUpdating = !!statusUpdating[c._id];

              return (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="rounded-xl overflow-hidden cursor-pointer group"
                  style={{
                    background: CARD_BG,
                    border: overdue
                      ? "1px solid rgba(220,38,38,0.22)"
                      : "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                    transition: "box-shadow .2s, transform .2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 1px 8px rgba(0,0,0,0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onClick={() => {
                    setSelectedCase(c);
                    setDetailOpen(true);
                  }}
                >
                  {/* Top accent + overdue bar */}
                  <div
                    className="h-[3px]"
                    style={{ background: overdue ? "#ef4444" : G }}
                  />

                  <div className="p-4 space-y-3">
                    {/* Title + badges */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2">
                        {c.title}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        <StatusBadge status={c.status} />
                        {overdue && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{
                              background: "rgba(220,38,38,0.08)",
                              color: "#dc2626",
                            }}
                          >
                            <FaExclamationTriangle style={{ fontSize: 8 }} />{" "}
                            OVERDUE
                          </span>
                        )}
                        {!overdue && days !== null && days <= 7 && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{
                              background: "rgba(29,78,216,0.08)",
                              color: "#1d4ed8",
                            }}
                          >
                            <FaCalendarAlt style={{ fontSize: 8 }} /> IN {days}{" "}
                            DAYS
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {[
                        { label: "Case No.", value: c.caseNo },
                        {
                          label: "Party",
                          value: c.client?.name || c.partyName,
                        },
                        { label: "Court", value: c.court?.name || c.court },
                        {
                          label: "Hearing",
                          value: formatDate(c.nextHearing),
                          highlight: overdue,
                        },
                      ].map(({ label, value, highlight }) =>
                        value ? (
                          <div key={label}>
                            <p
                              className="text-[9px] font-semibold uppercase tracking-wider"
                              style={{ color: "rgba(0,0,0,0.35)" }}
                            >
                              {label}
                            </p>
                            <p
                              className={`text-[11px] font-medium truncate ${highlight ? "text-red-600" : "text-gray-800"}`}
                            >
                              {value}
                            </p>
                          </div>
                        ) : null,
                      )}
                    </div>

                    {/* Quick status */}
                    <div>
                      <p
                        className="text-[9px] font-semibold uppercase tracking-wider mb-1.5"
                        style={{ color: "rgba(0,0,0,0.3)" }}
                      >
                        Quick Status
                      </p>
                      <div className="flex gap-1.5 flex-wrap">
                        {["pending", "hearing", "disposed"].map((s) => {
                          const active = c.status === s;
                          const cfg = STATUS[s];
                          return (
                            <button
                              key={s}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(c._id, s, c.status);
                              }}
                              disabled={isUpdating}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition"
                              style={{
                                background: active ? cfg.bg : "#f3f3f3",
                                color: active ? cfg.color : "rgba(0,0,0,0.4)",
                                border: active
                                  ? `1px solid ${cfg.dot}33`
                                  : "1px solid rgba(0,0,0,0.08)",
                                opacity: isUpdating ? 0.6 : 1,
                              }}
                            >
                              {isUpdating && statusUpdating[c._id] === s ? (
                                <Spinner size={10} />
                              ) : (
                                cfg.label
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className="flex items-center justify-between pt-1"
                      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <p
                        className="text-[10px]"
                        style={{ color: "rgba(0,0,0,0.28)" }}
                      >
                        {new Date(
                          c.updatedAt || c.createdAt,
                        ).toLocaleDateString()}
                      </p>
                      <div className="flex gap-1.5">
                        {[
                          {
                            icon: FaEye,
                            title: "View",
                            fn: (e) => {
                              e.stopPropagation();
                              navigate(`/user-panel/cases/${c._id}`, {
                                state: { caseData: c },
                              });
                            },
                            color: "#1d4ed8",
                          },
                          {
                            icon: FaEdit,
                            title: "Edit",
                            fn: (e) => {
                              e.stopPropagation();
                              gate("Edit Case", () =>
                                navigate("/user-panel/cases/edit", {
                                  state: { caseData: c },
                                }),
                              )();
                            },
                            color: G,
                          },
                          {
                            icon: FaTrash,
                            title: "Delete",
                            fn: (e) => {
                              e.stopPropagation();
                              gate("Delete Case", () => {
                                setDeleteTarget({ id: c._id, title: c.title });
                                setDeleteConfirm("");
                              })();
                            },
                            color: "#dc2626",
                          },
                        ].map(({ icon: Icon, title, fn, color }) => (
                          <button
                            key={title}
                            title={title}
                            onClick={fn}
                            className="flex h-7 w-7 items-center justify-center rounded-lg transition"
                            style={{ color: "rgba(0,0,0,0.3)" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = `${color}14`;
                              e.currentTarget.style.color = color;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "rgba(0,0,0,0.3)";
                            }}
                          >
                            <Icon style={{ fontSize: 11 }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center rounded-2xl"
            style={{
              background: CARD_BG,
              border: "1px solid rgba(0,0,0,0.07)",
            }}
          >
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: G_DIM }}
            >
              <FaGavel style={{ color: G, fontSize: 20 }} />
            </div>
            {searchTerm || filterStatus !== "all" ? (
              <>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  No matching cases
                </p>
                <p
                  className="text-xs mb-4"
                  style={{ color: "rgba(0,0,0,0.4)" }}
                >
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ background: DARK, color: "#fff" }}
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-gray-900 mb-1">
                  No cases yet
                </p>
                <p
                  className="text-xs mb-4"
                  style={{ color: "rgba(0,0,0,0.4)" }}
                >
                  Start by adding your first legal case
                </p>
                <button
                  onClick={gate("Create New Case", () =>
                    navigate("/user-panel/cases/add"),
                  )}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ background: DARK, color: "#fff" }}
                >
                  <FaPlus style={{ fontSize: 10 }} /> Add First Case
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Case Detail Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {detailOpen && selectedCase && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-3"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetailOpen(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="w-full max-w-lg rounded-2xl overflow-hidden"
              style={{
                background: "#1e1e1e",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-[3px]" style={{ background: G }} />
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <h3 className="text-sm font-bold text-white">Case Details</h3>
                <button
                  onClick={() => setDetailOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  }}
                >
                  <FaTimes style={{ fontSize: 11 }} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white mb-1.5">
                    {selectedCase.title}
                  </h4>
                  <StatusBadge status={selectedCase.status} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Case Number", selectedCase.caseNo],
                    [
                      "Party Name",
                      selectedCase.client?.name || selectedCase.partyName,
                    ],
                    ["Court", selectedCase.court?.name || selectedCase.court],
                    ["Next Hearing", formatDate(selectedCase.nextHearing)],
                  ].map(([l, v]) =>
                    v ? (
                      <div
                        key={l}
                        className="rounded-lg p-3"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        <p
                          className="text-[9px] font-semibold uppercase tracking-wider mb-0.5"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {l}
                        </p>
                        <p className="text-xs font-semibold text-white">{v}</p>
                      </div>
                    ) : null,
                  )}
                </div>
                {selectedCase.description && (
                  <div
                    className="rounded-lg p-3"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <p
                      className="text-[9px] font-semibold uppercase tracking-wider mb-1"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      Description
                    </p>
                    <p className="text-xs text-white leading-relaxed opacity-70">
                      {selectedCase.description}
                    </p>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setDetailOpen(false);
                      navigate(`/user-panel/cases/${selectedCase._id}`, {
                        state: { caseData: selectedCase },
                      });
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold transition"
                    style={{ background: G, color: DARK }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#d4aa55")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = G)}
                  >
                    <FaEye className="inline mr-1.5" style={{ fontSize: 10 }} />{" "}
                    View Full Case
                  </button>
                  <button
                    onClick={() => {
                      setDetailOpen(false);
                      gate("Edit Case", () =>
                        navigate("/user-panel/cases/edit", {
                          state: { caseData: selectedCase },
                        }),
                      )();
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold transition"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.12)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.07)")
                    }
                  >
                    <FaEdit
                      className="inline mr-1.5"
                      style={{ fontSize: 10 }}
                    />{" "}
                    Edit Case
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ───────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[130] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl overflow-hidden"
              style={{
                background: "#1e1e1e",
                border: "1px solid rgba(220,38,38,0.3)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-[3px]" style={{ background: "#dc2626" }} />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(220,38,38,0.1)" }}
                  >
                    <FaTrash style={{ color: "#dc2626", fontSize: 13 }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Delete Case</p>
                    <p
                      className="text-[11px]"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      This cannot be undone
                    </p>
                  </div>
                </div>
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Type <strong className="text-white">DELETE</strong> to
                  permanently delete "
                  <span style={{ color: G }}>{deleteTarget.title}</span>"
                </p>
                <input
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#fff",
                  }}
                  placeholder="Type DELETE"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#dc2626")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.10)")
                  }
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteConfirm !== "DELETE"}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold transition disabled:opacity-30"
                    style={{ background: "#dc2626", color: "#fff" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SubscriptionBlocker
        isOpen={showBlocker}
        onClose={() => setShowBlocker(false)}
        featureName={blockedAction || "Case Management"}
      />
    </div>
  );
}
