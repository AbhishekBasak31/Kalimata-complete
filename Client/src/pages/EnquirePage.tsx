// src/pages/EnquirePage.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

const EnquirePage = () => {
  const contactInfo = [
    { icon: Phone, title: "Call Us", info: "+91 98306 98226", link: "tel:+919830698226" },
    { icon: Mail, title: "Email", info: "info@kalimatagroup.co.in", link: "mailto:info@kalimatagroup.co.in" },
    { icon: MapPin, title: "Visit Us", info: "Industrial Area, Kolkata", link: "https://maps.google.com/?q=Industrial+Area,+Kolkata" },
    { icon: Clock, title: "Hours", info: "Mon - Sat: 9am - 6pm", link: "#" },
  ];

  return (
    <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-100 via-white to-gray-100 overflow-hidden">
      {/* Abstract Lines */}
      <div className="absolute top-10 left-10 w-[200px] h-[2px] bg-primary/20 rotate-12 animate-pulse"></div>
      <div className="absolute top-48 right-16 w-[150px] h-[2px] bg-secondary/20 -rotate-6 animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-[220px] h-[2px] bg-primary/10 rotate-45 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-[180px] h-[2px] bg-secondary/10 -rotate-30 animate-pulse"></div>

      {/* Abstract Circles */}
      <div className="absolute top-0 left-1/3 w-24 h-24 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-1/3 w-28 h-28 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative container mx-auto px-4 max-w-4xl">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Send an <span className="text-primary">Enquiry</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl">
            Have a project or query? Fill out the form below and our team will get back to you promptly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Card className="p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/30 flex flex-col w-full">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Send your Enquiry</h3>
              <form className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input type="text" placeholder="First Name" className="text-gray-800 focus:border-primary" />
                  <Input type="text" placeholder="Last Name" className="text-gray-800 focus:border-primary" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input type="email" placeholder="Email" className="text-gray-800 focus:border-primary" />
                  <Input type="tel" placeholder="Phone Number" className="text-gray-800 focus:border-primary" />
                </div>

                <Textarea placeholder="Your Message" className="text-gray-800 focus:border-primary min-h-[100px]" />

                <Button
                  type="submit"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300"
                >
                  Send Enquiry
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center gap-6 relative"
          >
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
                  <Card className="flex flex-col items-center text-center p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/20 hover:scale-105 transition-transform duration-300">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-1">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-xs">{item.info}</p>
                  </Card>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnquirePage;
