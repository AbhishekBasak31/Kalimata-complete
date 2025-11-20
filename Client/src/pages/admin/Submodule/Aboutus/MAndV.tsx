// src/pages/MAndVDetails.tsx
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { mAndVApi } from "../../../../Backend"; // adjust path to your Backend export
import { Button } from "@/components/ui/button"; // optional: your UI Button

type MAndVItem = {
  _id: string;
  Img1?: string;
  Htext1?: string;
  Dtext1?: string;
  Img2?: string;
  Htext2?: string;
  Dtext2?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function MAndVDetails() {
  const [items, setItems] = useState<MAndVItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state (editable-only; creation disabled)
  const [editing, setEditing] = useState<MAndVItem | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // form refs
  const img1FileRef = useRef<HTMLInputElement | null>(null);
  const img2FileRef = useRef<HTMLInputElement | null>(null);

  // simple form controlled fields
  const [form, setForm] = useState({
    Htext1: "",
    Dtext1: "",
    Htext2: "",
    Dtext2: "",
    Img1Url: "",
    Img2Url: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mAndVApi.getAll();
      const data = res?.data?.data ?? res?.data;
      if (!Array.isArray(data)) {
        setItems([]);
      } else {
        const sorted = data.slice().sort((a: MAndVItem, b: MAndVItem) => {
          const ta = new Date(a.createdAt || 0).getTime();
          const tb = new Date(b.createdAt || 0).getTime();
          return tb - ta;
        });
        setItems(sorted);
      }
    } catch (err: any) {
      console.error("fetch mandv error", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (item: MAndVItem) => {
    setEditing(item);
    setForm({
      Htext1: item.Htext1 ?? "",
      Dtext1: item.Dtext1 ?? "",
      Htext2: item.Htext2 ?? "",
      Dtext2: item.Dtext2 ?? "",
      Img1Url: item.Img1 ?? "",
      Img2Url: item.Img2 ?? "",
    });
    if (img1FileRef.current) img1FileRef.current.value = "";
    if (img2FileRef.current) img2FileRef.current.value = "";
    setShowForm(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editing) {
      // safety: creation is disabled in this page
      alert("Creation is disabled here. Please select an existing item to edit.");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("Htext1", form.Htext1);
      fd.append("Dtext1", form.Dtext1);
      fd.append("Htext2", form.Htext2);
      fd.append("Dtext2", form.Dtext2);

      // allow uploading files or using Img URL fields
      const f1 = img1FileRef.current?.files?.[0];
      const f2 = img2FileRef.current?.files?.[0];
      if (f1) fd.append("Img1", f1);
      else if (form.Img1Url) fd.append("Img1", form.Img1Url);

      if (f2) fd.append("Img2", f2);
      else if (form.Img2Url) fd.append("Img2", form.Img2Url);

      await mAndVApi.update(editing._id, fd);

      setShowForm(false);
      setEditing(null);
      await fetchItems();
    } catch (err: any) {
      console.error("submit error", err);
      alert(err?.response?.data?.message ?? err?.message ?? "Update failed");
    }
  };

  return (
    <section className="text-black container mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mission & Vision</h1>
      </div>

      {loading ? (
        <div className="py-12 text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-600">Error: {error}</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-gray-600">No M & V entries found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((it) => (
            <motion.article
              key={it._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-1/2">
                <img src={it.Img1} alt={it.Htext1} className="w-full h-64 object-cover" />
              </div>

              <div className="p-6 flex-1">
                <h3 className="text-xl font-semibold mb-2">{it.Htext1}</h3>
                <p className="text-gray-700 mb-4">{it.Dtext1}</p>

                <div className="my-4 h-px bg-gray-100" />

                <div className="md:flex md:items-start md:gap-4">
                  <div className="md:w-1/3">
                    <img src={it.Img2} alt={it.Htext2} className="w-full h-36 object-cover rounded-lg" />
                  </div>
                  <div className="md:flex-1 mt-3 md:mt-0">
                    <h4 className="font-semibold">{it.Htext2}</h4>
                    <p className="text-gray-700">{it.Dtext2}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  {/* Edit button always visible; creation & delete are intentionally disabled */}
                  <Button onClick={() => handleOpenEdit(it)} className="bg-yellow-500 text-white">
                    Edit
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Edit Modal (simple overlay) */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setShowForm(false); setEditing(null); }} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 z-20">
            <h3 className="text-xl font-semibold mb-4">Edit Mission & Vision</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Heading 1</span>
                  <input value={form.Htext1} onChange={(e) => setForm({ ...form, Htext1: e.target.value })} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Heading 2</span>
                  <input value={form.Htext2} onChange={(e) => setForm({ ...form, Htext2: e.target.value })} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium">Description 1</span>
                  <textarea value={form.Dtext1} onChange={(e) => setForm({ ...form, Dtext1: e.target.value })} className="border p-2 rounded h-24" />
                </label>
                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium">Description 2</span>
                  <textarea value={form.Dtext2} onChange={(e) => setForm({ ...form, Dtext2: e.target.value })} className="border p-2 rounded h-24" />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium">Image 1 (file)</span>
                  <input ref={img1FileRef} type="file" accept="image/*" />
                  <span className="text-xs text-gray-500 mt-1">Or provide an image URL:</span>
                  <input value={form.Img1Url} onChange={(e) => setForm({ ...form, Img1Url: e.target.value })} className="border p-2 rounded mt-1" />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium">Image 2 (file)</span>
                  <input ref={img2FileRef} type="file" accept="image/*" />
                  <span className="text-xs text-gray-500 mt-1">Or provide an image URL:</span>
                  <input value={form.Img2Url} onChange={(e) => setForm({ ...form, Img2Url: e.target.value })} className="border p-2 rounded mt-1" />
                </label>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary text-white">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
