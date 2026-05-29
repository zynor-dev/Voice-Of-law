import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { notificationsAPI } from "../../services/api";

export default function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        notificationsAPI.list({ limit: 12, page: 1 }),
        notificationsAPI.unreadCount(),
      ]);
      setItems(listRes.data?.data || []);
      setCount(countRes.data?.count ?? 0);
    } catch {
      setItems([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    refresh();
  }, [open]);

  useEffect(() => {
    const t = setInterval(() => {
      notificationsAPI
        .unreadCount()
        .then((r) => setCount(r.data?.count ?? 0))
        .catch(() => {});
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const markAll = async () => {
    try {
      await notificationsAPI.markAllRead();
      await refresh();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        data-notification-toggle
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
        aria-expanded={open}
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-amber-500 px-0.5 text-[9px] font-bold text-slate-950">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-[130] sm:hidden"
              aria-label="Close notifications"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 z-[140] mt-1.5 w-[min(100vw-1.5rem,20rem)] overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                <span className="text-[11px] font-semibold text-slate-800">
                  Notifications
                </span>
                {count > 0 && (
                  <button
                    type="button"
                    onClick={markAll}
                    className="text-[10px] font-medium text-amber-700 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-6 text-[11px] text-slate-500">
                    Loading…
                  </div>
                ) : items.length === 0 ? (
                  <p className="px-3 py-6 text-center text-[11px] text-slate-500">
                    You&apos;re all caught up.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {items.map((n) => (
                      <li
                        key={n._id}
                        className={`px-3 py-2 text-[11px] ${
                          n.isRead ? "bg-white" : "bg-amber-500/[0.04]"
                        }`}
                      >
                        <p className="font-medium text-slate-800">{n.title}</p>
                        {n.message && (
                          <p className="mt-0.5 text-slate-600">{n.message}</p>
                        )}
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {n.createdAt &&
                            new Date(n.createdAt).toLocaleString(undefined, {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
