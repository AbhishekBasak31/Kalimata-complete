import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { projectsMock, Project } from "@/data/projectsMock";

const ProjectDetailsPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();

  // Filter projects by their status (live, completed, upcoming)
  const categoryProjects: Project[] = projectsMock.filter(
    (p) => p.status === categorySlug
  );

  // Create readable heading for category
  const readableCategory =
    categorySlug === "live"
      ? "Ongoing"
      : categorySlug
      ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
      : "Projects";

  // Handle empty category gracefully
  if (!categoryProjects.length) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          No Projects Found
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn’t find any {readableCategory.toLowerCase()} projects at the moment.
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md"
        >
          ← Back to Projects
        </button>
      </div>
    );
  }

  return (
    <section className="relative bg-gray-50 py-20 pt-32 overflow-hidden">
      {/* 🌟 Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
          {readableCategory} Projects
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Explore our {readableCategory.toLowerCase()} projects that showcase our
          commitment to innovation, quality, and precision craftsmanship.
        </p>
      </motion.div>

      {/* 🧱 Project Cards Grid */}
      <div className="container mx-auto px-6 max-w-6xl grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {categoryProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            onClick={() => navigate(`/projects/${categorySlug}/${project.id}`)}
          >
            {/* Image Section */}
            <div className="relative h-56 w-full overflow-hidden">
              <img
                src={project.images?.[0]}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
              </div>

              <ul className="text-gray-700 text-sm space-y-1 mb-4">
                {project.highlights.slice(0, 3).map((highlight, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary mr-1">•</span> {highlight}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(`/projects/${categorySlug}/${project.id}`)}
                className="mt-auto inline-block bg-gradient-to-r from-primary to-orange-600 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
              >
                View Details →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ✨ Decorative Background Blurs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl animate-pulse" />
    </section>
  );
};

export default ProjectDetailsPage;
