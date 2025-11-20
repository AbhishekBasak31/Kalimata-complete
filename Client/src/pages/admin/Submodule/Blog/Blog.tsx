// src/pages/Admin/Blog/BlogDetails.tsx
import React, { useEffect, useState, useRef } from "react";
import { blogApi } from "../../../../Backend";
import type { ApiResponse } from "../../../../Backend";
import { buildFormData } from "../../../../Backend";
import { Trash2, Edit3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button"; // optional, use your button component or plain button

type BlogItem = {
  _id: string;
  Img?: string;
  Htext?: string;
  Dtext?: string;
  Adress?: string;
  Adresslink?: string;
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

const BlogDetails: React.FC = () => {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogItem | null>(null);

  const [Htext, setHtext] = useState("");
  const [Dtext, setDtext] = useState("");
  const [Adress, setAdress] = useState("");
  const [Adresslink, setAdresslink] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    setError(null);
    try {
      const res: ApiResponse<any> = await blogApi.getAll();
      const data: BlogItem[] = res.data?.data ?? res.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("fetch blogs error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load blogs");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setIsEditing(false);
    setEditingItem(null);
    setHtext("");
    setDtext("");
    setAdress("");
    setAdresslink("");
    setFile(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: BlogItem) => {
    setIsEditing(true);
    setEditingItem(item);
    setHtext(item.Htext ?? "");
    setDtext(item.Dtext ?? "");
    setAdress(item.Adress ?? "");
    setAdresslink(item.Adresslink ?? "");
    setFile(null); // user can optionally pick new image
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFile(null);
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    // basic client validation
    if (!Htext.trim() || !Dtext.trim() || !Adress.trim() || !Adresslink.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!file) {
      setError("Please select an image file.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("Htext", Htext.trim());
      fd.append("Dtext", Dtext.trim());
      fd.append("Adress", Adress.trim());
      fd.append("Adresslink", Adresslink.trim());
      fd.append("Img", file);

      const res = await blogApi.create(fd);
      setToast({ msg: "Blog created", type: "success" });
      closeModal();
      // refresh list
      await fetchItems();
    } catch (err: any) {
      console.error("create blog error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Create failed");
      setToast({ msg: err?.response?.data?.message ?? "Create failed", type: "error" });
    }
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingItem) return;
    setError(null);

    // at least one field must be provided (we'll send all to be simple)
    if (!Htext.trim() || !Dtext.trim() || !Adress.trim() || !Adresslink.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("Htext", Htext.trim());
      fd.append("Dtext", Dtext.trim());
      fd.append("Adress", Adress.trim());
      fd.append("Adresslink", Adresslink.trim());
      if (file) fd.append("Img", file);

      await blogApi.update(editingItem._id, fd);
      setToast({ msg: "Blog updated", type: "success" });
      closeModal();
      await fetchItems();
    } catch (err: any) {
      console.error("update blog error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Update failed");
      setToast({ msg: err?.response?.data?.message ?? "Update failed", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog? This action cannot be undone.")) return;
    try {
      await blogApi.delete(id);
      setToast({ msg: "Blog deleted", type: "success" });
      await fetchItems();
    } catch (err: any) {
      console.error("delete blog error:", err);
      setToast({ msg: err?.response?.data?.message ?? "Delete failed", type: "error" });
    }
  };

  return (
    <div className="mt-24 p-6 max-w-6xl mx-auto text-black">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Blog Management</h2>
          <p className="text-sm text-gray-500 mt-1">Create, edit and delete blog entries</p>
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={fetchItems} className="px-3 py-2 bg-green-50 text-green-800 rounded">Refresh</button>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Blog
          </button>
        </div>
      </div>

      {/* list */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No blog posts yet.</div>
        ) : (
          items.map((it) => (
            <div key={it._id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4 items-start">
              <div className="w-36 h-24 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={it.Img ?? "/assets/placeholder.jpg"}
                  alt={it.Htext}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{it.Htext}</div>
                    <div className="text-xs text-gray-500">{it.createdAt ? new Date(it.createdAt).toLocaleString() : ""}</div>
                  </div>

                  <div className="flex gap-2">
                    <button title="Edit" onClick={() => openEdit(it)} className="p-2 bg-yellow-50 text-yellow-800 rounded">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button title="Delete" onClick={() => handleDelete(it._id)} className="p-2 bg-red-50 text-red-700 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-gray-700">{it.Dtext}</div>

                <div className="mt-3 text-sm text-gray-600">
                  <div>Address: {it.Adress ?? "—"}</div>
                  <div>Address link: {it.Adresslink ? <a href={it.Adresslink} target="_blank" rel="noreferrer" className="text-primary underline">{it.Adresslink}</a> : "—"}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal} aria-hidden="true" />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{isEditing ? "Edit Blog" : "Create Blog"}</h3>
                <p className="text-xs text-gray-500">{isEditing ? "Update fields and optionally change image" : "Fill fields and upload an image"}</p>
              </div>
              <div>
                <button onClick={closeModal} className="px-3 py-1 bg-red-100 text-red-700 rounded">Close</button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); isEditing ? handleUpdate() : handleCreate(); }}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headline (Htext)</label>
                  <input value={Htext} onChange={(e) => setHtext(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Headline" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Dtext)</label>
                  <textarea value={Dtext} onChange={(e) => setDtext(e.target.value)} className="w-full border rounded px-3 py-2" rows={4} placeholder="Description" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input value={Adress} onChange={(e) => setAdress(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Address" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Link</label>
                  <input value={Adresslink} onChange={(e) => setAdresslink(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="https://..." required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
                  <div className="text-xs text-gray-500 mt-1">Upload image file (JPEG/PNG). Required on create; optional on edit.</div>
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                  {isEditing ? "Save changes" : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
