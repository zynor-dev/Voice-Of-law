import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import { adminAPI, handleApiError } from "../services/api";

const categories = [
  "civil",
  "criminal",
  "family",
  "property",
  "corporate",
  "constitutional",
  "employment",
  "banking_finance",
  "tax",
  "consumer",
  "intellectual_property",
  "legal_notice",
  "application",
  "agreement",
];
const createBlank = () => ({
  name: "",
  category: "civil",
  documentType: "",
  description: "",
  province: "",
  court: "",
  jurisdiction: "",
  language: "en",
  content: "",
  previewText: "",
  legalReferences: [],
  requiredFields: [],
  isActive: true,
});

function Questions({ fields, onChange }) {
  const update = (index, key, value) =>
    onChange(
      fields.map((field, current) =>
        current === index ? { ...field, [key]: value } : field,
      ),
    );
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Guided questions</label>
        <button
          type="button"
          className="text-sm font-semibold text-blue-700"
          onClick={() =>
            onChange([
              ...fields,
              {
                key: "",
                label: "",
                type: "text",
                required: true,
                helpText: "",
                step: fields.length
                  ? Math.max(...fields.map((field) => field.step || 1))
                  : 1,
              },
            ])
          }
        >
          + Add question
        </button>
      </div>
      {fields.map((field, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg border bg-gray-50 p-3"
        >
          <input
            className="border rounded px-3 py-2"
            value={field.key}
            placeholder="Field key: clientName"
            onChange={(event) =>
              update(index, "key", event.target.value.replace(/\s+/g, ""))
            }
          />
          <input
            className="border rounded px-3 py-2"
            value={field.label}
            placeholder="Question label"
            onChange={(event) => update(index, "label", event.target.value)}
          />
          <select
            className="border rounded px-3 py-2"
            value={field.type}
            onChange={(event) => update(index, "type", event.target.value)}
          >
            <option value="text">Short text</option>
            <option value="textarea">Long text</option>
            <option value="date">Date</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="boolean">Yes / No</option>
          </select>
          <input
            className="border rounded px-3 py-2"
            type="number"
            min="1"
            value={field.step || 1}
            placeholder="Step number"
            onChange={(event) =>
              update(index, "step", Number(event.target.value))
            }
          />
          <input
            className="border rounded px-3 py-2"
            value={field.helpText || ""}
            placeholder="Help text"
            onChange={(event) => update(index, "helpText", event.target.value)}
          />
          <div className="flex items-center justify-between">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={field.required !== false}
                onChange={(event) =>
                  update(index, "required", event.target.checked)
                }
                className="mr-2"
              />
              Required
            </label>
            <button
              type="button"
              className="text-sm text-red-600"
              onClick={() =>
                onChange(fields.filter((_, current) => current !== index))
              }
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function DraftingTemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.listDraftTemplates();
      setTemplates(response.data?.templates || []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const update = (key, value) =>
    setForm((previous) => ({ ...previous, [key]: value }));
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        requiredFields: form.requiredFields.filter(
          (field) => field.key && field.label,
        ),
      };
      if (form._id) await adminAPI.updateDraftTemplate(form._id, payload);
      else await adminAPI.createDraftTemplate(payload);
      setForm(null);
      await load();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };
  const remove = async (item) => {
    if (!window.confirm(`Delete template “${item.name}”?`)) return;
    try {
      await adminAPI.deleteDraftTemplate(item._id);
      await load();
    } catch (err) {
      setError(handleApiError(err));
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Drafting Templates
          </h2>
          <p className="mt-1 text-gray-500">
            Create the real templates shown to every user in Legal Drafting.
          </p>
        </div>
        <button
          onClick={() => setForm(createBlank())}
          className="flex items-center gap-2 rounded-lg bg-[#c79f44] px-4 py-2 text-white"
        >
          <FaPlus />
          New template
        </button>
      </div>
      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {loading ? (
        <p>Loading templates…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="p-4">Template</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Language</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-4">
                    <strong>{item.name}</strong>
                    <p className="text-xs text-gray-500">
                      {item.documentType || "Document"}
                    </p>
                  </td>
                  <td className="p-4 capitalize">
                    {item.category?.replace("_", " ")}
                  </td>
                  <td className="p-4">
                    {item.province || "Pakistan"}
                    {item.court ? ` · ${item.court}` : ""}
                  </td>
                  <td className="p-4">
                    {item.language === "ur" ? "Urdu" : "English"}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() =>
                        adminAPI
                          .updateDraftTemplate(item._id, {
                            isActive: !item.isActive,
                          })
                          .then(load)
                      }
                      className={
                        item.isActive ? "text-green-700" : "text-gray-500"
                      }
                    >
                      {item.isActive ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="whitespace-nowrap p-4">
                    <button
                      className="mr-3 text-blue-700"
                      onClick={() =>
                        setForm({
                          ...item,
                          legalReferences: item.legalReferences || [],
                          requiredFields: item.requiredFields || [],
                        })
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => remove(item)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!templates.length && (
            <p className="p-8 text-center text-gray-500">
              No templates yet. Add your first approved Pakistan-focused
              template.
            </p>
          )}
        </div>
      )}
      {form && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
          <form
            onSubmit={save}
            className="mx-auto my-8 max-w-4xl space-y-5 rounded-xl bg-white p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">
                  {form._id ? "Edit template" : "New template"}
                </h3>
                <p className="text-sm text-gray-500">
                  Use Handlebars placeholders, for example {"{{clientName}}"}.
                </p>
              </div>
              <button type="button" onClick={() => setForm(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">
                Template name
                <input
                  required
                  className="mt-1 block w-full rounded border px-3 py-2"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                />
              </label>
              <label className="text-sm font-medium">
                Document type
                <input
                  className="mt-1 block w-full rounded border px-3 py-2"
                  value={form.documentType || ""}
                  onChange={(event) =>
                    update("documentType", event.target.value)
                  }
                />
              </label>
              <label className="text-sm font-medium">
                Category
                <select
                  className="mt-1 block w-full rounded border px-3 py-2"
                  value={form.category}
                  onChange={(event) => update("category", event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium">
                Language
                <select
                  className="mt-1 block w-full rounded border px-3 py-2"
                  value={form.language}
                  onChange={(event) => update("language", event.target.value)}
                >
                  <option value="en">English</option>
                  <option value="ur">Urdu</option>
                </select>
              </label>
              <label className="text-sm font-medium">
                Province
                <input
                  className="mt-1 block w-full rounded border px-3 py-2"
                  value={form.province || ""}
                  onChange={(event) => update("province", event.target.value)}
                  placeholder="e.g. Punjab"
                />
              </label>
              <label className="text-sm font-medium">
                Court / jurisdiction
                <input
                  className="mt-1 block w-full rounded border px-3 py-2"
                  value={form.court || ""}
                  onChange={(event) => update("court", event.target.value)}
                  placeholder="e.g. Lahore High Court"
                />
              </label>
            </div>
            <label className="block text-sm font-medium">
              Description
              <textarea
                className="mt-1 block w-full rounded border px-3 py-2"
                rows="2"
                value={form.description || ""}
                onChange={(event) => update("description", event.target.value)}
              />
            </label>
            <Questions
              fields={form.requiredFields || []}
              onChange={(value) => update("requiredFields", value)}
            />
            <label className="block text-sm font-medium">
              Template preview
              <textarea
                className="mt-1 block w-full rounded border px-3 py-2"
                rows="5"
                value={form.previewText || ""}
                onChange={(event) => update("previewText", event.target.value)}
                placeholder="Short readable preview for users"
              />
            </label>
            <label className="block text-sm font-medium">
              Template content *
              <textarea
                required
                className="mt-1 block w-full rounded border px-3 py-2 font-mono text-sm"
                rows="14"
                value={form.content}
                onChange={(event) => update("content", event.target.value)}
                placeholder="IN THE COURT OF {{courtName}}…"
              />
            </label>
            <label className="text-sm">
              <input
                type="checkbox"
                checked={form.isActive !== false}
                onChange={(event) => update("isActive", event.target.checked)}
                className="mr-2"
              />
              Available to users
            </label>
            <div className="flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                className="flex items-center gap-2 rounded bg-[#c79f44] px-4 py-2 text-white"
              >
                <FaSave />
                {saving ? "Saving…" : "Save template"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
