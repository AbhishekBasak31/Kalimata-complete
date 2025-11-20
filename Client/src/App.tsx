import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// 🌐 Core Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutUs from "@/components/AboutUs";
import ServiceDetailModal from "@/components/ServiceDetailModal";
import ServicesSection from "@/components/ServicesSection";

// 🧭 Pages
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import InternalProductDetailsPage from "@/pages/InternalProductDetailsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import Blog from "@/pages/Blog";
import ContactPage from "@/pages/ContactPage";
import ServicePage from "@/pages/ServicePage";
import NotFound from "@/pages/NotFound";
import CategoryPage from "@/pages/CategoryPage";
import SubCategoryPage from "@/pages/SubCategoryPage";
import CorporatePage from "@/pages/CorporatePage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage";
import EnquirePage from "@/pages/EnquirePage";
import CareersPage from "@/pages/CareersPage";

// 🧭 About Sub-Pages
import CompanyProfile from "@/pages/about/CompanyProfile";
import BoardOfDirectors from "@/pages/about/BoardOfDirectors";
import CSR from "@/pages/about/CSR";
import MissionVision from "@/pages/about/MissionVision";
import AdminMain from "./pages/admin/Main/Main";
import Dashboard from "./pages/admin/Submodule/Dashboard";
import DetailsRouter from "./pages/admin/Submodule/DetailRouter";

// 🧭 Scroll To Top Component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

// ⚙️ React Query Setup
const queryClient = new QueryClient();

const App = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Global Toasters */}
        <Toaster />
        <Sonner />

        <BrowserRouter>
          {/* Global Header */}
          <Header />

          {/* Smooth Scroll on Route Change */}
          <ScrollToTop />

          {/* All App Routes */}
          <Routes>
            {/* 🏠 Home & Auth */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* 🏢 Corporate */}
            <Route path="/corporate" element={<CorporatePage />} />

            {/* 🧱 Projects */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:categorySlug" element={<ProjectDetailsPage />} />
            <Route
              path="/projects/:categorySlug/:projectId"
              element={<ProjectDetailsPage />}
            />

            {/* 📝 Enquiry Page */}
            <Route path="/enquire" element={<EnquirePage />} />

            {/* 🏷️ Categories & Products */}
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/subcategory/:subCategorySlug" element={<SubCategoryPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route
              path="/products/:categorySlug/:subCategorySlug"
              element={<ProductsPage />}
            />
            <Route
              path="/products/:categorySlug/:subCategorySlug/:productId"
              element={<ProductDetailsPage />}
            />
            <Route
              path="/internal-products/:productId"
              element={<InternalProductDetailsPage />}
            />

            {/* ⚙️ Services */}
            <Route path="/services" element={<ServicesSection />} />
            <Route path="/services/:slug" element={<ServicePage />} />

            {/* 📜 Legal & Info Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsPage />} />

            {/* 📰 Blog, Contact, About */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/aboutus" element={<AboutUs />} />

            {/* 🏢 About Sub-Pages */}
            <Route path="/about/company-profile" element={<CompanyProfile />} />
            <Route path="/about/board-of-directors" element={<BoardOfDirectors />} />
            <Route path="/about/csr" element={<CSR />} />
            <Route path="/about/mission-vision" element={<MissionVision />} />

            {/* 💼 Careers */}
            <Route path="/careers" element={<CareersPage />} />
        <Route path="/admin" element={<AdminMain />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="details/:type" element={<DetailsRouter />} /> {/* <-- plural */}
        </Route>
            {/* ❌ 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Global Footer */}
          <Footer onServiceClick={(serviceKey) => setSelectedService(serviceKey)} />

          {/* 🪟 Service Modal */}
          {selectedService && (
            <ServiceDetailModal
              serviceTitle={selectedService}
              onClose={() => setSelectedService(null)}
            />
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
