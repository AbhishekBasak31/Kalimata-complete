// src/pages/CorporatePage.tsx
import { useState, useEffect } from "react";
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
import corporateVideo from "@/assets/corporate.mp4"; // example video

// Counter component
const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
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
  }, [target]);

  return <span>{count}+</span>;
};

const CorporatePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<null | typeof features[0]>(null);

  const stats = [
    { value: 25, label: "Years Experience" },
    { value: 150, label: "Industries Served" },
    { value: 50, label: "Factories Built" },
  ];

  const features = [
    {
      title: "Well Maintained",
      description: "State-of-the-art facilities, meticulously maintained for performance.",
      fullDescription:
        "Our facilities undergo rigorous maintenance schedules to ensure optimal performance. Dedicated teams for equipment maintenance, quality control systems, and environmental compliance. Preventive programs reduce downtime by 95% and ensure consistent quality.",
      icon: "🔧",
      image: maintenanceImg,
    },
    {
      title: "Industrial Specialist",
      description: "Precision-engineered solutions for complex industrial applications.",
      fullDescription:
        "With over 25 years of experience, our team consists of metallurgists, engineers, and specialists serving industries including automotive, aerospace, and heavy machinery. ISO certified and globally recognized.",
      icon: "⚙️",
      image: specialistImg,
    },
    {
      title: "Latest Equipment",
      description: "Advanced casting and foundry equipment ensures top quality.",
      fullDescription:
        "Computer-controlled furnaces, robotic pouring systems, 3D sand printing, and AI-powered inspection systems. Achieving tolerances of ±0.1mm and superior finishes.",
      icon: "🏭",
      image: equipmentImg,
    },
  ];

  // Animate entrance when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById("corporate");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="corporate" className="relative py-16 pt-24 bg-gray-50">
      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-96 mb-16 overflow-hidden rounded-xl">
        <video
          src={corporateVideo}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
            Kalimata Group <br />
            <span className="text-primary">Corporate Overview</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary uppercase font-semibold tracking-wide mb-2">
            Who We Are
          </p>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Transforming Industries with <span className="text-primary">Innovation</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            Kalimata Group delivers high-quality metal castings, cutting-edge technology, and durable solutions tailored to your industrial needs. Our commitment to innovation and excellence sets us apart.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-extrabold text-primary mb-2">
                <Counter target={stat.value} />
              </div>
              <p className="text-gray-700 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
            >
              <Card className="overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-500 rounded-lg cursor-pointer">
                <div className="h-44 w-full relative">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-4 text-center">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed mb-2">
                    {feature.description}
                  </p>
                  <button
                    className="text-primary text-xs font-semibold hover:underline"
                    onClick={() => setSelectedFeature(feature)}
                  >
                    Read More →
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Detail Dialog */}
        <Dialog
          open={!!selectedFeature}
          onOpenChange={() => setSelectedFeature(null)}
        >
          <DialogContent className="max-w-3xl p-0 rounded-xl overflow-hidden shadow-xl">
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
                <DialogTitle className="flex items-center gap-3 text-xl font-bold mb-2">
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
                  className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default CorporatePage;
