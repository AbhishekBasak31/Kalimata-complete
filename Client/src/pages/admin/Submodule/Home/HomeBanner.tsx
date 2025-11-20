// src/pages/HomeBannerDetails.tsx
import React, { useEffect, useState, useRef } from "react";
import { homeBannerApi } from "../../../../Backend"; // adjust path to your Backend export
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";

type Banner = {
  _id: string;
  Vedios1?: string;
  Vedios2?: string;
  Vedios3?: string;
  Htext?: string;
  Bp1?: string;
  Bp2?: string;
  Bp3?: string;
  createdAt?: string;
};

export default function HomeBannerDetails() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // edit modal
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    Htext: "",
    Bp1: "",
    Bp2: "",
    Bp3: "",
  });
  const v1Ref = useRef<HTMLInputElement | null>(null);
  const v2Ref = useRef<HTMLInputElement | null>(null);
  const v3Ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    setLoading(true);
    setError(null);
    try {
      // try latest endpoint first
      let res;
      try {
        res = await homeBannerApi.getLatest();
        const data = res?.data?.data ?? res?.data;
        setBanner(data ?? null);
      } catch {
        // fallback to getAll
        res = await homeBannerApi.getAll();
        const arr = res?.data?.data ?? res?.data ?? [];
        if (Array.isArray(arr) && arr.length) setBanner(arr[0]);
        else setBanner(null);
      }
    } catch (err: any) {
      console.error("fetch banner error", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load banner");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = () => {
    setForm({
      Htext: banner?.Htext ?? "",
      Bp1: banner?.Bp1 ?? "",
      Bp2: banner?.Bp2 ?? "",
      Bp3: banner?.Bp3 ?? "",
    });
    if (v1Ref.current) v1Ref.current.value = "";
    if (v2Ref.current) v2Ref.current.value = "";
    if (v3Ref.current) v3Ref.current.value = "";
    setOpen(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!banner?._id) {
      alert("No banner to update");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("Htext", form.Htext);
      fd.append("Bp1", form.Bp1);
      fd.append("Bp2", form.Bp2);
      fd.append("Bp3", form.Bp3);

      const f1 = v1Ref.current?.files?.[0];
      const f2 = v2Ref.current?.files?.[0];
      const f3 = v3Ref.current?.files?.[0];
      if (f1) fd.append("Vedios1", f1);
      if (f2) fd.append("Vedios2", f2);
      if (f3) fd.append("Vedios3", f3);

      await homeBannerApi.update(banner._id, fd);
      setOpen(false);
      await fetchBanner();
    } catch (err: any) {
      console.error("update banner error", err);
      alert(err?.response?.data?.message ?? err?.message ?? "Update failed");
    }
  };

  if (loading) return <div className="py-12 text-center">Loading banner...</div>;
  if (error) return <div className="py-12 text-center text-red-600">Error: {error}</div>;
  if (!banner) return <div className="py-12 text-center text-gray-600">No banner found.</div>;

  return (
    <section className="mt-20 container mx-auto px-6 py-12 text-black">
      <div className="grid gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Home Banner</h1>
          <Button onClick={openEdit} className="bg-primary text-white">Edit Banner</Button>
        </div>

        {/* Htext */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-2">{banner.Htext}</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>{banner.Bp1}</li>
            <li>{banner.Bp2}</li>
            <li>{banner.Bp3}</li>
          </ul>
        </div>

        {/* Videos grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[banner.Vedios1, banner.Vedios2, banner.Vedios3].map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md"
            >
              {src ? (
                <video controls className="w-full h-64 object-cover">
                  <source src={src} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-500">No video</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className="max-w-2xl p-0 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 bg-white">
            <h3 className="text-xl font-semibold mb-4">Edit Home Banner</h3>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <label className="block mb-3">
                <span className="text-sm font-medium">Heading</span>
                <input value={form.Htext} onChange={(e) => setForm({ ...form, Htext: e.target.value })} className="w-full border p-2 rounded mt-1" />
              </label>

              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <label className="block">
                  <span className="text-sm font-medium">Bullet 1</span>
                  <input value={form.Bp1} onChange={(e) => setForm({ ...form, Bp1: e.target.value })} className="w-full border p-2 rounded mt-1" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Bullet 2</span>
                  <input value={form.Bp2} onChange={(e) => setForm({ ...form, Bp2: e.target.value })} className="w-full border p-2 rounded mt-1" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Bullet 3</span>
                  <input value={form.Bp3} onChange={(e) => setForm({ ...form, Bp3: e.target.value })} className="w-full border p-2 rounded mt-1" />
                </label>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <label className="block">
                  <span className="text-sm font-medium">Replace Video 1 (optional)</span>
                  <input ref={v1Ref} type="file" accept="video/*" className="mt-1" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Replace Video 2 (optional)</span>
                  <input ref={v2Ref} type="file" accept="video/*" className="mt-1" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Replace Video 3 (optional)</span>
                  <input ref={v3Ref} type="file" accept="video/*" className="mt-1" />
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
