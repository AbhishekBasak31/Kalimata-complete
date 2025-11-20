// src/pages/Admin/Contact/ContactDetails.tsx
import React, { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import { contactApi } from "../../../../Backend"; // adjust path if needed
import { motion, AnimatePresence } from "framer-motion";

type ContactItem = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
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
        <button onClick={onClose} className="ml-2 text-sm opacity-90 hover:opacity-100">✕</button>
      </div>
    </div>
  );
};

const ContactDetails: React.FC = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<ContactItem | null>(null);
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: AxiosResponse<any> = await contactApi.getAll();
      const list: ContactItem[] = res.data?.data ?? res.data ?? [];
      setContacts(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.error("fetch contacts error", err);
      setError(err?.response?.data?.message ?? err?.message ?? "Failed to load contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // ---------- Copy helpers ----------
  const copyToClipboard = async (value: string, label = "Value") => {
    try {
      if (!value) throw new Error("Nothing to copy");
      await navigator.clipboard.writeText(value);
      setToast({ msg: `${label} copied to clipboard`, type: "success" });
    } catch (err: any) {
      console.error("copy failed", err);
      setToast({ msg: `Failed to copy ${label}`, type: "error" });
    }
  };

  // ---------- CSV Export ----------
  const exportCsv = () => {
    if (!contacts || !contacts.length) {
      setToast({ msg: "No contacts to export", type: "error" });
      return;
    }

    // Build CSV rows
    const headers = ["_id", "name", "email", "phone", "message", "createdAt"];
    const rows = contacts.map((c) =>
      headers.map((h) => {
        const raw = (c as any)[h] ?? "";
        // escape double quotes and wrap field in quotes
        return `"${String(raw).replace(/"/g, '""')}"`;
      }).join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `contacts-${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setToast({ msg: "CSV exported", type: "success" });
  };

  return (
    <div className="mt-32 p-6 max-w-6xl mx-auto text-black">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contact Submissions</h2>
          <p className="text-sm text-gray-500 mt-1">All contact form submissions</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchAll} className="px-3 py-2 bg-green-50 text-green-800 rounded">Refresh</button>
          <button onClick={exportCsv} className="px-3 py-2 bg-blue-600 text-white rounded">Export CSV</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">Total: <span className="font-medium text-gray-800">{contacts.length}</span></div>
          <div className="text-sm text-gray-500">{loading ? "Loading…" : error ? "Error" : "Live"}</div>
        </div>

        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-gray-500 bg-gray-50">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">Received</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Loading contacts…</td></tr>
              ) : contacts.length === 0 ? (
                <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">No contacts found</td></tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c._id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-3 py-3 align-top">
                      <div className="font-medium text-gray-800">{c.name}</div>
                    </td>

                    <td className="px-3 py-3 align-top">
                      <div className="flex items-center gap-3">
                        <a href={`mailto:${c.email}`} className="text-blue-600 underline">{c.email}</a>
                        <button
                          onClick={() => copyToClipboard(c.email, "Email")}
                          className="px-2 py-1 text-xs bg-black text-white rounded"
                          title="Copy email"
                        >
                          Copy
                        </button>
                      </div>
                    </td>

                    <td className="px-3 py-3 align-top">
                      <div className="flex items-center gap-3">
                        <a href={`tel:${c.phone}`} className="text-gray-700">{c.phone}</a>
                        <button
                          onClick={() => copyToClipboard(c.phone, "Phone")}
                          className="px-2 py-1 text-xs bg-black text-white rounded"
                          title="Copy phone"
                        >
                          Copy
                        </button>
                      </div>
                    </td>

                    <td className="px-3 py-3 align-top max-w-xs">
                      <div className="truncate text-black" title={c.message}>{c.message}</div>
                    </td>

                    <td className="px-3 py-3 align-top text-xs text-gray-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                    </td>

                    <td className="px-3 py-3 align-top">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(c)}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="relative bg-white rounded-lg shadow-xl max-w-xl w-full z-10 overflow-hidden"
            >
              <div className="p-5 border-b flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selected.name}</h3>
                  <div className="text-xs text-gray-500">{selected.email} • {selected.phone}</div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  Close
                </button>
              </div>

              <div className="p-5">
                <h4 className="text-sm text-gray-500 mb-2">Message</h4>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{selected.message}</p>

                <div className="mt-4 text-xs text-gray-500">
                  Received: {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "—"}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => copyToClipboard(selected.email, "Email")}
                    className="px-3 py-1 bg-gray-100 rounded text-sm"
                  >
                    Copy Email
                  </button>
                  <button
                    onClick={() => copyToClipboard(selected.phone, "Phone")}
                    className="px-3 py-1 bg-gray-100 rounded text-sm"
                  >
                    Copy Phone
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactDetails;
