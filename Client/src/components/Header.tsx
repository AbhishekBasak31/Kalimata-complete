import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Phone,
  Mail,
  Facebook,
  Linkedin,
  Instagram,
  FileText,
  MessageCircle,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si"
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { categories } from "@/data/category";
import { subcategories } from "@/data/subcategory";

/* ---------------- Smooth Scroll Helper ---------------- */
const smoothScroll = (elementId: string) => {
  const target = document.querySelector(elementId);
  if (!target) return;

  const start = window.scrollY;
  const end = (target as HTMLElement).offsetTop - 60;
  const distance = end - start;
  const duration = 600;
  let startTime: number | null = null;

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    window.scrollTo(0, start + distance * ease);
    if (elapsed < duration) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

/* ---------------- Types ---------------- */
interface SubCategory {
  name: string;
  slug: string;
}
interface Category {
  name: string;
  slug: string;
  subCategories: SubCategory[];
}

/* ---------------- Build Category Tree ---------------- */
const productCategories: Category[] = categories.map((cat) => ({
  name: cat.name,
  slug: cat.id,
  subCategories: subcategories
    .filter((sub) => sub.categoryId === cat.id)
    .map((sub) => ({ name: sub.name, slug: sub.id })),
}));

/* ---------------- Header Component ---------------- */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [enquireHovered, setEnquireHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) {
      setScrolled(true);
      return;
    }
    const handleScroll = () => setScrolled(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "#contact" },
    { name: "Careers", href: "/careers" },
  ];

  const aboutPages = [
    { name: "Company Profile", href: "/about/company-profile" },
    { name: "Board of Directors", href: "/about/board-of-directors" },
    { name: "CSR", href: "/about/csr" },
    { name: "Mission & Vision", href: "/about/mission-vision" },
  ];

  const handleNavClick = (href: string) => {
    if (href === "/") {
      if (isHomePage) window.scrollTo({ top: 0, behavior: "smooth" });
      else navigate("/");
    } else if (href.startsWith("/")) navigate(href);
    else if (isHomePage) smoothScroll(href);
    else navigate(`/${href.replace("#", "")}`);
  };

  const handleCategoryClick = (slug: string) => navigate(`/category/${slug}`);
  const handleSubCategoryClick = (catSlug: string, subSlug: string) =>
    navigate(`/products/${catSlug}/${subSlug}`);

  /* ---------------- JSX ---------------- */
  return (
    <>
      {/* ---------------- Header ---------------- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "backdrop-blur-md bg-white/80 shadow-md" : "bg-transparent"
        }`}
      >
        {/* ---------------- Contact Bar ---------------- */}
        <div
          className={`py-2 text-xs transition-all duration-500 ${
            scrolled
              ? "bg-primary text-primary-foreground"
              : "bg-transparent text-white"
          }`}
        >
          <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4 text-center sm:text-left">
            {/* Contact Info */}
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
              <a href="tel:+919830698226" className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> +91 98306 98226
              </a>
              <a
                href="mailto:info@kalimatagroup.co.in"
                className="flex items-center gap-1"
              >
                <Mail className="h-3 w-3" /> info@kalimatagroup.co.in
              </a>
            </div>

            {/* ✅ Social Links (Visible on All Devices) */}
            <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap mt-1 sm:mt-0">
              <span className="text-[10px] sm:text-xs">Follow us:</span>
              <a
                href="https://www.facebook.com/share/1Z8KxCfVg1/"
                target="_blank"
                className="hover:text-[#1877F2] transition-colors"
              >
                <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/kalimatagroup/"
                target="_blank"
                className="hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
              <a
                href="https://www.instagram.com/kalimatagroup?igsh=NGFxMDBhMHJ1MjJ2"
                target="_blank"
                className="hover:text-[#E1306C] transition-colors"
              >
                <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* ---------------- Main Nav ---------------- */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center shrink-0">
              <img
                src={logo}
                alt="Kalimata Group"
                className={`h-8 md:h-10 w-auto transition-all duration-500 ${
                  scrolled ? "invert-0" : "invert"
                }`}
              />
            </a>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-6 relative">
              <button
                onClick={() => handleNavClick("/")}
                className={`font-medium text-sm ${
                  scrolled
                    ? "text-black hover:text-primary"
                    : "text-white hover:text-orange-400"
                }`}
              >
                Home
              </button>

              <DropdownMenu
                title="Products"
                scrolled={scrolled}
                productCategories={productCategories}
                onCategory={handleCategoryClick}
                onSubCategory={handleSubCategoryClick}
              />

              <DropdownMenuSimple
                title="About Us"
                scrolled={scrolled}
                pages={aboutPages}
                onNavigate={handleNavClick}
              />

              {navItems
                .filter((i) => i.name !== "Home")
                .map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`font-medium text-sm ${
                      scrolled
                        ? "text-black hover:text-primary"
                        : "text-white hover:text-orange-400"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}

              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                onClick={() => navigate("/auth?tab=login")}
              >
                LOGIN
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden transition-colors ${
                scrolled ? "text-black" : "text-white"
              }`}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* ---------------- Mobile Nav ---------------- */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 mt-1 rounded-lg shadow-lg animate-fade-in">
              <nav className="py-3 px-2 text-sm">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      handleNavClick(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block py-2 px-3 w-full text-left rounded hover:bg-gray-100 hover:text-primary"
                  >
                    {item.name}
                  </button>
                ))}

                {/* Product Categories */}
                <div className="mt-3">
                  <span className="block px-3 py-2 font-medium text-gray-700">
                    Products
                  </span>
                  {productCategories.map((cat) => (
                    <MobileCategory
                      key={cat.slug}
                      category={cat}
                      handleSubCategoryClick={handleSubCategoryClick}
                      setIsMobileMenuOpen={setIsMobileMenuOpen}
                    />
                  ))}
                </div>

                {/* About */}
                <div className="mt-3 border-t border-gray-200 pt-2">
                  <span className="block px-3 py-2 font-medium text-gray-700">
                    About
                  </span>
                  {aboutPages.map((p) => (
                    <button
                      key={p.href}
                      onClick={() => {
                        handleNavClick(p.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block py-2 px-6 w-full text-left rounded hover:bg-gray-100"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="px-3 pt-3">
                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                    onClick={() => navigate("/auth?tab=login")}
                  >
                    LOGIN
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ---------------- Floating Buttons ---------------- */}
      <div className="fixed top-[40%] right-0 z-40 flex flex-col items-end gap-3 sm:gap-2">
        <a
          href="/enquire"
          onMouseEnter={() => setEnquireHovered(true)}
          onMouseLeave={() => setEnquireHovered(false)}
          className={`flex items-center gap-2 bg-primary text-white font-semibold text-sm py-2 shadow-lg rounded-l-full transition-all duration-300 overflow-hidden ${
            enquireHovered ? "px-5 w-auto" : "px-3 w-16 justify-center"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="whitespace-nowrap hidden sm:inline">
            {enquireHovered ? "Enquire Now" : "Enquire"}
          </span>
        </a>

        {/* <a
          href="https://wa.me/9830698226"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-green-500 text-white px-3 py-2 shadow-lg rounded-l-full hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-5 h-5" />
        </a> */}

        <a
          href="https://wa.me/9830698226"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-green-500 text-white px-3 py-2 shadow-lg rounded-l-full hover:scale-110 transition-transform"
        >
          <SiWhatsapp className="w-5 h-5" />
        </a>


        <a
          href="tel:+9830698226"
          className="flex items-center justify-center bg-blue-600 text-white px-3 py-2 shadow-lg rounded-l-full hover:scale-110 transition-transform"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>
    </>
  );
};

export default Header;

/* ---------------- Helper Components ---------------- */
interface DropdownMenuProps {
  title: string;
  scrolled: boolean;
  productCategories: Category[];
  onCategory: (slug: string) => void;
  onSubCategory: (catSlug: string, subSlug: string) => void;
}

const DropdownMenu = ({
  title,
  scrolled,
  productCategories,
  onCategory,
  onSubCategory,
}: DropdownMenuProps) => (
  <div className="relative group">
    <button
      className={`font-medium flex items-center gap-1 text-sm transition-colors ${
        scrolled ? "text-black hover:text-primary" : "text-white hover:text-orange-400"
      }`}
    >
      {title}
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
      {productCategories.map((cat) => (
        <div key={cat.slug} className="relative group/sub border-b last:border-b-0">
          <button
            onClick={() => onCategory(cat.slug)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
          >
            {cat.name}
            {cat.subCategories.length > 0 && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
          {cat.subCategories.length > 0 && (
            <div className="absolute top-0 left-full w-56 bg-white border rounded shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all">
              {cat.subCategories.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => onSubCategory(cat.slug, sub.slug)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

interface DropdownMenuSimpleProps {
  title: string;
  scrolled: boolean;
  pages: { name: string; href: string }[];
  onNavigate: (href: string) => void;
}

const DropdownMenuSimple = ({
  title,
  scrolled,
  pages,
  onNavigate,
}: DropdownMenuSimpleProps) => (
  <div className="relative group">
    <button
      className={`font-medium flex items-center gap-1 text-sm transition-colors ${
        scrolled ? "text-black hover:text-primary" : "text-white hover:text-orange-400"
      }`}
    >
      {title}
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
      {pages.map((page) => (
        <button
          key={page.href}
          onClick={() => onNavigate(page.href)}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
        >
          {page.name}
        </button>
      ))}
    </div>
  </div>
);

interface MobileCategoryProps {
  category: Category;
  handleSubCategoryClick: (catSlug: string, subSlug: string) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const MobileCategory = ({
  category,
  handleSubCategoryClick,
  setIsMobileMenuOpen,
}: MobileCategoryProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
      >
        {category.name}
        {category.subCategories.length > 0 && (
          <svg
            className={`w-3 h-3 transition-transform ${
              open ? "rotate-90" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        )}
      </button>
      {open &&
        category.subCategories.map((sub) => (
          <button
            key={sub.slug}
            onClick={() => {
              handleSubCategoryClick(category.slug, sub.slug);
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left px-6 py-2 hover:bg-gray-100 text-sm"
          >
            {sub.name}
          </button>
        ))}
    </div>
  );
};
