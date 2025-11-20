import { motion } from "framer-motion";

const TermsPage = () => {
  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <section className="bg-gray-50 min-h-screen mt-10">
      <div className="bg-gradient-to-r from-primary to-blue-500 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-md md:text-lg max-w-2xl mx-auto">
          Read our terms and conditions carefully. Your use of Kalimata Group services is subject to these terms.
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
            By using Kalimata Group’s services, you agree to comply with and be bound by the following terms and conditions.
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
            <h2 className="text-xl font-semibold mb-2">Use of Services</h2>
            <p>
              You may use our services only in compliance with applicable laws and regulations. Unauthorized use is prohibited.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Account Responsibilities</h2>
            <p>
              If you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activity under your account.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
            <p>
              Kalimata Group is not liable for any direct, indirect, incidental, or consequential damages resulting from the use of our services.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
            <p>
              All content, trademarks, and materials on our website are the property of Kalimata Group unless otherwise noted.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Termination</h2>
            <p>
              We may suspend or terminate your access to services at any time if you violate these terms.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes will be resolved under the jurisdiction of Indian courts.
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
            For questions regarding our Terms of Service, please contact us via email or phone.
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
  );
};

export default TermsPage;
