"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { homeBannerApi } from "../Backend"; // adjust path if your Backend export sits elsewhere

// local fallbacks (keeps original look if API fails)
const FALLBACK_VIDEOS = [
  "/videos/foundry-pour.mp4",
  "/videos/machine-sparks.mp4",
  "/videos/molten-metal.mp4",
];
const FALLBACK_BP = [
  { title: "Precision", icon: "⚙️" },
  { title: "Master Craftsmanship", icon: "🔨" },
  { title: "Global Reach", icon: "🌍" },
];
const FALLBACK_HTEXT = "Indigenous Minds\nEngineering Wonders.";

const HeroSection = () => {
  const [videos, setVideos] = useState<string[]>(FALLBACK_VIDEOS);
  const [highlights, setHighlights] = useState<{ title: string; icon: string }[]>(
    FALLBACK_BP
  );
  const [htext, setHtext] = useState<string>(FALLBACK_HTEXT);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // prefer latest endpoint; fallback to getAll
        let res;
        try {
          res = await homeBannerApi.getLatest();
          const data = res?.data?.data ?? res?.data;
          if (!data) throw new Error("No latest banner");
          if (!mounted) return;

          const v = [
            data.Vedios1 || "",
            data.Vedios2 || "",
            data.Vedios3 || "",
          ].filter(Boolean);
          const bp = [
            data.Bp1 || "",
            data.Bp2 || "",
            data.Bp3 || "",
          ].filter(Boolean);
          setVideos(v.length ? v : FALLBACK_VIDEOS);
          setHighlights(
            bp.length
              ? bp.map((t: string, i: number) => ({ title: t, icon: FALLBACK_BP[i]?.icon ?? "•" }))
              : FALLBACK_BP
          );
          setHtext(data.Htext ? data.Htext : FALLBACK_HTEXT);
          return;
        } catch {
          // fallback to getAll
        }

        // fallback: getAll
        res = await homeBannerApi.getAll();
        const arr = res?.data?.data ?? res?.data ?? [];
        if (!Array.isArray(arr) || arr.length === 0) {
          // no data
          if (!mounted) return;
          setVideos(FALLBACK_VIDEOS);
          setHighlights(FALLBACK_BP);
          setHtext(FALLBACK_HTEXT);
          return;
        }
        const data = arr[0];
        if (!mounted) return;
        const v = [
          data.Vedios1 || "",
          data.Vedios2 || "",
          data.Vedios3 || "",
        ].filter(Boolean);
        const bp = [
          data.Bp1 || "",
          data.Bp2 || "",
          data.Bp3 || "",
        ].filter(Boolean);
        setVideos(v.length ? v : FALLBACK_VIDEOS);
        setHighlights(
          bp.length
            ? bp.map((t: string, i: number) => ({ title: t, icon: FALLBACK_BP[i]?.icon ?? "•" }))
            : FALLBACK_BP
        );
        setHtext(data.Htext ? data.Htext : FALLBACK_HTEXT);
      } catch (err) {
        console.error("HeroSection: failed to load banner", err);
        // keep fallbacks
        setVideos(FALLBACK_VIDEOS);
        setHighlights(FALLBACK_BP);
        setHtext(FALLBACK_HTEXT);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // prepare heading lines (preserve line breaks if provided by API)
  const headingLines = (htext || "").split(/\r?\n/).filter(Boolean);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end justify-start overflow-hidden bg-black"
    >
      {/* Background video (use first available video) */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.video
            key={videos[0] ?? "fallback-video"}
            src={videos[0]}
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Gradient overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-10 sm:px-16 pb-24 max-w-5xl">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-4 font-[Oswald] tracking-tight">
            {headingLines.length ? (
              <>
                {headingLines.map((ln, idx) => (
                  <span key={idx} className={idx === 0 ? "" : "text-gray-200 block"}>
                    {idx === 0 ? ln : ln}
                    <br />
                  </span>
                ))}
              </>
            ) : (
              <>{FALLBACK_HTEXT}</>
            )}
            {/* if API provided single-line Htext but you want to emphasize a word like original, you can refine later */}
          </h1>

          <br />

          {/* Highlights (Bps from API) */}
          <div className="flex flex-wrap gap-3">
            {loading ? (
              // subtle placeholder while loading
              <div className="text-white/70 text-sm">Loading highlights...</div>
            ) : (
              highlights.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 text-white/90 text-sm border border-white/10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  <span className="text-base opacity-80">{item.icon}</span>
                  {item.title}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
