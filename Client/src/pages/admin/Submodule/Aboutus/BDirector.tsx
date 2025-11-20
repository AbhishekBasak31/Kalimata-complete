// src/pages/Admin/BDirector/BDirectorDetails.tsx
import React, { useEffect, useState } from "react";
import { bdirectorApi } from "../../../../Backend";
import type { ApiResponse } from "../../../../Backend";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type BDirectorDoc = {
  _id: string;
  Img1?: string;
  Name1?: string;
  Desig1?: string;
  Dtext1?: string;

  Img2?: string;
  Name2?: string;
  Desig2?: string;
  Dtext2?: string;

  Img3?: string;
  Name3?: string;
  Desig3?: string;
  Dtext3?: string;

  createdAt?: string;
  updatedAt?: string;
};

const Toast: React.FC<{ msg: string; type?: "success" | "error"; onClose?: () => void }> = ({
  msg,
  type = "success",
  onClose,
}) => {
  const bg = type === "success" ? "bg-green-600" : "bg-red-600";
  return (
    <div className={`fixed top-6 right-6 z-50 ${bg} text-white px-4 py-2 rounded shadow-lg`}>
      <div className="flex items-center gap-3">
        <div className="text-sm">{msg}</div>
        <button onClick={onClose} className="ml-2 text-sm opacity-90 hover:opacity-100">
          ✕
        </button>
      </div>
    </div>
  );
};

export default function BDirectorDetails(): JSX.Element {
  const navigate = useNavigate();
  const [items, setItems] = useState<BDirectorDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // modal/form state
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState<BDirectorDoc | null>(null);
  // form fields
  const [form, setForm] = useState({
    Name1: "",
    Desig1: "",
    Dtext1: "",
    Name2: "",
    Desig2: "",
    Dtext2: "",
    Name3: "",
    Desig3: "",
    Dtext3: "",
  });
  // file inputs
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);

  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchItems = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res: ApiResponse<any> = await bdirectorApi.getAll();
      const data = res.data?.data ?? res.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("fetch bdirector error:", err);
      setErrorMsg(err?.response?.data?.message ?? err?.message ?? "Failed to load BDirector");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setIsEditing(null);
    setForm({
      Name1: "",
      Desig1: "",
      Dtext1: "",
      Name2: "",
      Desig2: "",
      Dtext2: "",
      Name3: "",
      Desig3: "",
      Dtext3: "",
    });
    setFile1(null);
    setFile2(null);
    setFile3(null);
    setErrorMsg(null);
    setOpenModal(true);
  };

  const openEdit = (it: BDirectorDoc) => {
    setIsEditing(it);
    setForm({
      Name1: it.Name1 ?? "",
      Desig1: it.Desig1 ?? "",
      Dtext1: it.Dtext1 ?? "",
      Name2: it.Name2 ?? "",
      Desig2: it.Desig2 ?? "",
      Dtext2: it.Dtext2 ?? "",
      Name3: it.Name3 ?? "",
      Desig3: it.Desig3 ?? "",
      Dtext3: it.Dtext3 ?? "",
    });
    setFile1(null);
    setFile2(null);
    setFile3(null);
    setErrorMsg(null);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setIsEditing(null);
    setErrorMsg(null);
  };

  // build FormData helper
  const buildForm = (): FormData => {
    const fd = new FormData();
    // files (only append if present)
    if (file1) fd.append("Img1", file1);
    if (file2) fd.append("Img2", file2);
    if (file3) fd.append("Img3", file3);

    // fields
    Object.entries(form).forEach(([k, v]) => {
      if (typeof v !== "undefined" && v !== null) fd.append(k, String(v));
    });

    return fd;
  };

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg(null);

    // Basic require: at least Name1/Desig1 non-empty OR image1 present (adjust as per your server logic)
    if (!form.Name1.trim() && !file1) {
      setErrorMsg("At least Name1 or Img1 is required.");
      return;
    }

    try {
      const fd = buildForm();
      await bdirectorApi.create(fd);
      setToast({ msg: "Created BDirector entry", type: "success" });
      closeModal();
      await fetchItems();
    } catch (err: any) {
      console.error("create bdirector error:", err);
      setErrorMsg(err?.response?.data?.message ?? err?.message ?? "Create failed");
      setToast({ msg: "Create failed", type: "error" });
    }
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isEditing) return;
    setErrorMsg(null);

    try {
      const fd = buildForm();
      // If no files and no fields changed, you might want to avoid calling update; we still call update with provided fields
      await bdirectorApi.update(isEditing._id, fd);
      setToast({ msg: "Updated", type: "success" });
      closeModal();
      await fetchItems();
    } catch (err: any) {
      console.error("update bdirector error:", err);
      setErrorMsg(err?.response?.data?.message ?? err?.message ?? "Update failed");
      setToast({ msg: "Update failed", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this BDirector entry?")) return;
    try {
      await bdirectorApi.delete(id);
      setToast({ msg: "Deleted", type: "success" });
      await fetchItems();
    } catch (err: any) {
      console.error("delete bdirector error:", err);
      setToast({ msg: err?.response?.data?.message ?? "Delete failed", type: "error" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-20 text-black">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Board Directors</h1>
          <p className="text-sm text-gray-500">Manage board directors (images + names/designations/descriptions)</p>
        </div>

        <div className="flex gap-2">
          <button onClick={fetchItems} className="px-3 py-2 bg-gray-100 rounded">Refresh</button>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No BDirector entries found.</div>
        ) : (
          <div className="grid gap-4">
            {items.map((it) => (
              <div key={it._id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row gap-4 items-start">
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 rounded overflow-hidden bg-gray-100">
                    {it.Img1 ? <img src={it.Img1} alt={it.Name1} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-semibold">{it.Name1 ?? "—"}</div>
                    <div className="text-xs text-gray-400 mt-1">{it.Desig1 ?? ""}</div>
                    <div className="text-sm text-gray-700 mt-2">{it.Dtext1 ?? ""}</div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  {/* second director preview */}
                  <div className="w-24 h-24 rounded overflow-hidden bg-gray-100">
                    {it.Img2 ? <img src={it.Img2} alt={it.Name2} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-semibold">{it.Name2 ?? "—"}</div>
                    <div className="text-xs text-gray-400 mt-1">{it.Desig2 ?? ""}</div>
                    <div className="text-sm text-gray-700 mt-2">{it.Dtext2 ?? ""}</div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  {/* third director preview */}
                  <div className="w-24 h-24 rounded overflow-hidden bg-gray-100">
                    {it.Img3 ? <img src={it.Img3} alt={it.Name3} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Name</div>
                    <div className="font-semibold">{it.Name3 ?? "—"}</div>
                    <div className="text-xs text-gray-400 mt-1">{it.Desig3 ?? ""}</div>
                    <div className="text-sm text-gray-700 mt-2">{it.Dtext3 ?? ""}</div>
                  </div>
                </div>

                <div className="ml-auto flex gap-2">
                  <button onClick={() => openEdit(it)} className="p-2 bg-yellow-50 text-yellow-700 rounded" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(it._id)} className="p-2 bg-red-50 text-red-700 rounded" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{isEditing ? "Edit BDirectors" : "Create BDirectors"}</h3>
                <p className="text-xs text-gray-500">{isEditing ? "Update details" : "Add director block (3 entries)"}</p>
              </div>
              <div>
                <button onClick={closeModal} className="px-3 py-1 bg-red-100 text-red-700 rounded">Close</button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                isEditing ? handleUpdate() : handleCreate();
              }}
            >
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Director 1 */}
                <div className="grid md:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Img1</label>
                    <input type="file" accept="image/*" onChange={(e) => setFile1(e.target.files?.[0] ?? null)} />
                    {isEditing && isEditing.Img1 && !file1 && <img src={isEditing.Img1} alt="img1" className="w-28 h-20 object-cover mt-2 rounded" />}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name1</label>
                    <input value={form.Name1} onChange={(e) => setForm({ ...form, Name1: e.target.value })} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation1</label>
                    <input value={form.Desig1} onChange={(e) => setForm({ ...form, Desig1: e.target.value })} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dtext1</label>
                    <textarea value={form.Dtext1} onChange={(e) => setForm({ ...form, Dtext1: e.target.value })} className="w-full border rounded px-3 py-2" rows={2} />
                  </div>
                </div>

                {/* Director 2 */}
                <div className="grid md:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Img2</label>
                    <input type="file" accept="image/*" onChange={(e) => setFile2(e.target.files?.[0] ?? null)} />
                    {isEditing && isEditing.Img2 && !file2 && <img src={isEditing.Img2} alt="img2" className="w-28 h-20 object-cover mt-2 rounded" />}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name2</label>
                    <input value={form.Name2} onChange={(e) => setForm({ ...form, Name2: e.target.value })} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation2</label>
                    <input value={form.Desig2} onChange={(e) => setForm({ ...form, Desig2: e.target.value })} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dtext2</label>
                    <textarea value={form.Dtext2} onChange={(e) => setForm({ ...form, Dtext2: e.target.value })} className="w-full border rounded px-3 py-2" rows={2} />
                  </div>
                </div>

                {/* Director 3 */}
                <div className="grid md:grid-cols-3 gap-3 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Img3</label>
                    <input type="file" accept="image/*" onChange={(e) => setFile3(e.target.files?.[0] ?? null)} />
                    {isEditing && isEditing.Img3 && !file3 && <img src={isEditing.Img3} alt="img3" className="w-28 h-20 object-cover mt-2 rounded" />}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name3</label>
                    <input value={form.Name3} onChange={(e) => setForm({ ...form, Name3: e.target.value })} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation3</label>
                    <input value={form.Desig3} onChange={(e) => setForm({ ...form, Desig3: e.target.value })} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dtext3</label>
                    <textarea value={form.Dtext3} onChange={(e) => setForm({ ...form, Dtext3: e.target.value })} className="w-full border rounded px-3 py-2" rows={2} />
                  </div>
                </div>

                {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                  {isEditing ? "Save changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
