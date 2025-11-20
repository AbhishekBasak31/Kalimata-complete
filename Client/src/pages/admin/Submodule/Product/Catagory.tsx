// src/pages/Admin/Catagory/CatagoryDetails.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import { catagoryApi } from "../../../../Backend"; // adjust path to your Backend export
import { buildFormData } from "../../../../Backend"; // your helper
import type { ApiResponse } from "../../../../Backend";
import type { AxiosResponse } from "axios";

type CatagoryDoc = {
  _id: string;
  Name: string;
  Dtext: string;
  Img?: string;
  KeyP1?: string;
  KeyP2?: string;
  KeyP3?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

const Toast: React.FC<{ msg: string; type?: "success" | "error"; onClose?: () => void }> = ({ msg, type = "success", onClose }) => {
  const bg = type === "success" ? "bg-green-600" : "bg-red-600";
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${bg} text-white px-4 py-2 rounded shadow`}>
      <div className="flex items-center gap-3">
        <div className="text-sm">{msg}</div>
        <button onClick={onClose} className="opacity-90 hover:opacity-100">✕</button>
      </div>
    </div>
  );
};

const emptyForm = {
  Name: "",
  Dtext: "",
  KeyP1: "",
  KeyP2: "",
  KeyP3: "",
  ImgFile: undefined as File | undefined,
  ImgPreview: "",
};

const CatagoryDetails: React.FC = () => {
  const [list, setList] = useState<CatagoryDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal/form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({ ...emptyForm }));
  const [editingId, setEditingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  // fetch
  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: AxiosResponse<any> = await catagoryApi.getAll();
      // backend returns { success: true, data: [...] }
      const items: CatagoryDoc[] = res.data?.data ?? res.data ?? [];
      setList(items);
    } catch (err: any) {
      console.error("fetch categories error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const openCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEdit = (c: CatagoryDoc) => {
    setIsEditing(true);
    setEditingId(c._id);
    setForm({
      Name: c.Name ?? "",
      Dtext: c.Dtext ?? "",
      KeyP1: c.KeyP1 ?? "",
      KeyP2: c.KeyP2 ?? "",
      KeyP3: c.KeyP3 ?? "",
      ImgFile: undefined,
      ImgPreview: c.Img ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ ...emptyForm });
    setEditingId(null);
    setIsEditing(false);
    setError(null);
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setForm((s) => ({ ...s, ImgFile: undefined, ImgPreview: "" }));
      return;
    }
    const preview = URL.createObjectURL(f);
    setForm((s) => ({ ...s, ImgFile: f, ImgPreview: preview }));
  };

  // validate per controller: create needs Name, Dtext, KeyP1, KeyP2, KeyP3 and Img file
  const validateCreate = () => {
    if (!form.Name.trim()) { setError("Name is required"); return false; }
    if (!form.Dtext.trim()) { setError("Dtext is required"); return false; }
    if (!form.KeyP1.trim()) { setError("KeyP1 is required"); return false; }
    if (!form.KeyP2.trim()) { setError("KeyP2 is required"); return false; }
    if (!form.KeyP3.trim()) { setError("KeyP3 is required"); return false; }
    if (!form.ImgFile && !form.ImgPreview) { setError("Image file is required"); return false; }
    return true;
  };

  const validateUpdate = () => {
    // Update allows partial fields; but if provided, they must be non-empty
    if (form.Name !== undefined && String(form.Name).trim().length === 0) { setError("Name cannot be empty"); return false; }
    if (form.Dtext !== undefined && String(form.Dtext).trim().length === 0) { setError("Dtext cannot be empty"); return false; }
    // KeyPs if present must be non-empty - but our UI always shows them; it's fine.
    return true;
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!validateCreate()) return;
    setSaving(true);
    try {
      const payload = {
        Name: form.Name,
        Dtext: form.Dtext,
        KeyP1: form.KeyP1,
        KeyP2: form.KeyP2,
        KeyP3: form.KeyP3,
      };
      const fd = buildFormData({ ...payload, Img: form.ImgFile });
      const res: AxiosResponse<any> = await catagoryApi.create(fd);
      setToast({ msg: "Category created", type: "success" });
      closeModal();
      await fetchList();
    } catch (err: any) {
      console.error("create category error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Create failed");
      setToast({ msg: error ?? "Create failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingId) { setError("No category selected"); return; }
    setError(null);
    if (!validateUpdate()) return;
    setSaving(true);
    try {
      // build form data — include only provided fields
      const payload: Record<string, any> = {};
      if (form.Name.trim()) payload.Name = form.Name;
      if (form.Dtext.trim()) payload.Dtext = form.Dtext;
      if (form.KeyP1.trim()) payload.KeyP1 = form.KeyP1;
      if (form.KeyP2.trim()) payload.KeyP2 = form.KeyP2;
      if (form.KeyP3.trim()) payload.KeyP3 = form.KeyP3;
      if (form.ImgFile) payload.Img = form.ImgFile;

      const fd = buildFormData(payload);
      const res: AxiosResponse<any> = await catagoryApi.update(editingId, fd);
      setToast({ msg: "Category updated", type: "success" });
      closeModal();
      await fetchList();
    } catch (err: any) {
      console.error("update category error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Update failed");
      setToast({ msg: error ?? "Update failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category and its subcats & products?")) return;
    try {
      await catagoryApi.delete(id);
      setToast({ msg: "Category deleted", type: "success" });
      await fetchList();
    } catch (err: any) {
      console.error("delete category error:", err);
      setToast({ msg: err?.response?.data?.message ?? err?.message ?? "Delete failed", type: "error" });
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="mt-32 p-6 max-w-6xl mx-auto  text-black">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Categories</h2>
          <p className="text-sm text-gray-500">Manage categories (create/edit/delete)</p>
        </div>

        <div className="flex gap-2">
          <button onClick={fetchList} className="px-3 py-2 bg-green-50 text-green-800 rounded">Refresh</button>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create Category</button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : list.length === 0 ? (
        <div className="text-gray-500">No categories yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((c) => (
            <div key={c._id} className="bg-white shadow rounded p-4 flex flex-col">
              <div className="h-40 w-full mb-3 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {c.Img ? (
                  <img src={c.Img} alt={c.Name} className="object-cover h-full w-full" />
                ) : (
                  <div className="text-gray-400">No image</div>
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-lg">{c.Name}</div>
                <div className="text-sm text-gray-600 mt-1">{c.Dtext}</div>
                <div className="text-xs text-gray-400 mt-2">Added: {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}</div>
                <div className="mt-3 text-sm text-gray-700">
                  {c.KeyP1 && <div>• {c.KeyP1}</div>}
                  {c.KeyP2 && <div>• {c.KeyP2}</div>}
                  {c.KeyP3 && <div>• {c.KeyP3}</div>}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button onClick={() => openEdit(c)} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">Edit</button>
                <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-100 text-red-800 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{isEditing ? "Edit Category" : "Create Category"}</h3>
                <p className="text-xs text-gray-500">{isEditing ? "Partial update allowed. Image optional." : "Name, Dtext, KeyP1..3 and image required."}</p>
              </div>
              <div>
                <button onClick={closeModal} className="px-3 py-1 bg-red-100 text-red-700 rounded">Close</button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); isEditing ? handleUpdate() : handleCreate(); }}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input value={form.Name} onChange={(e) => setForm((s) => ({ ...s, Name: e.target.value }))} className="w-full border rounded px-3 py-2 text-black" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dtext</label>
                  <textarea value={form.Dtext} onChange={(e) => setForm((s) => ({ ...s, Dtext: e.target.value }))} className="w-full border rounded px-3 py-2  text-black" rows={3} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input value={form.KeyP1} onChange={(e) => setForm((s) => ({ ...s, KeyP1: e.target.value }))} className="border rounded px-3 py-2  text-black" placeholder="KeyP1" required />
                  <input value={form.KeyP2} onChange={(e) => setForm((s) => ({ ...s, KeyP2: e.target.value }))} className="border rounded px-3 py-2  text-black" placeholder="KeyP2" required />
                  <input value={form.KeyP3} onChange={(e) => setForm((s) => ({ ...s, KeyP3: e.target.value }))} className="border rounded px-3 py-2  text-black" placeholder="KeyP3" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image {isEditing ? "(optional)" : "(required)"}</label>
                  <input type="file" accept="image/*" onChange={handleFile} />
                  {form.ImgPreview && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1 ">Preview</div>
                      <img src={form.ImgPreview} alt="preview" className="h-28 object-cover rounded" />
                    </div>
                  )}
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">
                  {saving ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save changes" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatagoryDetails;
