import { motion } from "framer-motion";
import HeroSectionAlt from "@/components/HeroSectionAlt";

const PrivacyPolicyPage = () => {
  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
      {/* Hero Section */}
      {/* <HeroSectionAlt
        title="About Kalimata Group"
        subtitle="Delivering Precision and Excellence Globally"
        ctaText="Contact Us"
        ctaLink="#contact"
        videoSrc="/videos/foundry-pour.mp4"
      /> */}
    <section className="bg-gray-50 min-h-screen pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-500 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-md md:text-lg max-w-2xl mx-auto">
          At Kalimata Group, your privacy matters. Learn how we handle your personal data responsibly.
        </p>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Intro */}
        <motion.div
          className="prose max-w-3xl mx-auto text-gray-700"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <p>
            At Kalimata Group, we value your privacy. This policy explains how we collect, use, and protect your personal information.
          </p>
        </motion.div>

        {/* Key Sections */}
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email, and contact details when you submit forms on our website.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To respond to enquiries</li>
              <li>To provide products and services</li>
              <li>To send updates and marketing communications</li>
            </ul>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
            <p>
              You can request access, correction, or deletion of your personal data at any time by contacting us.
            </p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-700">
            For any questions regarding this Privacy Policy, feel free to contact us via email or phone. Your privacy is our priority.
          </p>
          <a
            href="/contact"
            className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
    </>
  );
};

export default PrivacyPolicyPage;
