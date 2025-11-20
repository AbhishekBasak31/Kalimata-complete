import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

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

const timelineData = [
  { year: 1987, title: "Kalimata Ispat Industries Pvt Ltd-Unit", description: "Started Manufacturing Elastic Railway Clips for Indian Railways", image: factory },
  { year: 2008, title: "Helical Coil Expansion", description: "Started manufacturing helical coins for wagons and locomotives", image: Helical_coil },
  { year: 2010, title: "Ductile Iron Shoulders", description: "Entered into manufacturing of Ductile Iron Shoulders for concrete sleepers used in Indian Railways.", image: Shoulders },
  { year: 2011, title: "Elastic Clip Division", description: "Expanded our manufacturing for Elastic Rail clips in our new division of Kalimata Vyapaar.", image: Elastic },
  { year: 2012, title: "ADI Casting Expansion", description: "Expanded operations into Austempered Ductile Iron Castings for enhanced durability.", image: Austempered },
  { year: 2013, title: "Another Forging Unit", description: "Launched a new forging unit under Kalimata Ispat Industries with a dedicated Ductile Iron division.", image: Another },
  { year: 2017, title: "High Tensile Products", description: "Expanded foundry operations of Kalimata Ispat  Foundry Division", image: High_Tensile_Products },
  { year: 2018, title: "Capacity Upgrade to 12,000MT", description: "Enhanced foundry capacity from 8,000 to 12,000 tons per year.", image: Capacity_Upgrade },
  { year: 2019, title: "Automated Foundry Setup", description: "Established a new foundry. Established a fully automated greenfield foundry project using German technology.", image: Automated_Foundry },
  { year: 2020, title: "Production Scale-Up", description: "Increased annual capacity to 16,000 tons, scaling production from 60 lakh to 1.2 crore pieces per year.", image: Production_Scale },
  { year: 2022, title: "Rubber Sole Plate Unit", description: "Launched a new division for Composite Grooved Rubber Sole Plate production.", image: Rubber },
  { year: 2024, title: "Spring Capacity Doubled", description: "Increased manufacturing capacity from 2,400 to 4,800 tons for helical compression coil springs.", image: Spring },
  { year: 2025, title: "Plastic Molding Division", description: "Established a new plastic molding division for manufacturing SVN Liners.", image: Plastic },
];

const TimelineSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

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
    if (!isInView || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timelineData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isInView, isHovered]);

  const progressWidth =
    timelineData.length > 1 ? (activeIndex / (timelineData.length - 1)) * 100 : 0;

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
                  key={item.year}
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
                    {item.year}
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
            {timelineData.map((item) => (
              <div
                key={item.year}
                className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center px-2 sm:px-4"
              >
                {/* Image */}
                <Card className="overflow-hidden rounded-xl shadow-industrial">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover"
                    loading="lazy"
                  />
                </Card>

                {/* Text — matches AboutSection card text system */}
                <div className="mt-4 md:mt-0 text-center md:text-left px-1">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-primary mb-1">
                    {item.year}
                  </h3>
                  <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed max-w-prose mx-auto md:mx-0">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
