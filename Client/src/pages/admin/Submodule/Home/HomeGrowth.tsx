// src/pages/HomeGrowthDetails.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { homeGrowthApi } from "../../../../Backend"; // adjust path if needed

type GrowthItem = {
  _id: string;
  labels: string;
  Value: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function HomeGrowthDetails() {
  const [items, setItems] = useState<GrowthItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // modal / form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GrowthItem | null>(null);
  const [formLabels, setFormLabels] = useState("");
  const [formValue, setFormValue] = useState("");

  // submission state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await homeGrowthApi.getAll();
      // backend shape: { success: true, data: [ ... ] }
      const data = res?.data?.data ?? res?.data ?? [];
      if (Array.isArray(data)) {
        // newest-first by createdAt
        const sorted = data.slice().sort((a: GrowthItem, b: GrowthItem) => {
          const ta = new Date(a.createdAt || 0).getTime();
          const tb = new Date(b.createdAt || 0).getTime();
          return tb - ta;
        });
        setItems(sorted);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error("fetch home growth error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load growth data");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormLabels("");
    setFormValue("");
    setShowForm(true);
  };

  const openEdit = (item: GrowthItem) => {
    setEditing(item);
    setFormLabels(item.labels);
    setFormValue(item.Value);
    setShowForm(true);
  };

  const closeForm = () => {
    if (submitting) return;
    setShowForm(false);
    setEditing(null);
    setFormLabels("");
    setFormValue("");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // simple validation
    const labels = String(formLabels ?? "").trim();
    const value = String(formValue ?? "").trim();

    if (!labels) return alert("Please enter labels (e.g. 2024-2025).");
    if (!value) return alert("Please enter Value.");

    setSubmitting(true);
    try {
      if (editing) {
        // update
        const payload = { labels, Value: value };
        await homeGrowthApi.update(editing._id, payload);
      } else {
        // create
        const payload = { labels, Value: value };
        await homeGrowthApi.create(payload);
      }

      // refresh
      await fetchItems();
      closeForm();
    } catch (err: any) {
      console.error("save home growth error:", err);
      alert(err?.response?.data?.message ?? err?.message ?? "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record? This action cannot be undone.")) return;
    try {
      await homeGrowthApi.delete(id);
      // optimistic refresh
      setItems((prev) => prev.filter((it) => it._id !== id));
    } catch (err: any) {
      console.error("delete error:", err);
      alert(err?.response?.data?.message ?? err?.message ?? "Delete failed");
      // fallback: refetch
      await fetchItems();
    }
  };

  return (
    <section className="container mx-auto px-6 py-12 text-black mt-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Company Growth Timeline</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary/90"
          >
            + Add
          </button>
          <button
            onClick={fetchItems}
            className="px-3 py-2 border rounded-md text-sm"
            title="Refresh"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-600">Loading growth data…</div>
      ) : error ? (
        <div className="py-12 text-center text-red-600">Error: {error}</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-gray-600">No growth entries found.</div>
      ) : (
        <div className="grid gap-4">
          {items.map((it) => (
            <motion.div
              key={it._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1">
                <div className="flex items-baseline gap-4">
                  <span className="text-xl font-semibold text-gray-800">{it.labels}</span>
                  <span className="text-3xl font-extrabold text-primary">{it.Value}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Created: {it.createdAt ? new Date(it.createdAt).toLocaleString() : "—"}
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button
                  onClick={() => openEdit(it)}
                  className="px-3 py-1.5 bg-yellow-500 text-white rounded-md text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(it._id)}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={closeForm} />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 z-20">
            <h3 className="text-lg font-semibold mb-3">{editing ? "Edit Entry" : "Create Entry"}</h3>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <label className="block mb-3">
                <span className="text-sm font-medium">Labels (period)</span>
                <input
                  value={formLabels}
                  onChange={(e) => setFormLabels(e.target.value)}
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="e.g. 2024–2025"
                  required
                />
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium">Value</span>
                <input
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="e.g. 39"
                  required
                />
              </label>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded bg-gray-100"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-primary text-white"
                >
                  {submitting ? "Saving…" : editing ? "Save changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
