// src/components/TimelineSection.tsx
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { homeMilestoneApi } from "../Backend"; // <-- adjust path to your Backend export

import factory from "@/assets/timeline/factory.jpg";
import Helical_coil from "@/assets/timeline/Helical_coil.jpg";
import Shoulders from "@/assets/timeline/Shoulders.jpg";
import Elastic from "@/assets/timeline/Elastic_Clip.jpg";
import Austempered from "@/assets/timeline/Austempered.jpg";
import Another from "@/assets/timeline/Another_Forging_Unit.jpg";
import High_Tensile_Products from "@/assets/timeline/High_Tensile_Products.jpg";
import Capacity_Upgrade from "@/assets/timeline/Capacity_Upgrade_12,000T.jpg";
import Automated_Foundry from "@/assets/timeline/Automated_Foundry_Setup.jpg";
import Production_Scale from "@/assets/timeline/Production_Scale-Up.jpg";
import Rubber from "@/assets/timeline/Rubber.jpg";
import Spring from "@/assets/timeline/Spring.jpg";
import Plastic from "@/assets/timeline/Plastic.jpg";

const localFallbackImages = [
  factory,
  Helical_coil,
  Shoulders,
  Elastic,
  Austempered,
  Another,
  High_Tensile_Products,
  Capacity_Upgrade,
  Automated_Foundry,
  Production_Scale,
  Rubber,
  Spring,
  Plastic,
];

type ApiMilestone = {
  _id: string;
  Mstone: string;
  Year: string;
  Title: string;
  Desc: string;
  Img?: string;
  createdAt?: string;
  updatedAt?: string;
};

const TimelineSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [timelineData, setTimelineData] = useState<ApiMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);

  // fetch milestones from backend
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await homeMilestoneApi.getAll();
        const arr = res?.data?.data ?? res?.data ?? [];
        if (!mounted) return;

        // Normalize/ensure fields and sort by Year (numeric if possible) or createdAt
        const normalized: ApiMilestone[] = Array.isArray(arr)
          ? arr.map((it: any) => ({
              _id: it._id,
              Mstone: it.Mstone ?? "",
              Year: it.Year ?? "",
              Title: it.Title ?? "",
              Desc: it.Desc ?? "",
              Img: it.Img ?? undefined,
              createdAt: it.createdAt,
              updatedAt: it.updatedAt,
            }))
          : [];

        // prefer sorting by Year numeric descending, fallback to createdAt descending
        const sorted = normalized.slice().sort((a, b) => {
          const an = Number(String(a.Year).replace(/\D/g, "")); // try to extract digits
          const bn = Number(String(b.Year).replace(/\D/g, ""));
          if (!Number.isNaN(an) && !Number.isNaN(bn) && an !== bn) return an - bn; // ascending by year
          // fallback to createdAt
          const ta = new Date(a.createdAt ?? 0).getTime();
          const tb = new Date(b.createdAt ?? 0).getTime();
          return ta - tb;
        });

        // we want oldest -> newest order in timeline, so sorted ascending by year/createdAt
        setTimelineData(sorted);
        setActiveIndex(0);
      } catch (err: any) {
        console.error("fetch timeline error", err);
        setError(err?.response?.data?.message ?? err?.message ?? "Failed to load milestones");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Observe when the section enters/leaves the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
          setActiveIndex(0); // restart from beginning when it appears
        } else {
          setIsInView(false);
        }
      },
      { root: null, threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll slider every 5s, only when visible and not hovered
  useEffect(() => {
    if (!isInView || isHovered || timelineData.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timelineData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isInView, isHovered, timelineData.length]);

  const progressWidth =
    timelineData.length > 1 ? (activeIndex / (timelineData.length - 1)) * 100 : 0;

  // helper to pick fallback image if API doesn't provide one
  const getImageForIndex = (idx: number, itm: ApiMilestone) => {
    if (itm.Img && itm.Img.length > 5) return itm.Img;
    // fallback by index into local array (wrap)
    return localFallbackImages[idx % localFallbackImages.length];
  };

  return (
    <section
      ref={sectionRef}
      className={`py-8 sm:py-10 bg-primary/10 overflow-hidden transition-all duration-700
        ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Company milestones timeline"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading — matches AboutSection */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            Milestones <span className="text-primary">Achieved</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>

        {/* show loading / error */}
        {loading ? (
          <div className="py-12 text-center">Loading milestones…</div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">{error}</div>
        ) : timelineData.length === 0 ? (
          <div className="py-12 text-center text-gray-600">No milestones found.</div>
        ) : (
          <>
            {/* Timeline Years */}
            <div className="relative flex justify-center items-center mb-8 sm:mb-12">
              <div className="relative w-full flex justify-center items-center max-w-[95%] sm:max-w-[80%] mx-auto">
                {/* Base line */}
                <div className="absolute top-1/2 left-0 right-0 h-[4px] bg-muted-foreground/30 rounded-full transform -translate-y-1/2" />
                {/* Progress line */}
                <div
                  className="absolute top-1/2 left-0 h-[4px] bg-primary rounded-full transform -translate-y-1/2 transition-all duration-700"
                  style={{ width: `${progressWidth}%` }}
                />
                {/* Year buttons */}
                <div className="flex justify-between w-full relative z-10 overflow-x-auto scrollbar-hide">
                  {timelineData.map((item, index) => (
                    <button
                      key={item._id}
                      onClick={() => setActiveIndex(index)}
                      className="relative flex flex-col items-center text-center px-2 sm:px-0 flex-shrink-0"
                      aria-current={activeIndex === index ? "step" : undefined}
                    >
                      <span
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white transition-all ${
                          activeIndex >= index ? "bg-primary scale-110" : "bg-gray-400"
                        }`}
                      />
                      <span className="mt-2 sm:mt-3 text-xs sm:text-base font-medium whitespace-nowrap">
                        {item.Year}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Slider */}
            <div className="relative w-full overflow-hidden">
              <div
                className="flex transition-transform duration-700"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {timelineData.map((item, idx) => (
                  <div
                    key={item._id}
                    className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center px-2 sm:px-4"
                  >
                    {/* Image */}
                    <Card className="overflow-hidden rounded-xl shadow-industrial">
                      <img
                        src={getImageForIndex(idx, item)}
                        alt={item.Title}
                        className="w-full h-48 sm:h-56 md:h-64 object-cover"
                        loading="lazy"
                      />
                    </Card>

                    {/* Text — matches AboutSection card text system */}
                    <div className="mt-4 md:mt-0 text-center md:text-left px-1">
                      <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
                        {item.Year}
                      </h3>
                      <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                        {item.Title}
                      </h4>
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-prose mx-auto md:mx-0">
                        {item.Desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TimelineSection;
