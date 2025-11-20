// src/pages/CSRDetails.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import { csrApi } from "../../../../Backend"; // adjust importer path to your project layout
import { Button } from "@/components/ui/button"; // optional, fallback to native button if not present

type CSRType = {
  _id: string;
  Img?: string;
  Htext?: string;
  Dtext?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function CSRDetails() {
  const [items, setItems] = useState<CSRType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // create/edit form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editing, setEditing] = useState<CSRType | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<{ Htext: string; Dtext: string; ImgFile?: File | null; ImgUrl?: string }>({
    Htext: "",
    Dtext: "",
    ImgFile: null,
    ImgUrl: "",
  });

  // fetch list
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await csrApi.getAll();
      const data = res?.data?.data ?? res?.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("fetch CSR:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load CSR items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // handle input changes
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files.length ? e.target.files[0] : null;
    setForm((s) => ({ ...s, ImgFile: f }));
  };

  // open create form
  const openCreate = () => {
    setEditing(null);
    setForm({ Htext: "", Dtext: "", ImgFile: null, ImgUrl: "" });
    setShowForm(true);
  };

  // open edit form
  const openEdit = (item: CSRType) => {
    setEditing(item);
    setForm({ Htext: item.Htext ?? "", Dtext: item.Dtext ?? "", ImgFile: null, ImgUrl: item.Img ?? "" });
    setShowForm(true);
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("Htext", form.Htext);
    fd.append("Dtext", form.Dtext);
    if (form.ImgFile) fd.append("Img", form.ImgFile);
    else if (form.ImgUrl) fd.append("Img", form.ImgUrl);
    return fd;
  };

  // create or update
  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!form.Htext.trim() || !form.Dtext.trim()) {
        setError("Htext and Dtext are required.");
        setIsSubmitting(false);
        return;
      }

      const fd = buildFormData();

      if (editing) {
        await csrApi.update(editing._id, fd);
      } else {
        await csrApi.create(fd);
      }

      await fetchItems();
      setShowForm(false);
    } catch (err: any) {
      console.error("submit CSR:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Submit failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete
  const remove = async (id: string) => {
    const ok = window.confirm("Delete this CSR entry? This cannot be undone.");
    if (!ok) return;
    try {
      setIsSubmitting(true);
      await csrApi.delete(id);
      await fetchItems();
    } catch (err: any) {
      console.error("delete csr:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Delete failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-32 container mx-auto px-6 py-10 text-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">CSR Management</h1>
        <div className="flex gap-3">
          <button onClick={fetchItems} className="px-4 py-2 border rounded-md text-sm">Refresh</button>
          <button onClick={openCreate} className="px-4 py-2 bg-primary text-white rounded-md text-sm">Create CSR</button>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center">Loading CSR items…</div>
      ) : error ? (
        <div className="py-4 text-red-600">Error: {error}</div>
      ) : items.length === 0 ? (
        <div className="py-8 text-gray-600">No CSR items found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              {it.Img ? (
                <img src={it.Img} alt={it.Htext} className="w-full h-44 object-cover rounded-md mb-3" />
              ) : (
                <div className="w-full h-44 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400">No Image</div>
              )}
              <h3 className="font-semibold text-lg mb-1">{it.Htext}</h3>
              <p className="text-sm text-gray-700 mb-3">{it.Dtext}</p>
              <div className="mt-auto flex gap-2">
                <button onClick={() => openEdit(it)} className="px-3 py-1 border rounded text-sm">Edit</button>
                <button onClick={() => remove(it._id)} className="px-3 py-1 bg-red-500 text-white rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal/section */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40">
          <form onSubmit={submit} className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{editing ? "Edit CSR" : "Create CSR"}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-600">Close</button>
            </div>

            <div className="grid gap-3">
              <label className="text-sm">Heading (Htext)</label>
              <input name="Htext" value={form.Htext} onChange={onChange} className="border rounded p-2" />

              <label className="text-sm">Description (Dtext)</label>
              <textarea name="Dtext" value={form.Dtext} onChange={onChange} rows={4} className="border rounded p-2" />

              <label className="text-sm">Image (upload file)</label>
              <input type="file" accept="image/*" onChange={onFileChange} />

              <div className="text-xs text-gray-500">Or provide direct image URL</div>
              <input name="ImgUrl" value={form.ImgUrl} onChange={(e) => setForm(s => ({ ...s, ImgUrl: e.target.value }))} className="border rounded p-2" />

              {/* preview */}
              {/* <div className="mt-2">
                <div className="text-xs text-gray-600 mb-1">Preview</div>
                {form.ImgFile ? (
                  <img src={URL.createObjectURL(form.ImgFile)} alt="preview" className="w-full h-44 object-cover rounded-md" />
                ) : form.ImgUrl ? (
                  <img src={form.ImgUrl} alt="preview" className="w-full h-44 object-cover rounded-md" />
                ) : editing?.Img ? (
                  <img src={editing.Img} alt="preview" className="w-full h-44 object-cover rounded-md" />
                ) : (
                  <div className="w-full h-44 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">No preview</div>
                )}
              </div> */}

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <div className="flex items-center gap-3 mt-4">
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded">
                  {isSubmitting ? (editing ? "Updating..." : "Creating...") : (editing ? "Update" : "Create")}
                </button>
                <button type="button" onClick={() => { setShowForm(false); }} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
