import { motion } from "framer-motion";
import aboutImg from "@/assets/steel-castings.jpg";
import aboutImg2 from "@/assets/foundry.jpg";
import director1 from "@/assets/director1.jpg";
import director2 from "@/assets/director2.jpg";
import director3 from "@/assets/director3.jpg";

const AboutUs = () => {
  const stats = [
    { label: "Team Strength", value: "1700+", sub: "Professionals & Skilled workers" },
    { label: "Turnover (2024-25)", value: "INR 2700M", sub: "Group Turnover" },
    { label: "Global Clients", value: "India • US • ME Asia", sub: "Public & Private sectors" },
    { label: "Certifications", value: "ISO 9001, 14000", sub: "RDSO | FL & UM" },
  ];

  const directors = [
    {
      designation: "Founder",
      name: "Mr. Mahendra Kumar Jhawar",
      image: director2,
      quote:
        "“As We Look Toward The Future Of Kalimata Group, We Are Excited To Share Our Commitment To Innovation, Quality, And Sustainability. Our Strategic Initiatives Aim To Enhance Operational Efficiency And Expand Our Capabilities, Ensuring We Meet The Evolving Needs Of Our Clients. We Are Dedicated To Fostering A Culture Of Safety And Excellence, Empowering Our Team To Deliver Exceptional Results. Together, We Will Navigate The Challenges Ahead And Seize New Opportunities In The Foundry Industry. Thank You For Your Continued Support As We Forge A Prosperous Future.”",
    },
    {
      designation: "Managing Director",
      name: "Mr. Anant Jhawar",
      image: director1,
      quote:
        "“As We Look Toward The Future Of Kalimata Group, We Are Excited To Share Our Commitment To Innovation, Quality, And Sustainability. Our Strategic Initiatives Aim To Enhance Operational Efficiency And Expand Our Capabilities, Ensuring We Meet The Evolving Needs Of Our Clients. We Are Dedicated To Fostering A Culture Of Safety And Excellence, Empowering Our Team To Deliver Exceptional Results. Together, We Will Navigate The Challenges Ahead And Seize New Opportunities In The Foundry Industry. Thank You For Your Continued Support As We Forge A Prosperous Future.”",
    },
    {
      designation: "Managing Director",
      name: "Mr. Vikas Jhawar",
      image: director3,
      quote:
        "“As We Look Toward The Future Of Kalimata Group, We Are Excited To Share Our Commitment To Innovation, Quality, And Sustainability. Our Strategic Initiatives Aim To Enhance Operational Efficiency And Expand Our Capabilities, Ensuring We Meet The Evolving Needs Of Our Clients. We Are Dedicated To Fostering A Culture Of Safety And Excellence, Empowering Our Team To Deliver Exceptional Results. Together, We Will Navigate The Challenges Ahead And Seize New Opportunities In The Foundry Industry. Thank You For Your Continued Support As We Forge A Prosperous Future.”",
    },
  ];

  return (
    <section id="about" className="relative bg-gray-50 py-32 overflow-hidden">
      {/* Hero Intro */}
      <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative"
        >
          <img
            src={aboutImg}
            alt="About Kalimata"
            className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
          />
          <div className="absolute -bottom-10 -right-10 w-52 h-36 border-4 border-white rounded-xl shadow-lg overflow-hidden">
            <img src={aboutImg2} alt="Plant view" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 font-[Oswald]">
            About <span className="text-primary">Us</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
            India’s leading designers and manufacturers of various types of{" "}
            <span className="font-semibold">Ductile Iron Castings</span> such as Pipe Fittings, Manhole Covers & Frames,
            Gully Gratings, Rail Track Products, Wagon Components & Rail Pads, Helical Compression Coil Springs, Rail Clips, Rubber pads, HBN Liners, CCSB.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Continuous improvement with latest technologies</li>
            <li>✓ Collaborating with clients for optimized solutions</li>
            <li>✓ Fostering employee & community well-being</li>
          </ul>
        </motion.div>
      </div>

      {/* ✅ Company Description */}
      <div className="container mx-auto px-6 mt-20 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="bg-white rounded-2xl shadow-lg p-10 md:p-12 text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-[Oswald]">
            Company <span className="text-primary">Description</span>
          </h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-6">
            At Kalimata Group, we are dedicated to delivering innovative solutions that empower businesses and individuals to thrive.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-6">
            With a commitment to excellence and a focus on customer satisfaction, we leverage our expertise to drive growth and success in various industries.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-6">
            Our mission is to provide exceptional services and products that not only meet but exceed our clients' expectations. We believe in fostering lasting relationships built on trust, transparency, and mutual success.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            At Kalimata Group, our goal is to generate oriented sales by our staff members which enables us to meet the clients expectations in a timely manner.
          </p>
        </motion.div>
      </div>

      {/* ✅ Group Profile */}
      <div className="container mx-auto px-6 mt-20 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="bg-white rounded-2xl shadow-lg p-10 md:p-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center font-[Oswald]">
            Group <span className="text-primary">Profile</span>
          </h3>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
            Kalimata Group is a leading manufacturer specializing in precision casting and metal fabrication.
          </p>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
            With over 25+ years of experience in the industry, we are dedicated to delivering high-quality products that meet the stringent standards of various sectors, including automotive, aerospace, energy, and construction.
          </p>

          {/* Core Values */}
          <h4 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Core Values</h4>
          <ul className="text-gray-700 space-y-1 ml-2">
            <li>• <b>Quality:</b> We prioritize excellence in every aspect of our operations.</li>
            <li>• <b>Integrity:</b> We conduct our business with honesty and transparency.</li>
            <li>• <b>Innovation:</b> We embrace technology and innovation to enhance our processes.</li>
            <li>• <b>Sustainability:</b> Committed to zero waste and eco-friendly practices.</li>
            <li>• <b>Customer Focus:</b>Timely delivery with tailored solutions that exceed expectations.</li>
          </ul>

          {/* Services */}
          <h4 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Services</h4>
          <ul className="text-gray-700 space-y-1 ml-2">
            <li>• <b>Precision Casting:</b> Utilizing state-of-the-art techniques for producing complex components.</li>
            <li>• <b>Metal Fabrication:</b> Custom metalworking services to meet diverse client needs.</li>
            <li>• <b>Prototype Development:</b> Rapid prototyping for new designs and concepts.</li>
            <li>• <b>Thermal Treatment:</b> Advanced heat treatment processes to enhance material properties.</li>
          </ul>

          {/* Team */}
          <h4 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Team</h4>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Our team of skilled engineers, technicians, and support staff is our greatest asset. We invest in ongoing training and development to ensure we remain at the forefront of the industry.
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-6 mt-20 max-w-6xl grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 * i }}
            className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between text-center h-36"
          >
            <div className="text-xl font-bold text-gray-900">{s.value}</div>
            <div>
              <div className="text-gray-800 font-medium">{s.label}</div>
              <div className="text-sm text-gray-600">{s.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Directors */}
      <div className="container mx-auto px-6 mt-24 max-w-6xl space-y-16">
        <h3 className="text-3xl font-bold text-gray-900 font-[Oswald] mb-8">Our Leadership</h3>
        {directors.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 * i }}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              i % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-primary rounded-2xl"></div>
              <div className="absolute inset-0 -translate-x-3 -translate-y-3 border-2 border-secondary rounded-2xl"></div>
              <img
                src={d.image}
                alt={d.name}
                className="relative w-64 h-[380px] object-cover rounded-2xl shadow-lg"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="uppercase text-primary font-semibold tracking-wide">{d.designation}</p>
              <blockquote className="italic text-lg text-gray-800 mt-3 mb-4">{d.quote}</blockquote>
              <div className="text-xl font-bold text-gray-900">{d.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Accreditations */}
      <div className="container mx-auto px-6 mt-20 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="bg-white rounded-2xl shadow p-8 text-center"
        >
          <h4 className="text-xl font-bold mb-4 text-gray-900">Accreditations</h4>
          <p className="text-gray-700">
            ISO 9001:2015 Certified • FL & UM Certification • Research Design & Standards Organization (RDSO)
            under The Ministry of Railways, Govt of India.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
