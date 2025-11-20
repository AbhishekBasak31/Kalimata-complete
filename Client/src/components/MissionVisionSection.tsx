import { motion } from "framer-motion";
import missionImg from "@/assets/mission.jpg";
import visionImg from "@/assets/vision.jpg";
import valuesImg from "@/assets/values.jpg";

const cards = [
  {
    title: "Our Mission",
    text: `Our mission is to deliver world-class casting and engineering solutions that empower
industries across the globe. We integrate innovation, sustainability, and precision
in every process.`,
    img: missionImg,
  },
  {
    title: "Our Vision",
    text: `To become a global benchmark in iron and steel manufacturing through innovation,
excellence, and sustainability. We aim to inspire trust and progress across industries.`,
    img: visionImg,
  },
  {
    title: "Our Values",
    text: `Integrity, innovation, collaboration, and sustainability are at the core of everything
we do. We are committed to ethical practices and long-term value for all stakeholders.`,
    img: valuesImg,
  },
];

export default function MissionVisionValuesCards() {
  return (
    <section className="w-full py-6 md:py-8 px-4 bg-gray-100 text-gray-900">
      {/* Header — matches AboutSection baseline */}
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
          Our <span className="text-primary">Mission, Vision & Values</span>
        </h2>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-3" />
        <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          Discover what drives our company forward.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="flex-1 bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200"
          >
            <div className="relative h-64 md:h-72">
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mb-2">
                {card.title}
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {card.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
