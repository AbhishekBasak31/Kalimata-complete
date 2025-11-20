import { motion } from "framer-motion";
import director1 from "@/assets/director1.jpg";
import director2 from "@/assets/director2.jpg";
import director3 from "@/assets/director3.jpg";

const BoardOfDirectors = () => {
  const directors = [
    {
      designation: "Founder",
      name: "Mr. Mahendra Kumar Jhawar",
      image: director2,
      quote:
        "Our vision is rooted in integrity, innovation, and excellence. We focus on advancing technology, sustainable practices, and ethical governance. By prioritizing quality, efficiency, and customer satisfaction, we build long-term partnerships with clients. Every product reflects our commitment to reliability and precision. Through strategic planning and innovation, we strive to remain at the forefront of industrial excellence, setting benchmarks that inspire both our workforce and the broader sector, while ensuring growth benefits both society and the industry.",
    },
    {
      designation: "Managing Director",
      name: "Mr. Anant Jhawar",
      image: director1,
      quote:
        "We believe consistent improvement and technology investment form the backbone of growth. By empowering our workforce through training and mentorship, we ensure operational excellence. Customer satisfaction guides all decisions, from product design to delivery. Sustainability and ethical practices are central to our approach. Through teamwork, forward-looking strategies, and commitment to excellence, we aim to expand globally while maintaining core values, serving clients and communities with integrity, precision, and trust at every stage of operations.",
    },
    {
      designation: "Managing Director",
      name: "Mr. Vikas Jhawar",
      image: director3,
      quote:
        "Through teamwork, strategic expansion, and pursuit of excellence, we strengthen our legacy of innovation. Our mission is to deliver high-quality products while fostering a creative and responsible work culture. Modern technologies and advanced manufacturing ensure efficiency and sustainability. Client satisfaction, transparency, and long-term partnerships guide us, while social initiatives focus on community development and environmental stewardship. We aim to build a resilient, innovative, and ethically-driven organization that empowers employees and contributes positively to the global industrial landscape.",
    },
  ];

  // Colors for animated shapes
  const blurColors = [
    "rgba(255,102,0,0.3)",  // primary orange
    "rgba(255,153,51,0.25)", // lighter orange
    "rgba(255,102,0,0.2)",  // slightly transparent primary
  ];

  const shapeTypes = ["circle", "roundedRect"];

  return (
    <section className="relative bg-gray-50 pt-24 pb-12 overflow-hidden">
      {/* Animated blurred shapes */}
      {Array.from({ length: 8 }).map((_, i) => {
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

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center font-[Oswald]">
          Board of <span className="text-primary">Directors</span>
        </h1>

        <div className="space-y-6 md:space-y-8">
          {directors.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`flex flex-col md:flex-row items-center gap-4 md:gap-6 ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 border-2 border-primary rounded-2xl"></div>
                <div className="absolute inset-0 -translate-x-1.5 -translate-y-1.5 border-2 border-secondary rounded-2xl"></div>
                <img
                  src={d.image}
                  alt={d.name}
                  className="relative w-40 h-56 object-cover rounded-2xl shadow-md"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <p className="uppercase text-primary font-semibold tracking-wide text-sm md:text-base">
                  {d.designation}
                </p>
                <blockquote className="italic text-sm md:text-base text-gray-800 mt-1 mb-2 leading-relaxed">
                  “{d.quote}”
                </blockquote>
                <div className="text-base md:text-lg font-bold text-gray-900">{d.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoardOfDirectors;
