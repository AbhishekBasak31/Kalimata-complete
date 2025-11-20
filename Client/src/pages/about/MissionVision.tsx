// src/components/MissionVision.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import missionImg from "@/assets/company1.jpg"; // local fallback
import visionImg from "@/assets/company3.jpg"; // local fallback
import { mAndVApi } from "../../Backend"; // adjust path to your Backend export

type MAndVItem = {
  _id: string;
  Img1?: string;
  Htext1?: string;
  Dtext1?: string;
  Img2?: string;
  Htext2?: string;
  Dtext2?: string;
  createdAt?: string;
};

const MissionVision: React.FC = () => {
  const [item, setItem] = useState<MAndVItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Colors for background animated shapes/lines
  const shapeColors = [
    "rgba(255,255,255,0.1)",
    "rgba(255,255,255,0.15)",
    "rgba(255,255,255,0.08)",
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await mAndVApi.getAll();
        // backend returns { success: true, data: [...] } or raw array
        const data = res?.data?.data ?? res?.data ?? [];
        if (!Array.isArray(data) || data.length === 0) {
          if (mounted) setItem(null);
        } else {
          // choose newest by createdAt
          const sorted = data.slice().sort((a: MAndVItem, b: MAndVItem) => {
            const ta = new Date(a.createdAt || 0).getTime();
            const tb = new Date(b.createdAt || 0).getTime();
            return tb - ta;
          });
          if (mounted) setItem(sorted[0] ?? null);
        }
      } catch (err: any) {
        console.error("mAndV fetch error:", err);
        if (mounted) setError(err?.response?.data?.message ?? err?.message ?? "Failed to load Mission & Vision");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // pick images: backend first, else fallback
  const img1 = item?.Img1 || missionImg;
  const img2 = item?.Img2 || visionImg;

  const htext1 = item?.Htext1 || "Our Mission";
  const dtext1 =
    item?.Dtext1 ||
    "Our mission is to provide innovative, high-quality casting and manufacturing solutions that empower industries worldwide. We are committed to delivering exceptional value by combining advanced technology, meticulous craftsmanship, and sustainable practices.";

  const htext2 = item?.Htext2 || "Our Vision";
  const dtext2 =
    item?.Dtext2 ||
    "Our vision is to become a global leader in foundry and engineering solutions by consistently fostering innovation, sustainability, and operational excellence.";

  return (
    <section className="relative bg-gray-900 py-24 overflow-hidden">
      {/* Background animated shapes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${20 + Math.random() * 80}px`,
            height: `${20 + Math.random() * 80}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: shapeColors[i % shapeColors.length],
            boxShadow: "0 0 30px rgba(255,255,255,0.3)",
            zIndex: 0,
          }}
          animate={{
            y: [0, -20 + Math.random() * 40, 0],
            x: [0, 20 - Math.random() * 40, 0],
            rotate: [0, 30 - Math.random() * 60, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4 + Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white font-[Oswald]">
            Mission & <span className="text-primary">Vision</span>
          </h1>

          {loading ? (
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-base md:text-lg">Loading Mission & Vision…</p>
          ) : error ? (
            <p className="mt-4 text-red-400 max-w-2xl mx-auto text-base md:text-lg">{error}</p>
          ) : (
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
              {item ? item.Htext1 || item.Htext2 || "Driving innovation, sustainability, and excellence in every solution we provide." : "Driving innovation, sustainability, and excellence in every solution we provide."}
            </p>
          )}
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-12 gap-6 items-center mb-24"
        >
          {/* Image */}
          <div className="md:col-span-4">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-96 md:h-full rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.6)]"
            >
              <img src={img1} alt={htext1} className="w-full h-full object-cover rounded-3xl" />
            </motion.div>
          </div>

          {/* Text */}
          <div className="md:col-span-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800 rounded-3xl p-8 md:p-12 shadow-lg relative z-10"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">{htext1}</h2>
              <p className="text-gray-300 leading-relaxed">{dtext1}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-12 gap-6 items-center"
        >
          {/* Text */}
          <div className="md:col-span-8 md:order-1 order-2">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800 rounded-3xl p-8 md:p-12 shadow-lg relative z-10"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">{htext2}</h2>
              <p className="text-gray-300 leading-relaxed">{dtext2}</p>
            </motion.div>
          </div>

          {/* Image */}
          <div className="md:col-span-4 md:order-2 order-1">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-96 md:h-full rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.6)]"
            >
              <img src={img2} alt={htext2} className="w-full h-full object-cover rounded-3xl" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;
