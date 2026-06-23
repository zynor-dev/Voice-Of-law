import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCamera,
  FaCrown,
  FaEnvelope,
  FaEdit,
  FaMapMarkerAlt,
  FaGavel,
  FaBuilding,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import { filesAPI, userAPI } from "../../services/api";

// ── Theme ──────────────────────────────────────────────────────
const G = "#C79F44";
const G_DIM = "rgba(199,159,68,0.10)";
const G_RING = "rgba(199,159,68,0.28)";
const DARK = "#1a1a1a";

function resolveAvatarUrl(user) {
  if (!user?.profilePicture) return null;
  const p = user.profilePicture;
  return p.startsWith("http") ? p : filesAPI.getFileUrl(p);
}
function formatLocation(user) {
  return [user?.city, user?.province].filter(Boolean).join(", ") || null;
}

// Reusable input
const Field = ({ label, optional, ...props }) => (
  <div>
    <label
      className="block text-[11px] font-semibold mb-1"
      style={{ color: "rgba(255,255,255,0.5)" }}
    >
      {label}
      {optional && (
        <span
          className="font-normal ml-1"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          (optional)
        </span>
      )}
    </label>
    <input
      className="w-full rounded-lg px-3 py-2 text-xs outline-none transition"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "#fff",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = G;
        e.target.style.boxShadow = `0 0 0 2px ${G_DIM}`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "rgba(255,255,255,0.10)";
        e.target.style.boxShadow = "none";
      }}
      {...props}
    />
  </div>
);

export default function DashboardProfileCard({ user, setUser }) {
  const [freshUser, setFreshUser] = useState(user);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    city: "",
    courtName: "",
    bio: "",
  });

  useEffect(() => {
    setFreshUser(user);
  }, [user]);

  const display = freshUser || user;
  const avatarUrl = useMemo(() => resolveAvatarUrl(display), [display]);
  const isPaid =
    display?.role === "admin" ||
    (display?.subscription?.plan === "premium" &&
      display?.subscription?.isActive) ||
    display?.isSubscribed ||
    display?.isPaid;

  const loc = formatLocation(display);
  const chamber =
    display?.chamberName ||
    display?.chamber ||
    display?.firmName ||
    display?.organization ||
    null;

  const openEdit = () => {
    setForm({
      fullName: display?.fullName || "",
      city: display?.city || "",
      courtName: display?.courtName || "",
      bio: display?.bio || "",
    });
    setError("");
    setEditOpen(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await userAPI.updateProfile({
        fullName: form.fullName.trim(),
        city: form.city.trim(),
        courtName: form.courtName.trim(),
        bio: form.bio?.trim() || "",
      });
      if (data?.user) {
        const merged = { ...(freshUser || {}), ...data.user };
        setFreshUser(merged);
        setUser((p) => ({ ...p, ...data.user }));
        try {
          localStorage.setItem("voicelaw_user", JSON.stringify(merged));
          localStorage.setItem("user", JSON.stringify(merged));
        } catch {
          /* ignore */
        }
        setEditOpen(false);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update profile. Try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const onPickPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const { data } = await userAPI.uploadProfilePicture(file);
      if (data?.user) {
        const merged = { ...(freshUser || {}), ...data.user };
        setFreshUser(merged);
        setUser((p) => ({ ...p, ...data.user }));
        try {
          localStorage.setItem("voicelaw_user", JSON.stringify(merged));
          localStorage.setItem("user", JSON.stringify(merged));
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!display) return null;

  const metaItems = [
    display.email && { icon: FaEnvelope, label: display.email },
    display.phoneNumber && { icon: FaPhone, label: display.phoneNumber },
    loc && { icon: FaMapMarkerAlt, label: loc },
    chamber && { icon: FaBuilding, label: chamber },
    display.courtName && { icon: FaGavel, label: display.courtName },
    display.barCouncilNumber && {
      icon: FaIdCard,
      label: display.barCouncilNumber,
    },
    display.createdAt && {
      icon: FaCalendarAlt,
      label: `Member since ${new Date(display.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`,
    },
  ].filter(Boolean);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5 rounded-2xl overflow-hidden"
        style={{
          background: DARK,
          border: `1px solid rgba(255,255,255,0.07)`,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        }}
      >
        {/* Gold top strip */}
        <div className="h-[3px] w-full" style={{ background: G }} />

        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-start">
          {/* ── Avatar ── */}
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div
              className="h-[72px] w-[72px] sm:h-20 sm:w-20 rounded-2xl overflow-hidden flex items-center justify-center text-xl font-bold"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `2px solid ${G_RING}`,
                color: G,
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                display.fullName?.charAt(0)?.toUpperCase() ||
                display.email?.charAt(0)?.toUpperCase() ||
                "U"
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full transition"
              style={{
                background: G,
                color: DARK,
                border: `2px solid ${DARK}`,
              }}
              title="Change photo"
            >
              <FaCamera style={{ fontSize: "9px" }} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickPhoto}
            />
          </div>

          {/* ── Info ── */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            {/* Name row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                {display.fullName || display.email?.split("@")[0] || "User"}
              </h1>
              {isPaid && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: G_DIM,
                    color: G,
                    border: `1px solid ${G_RING}`,
                  }}
                >
                  <FaCrown style={{ fontSize: "8px" }} /> Premium
                </span>
              )}
              {!isPaid && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  Trial
                </span>
              )}
            </div>

            {/* Role / bar number */}
            {display.barCouncilNumber && (
              <p
                className="text-[11px] mb-2"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                Bar Council # {display.barCouncilNumber}
              </p>
            )}

            {/* Meta chips */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1">
              {metaItems.map(({ icon: Icon, label }, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-[11px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <Icon style={{ fontSize: "9px", color: G, opacity: 0.8 }} />
                  <span className="truncate max-w-[160px]">{label}</span>
                </span>
              ))}
            </div>

            {/* Bio */}
            {display.bio && (
              <p
                className="mt-2 text-[11px] leading-relaxed max-w-xl"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {display.bio}
              </p>
            )}

            {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}
          </div>

          {/* ── Edit button ── */}
          <div className="flex justify-center sm:justify-end shrink-0">
            <button
              type="button"
              onClick={openEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition"
              style={{
                background: G_DIM,
                color: G,
                border: `1px solid ${G_RING}`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(199,159,68,0.20)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = G_DIM)}
            >
              <FaEdit style={{ fontSize: "10px" }} /> Edit Profile
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-3"
            style={{
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !saving && setEditOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="w-full max-w-md rounded-2xl overflow-hidden max-h-[90dvh] overflow-y-auto"
              style={{
                background: "#1e1e1e",
                border: `1px solid rgba(255,255,255,0.08)`,
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div>
                  <h2 className="text-sm font-bold text-white">Edit Profile</h2>
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Changes sync with your account instantly
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg transition"
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
                  <FaTimes style={{ fontSize: "11px" }} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={saveProfile} className="p-5 space-y-3">
                <Field
                  label="Full Name"
                  value={form.fullName}
                  required
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                />
                <Field
                  label="City"
                  value={form.city}
                  required
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                />
                <Field
                  label="Court Name"
                  value={form.courtName}
                  required
                  onChange={(e) =>
                    setForm((f) => ({ ...f, courtName: e.target.value }))
                  }
                />
                <div>
                  <label
                    className="block text-[11px] font-semibold mb-1"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Bio{" "}
                    <span
                      className="font-normal"
                      style={{ color: "rgba(255,255,255,0.28)" }}
                    >
                      (optional)
                    </span>
                  </label>
                  <textarea
                    className="w-full rounded-lg px-3 py-2 text-xs outline-none transition resize-none"
                    rows={3}
                    maxLength={500}
                    value={form.bio}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, bio: e.target.value }))
                    }
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "#fff",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = G;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.10)";
                    }}
                  />
                </div>
                {error && <p className="text-[11px] text-red-400">{error}</p>}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-xs font-semibold transition"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.10)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.06)")
                    }
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-xs font-bold transition disabled:opacity-50"
                    style={{ background: G, color: DARK }}
                    onMouseEnter={(e) => {
                      if (!saving) e.currentTarget.style.background = "#d4aa55";
                    }}
                    onMouseLeave={(e) => (e.currentTarget.style.background = G)}
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
