// src/pages/InternalProductDetailsPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { products, Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import EnquiryModal from "@/components/EnquiryModal";
import { motion } from "framer-motion";

const InternalProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [showEnquiry, setShowEnquiry] = useState(false);

  // Find the product by its id
  const product: Product | undefined = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Product not found</h2>
        <Button className="mt-4" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  const images = [product.image]; // For now, single image, can extend to multiple

  return (
    <div className="w-full flex justify-center pt-36 pb-20 px-4">
      <div className="w-[70%]">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              {product.name}
            </h1>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              {product.description}
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold"
              onClick={() => setShowEnquiry(true)}
            >
              Enquire Now
            </Button>
          </div>
          <div className="lg:w-1/2 grid grid-cols-1 gap-4">
            {images.map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              />
            ))}
          </div>
        </div>

        {/* Key Features */}
        <section className="mt-16 bg-gray-50 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <span className="text-primary font-bold text-xl">✓</span>
                <p className="text-gray-700">{feature}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* About / Usage Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            About {product.name}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {product.name} is designed to deliver top performance in its category. 
            Manufactured with high-quality materials, it ensures durability, reliability, and 
            compliance with industry standards. Perfect for industrial, automotive, or 
            commercial applications depending on your requirements.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our {product.name.toLowerCase()} undergo rigorous testing to ensure maximum 
            efficiency, longevity, and user satisfaction. Available in various sizes 
            and specifications to fit your specific needs.
          </p>
        </section>

        {/* Image Gallery Section (optional multiple images) */}
        {images.length > 1 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <motion.img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className="rounded-xl shadow-lg w-full h-64 object-cover"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.2 }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Enquiry Modal */}
        {showEnquiry && (
          <EnquiryModal
            productId={product.id}
            productName={product.name}
            onClose={() => setShowEnquiry(false)}
          />
        )}
      </div>
    </div>
  );
};

export default InternalProductDetailsPage;
