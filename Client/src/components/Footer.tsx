// src/components/Footer.tsx
import React, { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoImg from "@/assets/logo.png";

// local/static fallback data (kept as a fallback)
import { categories as staticCategories } from "@/data/category";
import { subcategories as staticSubcategories } from "@/data/subcategory";

// <-- ADDED: import APIs (adjust path if your Backend export lives somewhere else)
import { catagoryApi, subcatApi } from "../Backend";

interface FooterProps {
  onServiceClick?: (serviceKey: string) => void;
}

interface SubCategory {
  id?: string;
  name: string;
  slug: string;
}

interface Category {
  id?: string;
  name: string;
  slug: string;
  subCategories?: SubCategory[];
}

interface AddressItem {
  title?: string;
  address?: string;
  mapsUrl?: string;
}

interface SiteMeta {
  name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  social?: {
    facebook?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    other1?: string | null;
    other2?: string | null;
  };
  footerCredit?: string;
}

const FALLBACK_FOOTER_CREDIT = "© 2023 Kalimata Group. All rights reserved.";

const Footer: React.FC<FooterProps> = ({ onServiceClick }) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [meta, setMeta] = useState<SiteMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // scroll helper
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleLinkClick = (path: string) => {
    navigate(path);
    scrollToTop();
  };

  // NOTE: categorySlug now holds category id
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
    scrollToTop();
  };

  // NOTE: subCategorySlug now holds subcategory id
  const handleSubCategoryClick = (categoryId: string, subCategoryId: string) => {
    navigate(`/products/${categoryId}/${subCategoryId}`);
    scrollToTop();
  };

  // Build categories from local static data (fallback)
  const buildFallbackCategories = (): Category[] =>
    staticCategories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      // ensure slug is id for consistency with requirement
      slug: cat.id || cat.slug || (cat.name || "").toLowerCase().replace(/\s+/g, "-"),
      subCategories: staticSubcategories
        .filter((s: any) => s.categoryId === cat.id)
        .map((s: any) => ({
          id: s.id,
          name: s.name,
          slug: s.id || s.slug || (s.name || "").toLowerCase().replace(/\s+/g, "-"),
        })),
    }));

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchFooterAndCategories() {
      setLoading(true);
      setError(null);

      try {
        // FOOTER: fetch via fetch() like before (keep same behavior)
        const footerRes = await fetch("/api/v1/footer/", { signal: controller.signal }).catch((e) => {
          // swallow to let category attempt continue
          return e;
        });

        if (mounted && footerRes && footerRes.ok) {
          // try to parse JSON safely
          try {
            const j = await footerRes.json();
            if (j && j.success && j.data) {
              const d = j.data;
              const social = {
                facebook: d.SocialLink1 || null,
                instagram: d.SocialLink2 || null,
                linkedin: d.SocialLink3 || null,
                other1: d.SocialLink4 || null,
                other2: d.SocialLink5 || null,
              };

              const siteMeta: SiteMeta = {
                name: "Kalimata Group",
                email: d.mailId || d.mail || null,
                phone: d.contactno || null,
                address: d.address || null,
                social,
                footerCredit: d.copyrightText || d.copyright || null,
              };

              setMeta(siteMeta);

              if (Array.isArray(d.factoryaddress) && d.factoryaddress.length) {
                const mapped = d.factoryaddress.map((fa: any) => ({
                  title: fa.Htext || "Factory",
                  address: fa.Dtext || "",
                  mapsUrl: fa.link || "#",
                }));
                setAddresses(mapped);
              } else {
                setAddresses([]);
              }
            } else {
              // fallback
              setError((prev) => prev ?? "Footer API responded unexpectedly; using fallback.");
              setMeta(null);
              setAddresses([]);
            }
          } catch (parseErr) {
            console.warn("Footer JSON parse failed; using fallback.", parseErr);
            setError((prev) => prev ?? "Footer JSON parse failed; using fallback.");
            setMeta(null);
            setAddresses([]);
          }
        } else {
          // footer request failed or returned HTML -> fallback
          setMeta(null);
          setAddresses([]);
        }

        // CATEGORIES: use provided axios-based catagoryApi
        try {
          const resp = await catagoryApi.getAll();
          const j = resp?.data;
          if (mounted && j && j.success && Array.isArray(j.data)) {
            // Map categories - use id as slug (per request)
            const cats = (j.data as any[]).map((c) => {
              const catId = c._id || c.id;
              return {
                id: catId,
                name: c.Name || c.name || "Unnamed",
                // set slug to id (so navigation uses id)
                slug: String(catId),
                subCategories:
                  Array.isArray(c.subCategories) && c.subCategories.length
                    ? c.subCategories.map((s: any) => ({
                        id: s._id || s.id,
                        name: s.Name || s.name || s.SubcatName || "Unnamed",
                        // sub slug set to id
                        slug: String(s._id || s.id),
                      }))
                    : [],
              } as Category;
            });

            // If any category lacks subCategories, try to fill with static fallback
            const catsWithSubs = cats.map((cat) => {
              if (cat.subCategories && cat.subCategories.length) return cat;
              const staticSubs = staticSubcategories
                .filter((s: any) => s.categoryId === (cat.id || cat.slug))
                .map((s: any) => ({
                  id: s.id,
                  name: s.name,
                  slug: s.id || s.slug || (s.name || "").toLowerCase().replace(/\s+/g, "-"),
                }));
              return { ...cat, subCategories: staticSubs };
            });

            setCategories(catsWithSubs);
          } else {
            // fallback: attempt to fetch subcategories separately and assemble
            console.warn("Category API returned unexpected shape — attempting subcat fallback.");
            // try subcatApi.getAll()
            try {
              const subResp = await subcatApi.getAll();
              const subJ = subResp?.data;
              if (subJ && subJ.success && Array.isArray(subJ.data)) {
                // build a map of categoryId -> subcats
                const map = new Map<string, SubCategory[]>();
                subJ.data.forEach((s: any) => {
                  const cat = s.Catagory && (s.Catagory._id || s.Catagory.id);
                  if (!cat) return;
                  const entry = map.get(cat) || [];
                  entry.push({
                    id: s._id || s.id,
                    name: s.Name || s.name || "Unnamed",
                    slug: String(s._id || s.id),
                  });
                  map.set(cat, entry);
                });

                // If cat API failed, try to build categories from map keys with static names
                const built = Array.from(map.keys()).map((catId) => ({
                  id: catId,
                  name: catId, // we don't have proper name from cat api; fallback to id
                  slug: String(catId),
                  subCategories: map.get(catId) || [],
                }));

                if (built.length) {
                  setCategories(built);
                } else {
                  setCategories(buildFallbackCategories());
                }
              } else {
                setCategories(buildFallbackCategories());
              }
            } catch (subErr) {
              console.warn("subcat fallback failed", subErr);
              setCategories(buildFallbackCategories());
            }
          }
        } catch (catErr) {
          console.error("Category fetch failed", catErr);
          setCategories(buildFallbackCategories());
          setError((prev) => prev ?? "Failed to load categories — using fallback.");
        }
      } catch (err: any) {
        if (err && (err.name === "AbortError" || err === "AbortError")) {
          // ignore abort
        } else {
          console.error("Error while fetching footer/categories:", err);
          setError((prev) => prev ?? "Failed to load footer data — using fallback content.");
          setMeta(null);
          setAddresses([]);
          setCategories(buildFallbackCategories());
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchFooterAndCategories();

    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // social links with fallback to the previous static links
  const socials = {
    facebook: meta?.social?.facebook || "https://www.facebook.com/share/1Z8KxCfVg1/",
    instagram:
      meta?.social?.instagram ||
      "https://www.instagram.com/kalimatagroup?igsh=NGFxMDBhMHJ1MjJ2",
    linkedin: meta?.social?.linkedin || "https://www.linkedin.com/company/kalimatagroup/",
  };

  const footerCreditText = meta?.footerCredit || FALLBACK_FOOTER_CREDIT;

  return (
    <footer className="bg-steel-dark text-white text-xs relative overflow-hidden">
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-gray-300">
          {/* Company Info */}
          <div className="space-y-4">
            <button
              onClick={() => handleLinkClick("/")}
              className="flex flex-col gap-2 items-start"
              aria-label="Go to Home"
            >
              <img src={logoImg} alt={meta?.name || "Kalimata Group"} className="h-24 w-auto invert drop-shadow-md" />
              <p className="text-gray-400 text-xs leading-snug max-w-[220px]">
                {meta?.name ? `${meta.name} — Indigenous Minds Engineering Wonders` : "Indigenous Minds Engineering Wonders"}
              </p>
            </button>

            {/* Social Icons (external) */}
            <div className="flex gap-2 mt-3">
              {[

                { Icon: Facebook, href: socials.facebook },
                { Icon: Instagram, href: socials.instagram },
                { Icon: Linkedin, href: socials.linkedin },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </a>
              ))}
            </div>

            {loading ? <p className="text-xs text-gray-400">Loading...</p> : null}
            {error ? <p className="text-xs text-amber-300">{error}</p> : null}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold italic mb-3 text-lg text-white">Quick Links</h4>
            <nav className="space-y-1.5">
              {[

                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Blog", path: "/blog" },
                { name: "Company Profile", path: "/about/company-profile" },
                { name: "Board of Directors", path: "/about/board-of-directors" },
                { name: "CSR", path: "/about/csr" },
                { name: "Mission & Vision", path: "/about/mission-vision" },
                { name: "Careers", path: "/careers" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="block text-gray-300 hover:text-primary transition-colors text-left w-full text-sm"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Our Products (dynamic) */}
          <div>
            <h4 className="font-semibold italic mb-3 text-lg text-white">Our Products</h4>
            <nav className="space-y-2">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => handleCategoryClick(String(category.id))}
                    className="block text-gray-300 hover:text-primary transition-colors text-left text-sm"
                  >
                    {category.name}
                  </button>

                  {category.subCategories && category.subCategories.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {category.subCategories!.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubCategoryClick(String(category.id), String(sub.id))}
                          className="block text-gray-400 hover:text-primary transition-colors text-left text-xs"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {!categories.length && !loading && <p className="text-gray-400 text-xs">No categories available</p>}
            </nav>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold italic mb-3 text-lg text-white">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Phone className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${meta?.phone || "+919830698226"}`} className="hover:text-primary transition-colors">
                    {meta?.phone || "+91 98306 98226"}
                  </a>
                  <p className="text-gray-400 text-xs">24/7 Support</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <a href={`mailto:${meta?.email || "info@kalimatagroup.co.in"}`} className="hover:text-primary transition-colors">
                    {meta?.email || "info@kalimatagroup.co.in"}
                  </a>
                  <p className="text-gray-400 text-xs">Business Inquiries</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href="https://www.google.com/maps/place/Kalimata+Vyapaar+Private+Limited,+Kolkata+700001,+West+Bengal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {meta?.address || "Industrial Area, Kolkata"}
                  </a>
                  <p className="text-gray-400 text-xs">West Bengal, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="bg-steel-dark/90 border-t border-steel-light/20">
        <div className="container mx-auto px-6 py-12 text-gray-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-xs leading-relaxed">
            {addresses.length > 0
              ? addresses.map((a, idx) => (
                  <div key={idx}>
                    <h5 className="text-primary font-semibold mb-3">{a.title}</h5>
                    <a href={a.mapsUrl || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors block">
                      <span dangerouslySetInnerHTML={{ __html: (a.address || "").replace(/\n/g, "<br/>") }} />
                    </a>
                  </div>
                ))
              : (
                <>
                  {/* fallback static addresses */}
                  <div>
                    <h5 className="text-primary font-semibold mb-3">Registered Office</h5>
                    <a href="https://maps.app.goo.gl/hBJ3go9bdEHLUjDb8" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors block">
                      Kalimata Group of Companies <br />
                      14/2 Old China Bazar Street, 3rd Floor, Room No. 213,
                      Kolkata-700001, West Bengal
                    </a>
                  </div>

                  <div>
                    <h5 className="text-primary font-semibold mb-3">Head Office</h5>
                    <a href="https://maps.app.goo.gl/TL8MMM4t6ts4Jp9u6" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors block">
                      Kalimata Ispat Private Limited <br />
                      P.S Srijan Corporate Park, Unit No: 9, 13th Floor, Tower-1,
                      Plot-G2, Block-GP, Sector-V, Salt Lake, Kolkata-700091, West
                      Bengal
                    </a>
                  </div>

                  <div>
                    <h5 className="text-primary font-semibold mb-3">Factory 1</h5>
                    <a href="https://maps.app.goo.gl/a1349ECwNgex2WeW7" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors block">
                      Kalimata Ispat Industries Private Limited <br />
                      Andul Road, Chunavati More, PO - Podrah, PS - Sankrail, Dist - Howrah, West Bengal - 711109.
                    </a>
                  </div>

                  <div>
                    <h5 className="text-primary font-semibold mb-3">Factory 2</h5>
                    <a href="https://maps.app.goo.gl/KBK5cMUqnZD5EASHA" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors block">
                      Kalimata Ispat Industries Private Limited <br />
                      1/98, Bidhan Road,vill-Sahebdihi, District-Bankura, P.S-Barjora, P.O- Hatasuria S.O,West Bengal-722204
                    </a>
                  </div>

                  <div>
                    <h5 className="text-primary font-semibold mb-3">Factory 3</h5>
                    <a href="https://maps.app.goo.gl/KBK5cMUqnZD5EASHA" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors block">
                      Kalimata Vyapaar Private Limited <br />
                      1/98, Bidhan Road,vill-Sahebdihi, District-Bankura, P.S-Barjora, P.O- Hatasuria S.O,West Bengal-722204
                    </a>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-steel-light/20 py-4 bg-steel-dark/95">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] text-gray-400">
          <p>{footerCreditText}</p>
          <div className="flex gap-4">
            <button onClick={() => handleLinkClick("/privacy-policy")} className="hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleLinkClick("/terms-of-service")} className="hover:text-primary transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
