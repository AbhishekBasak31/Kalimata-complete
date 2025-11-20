// src/pages/Admin/Subcatagory/SubcatagoryDetails.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import { buildFormData } from "../../../../Backend";
import { subcatApi, catagoryApi } from "../../../../Backend"; // ensure these are exported from src/lib/api.ts
import type { AxiosResponse } from "axios";

type CatagoryDoc = {
  _id: string;
  Name: string;
};

type SubcatDoc = {
  _id: string;
  Name: string;
  Dtext: string;
  Img?: string;
  KeyP1?: string;
  KeyP2?: string;
  Catagory?: CatagoryDoc | string;
  createdAt?: string;
  updatedAt?: string;
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
  Catagory: "",
  ImgFile: undefined as File | undefined,
  ImgPreview: "",
};

const SubcatagoryDetails: React.FC = () => {
  const [list, setList] = useState<SubcatDoc[]>([]);
  const [categories, setCategories] = useState<CatagoryDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal/form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({ ...emptyForm }));
  const [editingId, setEditingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  // fetch list and categories
  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: AxiosResponse<any> = await subcatApi.getAll();
      const items: SubcatDoc[] = res.data?.data ?? res.data ?? [];
      setList(items);
    } catch (err: any) {
      console.error("fetch subcats error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res: AxiosResponse<any> = await catagoryApi.getAll();
      const items: CatagoryDoc[] = res.data?.data ?? res.data ?? [];
      setCategories(items);
    } catch (err: any) {
      console.error("fetch categories error:", err);
    }
  };

  useEffect(() => {
    fetchList();
    fetchCategories();
  }, []);

  // open create modal
  const openCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setIsModalOpen(true);
  };

  // open edit modal (seed values)
  const openEdit = (s: SubcatDoc) => {
    setIsEditing(true);
    setEditingId(s._id);
    setForm({
      Name: s.Name ?? "",
      Dtext: s.Dtext ?? "",
      KeyP1: s.KeyP1 ?? "",
      KeyP2: s.KeyP2 ?? "",
      Catagory: typeof s.Catagory === "object" ? (s.Catagory as CatagoryDoc)._id : (s.Catagory as string) ?? "",
      ImgFile: undefined,
      ImgPreview: s.Img ?? "",
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

  // validations match controller: create requires Name, Dtext and Img file; cat optional but if provided must be ID
  const validateCreate = () => {
    if (!form.Name.trim()) { setError("Name is required"); return false; }
    if (!form.Dtext.trim()) { setError("Dtext is required"); return false; }
    if (!form.ImgFile && !form.ImgPreview) { setError("Image is required"); return false; }
    return true;
  };

  const validateUpdate = () => {
    // partial updates allowed; provided fields must be non-empty
    if (form.Name !== undefined && String(form.Name).trim().length === 0) { setError("Name cannot be empty"); return false; }
    if (form.Dtext !== undefined && String(form.Dtext).trim().length === 0) { setError("Dtext cannot be empty"); return false; }
    return true;
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!validateCreate()) return;
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        Name: form.Name,
        Dtext: form.Dtext,
        KeyP1: form.KeyP1,
        KeyP2: form.KeyP2,
        Catagory: form.Catagory || undefined,
        Img: form.ImgFile,
      };
      const fd = buildFormData(payload);
      await subcatApi.create(fd);
      setToast({ msg: "Subcategory created", type: "success" });
      closeModal();
      await fetchList();
    } catch (err: any) {
      console.error("create subcat error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Create failed");
      setToast({ msg: error ?? "Create failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingId) { setError("No subcategory selected"); return; }
    setError(null);
    if (!validateUpdate()) return;
    setSaving(true);
    try {
      const payload: Record<string, any> = {};
      if (form.Name.trim()) payload.Name = form.Name;
      if (form.Dtext.trim()) payload.Dtext = form.Dtext;
      if (form.KeyP1.trim()) payload.KeyP1 = form.KeyP1;
      if (form.KeyP2.trim()) payload.KeyP2 = form.KeyP2;
      if (form.Catagory) payload.Catagory = form.Catagory;
      if (form.ImgFile) payload.Img = form.ImgFile;

      const fd = buildFormData(payload);
      await subcatApi.update(editingId, fd);
      setToast({ msg: "Subcategory updated", type: "success" });
      closeModal();
      await fetchList();
    } catch (err: any) {
      console.error("update subcat error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Update failed");
      setToast({ msg: error ?? "Update failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subcategory and its products?")) return;
    try {
      await subcatApi.delete(id);
      setToast({ msg: "Subcategory deleted", type: "success" });
      await fetchList();
    } catch (err: any) {
      console.error("delete subcat error:", err);
      setToast({ msg: err?.response?.data?.message ?? err?.message ?? "Delete failed", type: "error" });
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="mt-32 p-6 max-w-6xl mx-auto text-black">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Subcategories</h2>
          <p className="text-sm text-gray-500">Manage subcategories (create/edit/delete)</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { fetchList(); fetchCategories(); }} className="px-3 py-2 bg-green-50 text-green-800 rounded">Refresh</button>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create Subcategory</button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : list.length === 0 ? (
        <div className="text-gray-500">No subcategories yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((s) => (
            <div key={s._id} className="bg-white shadow rounded p-4 flex flex-col">
              <div className="h-40 w-full mb-3 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {s.Img ? <img src={s.Img} alt={s.Name} className="object-cover h-full w-full" /> : <div className="text-gray-400">No image</div>}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-lg">{s.Name}</div>
                <div className="text-sm text-gray-600 mt-1">{s.Dtext}</div>
                <div className="text-xs text-gray-400 mt-2">Category: {typeof s.Catagory === "object" ? (s.Catagory as CatagoryDoc).Name : s.Catagory ?? "—"}</div>
                <div className="text-xs text-gray-400 mt-1">Added: {s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"}</div>

                <div className="mt-3 text-sm text-gray-700">
                  {s.KeyP1 && <div>• {s.KeyP1}</div>}
                  {s.KeyP2 && <div>• {s.KeyP2}</div>}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button onClick={() => openEdit(s)} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">Edit</button>
                <button onClick={() => handleDelete(s._id)} className="px-3 py-1 bg-red-100 text-red-800 rounded">Delete</button>
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
                <h3 className="text-lg font-semibold">{isEditing ? "Edit Subcategory" : "Create Subcategory"}</h3>
                <p className="text-xs text-gray-500">{isEditing ? "Partial update allowed. Image optional." : "Name, Dtext and image required."}</p>
              </div>
              <div>
                <button onClick={closeModal} className="px-3 py-1 bg-red-100 text-red-700 rounded">Close</button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); isEditing ? handleUpdate() : handleCreate(); }}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input value={form.Name} onChange={(e) => setForm((s) => ({ ...s, Name: e.target.value }))} className="w-full border rounded px-3 py-2" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dtext</label>
                  <textarea value={form.Dtext} onChange={(e) => setForm((s) => ({ ...s, Dtext: e.target.value }))} className="w-full border rounded px-3 py-2" rows={3} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={form.KeyP1} onChange={(e) => setForm((s) => ({ ...s, KeyP1: e.target.value }))} className="border rounded px-3 py-2" placeholder="KeyP1" />
                  <input value={form.KeyP2} onChange={(e) => setForm((s) => ({ ...s, KeyP2: e.target.value }))} className="border rounded px-3 py-2" placeholder="KeyP2" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category (optional)</label>
                  <select value={form.Catagory} onChange={(e) => setForm((s) => ({ ...s, Catagory: e.target.value }))} className="w-full border rounded px-3 py-2">
                    <option value="">-- none --</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.Name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image {isEditing ? "(optional)" : "(required)"}</label>
                  <input type="file" accept="image/*" onChange={handleFile} />
                  {form.ImgPreview && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Preview</div>
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

export default SubcatagoryDetails;
