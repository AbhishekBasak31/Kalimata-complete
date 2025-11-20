// src/pages/Admin/EnquiryDetails.tsx
import React, { useEffect, useState, useMemo } from "react";
import type { AxiosResponse } from "axios";
import { enquiryApi } from "../../../../Backend"; // <- adjust path to your API export
import { motion } from "framer-motion";

type Enquiry = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  enquirie: string;
  createdAt?: string;
  updatedAt?: string;
};

const toastTimeout = 3000;

const Toast: React.FC<{ msg: string; type?: "success" | "error"; onClose?: () => void }> = ({ msg, type = "success", onClose }) => {
  const bg = type === "success" ? "bg-green-600" : "bg-red-600";
  return (
    <div className={`fixed top-6 right-6 z-50 ${bg} text-black px-4 py-2 rounded shadow-lg`}>
      <div className="flex items-center gap-3">
        <div className="text-sm">{msg}</div>
        <button onClick={onClose} className="ml-2 text-sm opacity-90 hover:opacity-100">✕</button>
      </div>
    </div>
  );
};

const EnquiryDetails: React.FC = () => {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: AxiosResponse<any> = await enquiryApi.getAll();
      // backend returns { success:true, count, data:[...] }
      const payload: Enquiry[] = res.data?.data ?? res.data ?? [];
      setItems(Array.isArray(payload) ? payload : []);
    } catch (err: any) {
      console.error("fetch enquiries error", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to fetch enquiries");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // auto hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toastTimeout);
    return () => clearTimeout(t);
  }, [toast]);

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ msg: "Copied to clipboard", type: "success" });
    } catch {
      setToast({ msg: "Copy failed", type: "error" });
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        (it.name ?? "").toLowerCase().includes(q) ||
        (it.email ?? "").toLowerCase().includes(q) ||
        (it.phone ?? "").toLowerCase().includes(q) ||
        (it.enquirie ?? "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const exportCSV = () => {
    if (!filtered.length) {
      setToast({ msg: "No data to export", type: "error" });
      return;
    }
    const headers = ["_id", "name", "email", "phone", "enquirie", "createdAt"];
    const rows = filtered.map((r) =>
      headers.map((h) => {
        const val = (r as any)[h] ?? "";
        // escape quotes
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ msg: "Export started", type: "success" });
  };

  return (
    <div className="mt-32 p-6 max-w-6xl mx-auto">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Enquiries</h2>
          <p className="text-sm text-gray-500 mt-1">All customer enquiries received via site</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">{loading ? "Loading…" : `${items.length} total`}</div>
          <button onClick={fetchAll} className="px-3 py-2 bg-green-50 text-green-800 rounded">Refresh</button>
          <button onClick={exportCSV} className="px-3 py-2 bg-blue-600 text-white rounded">Export CSV</button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone or message"
          className="flex-1 border rounded px-3 py-2"
        />
        <div className="text-sm text-gray-500">{filtered.length} shown</div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading enquiries…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No enquiries found</div>
        ) : (
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-xs text-gray-600">#</th>
                <th className="px-4 py-3 text-xs text-gray-600">Name</th>
                <th className="px-4 py-3 text-xs text-gray-600">Email</th>
                <th className="px-4 py-3 text-xs text-gray-600">Phone</th>
                <th className="px-4 py-3 text-xs text-gray-600">Message</th>
                <th className="px-4 py-3 text-xs text-gray-600">Received</th>
                <th className="px-4 py-3 text-xs text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((row, i) => (
                <tr key={row._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700 align-top">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 align-top">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-blue-600 underline align-top">
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 align-top">
                    <a href={`tel:${row.phone}`}>{row.phone}</a>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 align-top truncate max-w-[28ch]">
                    {row.enquirie}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 align-top">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 align-top">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(row)}
                        className="px-2 py-1 bg-indigo-600 text-white rounded text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onCopy(row.email)}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs"
                        title="Copy email"
                      >
                        Copy Email
                      </button>
                      <button
                        onClick={() => onCopy(row.phone)}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs"
                        title="Copy phone"
                      >
                        Copy Phone
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-xl z-10 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold">Enquiry from {selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-sm text-gray-500">Close</button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div><strong>Name:</strong> {selected.name}</div>
              <div><strong>Email:</strong> <a className="text-blue-600 underline" href={`mailto:${selected.email}`}>{selected.email}</a></div>
              <div><strong>Phone:</strong> <a className="text-blue-600 underline" href={`tel:${selected.phone}`}>{selected.phone}</a></div>
              <div><strong>Message:</strong> <div className="mt-2 p-3 bg-gray-50 rounded">{selected.enquirie}</div></div>
              <div className="text-xs text-gray-500">Received: {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}</div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { navigator.clipboard.writeText(selected.email); setToast({ msg: "Email copied", type: "success" }); }} className="px-3 py-1 bg-gray-100 rounded text-sm">Copy Email</button>
              <button onClick={() => { navigator.clipboard.writeText(selected.phone); setToast({ msg: "Phone copied", type: "success" }); }} className="px-3 py-1 bg-gray-100 rounded text-sm">Copy Phone</button>
              <button onClick={() => setSelected(null)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Done</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EnquiryDetails;
