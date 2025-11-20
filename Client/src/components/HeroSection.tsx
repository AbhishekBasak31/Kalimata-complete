"use client";

import { motion, AnimatePresence } from "framer-motion";

const videos = [
  "/videos/foundry-pour.mp4",
  "/videos/machine-sparks.mp4",
  "/videos/molten-metal.mp4",
];

const highlights = [
  { title: "Precision", icon: "⚙️" },
  { title: "Master Craftsmanship", icon: "🔨" },
  { title: "Global Reach", icon: "🌍" },
];

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end justify-start overflow-hidden bg-black"
    >
      {/* Background video */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.video
            key={0}
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
            Indigenous <span className="text-orange-500">Minds</span>
            <br />
            <span className="text-gray-200">Engineering Wonders.</span>
          </h1>
          
          <br />
          
          {/* <p className="text-base md:text-lg text-gray-300 max-w-md mb-10 leading-relaxed tracking-wide">
            Engineering World-Class Solutions.
          </p> */}

          {/* Highlights */}
          <div className="flex flex-wrap gap-3">
            {highlights.map((item, i) => (
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
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
