// src/pages/Admin/Product/ProductDetails.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import { buildFormData } from "../../../../Backend";
import { productApi, catagoryApi, subcatApi } from "../../../../Backend";
import type { AxiosResponse } from "axios";

type CatDoc = { _id: string; Name: string };
type SubcatDoc = { _id: string; Name: string; Catagory?: string | CatDoc };

type ProductDoc = {
  _id: string;
  Name: string;
  Dtext: string;
  Img1?: string;
  Img2?: string;
  Img3?: string;
  CatagoryId?: CatDoc | string;
  SubcatagoryId?: SubcatDoc | string;
  Cline1?: string; Cline2?: string; Cline3?: string; Cline4?: string; Cline5?: string; Cline6?: string;
  Tspec1?: string; Tspec2?: string; Tspec3?: string; Tspec4?: string; Tspec5?: string;
  Tspec6?: string; Tspec7?: string; Tspec8?: string; Tspec9?: string; Tspec10?: string;
  App1?: string; App2?: string; App3?: string; App4?: string; App5?: string; App6?: string;
  createdAt?: string;
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
  CatagoryId: "",
  SubcatagoryId: "",
  Img1File: undefined as File | undefined,
  Img2File: undefined as File | undefined,
  Img3File: undefined as File | undefined,
  Img1Preview: "",
  Img2Preview: "",
  Img3Preview: "",
  Cline1: "", Cline2: "", Cline3: "", Cline4: "", Cline5: "", Cline6: "",
  // Tspecs & Apps default to empty strings
  Tspecs: Array.from({ length: 10 }).map(() => ""),
  Apps: Array.from({ length: 6 }).map(() => ""),
};

const ProductDetails: React.FC = () => {
  const [list, setList] = useState<ProductDoc[]>([]);
  const [categories, setCategories] = useState<CatDoc[]>([]);
  const [subcats, setSubcats] = useState<SubcatDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [rawResponse, setRawResponse] = useState<any>(null);
  // modal/form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({ ...emptyForm }));
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  // fetch lists
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: AxiosResponse<any> = await productApi.getAll();
      setList(res.data?.data ?? res.data ?? []);
      const catRes: AxiosResponse<any> = await catagoryApi.getAll();
      setCategories(catRes.data?.data ?? []);
      const subRes: AxiosResponse<any> = await subcatApi.getAll();
      setSubcats(subRes.data?.data ?? []);
    } catch (err: any) {
      console.error("fetch products error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setIsModalOpen(true);
  };

  const openEdit = (p: ProductDoc) => {
    setIsEditing(true);
    setEditingId(p._id);
    setForm((prev) => ({
      ...prev,
      Name: p.Name ?? "",
      Dtext: p.Dtext ?? "",
      CatagoryId: typeof p.CatagoryId === "object" ? (p.CatagoryId as CatDoc)._id : (p.CatagoryId as string) ?? "",
      SubcatagoryId: typeof p.SubcatagoryId === "object" ? (p.SubcatagoryId as SubcatDoc)._id : (p.SubcatagoryId as string) ?? "",
      Img1Preview: p.Img1 ?? "",
      Img2Preview: p.Img2 ?? "",
      Img3Preview: p.Img3 ?? "",
      Cline1: p.Cline1 ?? "", Cline2: p.Cline2 ?? "", Cline3: p.Cline3 ?? "", Cline4: p.Cline4 ?? "", Cline5: p.Cline5 ?? "", Cline6: p.Cline6 ?? "",
      Tspecs: [
        p.Tspec1 ?? "", p.Tspec2 ?? "", p.Tspec3 ?? "", p.Tspec4 ?? "", p.Tspec5 ?? "",
        p.Tspec6 ?? "", p.Tspec7 ?? "", p.Tspec8 ?? "", p.Tspec9 ?? "", p.Tspec10 ?? ""
      ],
      Apps: [
        p.App1 ?? "", p.App2 ?? "", p.App3 ?? "", p.App4 ?? "", p.App5 ?? "", p.App6 ?? ""
      ],
      Img1File: undefined, Img2File: undefined, Img3File: undefined,
    }));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ ...emptyForm });
    setEditingId(null);
    setIsEditing(false);
    setError(null);
  };

  // file handlers
  const handleFile = (which: 1 | 2 | 3) => (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      if (which === 1) setForm((s) => ({ ...s, Img1File: undefined, Img1Preview: "" }));
      if (which === 2) setForm((s) => ({ ...s, Img2File: undefined, Img2Preview: "" }));
      if (which === 3) setForm((s) => ({ ...s, Img3File: undefined, Img3Preview: "" }));
      return;
    }
    const preview = URL.createObjectURL(f);
    if (which === 1) setForm((s) => ({ ...s, Img1File: f, Img1Preview: preview }));
    if (which === 2) setForm((s) => ({ ...s, Img2File: f, Img2Preview: preview }));
    if (which === 3) setForm((s) => ({ ...s, Img3File: f, Img3Preview: preview }));
  };

  // validations follow controller: create requires many fields + 3 images
  const validateCreate = () => {
    if (!form.Name.trim()) { setError("Name is required"); return false; }
    if (!form.Dtext.trim()) { setError("Dtext is required"); return false; }
    // Required clines
    for (let i = 1; i <= 6; i++) {
      if (!String((form as any)[`Cline${i}`]).trim()) { setError(`Cline${i} is required`); return false; }
    }
    // Tspecs
    for (let i = 0; i < 10; i++) {
      if (!String(form.Tspecs[i]).trim()) { setError(`Tspec${i + 1} is required`); return false; }
    }
    // Apps
    for (let i = 0; i < 6; i++) {
      if (!String(form.Apps[i]).trim()) { setError(`App${i + 1} is required`); return false; }
    }
    // images required for create
    if (!form.Img1File && !form.Img1Preview) { setError("Img1 is required"); return false; }
    if (!form.Img2File && !form.Img2Preview) { setError("Img2 is required"); return false; }
    if (!form.Img3File && !form.Img3Preview) { setError("Img3 is required"); return false; }
    return true;
  };

  const validateUpdate = () => {
    // partial update allowed; if provided and empty -> invalid
    if (form.Name !== undefined && String(form.Name).trim().length === 0) { setError("Name cannot be empty"); return false; }
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
        CatagoryId: form.CatagoryId || undefined,
        SubcatagoryId: form.SubcatagoryId || undefined,
        Cline1: form.Cline1, Cline2: form.Cline2, Cline3: form.Cline3, Cline4: form.Cline4, Cline5: form.Cline5, Cline6: form.Cline6,
        // Tspecs & Apps
      };
      for (let i = 0; i < 10; i++) payload[`Tspec${i + 1}`] = form.Tspecs[i];
      for (let i = 0; i < 6; i++) payload[`App${i + 1}`] = form.Apps[i];
      payload.Img1 = form.Img1File;
      payload.Img2 = form.Img2File;
      payload.Img3 = form.Img3File;

      const fd = buildFormData(payload);
      await productApi.create(fd);
      setToast({ msg: "Product created", type: "success" });
      closeModal();
      await fetchAll();
    } catch (err: any) {
      console.error("create product error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Create failed");
      setToast({ msg: error ?? "Create failed", type: "error" });
    } finally { setSaving(false); }
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingId) { setError("No product selected"); return; }
    setError(null);
    if (!validateUpdate()) return;
    setSaving(true);
    try {
      const payload: Record<string, any> = {};
      if (String(form.Name).trim()) payload.Name = form.Name;
      if (String(form.Dtext).trim()) payload.Dtext = form.Dtext;
      if (form.CatagoryId) payload.CatagoryId = form.CatagoryId;
      if (form.SubcatagoryId) payload.SubcatagoryId = form.SubcatagoryId;
      for (let i = 1; i <= 6; i++) {
        const k = `Cline${i}`;
        if (String((form as any)[k]).trim()) payload[k] = (form as any)[k];
      }
      for (let i = 0; i < 10; i++) payload[`Tspec${i+1}`] = form.Tspecs[i];
      for (let i = 0; i < 6; i++) payload[`App${i+1}`] = form.Apps[i];
      if (form.Img1File) payload.Img1 = form.Img1File;
      if (form.Img2File) payload.Img2 = form.Img2File;
      if (form.Img3File) payload.Img3 = form.Img3File;

      const fd = buildFormData(payload);
      await productApi.update(editingId, fd);
      setToast({ msg: "Product updated", type: "success" });
      closeModal();
      await fetchAll();
    } catch (err: any) {
      console.error("update product error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Update failed");
      setToast({ msg: error ?? "Update failed", type: "error" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productApi.delete(id);
      setToast({ msg: "Product deleted", type: "success" });
      await fetchAll();
    } catch (err: any) {
      console.error("delete product error:", err);
      setToast({ msg: err?.response?.data?.message ?? err?.message ?? "Delete failed", type: "error" });
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="mt-32 p-6 max-w-7xl mx-auto text-black">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-sm text-gray-500">Manage products (create / edit / delete)</p>
        </div>

        <div className="flex gap-2">
          <button onClick={fetchAll} className="px-3 py-2 bg-green-50 text-green-800 rounded">Refresh</button>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create Product</button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : list.length === 0 ? (
        <div className="text-gray-500">No products yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p) => (
            <div key={p._id} className="bg-white shadow rounded p-4 flex flex-col">
              <div className="h-44 w-full mb-3 bg-gray-100 rounded overflow-hidden grid grid-cols-3 gap-1">
                <img src={p.Img1} alt={p.Name} className="object-cover w-full h-full" />
                <img src={p.Img2} alt={p.Name} className="object-cover w-full h-full" />
                <img src={p.Img3} alt={p.Name} className="object-cover w-full h-full" />
              </div>

              <div className="flex-1">
                <div className="font-semibold text-lg">{p.Name}</div>
                <div className="text-sm text-gray-600 mt-1">{p.Dtext}</div>
                <div className="text-xs text-gray-400 mt-2">Category: {typeof p.CatagoryId === "object" ? (p.CatagoryId as CatDoc).Name : p.CatagoryId ?? "—"}</div>
                <div className="text-xs text-gray-400 mt-1">Subcategory: {typeof p.SubcatagoryId === "object" ? (p.SubcatagoryId as SubcatDoc).Name : p.SubcatagoryId ?? "—"}</div>
                <div className="text-xs text-gray-400 mt-1">Added: {p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}</div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button onClick={() => openEdit(p)} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-100 text-red-800 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal} aria-hidden />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{isEditing ? "Edit Product" : "Create Product"}</h3>
                <p className="text-xs text-gray-500">{isEditing ? "Partial update allowed. Images optional." : "All Cline/Tspec/App fields + 3 images required."}</p>
              </div>
              <div>
                <button onClick={closeModal} className="px-3 py-1 bg-red-100 text-red-700 rounded">Close</button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); isEditing ? handleUpdate() : handleCreate(); }}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input value={form.Name} onChange={(e) => setForm((s) => ({ ...s, Name: e.target.value }))} className="w-full border rounded px-3 py-2" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short description</label>
                    <input value={form.Dtext} onChange={(e) => setForm((s) => ({ ...s, Dtext: e.target.value }))} className="w-full border rounded px-3 py-2" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={form.CatagoryId} onChange={(e) => setForm((s) => ({ ...s, CatagoryId: e.target.value }))} className="w-full border rounded px-3 py-2">
                      <option value="">-- none --</option>
                      {categories.map((c) => <option key={c._id} value={c._id}>{c.Name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                    <select value={form.SubcatagoryId} onChange={(e) => setForm((s) => ({ ...s, SubcatagoryId: e.target.value }))} className="w-full border rounded px-3 py-2">
                      <option value="">-- none --</option>
                      {subcats.map((s) => <option key={s._id} value={s._id}>{s.Name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Cline inputs */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Cline (6)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[1,2,3,4,5,6].map(i => (
                      <input key={i} value={(form as any)[`Cline${i}`]} onChange={(e) => setForm((s) => ({ ...s, [`Cline${i}`]: e.target.value }))} className="border rounded px-3 py-2" placeholder={`Cline${i}`} required={!isEditing} />
                    ))}
                  </div>
                </div>

                {/* Tspecs */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Technical Specs (10)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {form.Tspecs.map((t, idx) => (
                      <input key={idx} value={t} onChange={(e) => setForm((s) => ({ ...s, Tspecs: s.Tspecs.map((x,i) => i === idx ? e.target.value : x) }))} className="border rounded px-3 py-2" placeholder={`Tspec${idx+1}`} required={!isEditing} />
                    ))}
                  </div>
                </div>

                {/* Apps */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Applications (6)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {form.Apps.map((a, idx) => (
                      <input key={idx} value={a} onChange={(e) => setForm((s) => ({ ...s, Apps: s.Apps.map((x,i) => i === idx ? e.target.value : x) }))} className="border rounded px-3 py-2" placeholder={`App${idx+1}`} required={!isEditing} />
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Images (Img1, Img2, Img3) {isEditing ? "(optional)" : "(required)"}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input type="file" accept="image/*" onChange={handleFile(1)} />
                      {form.Img1Preview && <img src={form.Img1Preview} alt="img1" className="h-28 object-cover rounded mt-2" />}
                    </div>
                    <div>
                      <input type="file" accept="image/*" onChange={handleFile(2)} />
                      {form.Img2Preview && <img src={form.Img2Preview} alt="img2" className="h-28 object-cover rounded mt-2" />}
                    </div>
                    <div>
                      <input type="file" accept="image/*" onChange={handleFile(3)} />
                      {form.Img3Preview && <img src={form.Img3Preview} alt="img3" className="h-28 object-cover rounded mt-2" />}
                    </div>
                  </div>
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

export default ProductDetails;
