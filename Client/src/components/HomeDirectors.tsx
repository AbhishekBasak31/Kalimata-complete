// src/components/AboutCompanySection.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import introVideo from "@/assets/introduction.mp4"; // local fallback
import { homeAboutApi } from "../Backend"; // adjust if needed

const companyHighlights = [
  { title: "Expertise & Experience", text: "Years of specialized knowledge in casting and foundry processes." },
  { title: "State-of-the-Art Technology", text: "Advanced equipment ensuring precision and high-quality outcomes." },
  { title: "Safety & Sustainability", text: "Strict safety protocols and eco-friendly practices for reduced impact." },
  { title: "Diverse Product Range", text: "Components for automotive, aerospace, and construction." },
];

// small helper to ensure the value is a string URL
const normalizeVideoUrl = (v: any): string | null => {
  if (!v) return null;
  if (typeof v === "string") {
    const t = v.trim();
    if (!t) return null;
    // basic URL check: if it doesn't start with http/https, try to add https
    if (!/^https?:\/\//i.test(t)) return "https://" + t;
    return t;
  }
  // if the API returned an object like { url } or { secure_url }, try to extract
  if (typeof v === "object") {
    return normalizeVideoUrl(v.secure_url ?? v.url ?? v.src ?? v);
  }
  return null;
};

const AboutCompanySection: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [headTitle, setHeadTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await homeAboutApi.getAll();
        console.log("homeAboutApi.getAll() response:", res);
        const arr = res?.data?.data ?? res?.data ?? [];
        if (!mounted) return;

        // handle either single object or array
        const items = Array.isArray(arr) ? arr : [arr];
        if (items.length > 0) {
          // choose latest by updatedAt or createdAt
          const sorted = items
            .slice()
            .filter(Boolean)
            .sort((a: any, b: any) => {
              const ta = new Date(a?.updatedAt ?? a?.createdAt ?? 0).getTime();
              const tb = new Date(b?.updatedAt ?? b?.createdAt ?? 0).getTime();
              return tb - ta;
            });
          const latest = sorted[0];
          const candidate = normalizeVideoUrl(latest?.Vedios ?? latest?.Vedios1 ?? latest?.video ?? latest?.videoUrl ?? latest?.Videos);
          setVideoUrl(candidate);
          setHeadTitle(latest?.Title ?? latest?.Htext ?? null);
        } else {
          setVideoUrl(null);
          setHeadTitle(null);
        }
      } catch (err: any) {
        console.error("homeAbout fetch error:", err);
        setError(err?.response?.data?.message ?? err?.message ?? "Failed to load about data");
        setVideoUrl(null);
        setHeadTitle(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const headerTitle = headTitle ?? "About Us";
  // prefer backend video, fallback to local
  const videoSrc = videoUrl ?? introVideo;

  return (
    <section className="relative bg-gray-900 py-8 md:py-10 text-gray-100 overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`glow-${i}`}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: `${100 + Math.random() * 200}px`,
            height: `${100 + Math.random() * 200}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: `rgba(255, 165, 0, ${0.12 + Math.random() * 0.18})`,
            zIndex: 0,
          }}
        />
      ))}

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="container mx-auto px-4 max-w-5xl relative z-10 text-center">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            {loading ? <span className="opacity-80">Loading…</span> : error ? <span className="text-red-400">Error loading title</span> : (
              <>
                {headerTitle.split(" ").slice(0, 1).join(" ")} <span className="text-primary">{headerTitle.split(" ").slice(1).join(" ") || ""}</span>
              </>
            )}
          </h2>

          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-3" />
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            Delivering exceptional casting and foundry solutions with quality, innovation, and sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {companyHighlights.map((highlight, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }} className="bg-gray-800/80 p-4 rounded-xl shadow-md border border-white/10 hover:bg-gray-800/90 transition">
              <h3 className="text-base md:text-lg font-semibold text-orange-400 mb-1">{highlight.title}</h3>
              <p className="text-gray-300 text-sm md:text-base leading-snug">{highlight.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="mt-8 md:mt-10 flex justify-center relative z-10">
        <div className="w-full max-w-3xl aspect-[6/3] rounded-xl overflow-hidden shadow-xl border border-white/10">
          {/* NOTE: key forces re-mount when videoSrc changes which helps browsers to pick up new URL */}
          <video
            key={videoSrc ?? "fallback-video"}
            className="w-full h-full object-cover rounded-xl"
            autoPlay
            loop
            muted
            playsInline
            controls /* keep controls for debugging; remove if you want autoplay-only */
            crossOrigin="anonymous"
          >
            {/* source type helps the browser */}
            <source src={videoSrc as string} type="video/mp4" />
            {/* fallback text */}
            Your browser does not support the video tag — try opening the video link directly: <a href={String(videoSrc)} target="_blank" rel="noreferrer" className="underline">{String(videoSrc)}</a>
          </video>
        </div>
      </div>
    </section>
  );
};

export default AboutCompanySection;
