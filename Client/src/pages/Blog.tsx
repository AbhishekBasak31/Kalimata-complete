import { motion } from "framer-motion";
import hqImg from "@/assets/headquarter.jpg";
import officeImg from "@/assets/corporate-office.jpg";
import factory1Img from "@/assets/factory1.jpg";
import factory2Img from "@/assets/factory2.jpg";
import factory3Img from "@/assets/factory3.jpg";

const Blog = () => {
  // Background animated shapes colors
  const shapeColors = [
    "rgba(255,102,0,0.3)",
    "rgba(255,153,51,0.25)",
    "rgba(255,204,51,0.2)",
  ];

  return (
    <section className="relative bg-gray-50 py-36 overflow-hidden">
      {/* Animated Background Shapes */}
      {Array.from({ length: 15 }).map((_, i) => {
        const size = 40 + Math.random() * 80;
        return (
          <motion.div
            key={`shape-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: shapeColors[i % shapeColors.length],
              boxShadow: `0 0 ${size / 2}px ${shapeColors[i % shapeColors.length]}`,
              zIndex: 0,
            }}
            animate={{
              y: [0, -20 + Math.random() * 40, 0],
              x: [0, 20 - Math.random() * 40, 0],
              rotate: [0, 30 - Math.random() * 60, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Hero / Headquarters Section */}
      <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative"
        >
          <img
            src={hqImg}
            alt="Kalimata Headquarters"
            className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 font-[Oswald]">
            Our <span className="text-primary">Headquarters</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-3">
            Central hub for corporate administration, strategy, and management.
          </p>
          <a
            href="https://maps.app.goo.gl/TL8MMM4t6ts4Jp9u6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            P.S Srijan Corporate Park, Unit No: 9, 13th Floor, Tower-1, Salt Lake, Kolkata-700091
          </a>
        </motion.div>
      </div>

      {/* Offices and Factories Section */}
      <div className="container mx-auto px-6 mt-20 max-w-6xl grid md:grid-cols-2 gap-10 items-stretch relative z-10">
        {/* Corporate Office */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center md:text-left h-full hover:scale-105 transition-transform"
        >
          <div className="relative w-full h-56 md:h-64">
            <img src={officeImg} alt="Corporate Office" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="p-6">
            <h3 className="text-3xl font-bold text-gray-900 font-[Oswald] mb-2">
              Registered <span className="text-primary">Office</span>
            </h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
              Central office overseeing corporate administration and operations.
            </p>
            <a
              href="https://maps.app.goo.gl/hBJ3go9bdEHLUjDb8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              14/2 Old China Bazar Street, 3rd Floor, Room No. 213, Kolkata-700001, West Bengal
            </a>
          </div>
        </motion.div>

        {/* Factory 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center md:text-left h-full hover:scale-105 transition-transform"
        >
          <div className="relative w-full h-56 md:h-64">
            <img src={factory1Img} alt="Factory 1" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="p-6">
            <h3 className="text-3xl font-bold text-gray-900 font-[Oswald] mb-2">
              Factory <span className="text-primary">1</span>
            </h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
              Specializes in precision-cast metal solutions and advanced manufacturing.
            </p>
            <a
              href="https://maps.app.goo.gl/a1349ECwNgex2WeW7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              Andul Road, P.O Village-Podrah, Howrah-711109
            </a>
          </div>
        </motion.div>

        {/* Factory 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center md:text-left h-full hover:scale-105 transition-transform"
        >
          <div className="relative w-full h-56 md:h-64">
            <img src={factory2Img} alt="Factory 2" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="p-6">
            <h3 className="text-3xl font-bold text-gray-900 font-[Oswald] mb-2">
              Factory <span className="text-primary">2</span>
            </h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
              Produces high-quality metal components with modern automation.
            </p>
            <a
              href="https://maps.app.goo.gl/BCHz2yzQuXEpaF7U9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              1/89 Bidhan Road, Sahebdihi, Bankura-722204
            </a>
          </div>
        </motion.div>

        {/* Factory 3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center md:text-left h-full hover:scale-105 transition-transform"
        >
          <div className="relative w-full h-56 md:h-64">
            <img src={factory3Img} alt="Factory 3" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="p-6">
            <h3 className="text-3xl font-bold text-gray-900 font-[Oswald] mb-2">
              Factory <span className="text-primary">3</span>
            </h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
              Specializes in heat treatment and metal finishing operations.
            </p>
            <a
              href="https://maps.app.goo.gl/BCHz2yzQuXEpaF7U9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              1/89 Bidhan Road, Sahebdihi, Bankura-722204
            </a>
          </div>
        </motion.div>

        {/* Factory 4 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center md:text-left h-full hover:scale-105 transition-transform"
        >
          <div className="relative w-full h-56 md:h-64">
            <img src={factory3Img} alt="Factory 4" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="p-6">
            <h3 className="text-3xl font-bold text-gray-900 font-[Oswald] mb-2">
              Factory <span className="text-primary">4</span>
            </h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
              Specializes in heat treatment and metal finishing operations.
            </p>
            <a
              href="https://maps.app.goo.gl/5QCLFfuCGpMKKFkX8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              Plot-Q, Plasto Steel Park, Ghutghoria, Bankura-722202
            </a>
          </div>
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-6 mt-24 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-lg p-10 text-center"
        >
          <h3 className="text-4xl font-bold text-gray-900 mb-6 font-[Oswald]">
            Our <span className="text-primary">Values</span> at Kalimata Group
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mt-8 text-left">
            {[
              { title: "Quality", desc: "We are committed to excellence in every aspect of our operations, ensuring our products meet the highest industry standards." },
              { title: "Integrity", desc: "We conduct business with honesty and transparency, building trust with customers, employees, and partners." },
              { title: "Innovation", desc: "We embrace technology and creative thinking to drive improvement and create cutting-edge solutions." },
              { title: "Customer Focus", desc: "Our customers are at the heart of everything we do; we tailor our solutions to exceed their expectations." },
              { title: "Sustainability", desc: "We are dedicated to eco-friendly practices that protect the environment and ensure a sustainable future." },
              { title: "Collaboration & Respect", desc: "We value teamwork, safety, and mutual respect — empowering our people to achieve continuous growth and improvement." },
            ].map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer hover:cursor-[url('/cursor-arrow.svg'),_pointer]"
              >
                <h4 className="text-xl font-semibold text-primary mb-2">{value.title}</h4>
                <p className="text-gray-700">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background Accents */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
};

export default Blog;
