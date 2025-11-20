// src/components/CompanyProfile.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import companyImg1 from "@/assets/casting.jpg";
import companyImg2 from "@/assets/facility.jpg";
import companyImg3 from "@/assets/vision.jpg";
import { cprofileApi } from "../../Backend";

const FALLBACK_IMAGES = [companyImg1, companyImg2, companyImg3];

const CompanyProfile = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await cprofileApi.getAll();
        const data = res?.data?.data ?? res?.data;

        if (mounted) {
          setProfiles(Array.isArray(data) ? data : []);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.response?.data?.message ?? "Failed to load company profile");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const latest = profiles?.[0];

  const backendImages = profiles.slice(0, 3).map((p) => p.Img).filter(Boolean);
  const images = [
    ...backendImages,
    ...FALLBACK_IMAGES.slice(0, 3 - backendImages.length),
  ].slice(0, 3);

  const blurColors = [
    "rgba(255,102,0,0.35)",
    "rgba(255,153,51,0.3)",
    "rgba(255,102,0,0.25)",
  ];
  const shapeTypes = ["circle", "roundedRect"];

  return (
    <section className="relative bg-gray-50 pt-24 pb-12 overflow-hidden">
      {/* Background shapes */}
      {Array.from({ length: 18 }).map((_, i) => {
        const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const size = 30 + Math.random() * 60;

        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              width: size,
              height: size,
              backgroundColor: blurColors[i % blurColors.length],
              borderRadius: shape === "circle" ? "50%" : "20%",
              zIndex: 0,
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

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-[Oswald]">
            Company <span className="text-primary">Profile</span>
          </h1>

          {loading ? (
            <p className="mt-4 text-gray-600">Loading...</p>
          ) : error ? (
            <p className="mt-4 text-red-600">{error}</p>
          ) : (
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              {latest?.Htext ??
                "A legacy of precision, innovation, and industrial excellence in iron and steel manufacturing."}
            </p>
          )}
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-lg"
            >
              <img src={img} className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </motion.div>
          ))}
        </div>

        {/* ========= DYNAMIC BACKEND CARD GRID ========= */}
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
          {profiles.length > 0 ? (
            profiles.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between"
              >
                {/* heading */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {p.Htext}
                </h2>

                {/* description */}
                <p className="text-gray-700 leading-relaxed mb-4">{p.Dtext}</p>

                {/* image preview */}
               
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              No company profile available.
            </p>
          )}
        </div>
        {/* ========= END DYNAMIC CARDS ========= */}
      </div>
    </section>
  );
};

export default CompanyProfile;
