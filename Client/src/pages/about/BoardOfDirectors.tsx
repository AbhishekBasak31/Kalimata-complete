// src/components/BoardOfDirectors.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import director1 from "@/assets/director1.jpg";
import director2 from "@/assets/director2.jpg";
import director3 from "@/assets/director3.jpg";
// <-- change this import to where your bdirectorApi is exported
// e.g. import { bdirectorApi } from "@/lib/bdirectorApi";
// or import bdirectorApi from "@/lib/bdirectorApi";
import bdirectorApi, { api } from "../../Backend"; // <-- adjust path if needed
import type { ApiResponse } from "../../Backend";

type BDirectorResp = {
  _id?: string;
  Img1?: string;
  Desig1?: string;
  Dtext1?: string;
  Name1?: string;

  Img2?: string;
  Desig2?: string;
  Dtext2?: string;
  Name2?: string;

  Img3?: string;
  Desig3?: string;
  Dtext3?: string;
  Name3?: string;
};

const LoadingCard = () => (
  <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center">
    <div className="w-40 h-56 rounded-2xl bg-gray-100 animate-pulse mb-4" />
    <div className="h-4 w-48 bg-gray-100 animate-pulse mb-2" />
    <div className="h-3 w-36 bg-gray-100 animate-pulse" />
  </div>
);

const DirectorCard = ({
  image,
  designation,
  name,
  quote,
  reversed = false,
}: {
  image?: string;
  designation?: string;
  name?: string;
  quote?: string;
  reversed?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className={`flex flex-col md:flex-row items-center gap-4 md:gap-6 ${
      reversed ? "md:flex-row-reverse" : ""
    }`}
  >
    <div className="relative flex-shrink-0">
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 border-2 border-primary rounded-2xl"></div>
      <div className="absolute inset-0 -translate-x-1.5 -translate-y-1.5 border-2 border-secondary rounded-2xl"></div>
      <img
        src={image}
        alt={name}
        className="relative w-40 h-56 object-cover rounded-2xl shadow-md"
        onError={(e: any) => {
          // fallback in case invalid image url
          e.currentTarget.src = director1;
        }}
      />
    </div>

    <div className="flex-1 text-center md:text-left">
      <p className="uppercase text-primary font-semibold tracking-wide text-sm md:text-base">
        {designation}
      </p>
      <blockquote className="italic text-sm md:text-base text-gray-800 mt-1 mb-2 leading-relaxed">
        “{quote}”
      </blockquote>
      <div className="text-base md:text-lg font-bold text-gray-900">{name}</div>
    </div>
  </motion.div>
);

const BoardOfDirectors: React.FC = () => {
  const [item, setItem] = useState<BDirectorResp | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchLatest = async () => {
      setLoading(true);
      setErr(null);
      try {
        // Prefer getLatest if available in your API wrapper
        // If your wrapper only exposes getAll(), replace with getAll() and pick items.data[0]
        const res: ApiResponse<any>= await api.get("/api/v1/about/bdirector");
        // two possible shapes: { success:true, data: {...} } or { success:true, data: [ {...} ] }
        const d = res?.data?.data;
        let result: BDirectorResp | null = null;
        if (!d) {
          result = null;
        } else if (Array.isArray(d)) {
          result = d.length ? d[0] : null;
        } else {
          result = d;
        }

        if (mounted) setItem(result);
      } catch (error: any) {
        console.error("BoardOfDirectors fetch error:", error);
        setErr(error?.response?.data?.message || error?.message || "Failed to load directors");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLatest();
    return () => {
      mounted = false;
    };
  }, []);

  // build directors array from API response (fall back to static data if API missing)
  const directorsFromApi = (data: BDirectorResp | null) => {
    if (!data) return null;
    return [
      {
        designation: data.Desig1 || "Founder",
        name: data.Name1 || "Founder Name",
        image: data.Img1 || director1,
        quote: data.Dtext1 || "",
      },
      {
        designation: data.Desig2 || "Managing Director",
        name: data.Name2 || "MD Name",
        image: data.Img2 || director2,
        quote: data.Dtext2 || "",
      },
      {
        designation: data.Desig3 || "Managing Director",
        name: data.Name3 || "MD Name",
        image: data.Img3 || director3,
        quote: data.Dtext3 || "",
      },
    ];
  };

  // static fallback directors (your original content)
  const staticDirectors = [
    {
      designation: "Founder",
      name: "Mr. Mahendra Kumar Jhawar",
      image: director2,
      quote:
        "Our vision is rooted in integrity, innovation, and excellence. We focus on advancing technology, sustainable practices, and ethical governance. By prioritizing quality, efficiency, and customer satisfaction, we build long-term partnerships with clients. Every product reflects our commitment to reliability and precision. Through strategic planning and innovation, we strive to remain at the forefront of industrial excellence, setting benchmarks that inspire both our workforce and the broader sector, while ensuring growth benefits both society and the industry.",
    },
    {
      designation: "Managing Director",
      name: "Mr. Anant Jhawar",
      image: director1,
      quote:
        "We believe consistent improvement and technology investment form the backbone of growth. By empowering our workforce through training and mentorship, we ensure operational excellence. Customer satisfaction guides all decisions, from product design to delivery. Sustainability and ethical practices are central to our approach. Through teamwork, forward-looking strategies, and commitment to excellence, we aim to expand globally while maintaining core values, serving clients and communities with integrity, precision, and trust at every stage of operations.",
    },
    {
      designation: "Managing Director",
      name: "Mr. Vikas Jhawar",
      image: director3,
      quote:
        "Through teamwork, strategic expansion, and pursuit of excellence, we strengthen our legacy of innovation. Our mission is to deliver high-quality products while fostering a creative and responsible work culture. Modern technologies and advanced manufacturing ensure efficiency and sustainability. Client satisfaction, transparency, and long-term partnerships guide us, while social initiatives focus on community development and environmental stewardship. We aim to build a resilient, innovative, and ethically-driven organization that empowers employees and contributes positively to the global industrial landscape.",
    },
  ];

  const directors = directorsFromApi(item) ?? staticDirectors;

  return (
    <section className="relative bg-gray-50 pt-24 pb-12 overflow-hidden">
      {/* Animated blurred shapes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const size = 30 + Math.random() * 60;
        const shapeStyle: React.CSSProperties = {
          width: size,
          height: size,
          backgroundColor: ["rgba(255,102,0,0.3)", "rgba(255,153,51,0.25)", "rgba(255,102,0,0.2)"][i % 3],
          borderRadius: Math.random() > 0.5 ? "50%" : "20%",
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

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center font-[Oswald]">
          Board of <span className="text-primary">Directors</span>
        </h1>

        {loading ? (
          <div className="space-y-6 md:space-y-8">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : err ? (
          <div className="text-center text-red-600 py-8">{err}</div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            {directors.map((d, i) => (
              <div key={i}>
                <DirectorCard
                  image={d.image}
                  designation={d.designation}
                  name={d.name}
                  quote={d.quote}
                  reversed={i % 2 !== 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BoardOfDirectors;
