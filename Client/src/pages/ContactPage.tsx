// src/pages/ContactPage.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
  const navigate = useNavigate();

  const contactInfo = [
    { icon: Phone, title: "Call Us", info: "+91 98306 98226", link: "tel:+919830698226" },
    { icon: Mail, title: "Email", info: "info@kalimatagroup.co.in", link: "mailto:info@kalimatagroup.co.in" },
    { icon: MapPin, title: "Visit Us", info: "Industrial Area, Kolkata", link: "https://maps.google.com/?q=Industrial+Area,+Kolkata" },
    { icon: Clock, title: "Hours", info: "Mon - Sat: 9am - 6pm", link: "#" },
  ];

  return (
    <section
      id="contact"
      className="relative pt-32 pb-16 bg-gradient-to-br from-gray-100 via-white to-gray-100"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>

      <div className="relative container mx-auto px-4 max-w-4xl space-y-12">

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let’s <span className="text-primary">Connect</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl">
            Have a project in mind? Reach out and let’s build something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Card className="p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/30 flex flex-col w-full">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Send us a Message</h3>
              <form className="flex flex-col gap-4">
                {/* First Row: First + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input type="text" placeholder="First Name" className="text-gray-800 focus:border-primary" />
                  <Input type="text" placeholder="Last Name" className="text-gray-800 focus:border-primary" />
                </div>

                {/* Second Row: Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input type="email" placeholder="Email" className="text-gray-800 focus:border-primary" />
                  <Input type="tel" placeholder="Phone Number" className="text-gray-800 focus:border-primary" />
                </div>

                {/* Message */}
                <Textarea placeholder="Your Message" className="text-gray-800 focus:border-primary min-h-[100px]" />

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Contact Info & Auth */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-between gap-6"
          >
            {/* Contact Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((item, i) => (
                <motion.a
                  href={item.link}
                  key={i}
                  target={item.link.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="block"
                >
                  <Card className="flex flex-col items-center text-center p-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/20 hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-xs">{item.info}</p>
                  </Card>
                </motion.a>
              ))}
            </div>

            {/* Auth CTA */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Card className="p-4 text-center bg-gradient-to-r from-primary to-primary/80 shadow-xl rounded-2xl border-none w-full">
                <h4 className="text-lg font-bold text-white mb-3">Ready to Get Started?</h4>
                <div className="flex justify-center gap-3">
                  <Button
                    size="sm"
                    className="bg-white text-primary hover:bg-gray-200 hover:text-black shadow-sm"
                    onClick={() => navigate("/auth?tab=register")}
                  >
                    Register
                  </Button>
                  <Button
                    size="sm"
                    className="bg-white text-primary hover:bg-gray-200 hover:text-black shadow-sm"
                    onClick={() => navigate("/auth?tab=login")}
                  >
                    Login
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactPage;
