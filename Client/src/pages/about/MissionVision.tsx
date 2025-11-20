import { motion } from "framer-motion";
import missionImg from "@/assets/company1.jpg"; // replace with your mission image
import visionImg from "@/assets/company3.jpg"; // replace with your vision image

const MissionVision = () => {
  // Colors for background animated shapes/lines
  const shapeColors = [
    "rgba(255,255,255,0.1)",
    "rgba(255,255,255,0.15)",
    "rgba(255,255,255,0.08)",
  ];

  return (
    <section className="relative bg-gray-900 py-24 overflow-hidden">
      {/* Background animated shapes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${20 + Math.random() * 80}px`,
            height: `${20 + Math.random() * 80}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: shapeColors[i % shapeColors.length],
            boxShadow: "0 0 30px rgba(255,255,255,0.3)",
            zIndex: 0,
          }}
          animate={{
            y: [0, -20 + Math.random() * 40, 0],
            x: [0, 20 - Math.random() * 40, 0],
            rotate: [0, 30 - Math.random() * 60, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4 + Math.random() * 2, // faster animation
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white font-[Oswald]">
            Mission & <span className="text-primary">Vision</span>
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-base md:text-lg">
            Driving innovation, sustainability, and excellence in every solution we provide.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-12 gap-6 items-center mb-24"
        >
          {/* Image */}
          <div className="md:col-span-4">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-96 md:h-full rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.6)]"
            >
              <img
                src={missionImg}
                alt="Mission"
                className="w-full h-full object-cover rounded-3xl"
              />
            </motion.div>
          </div>

          {/* Text */}
          <div className="md:col-span-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800 rounded-3xl p-8 md:p-12 shadow-lg relative z-10"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                Our mission is to provide innovative, high-quality casting and manufacturing solutions that empower industries worldwide. 
                We are committed to delivering exceptional value by combining advanced technology, meticulous craftsmanship, and sustainable practices. 
                Every project is approached with integrity, precision, and dedication to customer satisfaction, ensuring long-term partnerships and mutual growth. 
                Beyond products, we focus on fostering knowledge sharing, enhancing operational efficiency, and continuously improving our processes to exceed expectations.
                Through this holistic approach, we aim to enable industries to thrive while contributing to a sustainable and responsible future.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-12 gap-6 items-center"
        >
          {/* Text */}
          <div className="md:col-span-8 md:order-1 order-2">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800 rounded-3xl p-8 md:p-12 shadow-lg relative z-10"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300 leading-relaxed">
                Our vision is to become a global leader in foundry and engineering solutions by consistently fostering innovation, sustainability, and operational excellence. 
                We strive to create advanced, reliable, and eco-conscious solutions that elevate industry standards and empower our clients to achieve long-term success. 
                By integrating technology, quality management, and ethical practices, we aim to shape a future where our contributions positively impact communities, employees, and stakeholders alike. 
                We envision a company that not only excels in manufacturing but also inspires others through commitment to sustainability, social responsibility, and continuous growth.
              </p>
            </motion.div>
          </div>

          {/* Image */}
          <div className="md:col-span-4 md:order-2 order-1">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-96 md:h-full rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.6)]"
            >
              <img
                src={visionImg}
                alt="Vision"
                className="w-full h-full object-cover rounded-3xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;
