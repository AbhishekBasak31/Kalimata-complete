import { motion } from "framer-motion";
import introVideo from "@/assets/introduction.mp4"; // ✅ Local video

const companyHighlights = [
  {
    title: "Expertise & Experience",
    text: "Years of specialized knowledge in casting and foundry processes.",
  },
  {
    title: "State-of-the-Art Technology",
    text: "Advanced equipment ensuring precision and high-quality outcomes.",
  },
  {
    title: "Safety & Sustainability",
    text: "Strict safety protocols and eco-friendly practices for reduced impact.",
  },
  {
    title: "Diverse Product Range",
    text: "Components for automotive, aerospace, and construction.",
  },
];

const AboutCompanySection = () => {
  return (
    <section className="relative bg-gray-900 py-8 md:py-10 text-gray-100 overflow-hidden">
      {/* Background Glowing Shapes */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`glow-${i}`}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            width: `${100 + Math.random() * 200}px`,
            height: `${100 + Math.random() * 200}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: `rgba(255, 165, 0, ${0.15 + Math.random() * 0.2})`,
            zIndex: 0,
          }}
        />
      ))}

      {/* === About Section with Text + Highlights === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 max-w-5xl relative z-10 text-center"
      >
        {/* Header — matches AboutSection baseline */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            About <span className="text-primary">Us</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-3" />
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            Delivering exceptional casting and foundry solutions with quality, innovation, and sustainability.
          </p>
        </div>

        {/* Highlights Grid — compact cards aligned with baseline body scale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {companyHighlights.map((highlight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="bg-gray-800/80 p-4 rounded-xl shadow-md border border-white/10 hover:bg-gray-800/90 transition"
            >
              <h3 className="text-base md:text-lg font-semibold text-orange-400 mb-1">
                {highlight.title}
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-snug">
                {highlight.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* === Intro Video Section Below Text (compact) === */}
      <div className="mt-8 md:mt-10 flex justify-center relative z-10">
        <div className="w-full max-w-3xl aspect-[6/3] rounded-xl overflow-hidden shadow-xl border border-white/10">
          <video
            src={introVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutCompanySection;
