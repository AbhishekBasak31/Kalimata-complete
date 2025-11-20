import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import metalCastingImg from "@/assets/metal-casting.jpg";
import patternMakingImg from "@/assets/pattern-making.jpg";
import foundryImg from "@/assets/foundry.jpg";
import industrialImg from "@/assets/industrial.jpg";
import heatTreatmentImg from "@/assets/heat-treatment.jpg";
import qualityControlImg from "@/assets/quality-control.jpg";
import machiningImg from "@/assets/machining.jpg";
import consultingImg from "@/assets/consulting.jpg";
import serviceVideo from "@/assets/foundry-pour.mp4";
import reviewerImg from "@/assets/consulting.jpg";

// Star Icon
const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.154c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.946c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.946a1 1 0 00-.364-1.118L2.034 9.373c-.783-.57-.38-1.81.588-1.81h4.154a1 1 0 00.95-.69l1.286-3.946z"/>
  </svg>
);

// All 8 services data
const services = [
  {
    title: "Metal Casting",
    slug: "metal-casting",
    sliderImages: [metalCastingImg, patternMakingImg, foundryImg],
    imageTextSections: [
      { img: metalCastingImg, heading: "Our Process", text: "Precision molds and automated casting ensure consistent quality." },
      { img: patternMakingImg, heading: "Materials Used", text: "Cast iron, steel, and aluminum with high tensile strength." },
      { img: foundryImg, heading: "Applications", text: "Railway, automotive, and construction industries." },
      { img: industrialImg, heading: "Quality Assurance", text: "Strict quality control at each production stage." },
    ],
    videoDescription: "Watch our process in action. This short demo shows our end-to-end production for metal casting services.",
    reviews: [
      { name: "John Doe", role: "Production Manager", img: reviewerImg, rating: 5, tags: ["Reliable","Quality Service"], content: "The metal casting process was highly precise and met all our specifications." },
      { name: "Jane Smith", role: "Quality Head", img: reviewerImg, rating: 4, tags: ["Professional","Timely Delivery"], content: "Excellent team and high-quality output. Slight delay but worth it." },
    ],
  },
  {
    title: "Testing Facility",
    slug: "pattern-making",
    sliderImages: [qualityControlImg, industrialImg, consultingImg], // replace with your actual testing facility images
    imageTextSections: [
      { img: qualityControlImg, heading: "Spectrometer", text: "High-precision spectrometer for material analysis." },
      { img: industrialImg, heading: "Chemical Lab", text: "Fully equipped chemical laboratory for material testing." },
      { img: consultingImg, heading: "Microscope with Image Analyzer", text: "Microscope coupled with image analyzer for microstructural evaluation." },
      { img: heatTreatmentImg, heading: "UTM – Computerised Universal Testing with Graph Recording Machine", text: "Universal testing for tensile, compression, and bend tests." },
      { img: machiningImg, heading: "BHN Hardness Testing Machine", text: "Brinell hardness testing for metal samples." },
      { img: patternMakingImg, heading: "Impact Testing Machine", text: "Measure impact strength of materials." },
      { img: qualityControlImg, heading: "Hydraulic Load Testing Machine up to 100 Tons", text: "Hydraulic testing for high-capacity load applications." },
      { img: industrialImg, heading: "Crack Detection Machine", text: "Detect cracks and defects in castings and components." },
      { img: consultingImg, heading: "Shadow Graph Testing Machine (Broaching Machine)", text: "Dimensional inspection using shadow graph." },
      { img: heatTreatmentImg, heading: "Ultrasonic Flaw Detecting Machine", text: "Ultrasonic testing for internal flaws in materials." },
      { img: machiningImg, heading: "Hydro Static Pressure Testing Machine", text: "Test castings and pipes under hydrostatic pressure." },
      { img: patternMakingImg, heading: "Elecometer", text: "Testing electrical insulation and surface properties." },
    ],
    videoDescription: "Our Testing Facility ensures material and product quality using advanced equipment and precise measurements.",
    reviews: [
      { name: "Lab Manager", role: "Testing Head", img: reviewerImg, rating: 5, tags: ["Accurate","Reliable"], content: "The testing facility is well-equipped and ensures all standards are met." },
    ],
  },
  {
    title: "Foundry Solutions",
    slug: "foundry-solutions",
    sliderImages: [foundryImg, heatTreatmentImg, patternMakingImg],
    imageTextSections: [
      { img: foundryImg, heading: "Comprehensive Foundry", text: "All types of casting services under one roof." },
      { img: heatTreatmentImg, heading: "Advanced Techniques", text: "High-quality processes ensure durability." },
      { img: patternMakingImg, heading: "Custom Solutions", text: "Tailored to client specifications." },
      { img: metalCastingImg, heading: "Support", text: "End-to-end support for your projects." },
    ],
    videoDescription: "Full-spectrum foundry services for diverse industries.",
    reviews: [
      { name: "Bob Lee", role: "Operations Head", img: reviewerImg, rating: 4, tags: ["Reliable","Flexible"], content: "Foundry setup was efficient and met our requirements." },
    ],
  },
  {
    title: "Industrial Engineering",
    slug: "industrial-engineering",
    sliderImages: [industrialImg, metalCastingImg, consultingImg],
    imageTextSections: [
      { img: industrialImg, heading: "Process Optimization", text: "Improving efficiency with modern engineering techniques." },
      { img: metalCastingImg, heading: "Integration", text: "Seamless integration into your production line." },
      { img: consultingImg, heading: "Support", text: "Professional guidance throughout project." },
      { img: patternMakingImg, heading: "Quality", text: "Maintaining high standards at every stage." },
    ],
    videoDescription: "Optimize your industrial processes with our expert team.",
    reviews: [
      { name: "Clara Adams", role: "Project Manager", img: reviewerImg, rating: 5, tags: ["Professional","Timely"], content: "Engineering solutions were implemented seamlessly." },
    ],
  },
  {
    title: "Heat Treatment",
    slug: "heat-treatment",
    sliderImages: [heatTreatmentImg, machiningImg, industrialImg],
    imageTextSections: [
      { img: heatTreatmentImg, heading: "Advanced Techniques", text: "Precision heat treatment for durability." },
      { img: machiningImg, heading: "Consistency", text: "Uniform results for all materials." },
      { img: industrialImg, heading: "Applications", text: "Automotive, construction, and more." },
      { img: patternMakingImg, heading: "Monitoring", text: "Strict supervision of temperature and process." },
    ],
    videoDescription: "Our heat treatment improves strength and performance of materials.",
    reviews: [
      { name: "David Brown", role: "Materials Engineer", img: reviewerImg, rating: 5, tags: ["Durable","Consistent"], content: "Heat-treated materials exceeded our expectations." },
    ],
  },
  {
    title: "Quality Control",
    slug: "quality-control",
    sliderImages: [qualityControlImg, foundryImg, metalCastingImg],
    imageTextSections: [
      { img: qualityControlImg, heading: "Inspection", text: "Rigorous inspection at every stage." },
      { img: foundryImg, heading: "Testing", text: "Advanced testing ensures compliance." },
      { img: metalCastingImg, heading: "Documentation", text: "Detailed reports for transparency." },
      { img: patternMakingImg, heading: "Standards", text: "Meet international quality standards." },
    ],
    videoDescription: "Quality control ensures the best products reach our clients.",
    reviews: [
      { name: "Eva Green", role: "QC Manager", img: reviewerImg, rating: 5, tags: ["Thorough","Reliable"], content: "Every batch passed strict quality standards." },
    ],
  },
  {
    title: "Machining Services",
    slug: "machining-services",
    sliderImages: [machiningImg, industrialImg, heatTreatmentImg],
    imageTextSections: [
      { img: machiningImg, heading: "Precision Machining", text: "Exact dimensions and tolerances guaranteed." },
      { img: industrialImg, heading: "Versatility", text: "Capable of handling diverse materials." },
      { img: heatTreatmentImg, heading: "Automation", text: "Modern CNC and automation equipment." },
      { img: patternMakingImg, heading: "Support", text: "Technical assistance throughout process." },
    ],
    videoDescription: "Our machining services produce precise and reliable components.",
    reviews: [
      { name: "Frank White", role: "Production Lead", img: reviewerImg, rating: 4, tags: ["Accurate","Fast"], content: "Machining was precise and on schedule." },
    ],
  },
  {
    title: "Consulting Services",
    slug: "consulting-services",
    sliderImages: [consultingImg, patternMakingImg, metalCastingImg],
    imageTextSections: [
      { img: consultingImg, heading: "Expert Advice", text: "Optimize processes for efficiency." },
      { img: patternMakingImg, heading: "Process Analysis", text: "Detailed evaluation for improvements." },
      { img: metalCastingImg, heading: "Implementation", text: "Hands-on assistance in executing solutions." },
      { img: industrialImg, heading: "Training", text: "Educating staff for smooth operations." },
    ],
    videoDescription: "Professional consulting services to enhance productivity.",
    reviews: [
      { name: "Grace Hill", role: "CEO", img: reviewerImg, rating: 5, tags: ["Insightful","Professional"], content: "Consulting helped improve our operations significantly." },
    ],
  },
];

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find((s) => s.slug === slug);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (service?.sliderImages.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [service]);

  if (!service) {
    return (
      <div className="container mx-auto mt-32 px-4 text-center">
        <h2 className="text-xl font-bold mb-4">Service Not Found</h2>
      </div>
    );
  }

  return (
    <section className="bg-gray-100 text-gray-800 pt-32 pb-16 space-y-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-10">

        {/* Carousel */}
        <div className="relative w-11/20 md:w-4/5 h-64 md:h-80 mx-auto overflow-hidden rounded-lg shadow-lg">
          <AnimatePresence>
            <motion.img
              key={currentSlide}
              src={service.sliderImages[currentSlide]}
              alt={`slide-${currentSlide}`}
              className="w-full h-full object-cover rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {service.sliderImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? "bg-primary scale-125" : "bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        {/* Alternating Image-Text Sections */}
        {service.imageTextSections.map((section, idx) => (
          <motion.div
            key={idx}
            className={`flex flex-col md:flex-row ${idx % 2 === 1 ? "md:flex-row-reverse" : ""} justify-center items-center gap-6 w-7/12 mx-auto`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden rounded-lg shadow-lg w-1/2">
              <img src={section.img} alt={section.heading} className="w-full h-48 object-cover rounded-md" />
            </Card>
            <div className="w-1/2 space-y-2">
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              <p className="text-sm text-gray-700">{section.text}</p>
            </div>
          </motion.div>
        ))}

        {/* Video Section */}
        <motion.div className="flex flex-col md:flex-row items-center gap-6"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <video controls className="w-full md:w-1/3 rounded-md shadow-lg" src={serviceVideo} />
          <div className="text-sm md:text-base text-gray-700">{service.videoDescription}</div>
        </motion.div>

        {/* Reviews */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Customer Reviews & Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.reviews.map((review, idx) => (
              <Card key={idx} className="p-4 rounded-lg shadow-md bg-white flex flex-col md:flex-row gap-4">
                <img src={review.img} alt={review.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{review.name}</h3>
                    <span className="text-sm text-gray-500">({review.role})</span>
                  </div>
                  <div className="flex items-center gap-1">{Array.from({ length: review.rating }).map((_, i) => <StarIcon key={i} />)}</div>
                  <p className="text-sm text-gray-700 mt-1">{review.content}</p>
                  <div className="flex gap-2 mt-2">{review.tags.map((tag, i) => <span key={i} className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">{tag}</span>)}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServicePage;
