import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Volume2, VolumeX } from "lucide-react";

// Service data for 8 services
const serviceDetails: Record<string, any> = {
  "metal-casting": {
    title: "Metal Casting",
    hero: "Precision Metal Casting Solutions",
    description: "Advanced metal casting services for industrial and artistic applications.",
    capabilities: ["Sand Casting", "Investment Casting", "Die Casting", "Continuous Casting"],
    materials: ["Cast Iron", "Steel", "Aluminum", "Bronze", "Brass"],
    applications: ["Automotive Components", "Industrial Machinery", "Architectural Elements", "Art & Sculpture"],
    processSteps: ["Design & Pattern Creation", "Mold Preparation", "Melting & Pouring", "Cooling & Solidification", "Finishing & Inspection"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  "pattern-making": {
    title: "Pattern Making",
    hero: "Expert Pattern Design & Manufacturing",
    description: "Professional pattern design and manufacturing services for accurate and efficient casting processes.",
    capabilities: ["Wood Patterns", "Metal Patterns", "3D Printed Patterns", "CNC Machined Patterns"],
    materials: ["Hardwood", "Aluminum", "Steel", "Resin", "Composite Materials"],
    applications: ["Prototype Development", "Production Tooling", "Complex Geometries", "Custom Solutions"],
    processSteps: ["Design Analysis", "Material Selection", "Manufacturing Process", "Quality Verification", "Pattern Delivery"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  "foundry-solutions": {
    title: "Foundry Solutions",
    hero: "Comprehensive Foundry Services",
    description: "End-to-end foundry services from concept to finished product with quality assurance.",
    capabilities: ["Melting & Pouring", "Heat Treatment", "Machining", "Quality Control"],
    materials: ["Ferrous Alloys", "Non-ferrous Metals", "Specialty Alloys", "Custom Compositions"],
    applications: ["Heavy Industry", "Aerospace", "Marine", "Energy Sector"],
    processSteps: ["Process Planning", "Production Setup", "Casting Operations", "Quality Testing", "Final Delivery"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  "industrial-engineering": {
    title: "Industrial Engineering",
    hero: "Complete Engineering Solutions",
    description: "Comprehensive engineering solutions for industrial manufacturing and production optimization.",
    capabilities: ["Process Design", "Equipment Selection", "Automation", "Consulting"],
    materials: ["Control Systems", "Automation Equipment", "Process Machinery", "Safety Systems"],
    applications: ["Factory Setup", "Process Improvement", "Automation Projects", "Technical Consulting"],
    processSteps: ["Needs Assessment", "Solution Design", "Implementation", "Testing & Validation", "Ongoing Support"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  "heat-treatment": {
    title: "Heat Treatment",
    hero: "Specialized Heat Treatment Services",
    description: "Enhancing material properties and performance with precise heat treatment processes.",
    capabilities: ["Annealing", "Normalizing", "Quenching & Tempering", "Stress Relieving"],
    materials: ["Steel", "Aluminum", "Brass", "Bronze"],
    applications: ["Industrial Components", "Automotive", "Aerospace", "Tooling"],
    processSteps: ["Preparation", "Heating", "Soaking", "Cooling", "Inspection"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  "quality-control": {
    title: "Quality Control",
    hero: "Comprehensive Testing & QA",
    description: "Ensuring product excellence with advanced quality control and inspection services.",
    capabilities: ["NDT Testing", "Dimensional Inspection", "Material Analysis", "Certification"],
    materials: ["All Metals", "Alloys", "Composite Materials"],
    applications: ["Automotive", "Aerospace", "Industrial Machinery", "Construction"],
    processSteps: ["Sampling", "Testing", "Analysis", "Reporting", "Certification"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  "machining": {
    title: "Machining Services",
    hero: "Precision Machining & Finishing",
    description: "High-precision machining for cast components to exact specifications.",
    capabilities: ["CNC Machining", "Surface Finishing", "Assembly", "Custom Tooling"],
    materials: ["Steel", "Aluminum", "Bronze", "Brass"],
    applications: ["Industrial Parts", "Automotive Components", "Custom Solutions"],
    processSteps: ["Design", "Programming", "Machining", "Finishing", "Quality Check"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  "consulting": {
    title: "Consulting Services",
    hero: "Expert Foundry & Process Consulting",
    description: "Optimizing processes and improving efficiency through expert consultation.",
    capabilities: ["Process Audit", "Cost Analysis", "Technical Training", "Design Optimization"],
    materials: ["All Materials"],
    applications: ["Factories", "Foundries", "Industrial Units"],
    processSteps: ["Assessment", "Recommendation", "Implementation", "Review", "Support"],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
};

interface ServiceDetailPageProps {
  serviceTitle: string;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ serviceTitle }) => {
  const [isMuted, setIsMuted] = useState(true);
  const service = serviceDetails[serviceTitle] || serviceDetails["metal-casting"];

  return (
    <div className="text-gray-900 bg-white">
      {/* Hero & Video */}
      <section className="relative bg-gradient-to-r from-primary/20 to-secondary/20 p-6 md:p-12">
        <div className="md:flex md:gap-6">
          <div className="md:flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{service.hero}</h1>
            <p className="text-gray-700 text-base md:text-lg">{service.description}</p>
          </div>
          <div className="relative w-full md:w-[400px] h-64 md:h-72 rounded-lg overflow-hidden mt-4 md:mt-0 flex-shrink-0">
            <iframe
              src={`${service.video}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=dQw4w9WgXcQ&modestbranding=1`}
              className="w-full h-full"
              title={service.title}
              allow="autoplay; encrypted-media"
            />
            <button
              className="absolute top-2 right-2 p-2 bg-white/70 rounded-full hover:bg-white/90 transition"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-gray-900" /> : <Volume2 className="w-5 h-5 text-gray-900" />}
            </button>
          </div>
        </div>
      </section>

      {/* Capabilities & Process */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Capabilities</h2>
          <ul className="space-y-2">
            {service.capabilities.map((cap: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-1 flex-shrink-0"></span>
                {cap}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Process Steps</h2>
          <div className="space-y-3">
            {service.processSteps.map((step: string, idx: number) => (
              <Card key={idx} className="p-3 border-l-4 border-primary rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                  <span className="font-semibold">{step}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Materials & Applications */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-gray-50">
        <Card className="p-4 rounded-lg">
          <h3 className="text-xl font-bold text-primary mb-3">Materials</h3>
          <div className="grid grid-cols-2 gap-2">
            {service.materials.map((m: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">{m}</div>
            ))}
          </div>
        </Card>

        <Card className="p-4 rounded-lg">
          <h3 className="text-xl font-bold text-primary mb-3">Applications</h3>
          <div className="space-y-2">
            {service.applications.map((app: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">{app}</div>
            ))}
          </div>
        </Card>
      </section>

      {/* Contact & Enquiry */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
        <Card className="p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-bold text-primary mb-3">Contact Info</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 9831334751</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> info@kalimatagroup.com</div>
          </div>
        </Card>
        <Card className="p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-bold text-primary mb-3">Send Enquiry</h3>
          <form className="space-y-3">
            <input className="w-full p-2 rounded-md border border-gray-300" placeholder="Name *" />
            <input className="w-full p-2 rounded-md border border-gray-300" placeholder="Email *" />
            <input className="w-full p-2 rounded-md border border-gray-300" placeholder="Phone" />
            <textarea className="w-full p-2 rounded-md border border-gray-300" rows={3} placeholder="Project Details *" />
            <Button className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md">Submit</Button>
          </form>
        </Card>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
