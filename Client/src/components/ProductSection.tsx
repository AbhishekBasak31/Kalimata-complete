// src/components/ProductSection.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// fallback local imports (keeps behavior if CMS/static JSON not available)
import { categories as localCategories } from "@/data/category";
import { subcategories as localSubcategories } from "@/data/subcategory";

const ITEMS_PER_PAGE = 4;
const AUTO_SWITCH_INTERVAL = 15000; // 15 seconds
const FIXED_SECTION_HEIGHT = "45rem"; // Keeps section height stable

/* -----------------------
   Types
   ----------------------- */
type Category = {
  id: string;
  name: string;
  image?: string;
  keyDetails?: string[];
  [k: string]: any;
};

type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  image?: string;
  [k: string]: any;
};

/* -----------------------
   Helper: resolve image URLs safely
   ----------------------- */
function resolveImageUrl(raw?: string) {
  if (!raw) return "/assets/placeholder.jpg";

  // Already absolute?
  if (/^https?:\/\//i.test(raw)) return raw;

  // Leading slash -> site root
  if (raw.startsWith("/")) return raw;

  // Try to resolve relative to base
  try {
    const base =
      typeof import.meta.env.BASE_URL === "string" && import.meta.env.BASE_URL.length > 0
        ? import.meta.env.BASE_URL
        : "/";
    return new URL(raw, base).toString();
  } catch {
    return "/" + raw.replace(/^\/+/, "");
  }
}

/* -----------------------
   Helper: backend URL builder
   ----------------------- */
function buildBackendUrl(path: string) {
  const base = (import.meta.env.VITE_BACKENDAPI as string) || "";
  if (!base) return path;
  return `${base.replace(/\/$/, "")}${path}`;
}

/* -----------------------
   Component
   ----------------------- */
export default function ProductSection() {
  const navigate = useNavigate();
  const location = useLocation();

  // preview mode when ?preview=true in URL
  const urlSearch = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const previewMode = urlSearch.get("preview") === "true";

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [categories, setCategories] = useState<Category[]>(localCategories);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(localSubcategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filtered & paginated
  const filteredSubcategories = useMemo(
    () => (selectedCategoryId ? subcategories.filter((s) => s.categoryId === selectedCategoryId) : []),
    [selectedCategoryId, subcategories]
  );

  const totalPages = Math.max(1, Math.ceil(filteredSubcategories.length / ITEMS_PER_PAGE));
  const paginatedSubcategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubcategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubcategories, currentPage]);

  /* Fetch categories & subcategories from backend (with fallback)
     - categories endpoint: /api/v1/product/catagory
     - subcategories endpoint: /api/v1/product/subcatagory
  */
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);

      const catUrl = previewMode ? buildBackendUrl("/api/v1/product/catagory?draft=true") : buildBackendUrl("/api/v1/product/catagory");
      const subUrl = previewMode ? buildBackendUrl("/api/v1/product/subcatagory?draft=true") : buildBackendUrl("/api/v1/product/subcatagory");

      try {
        const [catRes, subRes] = await Promise.allSettled([
          fetch(catUrl, { credentials: "include" }),
          fetch(subUrl, { credentials: "include" }),
        ]);

        // helper: parse response into array if possible
        const parseResultToArray = async (r: PromiseSettledResult<Response>) => {
          if (r.status !== "fulfilled") throw r.reason;
          const resp = r.value;
          const ct = resp.headers.get("content-type") || "";
          if (!resp.ok) {
            const text = await resp.text().catch(() => "");
            throw new Error(`Request failed (${resp.status}) - ${text.slice(0, 200)}`);
          }
          if (!ct.includes("application/json") && !ct.includes("text/json")) {
            const text = await resp.text().catch(() => "");
            throw new Error(`Non-JSON response: ${text.slice(0, 200)}`);
          }
          const json = await resp.json();
          // backend shape -> { success: true, data: [...] }
          if (Array.isArray(json)) return json;
          if (Array.isArray(json.data)) return json.data;
          // In case API returns single object, wrap in array
          if (json && typeof json === "object") return json.data ? json.data : [];
          return [];
        };

        const catsArr = await parseResultToArray(catRes).catch((err) => {
          console.warn("Categories fetch parse failed:", err);
          return null;
        });
        const subsArr = await parseResultToArray(subRes).catch((err) => {
          console.warn("Subcategories fetch parse failed:", err);
          return null;
        });

        if (!mounted) return;

        // if we got arrays from backend, map them to our UI shape; otherwise fallback
        if (Array.isArray(catsArr) && catsArr.length) {
          const mappedCats: Category[] = catsArr.map((c: any) => ({
            id: String(c._id),
            name: c.Name ?? c.name ?? "Untitled",
            image: c.Img ?? c.Image ?? c.img ?? "",
            keyDetails: [c.KeyP1, c.KeyP2, c.KeyP3].filter(Boolean),
            // keep raw for any extension
            raw: c,
          }));
          setCategories(mappedCats);
          // if no selection yet, pick the first backend category
          if (!selectedCategoryId) setSelectedCategoryId(mappedCats[0]?.id ?? null);
        } else {
          setCategories(localCategories);
          if (!selectedCategoryId && localCategories.length) setSelectedCategoryId(localCategories[0]?.id ?? null);
        }

        if (Array.isArray(subsArr) && subsArr.length) {
          const mappedSubs: Subcategory[] = subsArr.map((s: any) => {
            // Catagory field sometimes is id string or populated object
            const catId = s.Catagory && typeof s.Catagory === "object" ? s.Catagory._id : s.Catagory;
            return {
              id: String(s._id),
              categoryId: String(catId ?? s.CatagoryId ?? s.Catagory ?? ""),
              name: s.Name ?? s.name ?? "Untitled",
              description: s.Dtext ?? s.description ?? "",
              image: s.Img ?? s.Image ?? "",
              raw: s,
            };
          });
          setSubcategories(mappedSubs);

          // if no selectedCategoryId (fallback), pick first sub's category
          if (!selectedCategoryId && mappedSubs.length) {
            const firstCat = mappedSubs[0].categoryId;
            setSelectedCategoryId(firstCat ?? null);
          }
        } else {
          // fallback to local
          // map local subcategory format to expected if necessary
          setSubcategories(localSubcategories);
          if (!selectedCategoryId && localSubcategories.length) setSelectedCategoryId(localSubcategories[0].categoryId ?? null);
        }
      } catch (err: any) {
        console.error("ProductSection fetch error:", err);
        if (mounted) {
          setError(String(err?.message ?? err));
          setCategories(localCategories);
          setSubcategories(localSubcategories);
          if (!selectedCategoryId && localCategories.length) setSelectedCategoryId(localCategories[0].id);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewMode]);

  // Auto-switch categories every interval
  useEffect(() => {
    if (!categories || categories.length === 0) return;
    const interval = setInterval(() => {
      setSelectedCategoryId((prevId) => {
        const curIndex = categories.findIndex((c) => c.id === prevId);
        const nextIndex = (curIndex + 1) % categories.length;
        return categories[nextIndex].id;
      });
      setCurrentPage(1);
    }, AUTO_SWITCH_INTERVAL);

    return () => clearInterval(interval);
  }, [categories]);

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      setCurrentPage(1);
    } else {
      setSelectedCategoryId(categoryId);
      setCurrentPage(1);
    }
  };

  // show a simple skeleton / loading UX
  if (loading) {
    return (
      <section className="relative w-full max-w-7xl mx-auto py-8 px-4" style={{ minHeight: FIXED_SECTION_HEIGHT }}>
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Loading Products...</h2>
          <p className="text-gray-500">Loading categories and products from CMS...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full max-w-7xl mx-auto py-10 px-4 overflow-hidden" style={{ minHeight: FIXED_SECTION_HEIGHT }}>
      {/* Decorative Background */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-orange-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-2xl" />

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
          Our Product <span className="text-primary">Categories</span>
        </h2>
        <div className="mt-2 w-16 h-1 bg-primary mx-auto rounded-full" />
        <p className="text-gray-700 mt-3 text-sm md:text-base max-w-2xl mx-auto">
          Precision-engineered industrial castings and components built for reliable performance.
        </p>
      </div>

      {/* Show error banner if fetch had an error */}
      {error && (
        <div className="mb-6 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
          <strong>Notice:</strong> Unable to fetch CMS data — using local fallback.
          <div className="mt-1 text-xs text-gray-600">{error}</div>
        </div>
      )}

      {/* Category Cards */}
      <div className="flex justify-center gap-6 md:gap-8 relative z-10 flex-wrap md:flex-nowrap">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer w-full sm:w-[300px] md:w-[32%] ${
              selectedCategoryId === category.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="relative h-52 md:h-56 w-full overflow-hidden">
              <img
                src={resolveImageUrl(category.image)}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/assets/placeholder.jpg")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>
            <div className="p-5 md:p-6">
              <h3 className="font-semibold text-lg md:text-xl text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <ul className="list-disc pl-5 text-gray-700 text-sm md:text-base space-y-1.5 mb-4">
                {(category.keyDetails || []).map((detail: string, idx: number) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // slug is the _id
                  navigate(`/category/${category.id}`);
                }}
                className="inline-block bg-primary text-white text-sm font-semibold py-2 px-5 rounded-full hover:bg-primary/90 transition-all"
              >
                Learn More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Subcategory Section */}
      <div className="relative mt-10 md:mt-12 z-10 min-h-[22rem] overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedCategoryId && filteredSubcategories.length > 0 && (
            <motion.div
              key={selectedCategoryId}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
                Our <span className="text-primary">Products</span>
              </h2>

              {/* Mobile Scrollable Cards */}
              <div className="flex md:hidden overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
                {paginatedSubcategories.map((sub) => (
                  <motion.div
                    key={sub.id}
                    className="flex-shrink-0 w-64 snap-center bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate(`/products/${selectedCategoryId}/${sub.id}`)}
                  >
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={resolveImageUrl(sub.image)}
                        alt={sub.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 text-base mb-1">{sub.name}</h4>
                      <p className="text-gray-700 text-sm mb-2 line-clamp-2">{sub.description}</p>
                      <button className="bg-primary text-white text-xs font-semibold py-1 px-3 rounded-full hover:bg-primary/90 transition-all">
                        Read More →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-6">
                {paginatedSubcategories.map((sub) => (
                  <motion.div
                    key={sub.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                    onClick={() => navigate(`/products/${selectedCategoryId}/${sub.id}`)}
                  >
                    <div className="relative h-32 w-full overflow-hidden">
                      <img
                        src={resolveImageUrl(sub.image)}
                        alt={sub.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">{sub.name}</h4>
                      <p className="text-gray-700 text-sm md:text-base mb-2 line-clamp-2">{sub.description}</p>
                      <button className="bg-primary text-white text-xs font-semibold py-1 px-3 rounded-full hover:bg-primary/90 transition-all">
                        Read More →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-3">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentPage === i + 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } transition`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* no products placeholder */}
          {selectedCategoryId && filteredSubcategories.length === 0 && (
            <motion.div
              key="no-products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-gray-600"
            >
              No products found for this category.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
    </section>
  );
}
