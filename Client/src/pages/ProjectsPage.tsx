import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Project, projectsMock } from "@/data/projectsMock";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(projectsMock);
  }, []);

  const sections = [
    {
      title: "Completed Projects",
      status: "completed" as Project["status"],
      bg: "bg-[#001e57] text-white", // Navy blue with white text
      description:
        "A showcase of our successful projects that demonstrate Kalimata Group’s commitment to quality and precision.",
    },
    {
      title: "Ongoing Projects",
      status: "live" as Project["status"],
      bg: "bg-[#f5f5dc] text-gray-900", // Beige with dark text
      description:
        "Our current endeavors, where innovation meets craftsmanship — delivering excellence in real-time.",
    },
    {
      title: "Upcoming Projects",
      status: "upcoming" as Project["status"],
      bg: "bg-primary text-white", // Primary color with white text
      description:
        "A glimpse into our future ventures, expanding horizons and driving technological advancements.",
    },
  ];

  const handleCardClick = (status: Project["status"]) => {
    navigate(`/projects/${status}`);
  };

  return (
    <section className="relative min-h-screen bg-gray-50 py-20 pt-32 overflow-hidden">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 font-[Oswald]">
          Our <span className="text-primary">Projects</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore our journey of excellence — past achievements, ongoing work,
          and future innovations that define Kalimata Group.
        </p>
      </motion.div>

      {/* Cards Row */}
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 max-w-7xl">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            onClick={() => handleCardClick(section.status)}
            className={`relative rounded-2xl cursor-pointer overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 p-10 flex flex-col justify-end text-center ${section.bg}`}
          >
            {/* Content */}
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold mb-3"
              >
                {section.title}
              </motion.h2>
              <p className="text-sm md:text-base mb-6">{section.description}</p>

              <motion.button
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition"
              >
                Explore
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated Background Accents */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
};

export default ProjectsPage;
