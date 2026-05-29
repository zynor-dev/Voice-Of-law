/**
 * Admin operations — real data from GET /api/v1/admin/users and related routes.
 * (Replaces an accidental duplicate of SubscriptionPage in this file path.)
 */
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { adminAPI } from "../../services/api";

function formatPlan(u) {
  const s = u.subscription || {};
  const end = s.endDate ? new Date(s.endDate).toLocaleDateString() : "—";
  return `${s.plan || "—"}${s.isActive === false ? " (inactive)" : ""} · ends ${end}`;
}

export default function PaymentVerification() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const load = useCallback(async (searchQuery) => {
    setLoading(true);
    setError("");
    const search =
      searchQuery !== undefined &&
      searchQuery !== null &&
      String(searchQuery).trim()
        ? String(searchQuery).trim()
        : undefined;
    try {
      const { data } = await adminAPI.listUsers({
        limit: 50,
        page: 1,
        search,
      });
      setUsers(data?.data || []);
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not load users (admin only)."
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = async (id, role) => {
    if (!window.confirm(`Set role to ${role}?`)) return;
    try {
      await adminAPI.changeUserRole(id, role);
      await load(searchInput.trim() || undefined);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update role");
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await adminAPI.deleteUser(id);
      await load(searchInput.trim() || undefined);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-sm font-semibold text-slate-900">
              Admin · Users
            </h1>
            <p className="text-[11px] text-slate-500">
              Live accounts from MongoDB — roles, subscriptions, CRUD
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Back to dashboard
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <input
            type="search"
            placeholder="Search name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
          />
          <button
            type="button"
            onClick={() => load(searchInput.trim() || undefined)}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            Search / refresh
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-800">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          {loading ? (
            <div className="p-8 text-center text-[11px] text-slate-500">
              Loading…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">User</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Subscription</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/80">
                      <td className="px-3 py-2">
                        <div className="font-medium text-slate-900">
                          {u.fullName}
                        </div>
                        <div className="text-slate-500">{u.email}</div>
                        <div className="text-slate-400">{u.city}</div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600">
                        {formatPlan(u)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {u.role !== "admin" && (
                          <div className="flex flex-wrap justify-end gap-1">
                            <button
                              type="button"
                              className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] hover:bg-slate-100"
                              onClick={() => changeRole(u._id, "admin")}
                            >
                              Make admin
                            </button>
                            <button
                              type="button"
                              className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] hover:bg-slate-100"
                              onClick={() => changeRole(u._id, "user")}
                            >
                              Make user
                            </button>
                            <button
                              type="button"
                              className="rounded border border-red-200 px-1.5 py-0.5 text-[10px] text-red-700 hover:bg-red-50"
                              onClick={() => removeUser(u._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && !loading && (
                <p className="p-6 text-center text-[11px] text-slate-500">
                  No users found.
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
