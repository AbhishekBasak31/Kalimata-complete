// src/components/CSR.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import csrImg1 from "@/assets/company1.jpg";
import csrImg2 from "@/assets/company2.jpg";
import csrImg3 from "@/assets/company3.jpg";
import { csrApi } from "../../Backend"; // adjust path if your Backend file lives elsewhere

const FALLBACK_IMAGES = [csrImg1, csrImg2, csrImg3];

const CSR: React.FC = () => {
  const [items, setItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await csrApi.getAll();
        // backend returns { success: true, data: [...] } or sometimes data directly
        const data = res?.data?.data ?? res?.data;
        if (mounted) {
          if (Array.isArray(data)) {
            // keep newest first (backend likely already sorted but ensure it)
            setItems(data.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          } else {
            setItems([]);
          }
        }
      } catch (err: any) {
        console.error("CSR fetch error:", err);
        if (mounted) setError(err?.response?.data?.message ?? err?.message ?? "Failed to load CSR data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // if backend has less cards than we want, use fallback images and filler content
  const displayItems = items.length
    ? items
    : [
        { _id: "fallback-1", Img: FALLBACK_IMAGES[0], Htext: "Environmental Sustainability", Dtext: "We adopt eco-friendly processes..." },
        { _id: "fallback-2", Img: FALLBACK_IMAGES[1], Htext: "Community Development", Dtext: "Supporting local education and healthcare..." },
        { _id: "fallback-3", Img: FALLBACK_IMAGES[2], Htext: "Employee Welfare", Dtext: "Promoting safety, learning and diversity..." },
      ];

  // Colors and shapes used by the original design
  const blurColors = [
    "rgba(255,102,0,0.35)", // primary orange
    "rgba(255,153,51,0.3)", // lighter orange
    "rgba(255,102,0,0.25)", // slightly transparent primary
  ];
  const shapeTypes = ["circle", "roundedRect"];

  return (
    <section className="relative bg-gray-50 pt-24 pb-12 overflow-hidden">
      {/* Animated blurred shapes */}
      {Array.from({ length: 16 }).map((_, i) => {
        const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const size = 30 + Math.random() * 60;
        const shapeStyle = {
          width: size,
          height: size,
          backgroundColor: blurColors[i % blurColors.length],
          borderRadius: shape === "circle" ? "50%" : "20%",
        };
        return (
          <motion.div
            key={`shape-${i}`}
            className="absolute pointer-events-none"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              zIndex: 0,
              ...shapeStyle,
            }}
            animate={{
              y: [0, -10 + Math.random() * 10, 0],
              x: [0, 10 - Math.random() * 10, 0],
              rotate: [0, 15 - Math.random() * 30, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 8 + Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        );
      })}

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-[Oswald]">
            Corporate <span className="text-primary">Social Responsibility</span>
          </h1>

          {loading ? (
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">Loading CSR activities...</p>
          ) : error ? (
            <p className="mt-3 text-red-600 max-w-2xl mx-auto text-sm md:text-base">{error}</p>
          ) : (
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              We strive to create positive social and environmental impact through responsible business practices.
            </p>
          )}
        </motion.div>

        {/* CSR Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayItems.map((activity, i) => {
            // prefer backend image; if missing use fallback image by index
            const imgSrc = activity.Img || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
            const title = activity.Htext || activity.title || `Activity ${i + 1}`;
            const desc = activity.Dtext || activity.description || "Description coming soon.";

            return (
              <motion.div
                key={activity._id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-40 md:h-44">
                  <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4 md:p-5 flex-1 flex flex-col">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{title}</h2>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed flex-1">{desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CSR;
