// src/pages/HomeDirectorDetails.tsx
import React, { useEffect, useState, useRef } from "react";
import { homeDirectorApi } from "../../../../Backend"; // adjust path if needed
import { motion } from "framer-motion";

type HomeDirectorType = {
  _id: string;
  Title?: string;
  Text?: string;
  Vedios?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function HomeDirectorDetails() {
  const [item, setItem] = useState<HomeDirectorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const videoFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // call getAll and pick newest entry (descending by createdAt)
        const resp = await homeDirectorApi.getAll();
        console.debug("homeDirectorApi.getAll response:", resp);
        const payload = resp?.data?.data ?? resp?.data ?? resp;
        let candidate = null;
        if (Array.isArray(payload)) {
          candidate = payload.length ? payload.slice().sort((a: any, b: any) => {
            const ta = new Date(a.createdAt || 0).getTime();
            const tb = new Date(b.createdAt || 0).getTime();
            return tb - ta;
          })[0] : null;
        } else if (payload && typeof payload === "object") {
          candidate = payload._id ? payload : null;
        }

        if (!mounted) return;
        setItem(candidate);
      } catch (err: any) {
        console.error("HomeDirector fetch error:", err);
        const msg = err?.response?.data?.message ?? err?.message ?? "Failed to load director — check console/network";
        setError(String(msg));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  // open edit modal & populate form
  const openEdit = () => {
    if (!item) return;
    setTitle(item.Title ?? "");
    setText(item.Text ?? "");
    setVideoUrl(item.Vedios ?? "");
    if (videoFileRef.current) videoFileRef.current.value = "";
    setEditing(true);
  };

  const closeEdit = () => {
    setEditing(false);
    setSubmitting(false);
  };

  // submit update
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!item) return alert("No item to update");

    setSubmitting(true);
    try {
      const fd = new FormData();
      // Append fields (backend accepts missing fields but controller expects non-empty strings)
      fd.append("Title", title ?? "");
      fd.append("Text", text ?? "");

      // File takes priority; otherwise append the URL to Vedios
      const file = videoFileRef.current?.files?.[0];
      if (file) {
        fd.append("Vedios", file);
      } else {
        // if user left the videoUrl blank, we still append an empty string to indicate no change is allowed? 
        // But controller expects Vedios only if provided — to avoid accidental overwrite, only append if non-empty.
        if (videoUrl && videoUrl.trim()) fd.append("Vedios", videoUrl.trim());
      }

      console.info(`Updating HomeDirector id=${item._id}`);
      await homeDirectorApi.update(item._id, fd);

      // refetch after update (same logic as initial load)
      const resp = await homeDirectorApi.getAll();
      const payload = resp?.data?.data ?? resp?.data ?? resp;
      let candidate = null;
      if (Array.isArray(payload)) {
        candidate = payload.length ? payload.slice().sort((a: any, b: any) => {
          const ta = new Date(a.createdAt || 0).getTime();
          const tb = new Date(b.createdAt || 0).getTime();
          return tb - ta;
        })[0] : null;
      } else if (payload && typeof payload === "object") {
        candidate = payload._id ? payload : null;
      }
      setItem(candidate);
      closeEdit();
      console.info("HomeDirector updated and reloaded");
    } catch (err: any) {
      console.error("update error:", err);
      alert(err?.response?.data?.message ?? err?.message ?? "Update failed");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-12 text-center">Loading director message…</div>;
  if (error) return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  if (!item) return <div className="py-12 text-center text-gray-600">No director message found.</div>;

  return (
    <section className=" container mx-auto px-6 py-16 text-black mt-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Message from Director</h1>
        {/* Only edit option is available */}
        <button
          onClick={openEdit}
          className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90"
        >
          Edit
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Video */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {item.Vedios ? (
            <video
              src={item.Vedios}
              controls
              muted
              className="w-full rounded-2xl shadow-md object-cover max-h-[520px]"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
              No video available
            </div>
          )}
        </motion.div>

        {/* Text */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <h2 className="text-3xl font-bold mb-4">{item.Title ?? "Message from Director"}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{item.Text ?? "No text provided."}</p>

          <div className="mt-6 text-sm text-gray-500">
            <strong>Updated:</strong> {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "—"}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/50" onClick={closeEdit} />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 z-20">
            <h3 className="text-xl font-semibold mb-3">Edit Director Message</h3>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <label className="block mb-3">
                <span className="text-sm font-medium">Title</span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border rounded p-2" required />
              </label>

              <label className="block mb-3">
                <span className="text-sm font-medium">Text</span>
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-1 block w-full border rounded p-2 h-28" required />
              </label>

              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <label className="block">
                  <span className="text-sm font-medium">Upload Video (replace)</span>
                  <input ref={videoFileRef} type="file" accept="video/*" className="mt-1" />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">Or Video URL</span>
                  <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="mt-1 block w-full border rounded p-2" placeholder="https://..." />
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={closeEdit} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-primary text-white">
                  {submitting ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
