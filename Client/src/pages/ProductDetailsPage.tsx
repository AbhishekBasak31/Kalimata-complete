// src/pages/ProductDetailsPage.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import EnquiryModal from "@/components/EnquiryModal";
import { productApi, subcatApi } from "../Backend"; // <- use the API helpers you exported

type BackendProduct = {
  _id: string;
  Name?: string;
  Dtext?: string;
  Img1?: string;
  Img2?: string;
  Img3?: string;
  CatagoryId?: any;
  SubcatagoryId?: any;
  Cline1?: string;
  Cline2?: string;
  Cline3?: string;
  Cline4?: string;
  Cline5?: string;
  Cline6?: string;
  Tspec1?: string;
  Tspec2?: string;
  Tspec3?: string;
  Tspec4?: string;
  Tspec5?: string;
  Tspec6?: string;
  Tspec7?: string;
  Tspec8?: string;
  Tspec9?: string;
  Tspec10?: string;
  App1?: string;
  App2?: string;
  App3?: string;
  App4?: string;
  App5?: string;
  App6?: string;
  [k: string]: any;
};

type UIProduct = {
  id: string;
  name: string;
  description: string;
  images: string[];
  specifications: Record<string, string>;
  features: string[]; // cement lines
  applications: string[];
  raw: BackendProduct;
};

const ProductDetailsPage: React.FC = () => {
  const { categorySlug, subCategorySlug, productId } = useParams<{
    categorySlug: string;
    subCategorySlug: string;
    productId: string;
  }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<UIProduct | null>(null);
  const [relatedSubcategories, setRelatedSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const specsRef = useRef<HTMLDivElement>(null);

  // map backend product -> UIProduct
  const mapBackendToUI = (p: BackendProduct): UIProduct => {
    const imgs = [p.Img1, p.Img2, p.Img3].filter(Boolean) as string[];
    const features = [p.Cline1, p.Cline2, p.Cline3, p.Cline4, p.Cline5, p.Cline6].filter(Boolean) as string[];
    const applications = [p.App1, p.App2, p.App3, p.App4, p.App5, p.App6].filter(Boolean) as string[];

    const specs: Record<string, string> = {};
    for (let i = 1; i <= 10; i++) {
      const key = `Tspec${i}`;
      if (p[key]) specs[`Technical Spec ${i}`] = String(p[key]);
    }

    return {
      id: String(p._id),
      name: p.Name ?? "Untitled",
      description: p.Dtext ?? "",
      images: imgs.length ? imgs : ["/assets/placeholder.jpg"],
      specifications: specs,
      features,
      applications,
      raw: p,
    };
  };

  // Fetch product and subcategories using productApi & subcatApi
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        // fetch product by id
        const prodRes = await productApi.getById(String(productId));
        const prodData: BackendProduct = prodRes.data?.data ?? prodRes.data;
        if (!prodData) throw new Error("Product not found");

        if (!mounted) return;
        setProduct(mapBackendToUI(prodData));

        // fetch all subcategories (backend returns array under data)
        const subRes = await subcatApi.getAll();
        const subs: any[] = Array.isArray(subRes.data?.data) ? subRes.data.data : [];

        // Backend subcat objects have `.Catagory` as populated object OR id string.
        // Compare categorySlug (you use slug as _id) with sub.Catagory._id or sub.Catagory
        const filtered = subs.filter((s) => {
          const catId = s?.Catagory?._id ?? s?.Catagory;
          return String(catId) === String(categorySlug);
        });

        if (!mounted) return;
        setRelatedSubcategories(filtered);
      } catch (err: any) {
        console.error("ProductDetailsPage error:", err);
        if (!mounted) return;
        setError(err?.response?.data?.message ?? err?.message ?? "Failed to load product");
        setProduct(null);
        setRelatedSubcategories([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [productId, categorySlug]);

  // Auto slide (3s)
  useEffect(() => {
    if (!product) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product?.images.length]);

  // Keep slider height in sync with specs (keeps original behavior)
  useEffect(() => {
    if (!specsRef.current) return;
    const ro = new ResizeObserver(() => {
      // optional: you kept sliderHeight usage previously — left out since design unchanged
    });
    ro.observe(specsRef.current);
    return () => ro.disconnect();
  }, []);

  const handlePrev = () => {
    if (!product) return;
    setCurrentIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleNext = () => {
    if (!product) return;
    setCurrentIndex((prev) => (prev + 1) % product.images.length);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Loading product…</h1>
        <p className="text-gray-500">Fetching product details from backend</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-primary text-white">Retry</Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <Button onClick={() => navigate(-1)} className="bg-primary text-white">Go Back</Button>
      </div>
    );
  }

  return (
    <section className="relative bg-gray-50 min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary to-orange-700 text-white py-20 text-center overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 container mx-auto pt-4 px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 drop-shadow-lg">{product.name}</h1>
          <p className="text-white/90 max-w-3xl mx-auto leading-relaxed text-sm md:text-base">{product.description}</p>
        </motion.div>

        {/* Hero abstract shapes (8 shapes) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`hero-${i}`} className="absolute rounded-full filter blur-3xl pointer-events-none" style={{
            width: `${40 + i * 10}px`, height: `${40 + i * 10}px`,
            top: `${Math.random() * 80}%`, left: `${Math.random() * 80}%`,
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.15)`,
          }} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay pointer-events-none" />
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-6 mt-8 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary transition">Home</Link>{" "}
        /{" "}
        <Link to={`/category/${categorySlug}`} className="hover:text-primary">{categorySlug?.replace("-", " ")}</Link>{" "}
        /{" "}
        <Link to={`/products/${categorySlug}/${subCategorySlug}`} className="hover:text-primary">{subCategorySlug?.replace("-", " ")}</Link>{" "}
        / <span className="text-gray-700">{product.name}</span>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
        {/* Background shapes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`bg-${i}`} className="absolute rounded-full filter blur-3xl pointer-events-none" style={{
            width: `${30 + Math.random() * 80}px`, height: `${30 + Math.random() * 80}px`,
            top: `${Math.random() * 90}%`, left: `${Math.random() * 90}%`,
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.1)`, zIndex: 0,
          }} />
        ))}

        {/* Left: Slider + Specs */}
        <div className="lg:col-span-4 flex flex-col lg:flex-row gap-6 relative z-10">
          {/* Slider */}
          <div className="relative flex-shrink-0 rounded-2xl overflow-hidden shadow-lg w-full lg:w-[350px] h-[350px]">
            <AnimatePresence initial={false}>
              <motion.img
                key={currentIndex}
                src={product.images[currentIndex]}
                alt={`${product.name} ${currentIndex + 1}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover rounded-2xl"
              />
            </AnimatePresence>

            <button onClick={handlePrev} className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/70 hover:bg-white/90 text-gray-800 p-2 rounded-full shadow-md z-20">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNext} className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/70 hover:bg-white/90 text-gray-800 p-2 rounded-full shadow-md z-20">
              <ChevronRight className="w-5 h-5" />
            </button>

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`slider-${i}`} className="absolute rounded-full filter blur-3xl pointer-events-none" style={{
                width: `${30 + i * 10}px`, height: `${30 + i * 10}px`,
                top: `${Math.random() * 80}%`, left: `${Math.random() * 80}%`,
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
              }} />
            ))}
          </div>

          {/* Technical Specifications */}
          <section ref={specsRef} className="flex-1 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Technical Specifications</h2>
            <div className="grid sm:grid-cols-2 gap-y-3 text-sm text-gray-700">
              {Object.entries(product.specifications).length ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <p key={key}><span className="font-semibold text-gray-900">{key}: </span>{value}</p>
                ))
              ) : (
                <p className="text-gray-500">No technical specifications available.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Quick Links */}
        <aside className="lg:col-span-1 relative z-10">
          <div className="sticky top-28 bg-white shadow-md rounded-xl p-6">
            <h3 className="text-lg font-bold text-primary mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {relatedSubcategories.length ? relatedSubcategories.map((s) => {
                const sid = s._id ?? s.id;
                const name = s.Name ?? s.name ?? (s.Catagory?.Name ?? "Subcategory");
                return (
                  <li key={sid}>
                    <Link to={`/products/${categorySlug}/${sid}`} className={`text-sm flex items-center transition-colors ${sid === subCategorySlug ? "text-primary font-medium" : "text-gray-700 hover:text-primary"}`}>
                      <span className="w-2 h-2 rounded-full bg-primary mr-2" /> {name}
                    </Link>
                  </li>
                );
              }) : <li className="text-sm text-gray-500">No subcategories found</li>}
            </ul>
          </div>
        </aside>

        {/* Key Features */}
        <section className="lg:col-span-4 bg-white rounded-2xl shadow-md p-8 mt-6 relative z-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Cement Lining</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {product.features.length ? product.features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-gray-700">
                <CheckCircle2 className="text-primary w-5 h-5 mr-2" /> {feature}
              </li>
            )) : <li className="text-gray-500">No cement lining details available.</li>}
          </ul>
        </section>

        {/* Applications */}
        <section className="lg:col-span-4 bg-white rounded-2xl shadow-md p-8 mt-6 relative z-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Coating</h2>
          {product.applications.length ? (
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {product.applications.map((app, idx) => <li key={idx}>{app}</li>)}
            </ul>
          ) : (
            <p className="text-gray-500">No coating/application details available.</p>
          )}
        </section>

        {/* Enquire Now */}
        <div className="lg:col-span-4 mt-10 text-center relative z-10">
          <Button onClick={() => setSelectedProduct(product.id)} className="bg-gradient-to-r from-primary to-orange-600 text-white text-lg py-3 px-8 rounded-full hover:scale-105 transition-transform">
            Enquire Now →
          </Button>
        </div>
      </div>

      {/* Enquiry Modal */}
      {selectedProduct && <EnquiryModal productId={selectedProduct} productName={product.name} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
};

export default ProductDetailsPage;
