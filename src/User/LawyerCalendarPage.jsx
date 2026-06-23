import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash, FaLink } from "react-icons/fa";
import { calendarAPI, casesAPI } from "../../services/api";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function padGridStart(date) {
  const jsDay = date.getDay();
  const mondayFirst = jsDay === 0 ? 6 : jsDay - 1;
  return mondayFirst;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function LawyerCalendarPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const [events, setEvents] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [modal, setModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    eventType: "hearing",
    caseId: "",
  });

  const monthLabel = useMemo(
    () =>
      cursor.toLocaleString(undefined, { month: "long", year: "numeric" }),
    [cursor]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const start = startOfMonth(cursor);
      const end = endOfMonth(cursor);
      const [evRes, caseRes] = await Promise.all([
        calendarAPI.getEvents({
          start: start.toISOString(),
          end: end.toISOString(),
        }),
        casesAPI.getAll({ limit: 100, page: 1 }),
      ]);
      setEvents(evRes.data?.events || []);
      const list = caseRes.data?.data ?? caseRes.data?.cases ?? [];
      setCases(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr(e.response?.data?.message || "Could not load calendar.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [cursor]);

  useEffect(() => {
    load();
  }, [load]);

  const gridDays = useMemo(() => {
    const first = startOfMonth(cursor);
    const lead = padGridStart(first);
    const days = [];
    const start = new Date(first);
    start.setDate(start.getDate() - lead);
    for (let i = 0; i < 42; i++) {
      const cell = new Date(start);
      cell.setDate(start.getDate() + i);
      days.push(cell);
    }
    return days;
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      const d = new Date(ev.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }
    return map;
  }, [events]);

  const openNew = (presetDate) => {
    const d = presetDate || new Date();
    const iso = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      9,
      0,
      0
    )
      .toISOString()
      .slice(0, 16);
    setForm({
      title: "",
      date: iso,
      eventType: "hearing",
      caseId: "",
    });
    setModal(true);
  };

  const createEvent = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    setSubmitting(true);
    setErr("");
    try {
      const body = {
        title: form.title.trim(),
        date: new Date(form.date).toISOString(),
        eventType: form.eventType,
      };
      if (form.caseId) body.caseId = form.caseId;
      await calendarAPI.createEvent(body);
      setModal(false);
      await load();
    } catch (er) {
      setErr(er.response?.data?.message || "Could not create event.");
    } finally {
      setSubmitting(false);
    }
  };

  const removeEvent = async (id) => {
    if (!window.confirm("Delete this calendar entry?")) return;
    try {
      await calendarAPI.deleteEvent(id);
      await load();
    } catch (er) {
      setErr(er.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-3 pb-6 pt-1 sm:px-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900">
            Calendar
          </h2>
          <p className="text-[11px] text-slate-500">
            Hearings, deadlines, and case-linked dates
          </p>
        </div>
        <button
          type="button"
          onClick={() => openNew(new Date())}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          <FaPlus className="text-[10px]" />
          Add event
        </button>
      </div>

      <div className="rounded-xl border border-slate-200/90 bg-white/90 p-3 shadow-sm backdrop-blur-sm sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-50"
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
              )
            }
            aria-label="Previous month"
          >
            <FaChevronLeft className="text-xs" />
          </button>
          <span className="text-xs font-semibold text-slate-800">
            {monthLabel}
          </span>
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-50"
            onClick={() =>
              setCursor(
                new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
              )
            }
            aria-label="Next month"
          >
            <FaChevronRight className="text-xs" />
          </button>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center text-[11px] text-slate-500">
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            Loading…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-1">
                  {w}
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-0.5">
              {gridDays.map((day) => {
                const inMonth = day.getMonth() === cursor.getMonth();
                const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
                const dayEvents = eventsByDay.get(key) || [];
                const isToday = sameDay(day, new Date());
                return (
                  <motion.button
                    type="button"
                    key={key}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => inMonth && openNew(day)}
                    className={`flex min-h-[4.25rem] flex-col rounded-lg border p-1 text-left transition sm:min-h-[4.75rem] ${
                      inMonth
                        ? "border-slate-100 bg-slate-50/80 hover:border-amber-200/60 hover:bg-white"
                        : "border-transparent bg-transparent opacity-40"
                    } ${isToday ? "ring-1 ring-amber-400/70" : ""}`}
                  >
                    <span
                      className={`text-[10px] font-semibold ${
                        inMonth ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    <div className="mt-0.5 flex flex-1 flex-col gap-0.5 overflow-hidden">
                      {dayEvents.slice(0, 3).map((ev) => (
                        <span
                          key={ev._id}
                          className="truncate rounded bg-amber-500/15 px-0.5 text-[9px] font-medium text-amber-950"
                          title={ev.title}
                        >
                          {ev.title}
                        </span>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[8px] text-slate-400">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}

        {err && (
          <p className="mt-2 text-center text-[11px] text-red-600">{err}</p>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200/90 bg-white/90 p-3 shadow-sm sm:p-4">
        <h3 className="text-xs font-semibold text-slate-800">This month</h3>
        <ul className="mt-2 max-h-52 space-y-1.5 overflow-y-auto text-[11px]">
          {events.length === 0 && !loading && (
            <li className="text-slate-500">No events this month.</li>
          )}
          {events
            .slice()
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((ev) => (
              <li
                key={ev._id}
                className="flex items-start justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-2 py-1.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {ev.title}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(ev.date).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}{" "}
                    · {ev.eventType || "event"}
                    {ev.caseId?.title && (
                      <span className="ml-1 inline-flex items-center gap-0.5 text-amber-800/90">
                        <FaLink className="text-[8px]" />
                        {ev.caseId.title}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeEvent(ev._id)}
                  aria-label="Delete event"
                >
                  <FaTrash className="text-[10px]" />
                </button>
              </li>
            ))}
        </ul>
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-950/45 p-3 backdrop-blur-[1px] sm:items-center"
          onClick={() => !submitting && setModal(false)}
        >
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={createEvent}
            className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
          >
            <h3 className="text-sm font-semibold text-slate-900">New event</h3>
            <div className="mt-3 space-y-2">
              <div>
                <label className="text-[11px] font-medium text-slate-600">
                  Title
                </label>
                <input
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                  placeholder="Hearing / meeting / deadline"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600">
                  Date & time
                </label>
                <input
                  type="datetime-local"
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600">
                  Type
                </label>
                <select
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                  value={form.eventType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, eventType: e.target.value }))
                  }
                >
                  <option value="hearing">Hearing</option>
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-600">
                  Link case (optional)
                </label>
                <select
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                  value={form.caseId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, caseId: e.target.value }))
                  }
                >
                  <option value="">— None —</option>
                  {cases.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.caseNo} · {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs"
                onClick={() => setModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white disabled:opacity-50"
              >
                {submitting ? "Saving…" : "Save"}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
}
