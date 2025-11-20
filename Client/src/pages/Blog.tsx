// src/components/Blog.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import hqImg from "@/assets/headquarter.jpg";
import officeImg from "@/assets/corporate-office.jpg";
import factory1Img from "@/assets/factory1.jpg";
import factory2Img from "@/assets/factory2.jpg";
import factory3Img from "@/assets/factory3.jpg";
import { blogApi, ourvalueApi } from "../Backend"; // <-- change to your actual path
// types (adjust or remove if not using TS)
type BlogItem = {
  _id: string;
  Img?: string;
  Htext?: string;
  Dtext?: string;
  Adress?: string;
  Adresslink?: string;
  createdAt?: string;
  updatedAt?: string;
};

type OurValueItem = {
  _id?: string;
  Htext?: string;
  Dtext?: string;
};

const shapeColors = [
  "rgba(255,102,0,0.3)",
  "rgba(255,153,51,0.25)",
  "rgba(255,204,51,0.2)",
];

const defaultValues = [
  {
    title: "Quality",
    desc:
      "We are committed to excellence in every aspect of our operations, ensuring our products meet the highest industry standards.",
  },
  {
    title: "Integrity",
    desc:
      "We conduct business with honesty and transparency, building trust with customers, employees, and partners.",
  },
  {
    title: "Innovation",
    desc:
      "We embrace technology and creative thinking to drive improvement and create cutting-edge solutions.",
  },
  {
    title: "Customer Focus",
    desc:
      "Our customers are at the heart of everything we do; we tailor our solutions to exceed their expectations.",
  },
  {
    title: "Sustainability",
    desc:
      "We are dedicated to eco-friendly practices that protect the environment and ensure a sustainable future.",
  },
  {
    title: "Collaboration & Respect",
    desc:
      "We value teamwork, safety, and mutual respect — empowering our people to achieve continuous growth and improvement.",
  },
];

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [ourValues, setOurValues] = useState<OurValueItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog and ourvalue data
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [blogRes, ourValueRes] = await Promise.all([
          blogApi.getAll(),
          ourvalueApi.getAll(),
        ]);

        if (!mounted) return;

        // API shape: { success: true, data: [ ... ] }
        const blogData: BlogItem[] = blogRes?.data?.data || [];
        const ourValData: OurValueItem[] = ourValueRes?.data?.data || [];

        setBlogs(blogData);
        setOurValues(ourValData.length ? ourValData : null);
      } catch (err: any) {
        console.error("Failed to fetch blogs/values:", err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load content. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Helper to get image url (prioritize API Img then fallback local)
  const getImageUrl = (item: BlogItem | undefined, fallback: string) =>
    item?.Img || fallback;

  // Use first blog entry as headquarters if present
  const hq = blogs.length ? blogs[0] : undefined;

  // Remaining blog entries used for office/factories. If none exist, use static images/fixtures.
  const others = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <section className="relative bg-gray-50 py-36 overflow-hidden">
      {/* Animated Background Shapes */}
      {Array.from({ length: 12 }).map((_, i) => {
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

      <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 items-center relative z-10">
        {loading ? (
          <div className="col-span-2 py-24 text-center">
            <div className="inline-block animate-pulse px-6 py-4 bg-white rounded-xl shadow">Loading content...</div>
          </div>
        ) : error ? (
          <div className="col-span-2 py-24 text-center text-red-600">
            {error}
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <img
                src={getImageUrl(hq, hqImg)}
                alt={hq?.Htext || "Kalimata Headquarters"}
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
                {hq?.Htext ? (
                  <>
                    {hq.Htext.split(" ").slice(0, 1).join(" ")}{" "}
                    <span className="text-primary">
                      {hq.Htext.split(" ").slice(1).join(" ") || "Headquarters"}
                    </span>
                  </>
                ) : (
                  <>
                    Our <span className="text-primary">Headquarters</span>
                  </>
                )}
              </h2>

              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-3">
                {hq?.Dtext ||
                  "Central hub for corporate administration, strategy, and management."}
              </p>

              {hq?.Adresslink || hq?.Adress ? (
                <a
                  href={hq?.Adresslink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  {hq?.Adress || "View address"}
                </a>
              ) : (
                <a
                  href="https://maps.app.goo.gl/TL8MMM4t6ts4Jp9u6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  P.S Srijan Corporate Park, Unit No: 9, 13th Floor, Tower-1, Salt Lake, Kolkata-700091
                </a>
              )}
            </motion.div>
          </>
        )}
      </div>

      {/* Offices and Factories Section */}
      <div className="container mx-auto px-6 mt-20 max-w-6xl grid md:grid-cols-2 gap-10 items-stretch relative z-10">
        {/* Corporate Office (use blogs[1] if exists, else fallback) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center md:text-left h-full hover:scale-105 transition-transform"
        >
          <div className="relative w-full h-56 md:h-64">
            <img
              src={getImageUrl(blogs[1], officeImg)}
              alt={blogs[1]?.Htext || "Corporate Office"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="p-6">
            <h3 className="text-3xl font-bold text-gray-900 font-[Oswald] mb-2">
              {blogs[1]?.Htext ? (
                <>
                  {blogs[1].Htext.split(" ").slice(0, 1).join(" ")}{" "}
                  <span className="text-primary">
                    {blogs[1].Htext.split(" ").slice(1).join(" ") || "Office"}
                  </span>
                </>
              ) : (
                <>
                  Registered <span className="text-primary">Office</span>
                </>
              )}
            </h3>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
              {blogs[1]?.Dtext ||
                "Central office overseeing corporate administration and operations."}
            </p>

            <a
              href={blogs[1]?.Adresslink || "https://maps.app.goo.gl/hBJ3go9bdEHLUjDb8"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              {blogs[1]?.Adress ||
                "14/2 Old China Bazar Street, 3rd Floor, Room No. 213, Kolkata-700001, West Bengal"}
            </a>
          </div>
        </motion.div>

        {/* Dynamic factories: prefer blogs[2..] else render local static entries */}
        {others.length ? (
          others.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center md:text-left h-full hover:scale-105 transition-transform"
            >
              <div className="relative w-full h-56 md:h-64">
                <img src={getImageUrl(item, factory1Img)} alt={item.Htext || "Factory"} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-bold text-gray-900 font-[Oswald] mb-2">
                  {item.Htext || `Factory ${idx + 1}`}
                </h3>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
                  {item.Dtext || "Factory operations and manufacturing."}
                </p>
                <a
                  href={item.Adresslink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  {item.Adress || "View address"}
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          // fallback 3 static factories if no blog items present
          <>
            {[factory1Img, factory2Img, factory3Img].map((img, i) => (
              <motion.div
                key={`fallback-factory-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center text-center md:text-left h-full hover:scale-105 transition-transform"
              >
                <div className="relative w-full h-56 md:h-64">
                  <img src={img} alt={`Factory ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-3xl font-bold text-gray-900 font-[Oswald] mb-2">
                    Factory <span className="text-primary">{i + 1}</span>
                  </h3>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
                    {i === 0
                      ? "Specializes in precision-cast metal solutions and advanced manufacturing."
                      : i === 1
                      ? "Produces high-quality metal components with modern automation."
                      : "Specializes in heat treatment and metal finishing operations."}
                  </p>
                  <a
                    href="#"
                    className="text-primary font-semibold hover:underline"
                  >
                    View address
                  </a>
                </div>
              </motion.div>
            ))}
          </>
        )}
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
            {/* If your API provides a list of values, replace defaultValues with that */}
            {ourValues.map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer hover:cursor-[url('/cursor-arrow.svg'),_pointer]"
              >
                <h4 className="text-xl font-semibold text-primary mb-2">{value.Htext}</h4>
                <p className="text-gray-700">{value.Dtext}</p>
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
