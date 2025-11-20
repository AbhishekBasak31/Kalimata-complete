// src/components/AboutSection.tsx
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

import maintenanceImg from "@/assets/maintenance.jpg";
import specialistImg from "@/assets/specialist.jpg";
import equipmentImg from "@/assets/equipment.jpg";

import { homeAboutApi } from "../Backend"; // adjust path if needed

// Updated Counter component with leading zero
const Counter = ({
  target,
  startCounting,
}: {
  target: number;
  startCounting: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 15;
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, startCounting]);

  // Pad single-digit numbers
  const displayCount = count < 10 ? `0${count}` : `${count}`;

  return <span>{displayCount}</span>;
};

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [startCounting, setStartCounting] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<null | {
    title: string;
    fullDescription: string;
    icon?: string;
    image?: string;
  }>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeAbout, setHomeAbout] = useState<any | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);

  // Local fallback content in case backend missing fields
  const FALLBACK_FEATURES = [
    {
      title: "Well Maintained",
      fullDescription:
        "Our facilities undergo rigorous maintenance schedules to ensure optimal performance. Dedicated teams for equipment maintenance, quality control systems, and environmental compliance. Preventive programs reduce downtime by 95% and ensure consistent quality.",
      icon: "🔧",
      image: maintenanceImg,
    },
    {
      title: "Industrial Specialist",
      fullDescription:
        "With over 25 years of experience, our team consists of metallurgists, engineers, and specialists serving industries including automotive, aerospace, and heavy machinery. ISO certified and globally recognized.",
      icon: "⚙️",
      image: specialistImg,
    },
    {
      title: "Latest Equipment",
      fullDescription:
        "Computer-controlled furnaces, robotic pouring systems, 3D sand printing, and AI-powered inspection systems. Achieving tolerances of ±0.1mm and superior finishes.",
      icon: "🏭",
      image: equipmentImg,
    },
  ];

  // Observer for section animations
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) sectionObserver.observe(sectionRef.current);
    return () => sectionObserver.disconnect();
  }, []);

  // Observer only for counters
  useEffect(() => {
    const counterObserver = new IntersectionObserver(
      ([entry]) => {
        setStartCounting(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );

    if (counterRef.current) counterObserver.observe(counterRef.current);
    return () => counterObserver.disconnect();
  }, []);

  // Fetch latest homeAbout from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        let res;
        // try a /latest endpoint if present, else getAll
        try {
          res = await homeAboutApi.getLatest();
        } catch {
          res = await homeAboutApi.getAll();
        }
        const data = res?.data?.data ?? res?.data ?? [];
        // Data can be array or single object
        let latest = null;
        if (Array.isArray(data)) {
          latest = data.length ? data[0] : null;
        } else {
          latest = data;
        }
        if (mounted) setHomeAbout(latest ?? null);
      } catch (err: any) {
        console.error("fetch homeAbout error:", err);
        if (mounted) setError(err?.response?.data?.message ?? err?.message ?? "Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Build stats and features from backend or fallbacks
  const stats = (() => {
    // default fallbacks
    const defaults = [
      { value: 40, label: "Years of Experience", showPlus: true },
      { value: 2, label: "Foundry Units Built", showPlus: false },
      { value: 4, label: "Forging Units Built", showPlus: false },
    ];

    if (!homeAbout) return defaults;

    const n1 = parseInt(String(homeAbout.Num1 || "").replace(/\D/g, ""), 10) || 0;
    const n2 = parseInt(String(homeAbout.Num2 || "").replace(/\D/g, ""), 10) || 0;
    const n3 = parseInt(String(homeAbout.Num3 || "").replace(/\D/g, ""), 10) || 0;

    return [
      { value: n1 || defaults[0].value, label: homeAbout.Htext1 || defaults[0].label, showPlus: true },
      { value: n2 || defaults[1].value, label: homeAbout.Htext2 || defaults[1].label, showPlus: false },
      { value: n3 || defaults[2].value, label: homeAbout.Htext3 || defaults[2].label, showPlus: false },
    ];
  })();

  const features = (() => {
    if (!homeAbout) {
      return FALLBACK_FEATURES;
    }

    const f1 = {
      title: homeAbout.Htext1 ?? FALLBACK_FEATURES[0].title,
      fullDescription: homeAbout.Dtext1 ?? FALLBACK_FEATURES[0].fullDescription,
      icon: "🔧",
      image: homeAbout.Img1 ?? FALLBACK_FEATURES[0].image,
    };
    const f2 = {
      title: homeAbout.Htext2 ?? FALLBACK_FEATURES[1].title,
      fullDescription: homeAbout.Dtext2 ?? FALLBACK_FEATURES[1].fullDescription,
      icon: "⚙️",
      image: homeAbout.Img2 ?? FALLBACK_FEATURES[1].image,
    };
    const f3 = {
      title: homeAbout.Htext3 ?? FALLBACK_FEATURES[2].title,
      fullDescription: homeAbout.Dtext3 ?? FALLBACK_FEATURES[2].fullDescription,
      icon: "🏭",
      image: homeAbout.Img3 ?? FALLBACK_FEATURES[2].image,
    };

    return [f1, f2, f3];
  })();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-8 bg-primary/10 overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        {/* Intro */}
        <div className="text-center mb-6">
          <motion.p
            className="text-primary text-xs font-semibold uppercase tracking-wide mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2 }}
          >
            We are Kalimata Group
          </motion.p>
          <motion.h2
            className="text-2xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Transforming With <span className="text-primary">Innovations</span>
          </motion.h2>
          {/* optional subtitle from backend (use Dtext1 as short subtitle if provided) */}
          {homeAbout?.Dtext1 && (
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {homeAbout.Dtext1}
            </motion.p>
          )}
        </div>

        {/* Stats */}
        <div ref={counterRef} className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="text-4xl font-extrabold text-primary mb-1 drop-shadow-sm">
                <Counter target={stat.value} startCounting={startCounting} />
                {stat.showPlus && <span>+</span>}
              </div>
              <h3 className="text-sm font-medium text-gray-800">{stat.label}</h3>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
            >
              <Card
                className="overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-500 rounded-lg cursor-pointer"
                onClick={() => setSelectedFeature(feature)}
              >
                <div className="h-36 w-full relative">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-4 text-center">
                  {/* Increased icon size */}
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Detail Popup */}
        <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
          <DialogContent className="max-w-2xl p-0 rounded-xl overflow-hidden shadow-xl">
            {selectedFeature && (
              <div className="relative w-full h-64 md:h-80">
                <img
                  src={selectedFeature.image}
                  alt={selectedFeature.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}
            <div className="p-6 bg-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-2">
                  <span className="text-2xl">{selectedFeature?.icon}</span>
                  {selectedFeature?.title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-gray-700">
                  {selectedFeature?.fullDescription}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="px-4 py-1.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Loading / Error indicators */}
        {loading && <div className="mt-6 text-center text-gray-600">Loading...</div>}
        {error && <div className="mt-6 text-center text-red-600">Error: {error}</div>}
      </div>
    </section>
  );
};

export default AboutSection;
