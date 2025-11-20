// src/pages/CategoryPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { categories as localCategories } from "@/data/category";
import { subcategories as localSubcategories } from "@/data/subcategory";

/**
 * Helper: build backend URL (uses VITE_BACKENDAPI if provided)
 */
function buildBackendUrl(path: string) {
  const base = (import.meta.env.VITE_BACKENDAPI as string) || "";
  if (!base) return path;
  return `${base.replace(/\/$/, "")}${path}`;
}

/**
 * Normalize backend category -> UI shape
 */
function mapBackendCategory(c: any) {
  return {
    id: String(c._id),
    name: c.Name ?? c.name ?? "Untitled",
    description: c.Dtext ?? c.description ?? "",
    image: c.Img ?? c.Image ?? "",
    keyDetails: [c.KeyP1, c.KeyP2, c.KeyP3].filter(Boolean),
    raw: c,
  };
}

/**
 * Normalize backend subcategory -> UI shape
 */
function mapBackendSubcategory(s: any) {
  // backend uses "Catagory" populated object or id
  const catId = s.Catagory && typeof s.Catagory === "object" ? s.Catagory._id : s.Catagory ?? s.CatagoryId;
  return {
    id: String(s._id),
    categoryId: String(catId ?? ""),
    name: s.Name ?? s.name ?? "Untitled",
    description: s.Dtext ?? s.description ?? "",
    image: s.Img ?? s.Image ?? "",
    keyDetails: [s.KeyP1, s.KeyP2].filter(Boolean),
    raw: s,
  };
}

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const location = useLocation();

  const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const previewMode = urlSearch.get("preview") === "true";

  const [categories, setCategories] = useState(() => localCategories.map((c: any) => ({
    id: c.id,
    name: c.name,
    description: c.description ?? c.desc ?? "",
    image: c.image,
    keyDetails: c.keyDetails ?? [],
    raw: c,
  })));
  const [subcategories, setSubcategories] = useState(() => localSubcategories.map((s: any) => ({
    id: s.id,
    categoryId: s.categoryId,
    name: s.name,
    description: s.description ?? "",
    image: s.image,
    keyDetails: s.keyDetails ?? [],
    raw: s,
  })));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch backend data
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);

      const catUrl = previewMode
        ? buildBackendUrl("/api/v1/product/catagory?draft=true")
        : buildBackendUrl("/api/v1/product/catagory");
      const subUrl = previewMode
        ? buildBackendUrl("/api/v1/product/subcatagory?draft=true")
        : buildBackendUrl("/api/v1/product/subcatagory");

      try {
        const [catRes, subRes] = await Promise.allSettled([
          fetch(catUrl, { credentials: "include" }),
          fetch(subUrl, { credentials: "include" }),
        ]);

        const parse = async (r: PromiseSettledResult<Response>) => {
          if (r.status !== "fulfilled") throw r.reason;
          const resp = r.value;
          const ct = resp.headers.get("content-type") || "";
          if (!resp.ok) {
            const txt = await resp.text().catch(() => "");
            throw new Error(`HTTP ${resp.status} - ${txt.slice(0, 200)}`);
          }
          if (!ct.includes("application/json")) {
            const txt = await resp.text().catch(() => "");
            throw new Error(`Non-JSON response: ${txt.slice(0, 200)}`);
          }
          const json = await resp.json();
          // backend returns { success: true, data: [...] }
          if (Array.isArray(json)) return json;
          if (Array.isArray(json.data)) return json.data;
          return [];
        };

        const catsArr = await parse(catRes).catch((e) => {
          console.warn("Failed to parse categories:", e);
          return null;
        });
        const subsArr = await parse(subRes).catch((e) => {
          console.warn("Failed to parse subcategories:", e);
          return null;
        });

        if (!mounted) return;

        if (Array.isArray(catsArr) && catsArr.length) {
          setCategories(catsArr.map(mapBackendCategory));
        } else {
          // fallback to local categories already seeded
        }

        if (Array.isArray(subsArr) && subsArr.length) {
          setSubcategories(subsArr.map(mapBackendSubcategory));
        } else {
          // fallback to local subcategories already seeded
        }
      } catch (err: any) {
        console.error("CategoryPage fetch error:", err);
        if (mounted) {
          setError(String(err?.message ?? err));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [previewMode]);

  // find category and its subcategories (slug === _id)
  const categoryData = categories.find((cat) => cat.id === categorySlug);
  const relatedSubcategories = subcategories.filter((sub) => sub.categoryId === categorySlug);
  const otherCategories = categories.filter((c) => c.id !== categorySlug);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Loading category…</h1>
        <p className="text-gray-500">Fetching category & subcategory data...</p>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-500">No subcategories available for this category.</p>
        <Link
          to="/"
          className="inline-block mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-gray-50">
      {/* Gradient Hero */}
      <div className="relative bg-gradient-to-r from-primary to-orange-700 text-white py-24 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-6"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-wide drop-shadow-lg">
            {categoryData.name}
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            {categoryData.description}
          </p>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay pointer-events-none" />
      </div>

      {/* Main */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Subcategories */}
        <div className="lg:col-span-4">
          {relatedSubcategories.length === 0 ? (
            <div className="text-center text-gray-500 py-20">No subcategories found for this category.</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedSubcategories.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300"
                >
                  <img
                    src={sub.image || "/assets/placeholder.jpg"}
                    alt={sub.name}
                    onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/assets/placeholder.jpg")}
                    className="h-48 w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{sub.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{sub.description}</p>
                    <ul className="text-xs text-gray-500 list-disc pl-4 mb-4">
                      {(sub.keyDetails || []).slice(0, 3).map((detail: string, idx: number) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>

                    <Link
                      to={`/products/${categorySlug}/${sub.id}`}
                      className="inline-block text-primary font-medium text-sm hover:underline transition-colors"
                    >
                      Learn More →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 bg-white shadow-md rounded-xl p-6">
            <h3 className="text-lg font-bold text-primary mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {otherCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="text-gray-700 hover:text-primary transition-colors text-sm flex items-center"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CategoryPage;
