// src/pages/ProductsPage.tsx
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { FaThLarge, FaList } from "react-icons/fa";
import { categories as localCategories } from "@/data/category";
import { subcategories as localSubcategoryData } from "@/data/subcategory";
import { products as localProducts, Product as LocalProductType } from "@/data/products";

/* -----------------------
   Helpers: build backend url & mappers
   ----------------------- */
function buildBackendUrl(path: string) {
  const base = (import.meta.env.VITE_BACKENDAPI as string) || "";
  if (!base) return path;
  return `${base.replace(/\/$/, "")}${path}`;
}

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

function mapBackendSubcategory(s: any) {
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

function mapBackendProduct(p: any) {
  const catId = p.CatagoryId && typeof p.CatagoryId === "object" ? p.CatagoryId._id : p.CatagoryId;
  const subId = p.SubcatagoryId && typeof p.SubcatagoryId === "object" ? p.SubcatagoryId._id : p.SubcatagoryId;
  // choose Img1 as hero image fallback to Img2/Img3
  const image = p.Img1 || p.Img2 || p.Img3 || "";
  return {
    id: String(p._id),
    name: p.Name ?? p.name ?? "Untitled",
    description: p.Dtext ?? p.description ?? "",
    image,
    CatagoryId: String(catId ?? ""),
    SubcatagoryId: String(subId ?? ""),
    raw: p,
  };
}

/* -----------------------
   Component
   ----------------------- */
const ProductsPage: React.FC = () => {
  const { categorySlug, subCategorySlug } = useParams<{
    categorySlug?: string;
    subCategorySlug?: string;
  }>();

  const [isGridView, setIsGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // data from backend (with local fallback)
  const [categories, setCategories] = useState(() =>
    (localCategories || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description ?? c.desc ?? "",
      image: c.image,
      keyDetails: c.keyDetails ?? [],
      raw: c,
    }))
  );
  const [subcategories, setSubcategories] = useState(() =>
    (localSubcategoryData || []).map((s: any) => ({
      id: s.id,
      categoryId: s.categoryId,
      name: s.name,
      description: s.description ?? "",
      image: s.image,
      keyDetails: s.keyDetails ?? [],
      raw: s,
    }))
  );
  const [products, setProducts] = useState<LocalProductType[]>(
    () =>
      (localProducts || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        image: p.image,
        category: p.category,
        subcategory: p.subcategory,
        raw: p,
      })) as LocalProductType[]
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug, subCategorySlug]);

  // Fetch backend data
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);

      const catUrl = buildBackendUrl("/api/v1/product/catagory");
      const subUrl = buildBackendUrl("/api/v1/product/subcatagory");
      const prodUrl = buildBackendUrl("/api/v1/product");

      try {
        const [catRes, subRes, prodRes] = await Promise.allSettled([
          fetch(catUrl, { credentials: "include" }),
          fetch(subUrl, { credentials: "include" }),
          fetch(prodUrl, { credentials: "include" }),
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
          if (Array.isArray(json.data)) return json.data;
          if (Array.isArray(json)) return json;
          return [];
        };

        const [catsArr, subsArr, prodsArr] = await Promise.all([
          parse(catRes).catch((e) => {
            console.warn("categories parse failed:", e);
            return null;
          }),
          parse(subRes).catch((e) => {
            console.warn("subcategories parse failed:", e);
            return null;
          }),
          parse(prodRes).catch((e) => {
            console.warn("products parse failed:", e);
            return null;
          }),
        ]);

        if (!mounted) return;

        if (Array.isArray(catsArr) && catsArr.length) {
          setCategories(catsArr.map(mapBackendCategory));
        }
        if (Array.isArray(subsArr) && subsArr.length) {
          setSubcategories(subsArr.map(mapBackendSubcategory));
        }
        if (Array.isArray(prodsArr) && prodsArr.length) {
          setProducts(prodsArr.map(mapBackendProduct));
        }
      } catch (err: any) {
        console.error("ProductsPage fetch error:", err);
        if (mounted) setError(String(err?.message ?? err));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // find category/subcategory based on slug (slug === _id)
  const category = categories.find((c) => c.id === categorySlug);
  const subCategory = subcategories.find((s) => s.id === subCategorySlug);

  // Determine products (use backend product fields mapped earlier)
  const allProducts = useMemo(() => {
    if (subCategory) {
      return products.filter((p: any) => String(p.SubcatagoryId || p.subcategory || p.raw?.SubcatagoryId) === subCategory.id);
    } else if (category) {
      return products.filter((p: any) => String(p.CatagoryId || p.category || p.raw?.CatagoryId) === category.id);
    } else {
      return products;
    }
  }, [products, category, subCategory]);

  // Apply search filter
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return allProducts;
    const q = searchQuery.toLowerCase();
    return allProducts.filter(
      (p) =>
        (p.name ?? "").toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
    );
  }, [searchQuery, allProducts]);

  // Page title / description
  const pageTitle = subCategory ? subCategory.name : category ? category.name : "All Products";
  const pageDescription = subCategory ? subCategory.description : category ? category.description : "Browse our complete product catalog featuring durable, precision-engineered castings and components.";

  if (loading) {
    return (
      <section className="relative bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold mb-2">Loading products…</h2>
          <p className="text-gray-500">Fetching products, categories & subcategories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-primary to-orange-700 text-white py-24 text-center overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">{pageTitle}</h1>
          <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">{pageDescription}</p>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay pointer-events-none" />
      </div>

      {/* Main */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Main Product Display */}
        <div className="lg:col-span-4">
          {/* Breadcrumb + Search + View Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="text-sm text-gray-500">
              <Link to="/" className="hover:text-primary transition">Home</Link>
              {category && (
                <>
                  {" / "}
                  <Link to={`/category/${category.id}`} className="hover:text-primary transition">{category.name}</Link>
                </>
              )}
              {subCategory && (
                <>
                  {" / "}
                  <span className="text-gray-700">{subCategory.name}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
              />

              {/* View Toggle */}
              <div className="flex gap-2">
                <button onClick={() => setIsGridView(true)} className={`p-2 rounded-lg transition-colors ${isGridView ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`} title="Grid View">
                  <FaThLarge />
                </button>
                <button onClick={() => setIsGridView(false)} className={`p-2 rounded-lg transition-colors ${!isGridView ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`} title="List View">
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          <motion.div layout className={`${isGridView ? "grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "flex flex-col gap-6"}`}>
            <AnimatePresence>
              {filteredProducts.length === 0 ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="text-gray-500 text-center text-lg col-span-full">
                  No products found.
                </motion.p>
              ) : (
                filteredProducts.map((product: any, i: number) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex ${isGridView ? "flex-col" : "flex-row items-center"}`}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden ${isGridView ? "h-56 w-full" : "h-48 w-48 flex-shrink-0"}`}>
                      <img src={product.image || "/assets/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/assets/placeholder.jpg")} />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h2>
                      <p className="text-gray-600 text-sm flex-grow line-clamp-3">{product.description}</p>

                      <Link
                        to={`/products/${categorySlug || ""}/${subCategorySlug || ""}/${product.id}`}
                        className="mt-4 inline-block text-center bg-gradient-to-r from-primary to-orange-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
                      >
                        View Details →
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Sidebar: Related Subcategories */}
        {category && (
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white shadow-md rounded-xl p-6">
              <h3 className="text-lg font-bold text-primary mb-3">Related Subcategories</h3>
              <ul className="space-y-2">
                {subcategories.filter((s) => s.categoryId === category.id).map((s) => (
                  <li key={s.id}>
                    <Link to={`/products/${category.id}/${s.id}`} className={`text-sm flex items-center transition-colors ${s.id === subCategorySlug ? "text-primary font-medium" : "text-gray-700 hover:text-primary"}`}>
                      <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
