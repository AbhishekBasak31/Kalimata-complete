// src/pages/HomeMilestoneDetails.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { homeMilestoneApi } from "../../../../Backend"; // adjust to your Backend path
// import { Button } from "@/components/ui/button"; // optional UI button

type Milestone = {
  _id: string;
  Mstone: string;
  Year: string;
  Title: string;
  Desc: string;
  Img?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function HomeMilestoneDetails() {
  const [items, setItems] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal/form state
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const imgFileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    Mstone: "",
    Year: "",
    Title: "",
    Desc: "",
    ImgUrl: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await homeMilestoneApi.getAll();
      const arr = res?.data?.data ?? res?.data ?? [];
      if (Array.isArray(arr)) {
        const sorted = arr.slice().sort((a: any, b: any) => {
          const ta = new Date(a.createdAt ?? 0).getTime();
          const tb = new Date(b.createdAt ?? 0).getTime();
          return tb - ta;
        });
        setItems(sorted);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      console.error("fetch milestones error", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load milestones");
    } finally {
      setLoading(false);
    }
  };

  // open create modal
  const openCreate = () => {
    setEditing(null);
    setForm({ Mstone: "", Year: "", Title: "", Desc: "", ImgUrl: "" });
    if (imgFileRef.current) imgFileRef.current.value = "";
    setOpenForm(true);
  };

  // open editing modal
  const openEdit = (it: Milestone) => {
    setEditing(it);
    setForm({
      Mstone: it.Mstone ?? "",
      Year: it.Year ?? "",
      Title: it.Title ?? "",
      Desc: it.Desc ?? "",
      ImgUrl: it.Img ?? "",
    });
    if (imgFileRef.current) imgFileRef.current.value = "";
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this milestone?")) return;
    try {
      await homeMilestoneApi.delete(id);
      await fetchItems();
    } catch (err: any) {
      console.error("delete milestone error", err);
      alert(err?.response?.data?.message ?? err?.message ?? "Delete failed");
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // basic validation
    if (!form.Mstone || !form.Year || !form.Title || !form.Desc) {
      alert("Please fill all fields");
      return;
    }

    const fd = new FormData();
    fd.append("Mstone", form.Mstone);
    fd.append("Year", form.Year);
    fd.append("Title", form.Title);
    fd.append("Desc", form.Desc);

    const file = imgFileRef.current?.files?.[0];
    if (file) {
      fd.append("Img", file);
    } else if (form.ImgUrl) {
      // controller supports Img as URL in body
      fd.append("Img", form.ImgUrl);
    }

    try {
      if (editing) {
        // update
        await homeMilestoneApi.update(editing._id, fd);
      } else {
        // create
        await homeMilestoneApi.create(fd);
      }
      setOpenForm(false);
      await fetchItems();
    } catch (err: any) {
      console.error("save milestone error", err);
      alert(err?.response?.data?.message ?? err?.message ?? "Save failed");
    }
  };

  return (
    <section className="container mx-auto px-6 py-12 text-black mt-14">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Milestones</h1>
        <div className="flex gap-3">
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
          >
            + Add Milestone
          </button>
          <button
            onClick={fetchItems}
            className="px-3 py-2 rounded border"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-gray-600">No milestones found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <motion.article
              key={it._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              <div className="h-44 w-full relative">
                {it.Img ? (
                  // image
                  <img src={it.Img} alt={it.Title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    No image
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{it.Title}</h3>
                    <div className="text-xs text-gray-500">{it.Mstone} • {it.Year}</div>
                  </div>
                  <div className="text-sm text-gray-400">{new Date(it.createdAt ?? "").toLocaleDateString()}</div>
                </div>

                <p className="text-gray-700 mt-3 flex-1">{it.Desc}</p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEdit(it)}
                    className="px-3 py-1 rounded bg-yellow-500 text-white text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(it._id)}
                    className="px-3 py-1 rounded bg-red-500 text-white text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Modal form */}
      {openForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenForm(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 z-20">
            <h3 className="text-xl font-semibold mb-3">{editing ? "Edit Milestone" : "Create Milestone"}</h3>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Milestone</span>
                  <input value={form.Mstone} onChange={(e) => setForm({ ...form, Mstone: e.target.value })} className="border p-2 rounded" required />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium">Year</span>
                  <input value={form.Year} onChange={(e) => setForm({ ...form, Year: e.target.value })} className="border p-2 rounded" required />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium">Title</span>
                  <input value={form.Title} onChange={(e) => setForm({ ...form, Title: e.target.value })} className="border p-2 rounded" required />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium">Description</span>
                  <textarea value={form.Desc} onChange={(e) => setForm({ ...form, Desc: e.target.value })} className="border p-2 rounded h-28" required />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium">Image (file)</span>
                  <input ref={imgFileRef} type="file" accept="image/*" className="mt-1" />
                  <span className="text-xs text-gray-500 mt-1">Or provide an image URL</span>
                  <input value={form.ImgUrl} onChange={(e) => setForm({ ...form, ImgUrl: e.target.value })} className="border p-2 rounded mt-1" placeholder="https://..." />
                </label>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setOpenForm(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary text-white">{editing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
