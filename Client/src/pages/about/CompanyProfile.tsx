import { motion } from "framer-motion";
import companyImg1 from "@/assets/casting.jpg";
import companyImg2 from "@/assets/facility.jpg";
import companyImg3 from "@/assets/vision.jpg";

const CompanyProfile = () => {
  const images = [companyImg1, companyImg2, companyImg3];

  // Primary-color themed blurred shapes
  const blurColors = [
    "rgba(255,102,0,0.35)", // primary orange
    "rgba(255,153,51,0.3)", // lighter orange
    "rgba(255,102,0,0.25)", // slightly transparent primary
  ];

  // Shape types: circle or rounded rectangle
  const shapeTypes = ["circle", "roundedRect"];

  return (
    <section className="relative bg-gray-50 pt-24 pb-12 overflow-hidden">
      {/* Animated blurred shapes with rounded corners */}
      {Array.from({ length: 18 }).map((_, i) => {
        const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const size = 30 + Math.random() * 60;

        const shapeStyle = {
          width: size,
          height: size,
          backgroundColor: blurColors[i % blurColors.length],
          borderRadius: shape === "circle" ? "50%" : "20%", // all shapes rounded
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
        {/* Header */}
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
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            A legacy of precision, innovation, and industrial excellence in iron and steel manufacturing.
          </p>
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
              <img
                src={img}
                alt={`Company ${i + 1}`}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </motion.div>
          ))}
        </div>

        {/* Content Cards */}
        <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Precision Manufacturing</h2>
            <p className="text-gray-700 leading-relaxed">
              Expertise in precision casting and metal fabrication with state-of-the-art machinery ensures every component meets stringent quality standards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Advanced Facilities</h2>
            <p className="text-gray-700 leading-relaxed">
              Our production facilities integrate modern technology, automation, and quality assurance systems to achieve superior performance and consistency.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To drive sustainable growth and industrial excellence, delivering innovative solutions and fostering long-term partnerships worldwide.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CompanyProfile;
