import { useEffect, useState } from "react";

// Logos from your server
const logos = [
  "https://kalimatagroup.com/assets/uploads/factory/Jharkhand_Rajakiya_Chihna.png",
  "https://kalimatagroup.com/assets/uploads/factory/WEST-BENGAL.jpg",
  "https://kalimatagroup.com/assets/uploads/factory/givt-up.jfif",
  "https://kalimatagroup.com/assets/uploads/factory/Jharkhand_Rajakiya_Chihna.png",
  "https://kalimatagroup.com/assets/uploads/factory/WEST-BENGAL.jpg",
  "https://kalimatagroup.com/assets/uploads/factory/givt-up.jfif",
  "https://kalimatagroup.com/assets/uploads/factory/Jharkhand_Rajakiya_Chihna.png",
  "https://kalimatagroup.com/assets/uploads/factory/WEST-BENGAL.jpg",
  "https://kalimatagroup.com/assets/uploads/factory/givt-up.jfif",
];

export default function ClientsSection() {
  // Duplicate logos 3 times to allow sliding multiple times
  const allLogos = [...logos];
  const itemsPerSlide = 3; // slide 3 logos at a time
  const totalSlides = Math.ceil(allLogos.length / itemsPerSlide);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <div className="w-full max-w-6xl mx-auto pt-16 py-2">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-4">
        We are committed to provide safe industrial solutions to many factories
      </h2>
      <p className="text-center text-gray-700 mb-8">
        We proudly serve a diverse range of clients, from industry leaders to innovative startups, all seeking high-quality casting and foundry solutions tailored to their unique needs.
      </p>

      {/* Logo Slider */}
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${(currentSlide * 100) / totalSlides}%)` }}
        >
          {allLogos.map((logo, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-1/3 p-4 flex justify-center"
            >
              <img src={logo} alt={`Client ${idx}`} className="h-[120px] object-contain" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 mt-4">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full ${idx === currentSlide ? "bg-blue-600" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
