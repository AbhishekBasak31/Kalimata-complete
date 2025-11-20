// src/pages/Admin/Blog/OurValue.tsx
import React, { useEffect, useState } from "react";
import { ourvalueApi } from "../../../../Backend";
import type { ApiResponse } from "../../../../Backend";
import { Edit3, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button"; // optional - swap for plain <button> if not available

type OurValueItem = {
  _id: string;
  Htext: string;
  Dtext: string;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: any;
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

export default function OurValueDetails() {
  const [items, setItems] = useState<OurValueItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // modal / form states
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<OurValueItem | null>(null);

  const [Htext, setHtext] = useState("");
  const [Dtext, setDtext] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function fetchList() {
    setLoading(true);
    setFetchError(null);
    try {
      const res: ApiResponse<any> = await ourvalueApi.getAll();
      const data = res.data?.data ?? res.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("fetch ourvalue error:", err);
      setFetchError(err?.response?.data?.message ?? err?.message ?? "Failed to fetch values");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setIsEditing(false);
    setEditingItem(null);
    setHtext("");
    setDtext("");
    setFormError(null);
    setOpenModal(true);
  }

  function openEdit(item: OurValueItem) {
    setIsEditing(true);
    setEditingItem(item);
    setHtext(item.Htext ?? "");
    setDtext(item.Dtext ?? "");
    setFormError(null);
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setEditingItem(null);
    setFormError(null);
  }

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setFormError(null);

    if (!Htext.trim() || !Dtext.trim()) {
      setFormError("Both Htext and Dtext are required.");
      return;
    }

    try {
      const payload = { Htext: Htext.trim(), Dtext: Dtext.trim() };
      await ourvalueApi.create(payload);
      setToast({ msg: "Created", type: "success" });
      closeModal();
      await fetchList();
    } catch (err: any) {
      console.error("create ourvalue error:", err);
      setFormError(err?.response?.data?.message ?? err?.message ?? "Create failed");
      setToast({ msg: "Create failed", type: "error" });
    }
  }

  async function handleUpdate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!editingItem) return;
    setFormError(null);

    if (!Htext.trim() || !Dtext.trim()) {
      setFormError("Both Htext and Dtext are required.");
      return;
    }

    try {
      const payload = { Htext: Htext.trim(), Dtext: Dtext.trim() };
      await ourvalueApi.update(editingItem._id, payload);
      setToast({ msg: "Updated", type: "success" });
      closeModal();
      await fetchList();
    } catch (err: any) {
      console.error("update ourvalue error:", err);
      setFormError(err?.response?.data?.message ?? err?.message ?? "Update failed");
      setToast({ msg: "Update failed", type: "error" });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    try {
      await ourvalueApi.delete(id);
      setToast({ msg: "Deleted", type: "success" });
      await fetchList();
    } catch (err: any) {
      console.error("delete ourvalue error:", err);
      setToast({ msg: err?.response?.data?.message ?? "Delete failed", type: "error" });
    }
  }

  return (
    <div className="mt-24 p-6 max-w-5xl mx-auto text-black">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Our Values</h2>
          <p className="text-sm text-gray-500 mt-1">Manage the "Our Value" content section</p>
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={fetchList} className="px-3 py-2 bg-green-50 text-green-800 rounded">Refresh</button>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : fetchError ? (
          <div className="text-red-600 py-6 text-center">{fetchError}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No entries found.</div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it._id} className="flex items-start justify-between gap-4 p-4 border rounded">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{it.Htext}</div>
                  <div className="text-sm text-gray-700 mt-2">{it.Dtext}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {it.createdAt ? new Date(it.createdAt).toLocaleString() : ""}
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <button onClick={() => openEdit(it)} className="p-2 bg-yellow-50 text-yellow-800 rounded" title="Edit">
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
          <div className="fixed inset-0 bg-black/50" onClick={closeModal} aria-hidden="true" />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{isEditing ? "Edit Value" : "Create Value"}</h3>
                <p className="text-xs text-gray-500">{isEditing ? "Update fields below" : "Fill fields to create a value"}</p>
              </div>
              <div>
                <button onClick={closeModal} className="px-3 py-1 bg-red-100 text-red-700 rounded">Close</button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); isEditing ? handleUpdate() : handleCreate(); }}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headline (Htext)</label>
                  <input value={Htext} onChange={(e) => setHtext(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Headline" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Dtext)</label>
                  <textarea value={Dtext} onChange={(e) => setDtext(e.target.value)} className="w-full border rounded px-3 py-2" rows={4} placeholder="Description" required />
                </div>

                {formError && <div className="text-sm text-red-600">{formError}</div>}
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
