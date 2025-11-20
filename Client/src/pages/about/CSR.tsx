import { motion } from "framer-motion";
import csrImg1 from "@/assets/company1.jpg";
import csrImg2 from "@/assets/company2.jpg";
import csrImg3 from "@/assets/company3.jpg";

const CSR = () => {
  const csrActivities = [
    {
      title: "Environmental Sustainability",
      description:
        "We continually adopt eco-friendly processes and invest in technologies that reduce emissions and waste, ensuring minimal impact on the environment and promoting a greener future.",
      image: csrImg1,
    },
    {
      title: "Community Development",
      description:
        "Regular initiatives to support local education, skill training, and healthcare access in communities around our facilities, empowering people and fostering long-term growth.",
      image: csrImg2,
    },
    {
      title: "Employee Welfare & Ethical Governance",
      description:
        "Promoting workplace safety, continuous learning, diversity, and ethical governance. Ensuring transparency, fairness, and integrity in all our operations for a responsible work environment.",
      image: csrImg3,
    },
  ];

  // Colors for blurred background shapes
  const blurColors = [
    "rgba(255,102,0,0.35)",  // primary orange
    "rgba(255,153,51,0.3)",  // lighter orange
    "rgba(255,102,0,0.25)",  // slightly transparent primary
  ];

  const shapeTypes = ["circle", "roundedRect"];

  return (
    <section className="relative bg-gray-50 pt-24 pb-12 overflow-hidden">
      {/* Animated blurred shapes */}
      {Array.from({ length: 16 }).map((_, i) => {
        const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const size = 30 + Math.random() * 60;

        const shapeStyle = {
          width: size,
          height: size,
          backgroundColor: blurColors[i % blurColors.length],
          borderRadius: shape === "circle" ? "50%" : "20%",
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

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-[Oswald]">
            Corporate <span className="text-primary">Social Responsibility</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            At Kalimata Group, we strive to create a positive social and environmental impact through responsible business practices.
          </p>
        </motion.div>

        {/* CSR Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {csrActivities.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-40 md:h-44">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5 flex-1 flex flex-col">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{activity.title}</h2>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed flex-1">{activity.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CSR;
