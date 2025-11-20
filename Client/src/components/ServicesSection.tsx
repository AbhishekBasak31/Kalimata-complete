import React from "react";
import processVideo from "@/assets/foundry-pour.mp4"; // ✅ Local video import

const ProcessSection = () => {
  return (
    <section
      id="process"
      className="relative py-6 md:py-8 bg-gray-900 text-white overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---------------- Section Header ---------------- */}
        <div className="text-center mb-6 md:mb-8">
          <p className="text-primary text-xs font-semibold uppercase tracking-wide mb-1">
            Our Process
          </p>

          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Experience <span className="text-primary">Our Workflow</span>
          </h2>

          <div className="w-12 h-1 bg-primary mx-auto rounded-full mb-2" />

          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Transforming raw materials into high-quality products with care.
          </p>
        </div>

        {/* ---------------- Video Section ---------------- */}
        <div className="flex justify-center mt-4">
          <div
            className="
              w-full sm:w-4/5 lg:w-3/5
              rounded-xl overflow-hidden shadow-xl border border-white/10
              aspect-[4/3] sm:aspect-video
            "
          >
            <video
              src={processVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover rounded-xl"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* ---------------- Background Accents ---------------- */}
        <div className="absolute top-10 -left-24 w-64 h-64 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse hidden md:block"></div>
        <div className="absolute bottom-10 -right-24 w-72 h-72 sm:w-80 sm:h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse hidden md:block"></div>
      </div>
    </section>
  );
};

export default ProcessSection;
