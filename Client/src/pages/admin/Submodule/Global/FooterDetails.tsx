// src/pages/Admin/Footer/FooterDetails.tsx
import React, { useEffect, useState } from "react";
import { footerApi, factApi } from "../../../../Backend"; // adjust path / names if needed
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

type FooterDoc = {
  _id: string;
  SocialLink1?: string;
  SocialLink2?: string;
  SocialLink3?: string;
  SocialLink4?: string;
  SocialLink5?: string;
  SocialLink6?: string;
  SocialLink7?: string;
  copyrightText?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  address?: string;
  contactno?: string;
  mailId?: string;
  factoryaddress?: FactAddressDoc[] | string[]; // populated or ids
};

type FactAddressDoc = {
  _id: string;
  Htext: string;
  Dtext: string;
  link: string;
  footerId?: string | FooterDoc;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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

const requiredLinkKeys = ["SocialLink1", "SocialLink2", "SocialLink3", "SocialLink4"] as const;
type RequiredLinkKey = typeof requiredLinkKeys[number];

const FooterDetails: React.FC = () => {
  const navigate = useNavigate();
  const [footer, setFooter] = useState<FooterDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // modal/form state for footer create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // footer form fields
  const [copyrightText, setCopyrightText] = useState("");
  const [social, setSocial] = useState<Record<string, string>>({
    SocialLink1: "",
    SocialLink2: "",
    SocialLink3: "",
    SocialLink4: "",
    SocialLink5: "",
    SocialLink6: "",
    SocialLink7: "",
  });

  // toast
  const [toast, setToast] = useState<{ msg: string; type?: "success" | "error" } | null>(null);

  // factoryaddress list + modal (create/edit)
  const [factList, setFactList] = useState<FactAddressDoc[]>([]);
  const [factLoading, setFactLoading] = useState(false);
  const [factError, setFactError] = useState<string | null>(null);

  const [isFactModalOpen, setIsFactModalOpen] = useState(false);
  const [isFactSaving, setIsFactSaving] = useState(false);
  const [isFactCreating, setIsFactCreating] = useState(true);
  const [editingFact, setEditingFact] = useState<FactAddressDoc | null>(null);

  // fact form fields
  const [factHtext, setFactHtext] = useState("");
  const [factDtext, setFactDtext] = useState("");
  const [factLink, setFactLink] = useState("");
  const [factFooterId, setFactFooterId] = useState<string | undefined>(undefined);

  // normalize helper (same as backend expectations)
  const norm = (v: any) => {
    if (v === undefined || v === null) return undefined;
    const s = String(v).trim();
    return s.length ? s : undefined;
  };

  // ---------- Footer fetch/create/update ----------
  const fetchFooter = async () => {
    setLoading(true);
    setError(null);
    try {
      const res: AxiosResponse<any> = await footerApi.getLatest();
      // backend returns { success: true, data: { ... } }
      const doc: FooterDoc | null = res.data?.data ?? res.data ?? null;
      setFooter(doc);
      // if populated factoryaddress present, populate factList
      if (doc?.factoryaddress && Array.isArray(doc.factoryaddress)) {
        // could be populated objects or ids - filter objects
        const items = doc.factoryaddress.filter((f) => typeof f === "object") as FactAddressDoc[];
        if (items.length) setFactList(items);
      }
    } catch (err: any) {
      console.error("fetchFooter error:", err);
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to load footer";
      setError(msg);
      setFooter(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Factoryaddress CRUD ----------
  const fetchFactoryAddresses = async () => {
    setFactLoading(true);
    setFactError(null);
    try {
      const res: AxiosResponse<any> = await factApi.getAll(); // expects GET /api/v1/factAdd
      const items: FactAddressDoc[] = res.data?.data ?? res.data ?? [];
      setFactList(items);
    } catch (err: any) {
      console.error("fetchFactoryAddresses error:", err);
      setFactError(err?.response?.data?.message ?? err?.message ?? "Failed to load factory addresses");
    } finally {
      setFactLoading(false);
    }
  };

  // open modal for footer create/edit (existing behavior)
  const openModal = (createMode = false) => {
    setIsCreating(createMode);
    setError(null);

    if (createMode || !footer) {
      // reset
      setCopyrightText("");
      setSocial({
        SocialLink1: "",
        SocialLink2: "",
        SocialLink3: "",
        SocialLink4: "",
        SocialLink5: "",
        SocialLink6: "",
        SocialLink7: "",
      });
    } else {
      // seed with backend fields; ensure keys exist
      setSocial({
        SocialLink1: footer.SocialLink1 ?? "",
        SocialLink2: footer.SocialLink2 ?? "",
        SocialLink3: footer.SocialLink3 ?? "",
        SocialLink4: footer.SocialLink4 ?? "",
        SocialLink5: footer.SocialLink5 ?? "",
        SocialLink6: footer.SocialLink6 ?? "",
        SocialLink7: footer.SocialLink7 ?? "",
      });
      setCopyrightText(footer.copyrightText ?? "");
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  // ---------- Footer validation ----------
  const validateCreatePayload = () => {
    if (!copyrightText || !String(copyrightText).trim()) {
      setError("copyrightText is required.");
      return false;
    }
    for (const k of requiredLinkKeys) {
      if (!social[k] || !String(social[k]).trim()) {
        setError(`${k} is required.`);
        return false;
      }
    }
    return true;
  };

  const validateUpdatePayload = (payload: Record<string, any>) => {
    if (typeof payload.copyrightText !== "undefined" && !String(payload.copyrightText).trim()) {
      setError("copyrightText cannot be empty.");
      return false;
    }
    for (const k of requiredLinkKeys) {
      if (typeof payload[k] !== "undefined" && !String(payload[k]).trim()) {
        setError(`${k} cannot be empty if provided.`);
        return false;
      }
    }
    return true;
  };

  // FOOTER: CREATE / UPSERT
  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!validateCreatePayload()) return;
    setIsSaving(true);
    try {
      const payload: Record<string, any> = {
        copyrightText: String(copyrightText).trim(),
        SocialLink1: String(social.SocialLink1).trim(),
        SocialLink2: String(social.SocialLink2).trim(),
        SocialLink3: String(social.SocialLink3).trim(),
        SocialLink4: String(social.SocialLink4).trim(),
        SocialLink5: String(social.SocialLink5).trim(),
        SocialLink6: String(social.SocialLink6).trim(),
        SocialLink7: String(social.SocialLink7).trim(),
      };

      const res: AxiosResponse<any> = await footerApi.create(payload);
      const created: FooterDoc = res.data?.data ?? res.data ?? null;
      setFooter(created);
      setIsModalOpen(false);
      setToast({ msg: "Footer created/updated successfully", type: "success" });
      // refresh factory addresses (if populated)
      if (created?.factoryaddress) {
        const items = Array.isArray(created.factoryaddress) ? (created.factoryaddress as FactAddressDoc[]) : [];
        setFactList(items);
      } else {
        // fallback to fetch all
        await fetchFactoryAddresses();
      }
    } catch (err: any) {
      console.error("createFooter error:", err, err?.response?.data);
      const msg = err?.response?.data?.message ?? err?.message ?? "Create failed";
      setError(msg);
      setToast({ msg, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // FOOTER: UPDATE
  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!footer?._id) {
      setError("No footer found to update.");
      return;
    }

    const payload: Record<string, any> = {
      copyrightText: norm(copyrightText),
      SocialLink1: norm(social.SocialLink1),
      SocialLink2: norm(social.SocialLink2),
      SocialLink3: norm(social.SocialLink3),
      SocialLink4: norm(social.SocialLink4),
      SocialLink5: norm(social.SocialLink5),
      SocialLink6: norm(social.SocialLink6),
      SocialLink7: norm(social.SocialLink7),
    };

    // remove undefined keys so controller doesn't treat them as provided-empty
    Object.keys(payload).forEach((k) => (payload[k] === undefined ? delete payload[k] : null));

    if (Object.keys(payload).length === 0) {
      setError("No fields provided to update.");
      return;
    }
    if (!validateUpdatePayload(payload)) return;

    setIsSaving(true);
    try {
      const res: AxiosResponse<any> = await footerApi.update(footer._id, payload);
      const updated: FooterDoc = res.data?.data ?? res.data ?? null;
      setFooter(updated);
      setIsModalOpen(false);
      setToast({ msg: "Footer updated", type: "success" });

      // refresh factoryaddress list if updated footer contains populated factoryaddress
      if (updated?.factoryaddress && Array.isArray(updated.factoryaddress)) {
        setFactList(updated.factoryaddress as FactAddressDoc[]);
      } else {
        await fetchFactoryAddresses();
      }
    } catch (err: any) {
      console.error("updateFooter error:", err, err?.response?.data);
      const msg = err?.response?.data?.message ?? err?.message ?? "Update failed";
      setError(msg);
      setToast({ msg, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- Factory modal helpers ----------
  const openFactModalForCreate = (prefillFooterId?: string) => {
    setIsFactCreating(true);
    setEditingFact(null);
    setFactHtext("");
    setFactDtext("");
    setFactLink("");
    setFactFooterId(prefillFooterId ?? (footer?._id ?? undefined));
    setIsFactModalOpen(true);
    setFactError(null);
  };

  const openFactModalForEdit = (fact: FactAddressDoc) => {
    setIsFactCreating(false);
    setEditingFact(fact);
    setFactHtext(fact.Htext ?? "");
    setFactDtext(fact.Dtext ?? "");
    setFactLink(fact.link ?? "");
    // footerId may be an object or id
    setFactFooterId(typeof fact.footerId === "string" ? fact.footerId : (fact.footerId as any)?._id ?? footer?._id);
    setIsFactModalOpen(true);
    setFactError(null);
  };

  const closeFactModal = () => {
    setIsFactModalOpen(false);
    setFactError(null);
    setEditingFact(null);
  };

  // fact validation (Htext, Dtext, link required)
  const validateFactPayload = (payload: Record<string, any>) => {
    if (!payload.Htext) {
      setFactError("Htext is required.");
      return false;
    }
    if (!payload.Dtext) {
      setFactError("Dtext is required.");
      return false;
    }
    if (!payload.link) {
      setFactError("link is required.");
      return false;
    }
    return true;
  };

  // CREATE factory address
  const handleCreateFact = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFactError(null);
    const payload: Record<string, any> = {
      Htext: norm(factHtext),
      Dtext: norm(factDtext),
      link: norm(factLink),
    };
    if (factFooterId) payload.footerId = norm(factFooterId);

    if (!validateFactPayload(payload)) return;

    setIsFactSaving(true);
    try {
      const res: AxiosResponse<any> = await factApi.create(payload);
      const created: FactAddressDoc = res.data?.data ?? res.data ?? null;
      setToast({ msg: "Factory address created", type: "success" });
      closeFactModal();
      // refresh both lists: fact list and footer
      await fetchFactoryAddresses();
      await fetchFooter();
    } catch (err: any) {
      console.error("createFact error:", err, err?.response?.data);
      const msg = err?.response?.data?.message ?? err?.message ?? "Create failed";
      setFactError(msg);
      setToast({ msg, type: "error" });
    } finally {
      setIsFactSaving(false);
    }
  };

  // UPDATE factory address
  const handleUpdateFact = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingFact?._id) {
      setFactError("No factory address selected for update.");
      return;
    }
    const payload: Record<string, any> = {};
    if (typeof factHtext !== "undefined") payload.Htext = norm(factHtext);
    if (typeof factDtext !== "undefined") payload.Dtext = norm(factDtext);
    if (typeof factLink !== "undefined") payload.link = norm(factLink);
    if (typeof factFooterId !== "undefined") payload.footerId = norm(factFooterId);

    // remove undefined
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    if (Object.keys(payload).length === 0) {
      setFactError("No fields provided to update.");
      return;
    }
    if (!validateFactPayload({ ...editingFact, ...payload })) return;

    setIsFactSaving(true);
    try {
      const res: AxiosResponse<any> = await factApi.update(editingFact._id, payload);
      const updated: FactAddressDoc = res.data?.data ?? res.data ?? null;
      setToast({ msg: "Factory address updated", type: "success" });
      closeFactModal();
      await fetchFactoryAddresses();
      await fetchFooter();
    } catch (err: any) {
      console.error("updateFact error:", err, err?.response?.data);
      const msg = err?.response?.data?.message ?? err?.message ?? "Update failed";
      setFactError(msg);
      setToast({ msg, type: "error" });
    } finally {
      setIsFactSaving(false);
    }
  };

  // DELETE factory address
  const handleDeleteFact = async (id: string) => {
    if (!confirm("Delete this factory address?")) return;
    setFactError(null);
    try {
      await factApi.delete(id);
      setToast({ msg: "Factory address deleted", type: "success" });
      await fetchFactoryAddresses();
      await fetchFooter();
    } catch (err: any) {
      console.error("deleteFact error:", err, err?.response?.data);
      const msg = err?.response?.data?.message ?? err?.message ?? "Delete failed";
      setFactError(msg);
      setToast({ msg, type: "error" });
    }
  };

  // toast auto hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // ---------- render ----------
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-green-600 text-xl">
        Loading Footer...
      </div>
    );

  return (
    <div className="mt-16 p-6 max-w-5xl mx-auto text-black">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Footer Details</h2>
          <p className="text-sm text-gray-500 mt-1">Manage site footer (social links, copyright, contact & factory addresses)</p>
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={() => { fetchFooter(); fetchFactoryAddresses(); }} className="px-3 py-2 bg-green-50 text-green-800 rounded">
            Refresh
          </button>
          <button onClick={() => navigate(-1)} className="px-3 py-2 bg-gray-50 text-gray-800 rounded">
            Back
          </button>

          {footer ? (
            <button onClick={() => openModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded">
              Edit Footer
            </button>
          ) : (
            <button onClick={() => openModal(true)} className="px-4 py-2 bg-yellow-600 text-white rounded">
              Create Footer
            </button>
          )}
        </div>
      </div>

      {/* top info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500">ID</div>
          <div className="mt-1 text-sm break-all">{footer?._id ?? "—"}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500">Created</div>
          <div className="mt-1 text-sm">{footer?.createdAt ? new Date(footer.createdAt).toLocaleString() : "—"}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500">Updated</div>
          <div className="mt-1 text-sm">{footer?.updatedAt ? new Date(footer.updatedAt).toLocaleString() : "—"}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xs text-gray-500">Contact</div>
          <div className="mt-1 text-sm">{footer?.contactno ?? "—"} / {footer?.mailId ?? "—"}</div>
        </div>
      </div>

      {/* content */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-3">Content</h3>

        <div className="mb-4">
          <div className="text-xs text-gray-500">Copyright</div>
          <div className="mt-1 text-sm text-gray-800">{footer?.copyrightText ?? "—"}</div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">Social Links</div>
            <div className="text-xs text-gray-500">
              {footer ? (
                `${(footer.SocialLink1 ? 1 : 0) + (footer.SocialLink2 ? 1 : 0) + (footer.SocialLink3 ? 1 : 0) + (footer.SocialLink4 ? 1 : 0) + (footer.SocialLink5 ? 1 : 0) + (footer.SocialLink6 ? 1 : 0) + (footer.SocialLink7 ? 1 : 0)} links`
              ) : (
                "0 links"
              )}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {footer ? (
              <>
                {["SocialLink1","SocialLink2","SocialLink3","SocialLink4","SocialLink5","SocialLink6","SocialLink7"].map((k) => {
                  const v = (footer as any)[k];
                  return v ? (
                    <div key={k} className="text-sm text-blue-700 underline break-all">
                      <a href={v} target="_blank" rel="noreferrer">{v}</a>
                    </div>
                  ) : null;
                })}
              </>
            ) : (
              <div className="text-sm text-gray-400">—</div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500">Factory Addresses</div>
            <div className="text-xs text-gray-500">{factList.length} items</div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <button onClick={() => { fetchFactoryAddresses(); }} className="px-3 py-1 bg-green-50 text-green-800 rounded">Refresh</button>
              <button onClick={() => openFactModalForCreate(footer?._id)} className="px-3 py-1 bg-blue-600 text-white rounded">Create Address</button>
            </div>

            {factLoading ? (
              <div className="text-sm text-gray-500">Loading addresses...</div>
            ) : factList.length === 0 ? (
              <div className="text-sm text-gray-400">No factory addresses found.</div>
            ) : (
              <ul className="mt-2 space-y-2">
                {factList.map((f) => (
                  <li key={f._id} className="bg-gray-50 p-3 rounded flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{f.Htext}</div>
                      <div className="text-xs text-gray-600">{f.Dtext}</div>
                      <div className="text-xs text-blue-700 underline break-all mt-1">
                        <a href={f.link} target="_blank" rel="noreferrer">{f.link}</a>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Added: {f.createdAt ? new Date(f.createdAt).toLocaleString() : "—"}</div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button onClick={() => openFactModalForEdit(f)} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">Edit</button>
                      <button onClick={() => handleDeleteFact(f._id)} className="px-3 py-1 bg-red-100 text-red-800 rounded">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {factError && <div className="text-sm text-red-600 mt-2">{factError}</div>}
          </div>
        </div>
      </div>

      {/* footer modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeModal} aria-hidden="true" />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{isCreating ? "Create Footer" : "Edit Footer"}</h3>
                <p className="text-xs text-gray-500">{isCreating ? "Create the footer document" : "Update copyright and social links"}</p>
              </div>
              <div>
                <button onClick={closeModal} className="px-3 py-1 bg-red-100 text-red-700 rounded">Close</button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); isCreating ? handleCreate() : handleUpdate(); }}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                  <input
                    value={copyrightText}
                    onChange={(e) => setCopyrightText(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="© 2025 YourCompany. All rights reserved."
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Social Links (SocialLink1..7)</label>
                    <div className="text-xs text-gray-500">SocialLink1..4 required</div>
                  </div>

                  <div className="space-y-2">
                    {(["SocialLink1","SocialLink2","SocialLink3","SocialLink4","SocialLink5","SocialLink6","SocialLink7"] as const).map((k, idx) => (
                      <div key={k} className="flex gap-2 items-center">
                        <div className="text-xs w-20 text-gray-600">{k}</div>
                        <input
                          value={social[k] ?? ""}
                          onChange={(e) => setSocial((prev) => ({ ...prev, [k]: e.target.value }))}
                          className="flex-1 border rounded px-3 py-2"
                          placeholder={`https://...`}
                          required={idx < 4}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Provide full URLs. The backend expects individual fields: SocialLink1..SocialLink7.
                  </div>
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {isSaving ? (isCreating ? "Creating..." : "Saving...") : (isCreating ? "Create Footer" : "Save changes")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* factory modal */}
      {isFactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeFactModal} aria-hidden="true" />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl z-10">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{isFactCreating ? "Create Factory Address" : "Edit Factory Address"}</h3>
                <p className="text-xs text-gray-500">{isFactCreating ? "Add a new factory address and optionally attach to a footer" : "Update factory address"}</p>
              </div>
              <div>
                <button onClick={closeFactModal} className="px-3 py-1 bg-red-100 text-red-700 rounded">Close</button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); isFactCreating ? handleCreateFact() : handleUpdateFact(); }}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Htext</label>
                  <input value={factHtext} onChange={(e) => setFactHtext(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Heading" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dtext</label>
                  <input value={factDtext} onChange={(e) => setFactDtext(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Description" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                  <input value={factLink} onChange={(e) => setFactLink(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="https://..." required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attach to Footer (optional)</label>
                  <select value={factFooterId ?? ""} onChange={(e) => setFactFooterId(e.target.value ?? undefined)} className="w-full border rounded px-3 py-2">
                    <option value="">-- none --</option>
                    {footer && <option value={footer._id}>Current Footer ({footer._id.slice(0, 6)})</option>}
                  </select>
                  <div className="text-xs text-gray-500 mt-1">If provided, the backend will add this address id to Footer.factoryaddress.</div>
                </div>

                {factError && <div className="text-sm text-red-600">{factError}</div>}
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t">
                <button type="button" onClick={closeFactModal} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                <button type="submit" disabled={isFactSaving} className="px-4 py-2 bg-green-600 text-white rounded">
                  {isFactSaving ? (isFactCreating ? "Creating..." : "Saving...") : (isFactCreating ? "Create" : "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterDetails;
