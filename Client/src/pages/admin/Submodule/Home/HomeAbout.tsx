// src/pages/HomeAboutDetails.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { homeAboutApi } from "../../../../Backend"; // adjust to your Backend export location

type HomeAboutItem = {
  _id: string;
  Num1?: string;
  Num2?: string;
  Num3?: string;
  Img1?: string;
  Img2?: string;
  Img3?: string;
  Htext1?: string;
  Htext2?: string;
  Htext3?: string;
  Dtext1?: string;
  Dtext2?: string;
  Dtext3?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function HomeAboutDetails() {
  const [item, setItem] = useState<HomeAboutItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // edit modal state
  const [editing, setEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // form state
  const [form, setForm] = useState({
    Num1: "",
    Num2: "",
    Num3: "",
    Htext1: "",
    Htext2: "",
    Htext3: "",
    Dtext1: "",
    Dtext2: "",
    Dtext3: "",
    Img1Url: "",
    Img2Url: "",
    Img3Url: "",
  });

  // file refs for new uploads
  const img1FileRef = useRef<HTMLInputElement | null>(null);
  const img2FileRef = useRef<HTMLInputElement | null>(null);
  const img3FileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchLatest() {
    setLoading(true);
    setError(null);
    try {
      // prefer endpoint /latest if available, fallback to getAll then pick newest
      let res;
      try {
        res = await homeAboutApi.getLatest();
      } catch {
        res = await homeAboutApi.getAll();
      }
      const data = res?.data?.data ?? res?.data ?? [];
      const latest = Array.isArray(data) ? (data.length ? data[0] : null) : data;
      // if getLatest returned object, normalize
      const normalized = Array.isArray(latest) ? (latest.length ? latest[0] : null) : latest;
      setItem(normalized ?? null);

      if (normalized) {
        setForm({
          Num1: normalized.Num1 ?? "",
          Num2: normalized.Num2 ?? "",
          Num3: normalized.Num3 ?? "",
          Htext1: normalized.Htext1 ?? "",
          Htext2: normalized.Htext2 ?? "",
          Htext3: normalized.Htext3 ?? "",
          Dtext1: normalized.Dtext1 ?? "",
          Dtext2: normalized.Dtext2 ?? "",
          Dtext3: normalized.Dtext3 ?? "",
          Img1Url: normalized.Img1 ?? "",
          Img2Url: normalized.Img2 ?? "",
          Img3Url: normalized.Img3 ?? "",
        });
      }
    } catch (err: any) {
      console.error("fetch home about error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  const openEdit = () => {
    if (!item) return;
    setEditing(true);
    // ensure file inputs cleared
    if (img1FileRef.current) img1FileRef.current.value = "";
    if (img2FileRef.current) img2FileRef.current.value = "";
    if (img3FileRef.current) img3FileRef.current.value = "";
  };

  const closeEdit = () => {
    setEditing(false);
  };

  const handleFormChange = (k: keyof typeof form, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!item) return alert("No item to update");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("Num1", form.Num1);
      fd.append("Num2", form.Num2);
      fd.append("Num3", form.Num3);
      fd.append("Htext1", form.Htext1);
      fd.append("Htext2", form.Htext2);
      fd.append("Htext3", form.Htext3);
      fd.append("Dtext1", form.Dtext1);
      fd.append("Dtext2", form.Dtext2);
      fd.append("Dtext3", form.Dtext3);

      // file uploads take precedence if chosen, otherwise send ImgUrl values as Img fields
      const f1 = img1FileRef.current?.files?.[0];
      const f2 = img2FileRef.current?.files?.[0];
      const f3 = img3FileRef.current?.files?.[0];

      if (f1) fd.append("Img1", f1);
      else fd.append("Img1", form.Img1Url ?? "");

      if (f2) fd.append("Img2", f2);
      else fd.append("Img2", form.Img2Url ?? "");

      if (f3) fd.append("Img3", f3);
      else fd.append("Img3", form.Img3Url ?? "");

      await homeAboutApi.update(item._id, fd);
      alert("Updated successfully");
      setEditing(false);
      await fetchLatest();
    } catch (err: any) {
      console.error("update error:", err);
      alert(err?.response?.data?.message ?? err?.message ?? "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-12 text-center">Loading...</div>;
  if (error) return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  if (!item) return <div className="py-12 text-center text-gray-600">No Home About record found.</div>;

  const cards = [
    { num: item.Num1 ?? "", img: item.Img1 ?? "", title: item.Htext1 ?? "", desc: item.Dtext1 ?? "" },
    { num: item.Num2 ?? "", img: item.Img2 ?? "", title: item.Htext2 ?? "", desc: item.Dtext2 ?? "" },
    { num: item.Num3 ?? "", img: item.Img3 ?? "", title: item.Htext3 ?? "", desc: item.Dtext3 ?? "" },
  ];

  return (
    <section className="relative bg-gray-50 pt-16 pb-20 overflow-hidden text-black" >
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">About <span className="text-primary">Us</span></h2>
            <p className="mt-2 text-gray-600 max-w-2xl">Quick snapshot of our core strengths and numbers.</p>
          </div>

          <div>
            <button onClick={openEdit} className="inline-block bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary/90">
              Edit
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, idx) => (
            <motion.article key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.06 }} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="relative h-48">
                {c.img ? <img src={c.img} alt={c.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No image</div>}
                <div className="absolute left-4 top-4 bg-white/90 px-3 py-1 rounded-full shadow-sm text-sm font-semibold">{c.num}</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{c.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit} />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 z-20 overflow-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4">Edit Home About</h3>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <div className="grid gap-3 md:grid-cols-3">
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Num 1</span>
                  <input value={form.Num1} onChange={(e) => handleFormChange("Num1", e.target.value)} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Num 2</span>
                  <input value={form.Num2} onChange={(e) => handleFormChange("Num2", e.target.value)} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Num 3</span>
                  <input value={form.Num3} onChange={(e) => handleFormChange("Num3", e.target.value)} className="border p-2 rounded" />
                </label>

                <label className="flex flex-col md:col-span-3">
                  <span className="text-sm font-medium">Heading 1</span>
                  <input value={form.Htext1} onChange={(e) => handleFormChange("Htext1", e.target.value)} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col md:col-span-3">
                  <span className="text-sm font-medium">Description 1</span>
                  <textarea value={form.Dtext1} onChange={(e) => handleFormChange("Dtext1", e.target.value)} className="border p-2 rounded h-24" />
                </label>

                <label className="flex flex-col md:col-span-3">
                  <span className="text-sm font-medium">Heading 2</span>
                  <input value={form.Htext2} onChange={(e) => handleFormChange("Htext2", e.target.value)} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col md:col-span-3">
                  <span className="text-sm font-medium">Description 2</span>
                  <textarea value={form.Dtext2} onChange={(e) => handleFormChange("Dtext2", e.target.value)} className="border p-2 rounded h-24" />
                </label>

                <label className="flex flex-col md:col-span-3">
                  <span className="text-sm font-medium">Heading 3</span>
                  <input value={form.Htext3} onChange={(e) => handleFormChange("Htext3", e.target.value)} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col md:col-span-3">
                  <span className="text-sm font-medium">Description 3</span>
                  <textarea value={form.Dtext3} onChange={(e) => handleFormChange("Dtext3", e.target.value)} className="border p-2 rounded h-24" />
                </label>

                {/* Image 1 */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Image 1 (file)</span>
                  <input ref={img1FileRef} type="file" accept="image/*" className="mt-1" />
                  <span className="text-xs text-gray-500 mt-1">Or use image URL</span>
                  <input value={form.Img1Url} onChange={(e) => handleFormChange("Img1Url", e.target.value)} className="border p-2 rounded mt-1" />
                </label>

                {/* Image 2 */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Image 2 (file)</span>
                  <input ref={img2FileRef} type="file" accept="image/*" className="mt-1" />
                  <span className="text-xs text-gray-500 mt-1">Or use image URL</span>
                  <input value={form.Img2Url} onChange={(e) => handleFormChange("Img2Url", e.target.value)} className="border p-2 rounded mt-1" />
                </label>

                {/* Image 3 */}
                <label className="flex flex-col">
                  <span className="text-sm font-medium">Image 3 (file)</span>
                  <input ref={img3FileRef} type="file" accept="image/*" className="mt-1" />
                  <span className="text-xs text-gray-500 mt-1">Or use image URL</span>
                  <input value={form.Img3Url} onChange={(e) => handleFormChange("Img3Url", e.target.value)} className="border p-2 rounded mt-1" />
                </label>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button type="button" onClick={closeEdit} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-primary text-white">
                  {submitting ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
