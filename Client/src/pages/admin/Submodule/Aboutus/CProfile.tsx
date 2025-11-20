// src/pages/CProfile.tsx
import React, { useEffect, useState, useRef } from "react";
import { cprofileApi } from "../../../../Backend";

type CProfileType = {
  _id: string;
  Img?: string;
  Htext?: string;
  Dtext?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function CProfileDetails(): JSX.Element {
  const [items, setItems] = useState<CProfileType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // modal state (create / edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // form fields
  const [htext, setHtext] = useState("");
  const [dtext, setDtext] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // fetch list
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cprofileApi.getAll();
      // backend returns { success: true, data: [...] }
      const data = res?.data?.data ?? res?.data;
      if (Array.isArray(data)) setItems(data);
      else setItems([]);
    } catch (err: any) {
      console.error("cprofile fetch error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // open modal for create
  const openCreate = () => {
    setEditingId(null);
    setHtext("");
    setDtext("");
    setImgFile(null);
    setImgPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  };

  // open modal for edit
  const openEdit = (item: CProfileType) => {
    setEditingId(item._id);
    setHtext(item.Htext ?? "");
    setDtext(item.Dtext ?? "");
    setImgFile(null); // user may choose a new file
    setImgPreview(item.Img ?? null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setImgFile(f ?? null);
    if (f) {
      const url = URL.createObjectURL(f);
      setImgPreview(url);
    } else {
      setImgPreview(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setImgFile(null);
    setImgPreview(null);
  };

  // helper: build FormData for create/update
  const buildForm = () => {
    const fd = new FormData();
    fd.append("Htext", htext);
    fd.append("Dtext", dtext);
    if (imgFile) fd.append("Img", imgFile);
    return fd;
  };

  // create
  const handleCreate = async () => {
    if (!htext.trim() || !dtext.trim()) {
      setError("Htext and Dtext are required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const fd = buildForm();
      await cprofileApi.create(fd);
      await fetchItems();
      closeModal();
    } catch (err: any) {
      console.error("create error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Create failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // update
  const handleUpdate = async () => {
    if (!editingId) return;
    if (!htext.trim() || !dtext.trim()) {
      setError("Htext and Dtext are required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const fd = buildForm();
      await cprofileApi.update(editingId, fd);
      await fetchItems();
      closeModal();
    } catch (err: any) {
      console.error("update error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete
  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this profile? This cannot be undone.");
    if (!ok) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await cprofileApi.delete(id);
      await fetchItems();
    } catch (err: any) {
      console.error("delete error:", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Delete failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 mt-32 text-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Company Profile</h1>
        <div className="flex gap-3">
          <button
            onClick={openCreate}
            className="bg-primary text-white px-4 py-2 rounded-md shadow-sm hover:opacity-95"
          >
            + Add Profile
          </button>
          <button
            onClick={fetchItems}
            className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <div className="py-6 text-center">Loading...</div>}
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {!loading && items.length === 0 && (
        <div className="py-12 text-center text-gray-500">No profile entries yet.</div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-6">
          {items.map((it) => (
            <div
              key={it._id}
              className="bg-white rounded-lg shadow p-5 flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div className="w-full md:w-40 h-32 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {it.Img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.Img}
                    alt={it.Htext ?? "profile image"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{it.Htext}</h3>
                <p className="text-gray-600 mt-2">{it.Dtext}</p>
                <div className="text-xs text-gray-400 mt-2">
                  Created: {new Date(it.createdAt || "").toLocaleString()}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(it)}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(it._id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Profile" : "Create Profile"}</h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Heading (Htext)</label>
                <input
                  value={htext}
                  onChange={(e) => setHtext(e.target.value)}
                  className="mt-1 block w-full border rounded-md p-2"
                  placeholder="Enter heading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Dtext)</label>
                <textarea
                  value={dtext}
                  onChange={(e) => setDtext(e.target.value)}
                  className="mt-1 block w-full border rounded-md p-2 min-h-[100px]"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1"
                />
                {imgPreview && (
                  <div className="mt-3 w-48 h-32 rounded overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  disabled={isSubmitting}
                  className="bg-primary text-white px-4 py-2 rounded-md shadow-sm hover:opacity-95"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
