// src/components/EnquiryModal.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface EnquiryModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({ productId, productName, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    message: `I am interested in ${productName}. Please provide more details.`,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enquiry submitted for:", productId, formData);
    // Integrate backend API here
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-3xl w-full max-w-lg p-8 relative shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-700 font-bold text-2xl hover:text-primary transition"
            onClick={onClose}
          >
            &times;
          </button>

          {/* Modal Header */}
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
            Send an <span className="text-primary">Enquiry</span>
          </h2>

          {/* Enquiry Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="text-gray-800 focus:border-primary"
                required
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="text-gray-800 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="text-gray-800 focus:border-primary"
                required
              />
              <Input
                type="tel"
                name="contact"
                placeholder="Phone Number"
                value={formData.contact}
                onChange={handleChange}
                className="text-gray-800 focus:border-primary"
              />
            </div>

            <Textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="text-gray-800 focus:border-primary min-h-[100px]"
            />

            {/* Hidden field with product ID */}
            <input type="hidden" name="productId" value={productId} />

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 mt-2"
            >
              Send Enquiry
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnquiryModal;
