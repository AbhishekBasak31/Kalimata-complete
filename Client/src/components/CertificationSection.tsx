import { useEffect, useState, useRef } from "react";

// Logos for certifications (same as clients for now)
const logos = [
  "https://kalimatagroup.com/assets/uploads/certification/z1.png",
  "https://kalimatagroup.com/assets/uploads/certification/z3.png",
  "https://kalimatagroup.com/assets/uploads/certification/certfication.png",
  "https://kalimatagroup.com/assets/uploads/certification/z6.png",
  "https://kalimatagroup.com/assets/uploads/certification/quality%20image.png",
  "https://kalimatagroup.com/assets/uploads/certification/isro%20image%20certfication.png",
];

export default function CertificationSection() {
  const itemsPerSlide = 4; // show 4 logos per slide
  const slideWidth = 100 / itemsPerSlide; // width in percentage
  const allLogos = [...logos, ...logos]; // duplicate once for seamless loop
  const totalSlides = allLogos.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle the infinite loop effect
  useEffect(() => {
    if (currentIndex >= totalSlides / 2) {
      // After reaching the duplicated end, reset to start
      setTimeout(() => {
        setTransitionEnabled(false); // disable transition for instant jump
        setCurrentIndex(0);
      }, 700); // match transition duration
    } else {
      setTransitionEnabled(true);
    }
  }, [currentIndex, totalSlides]);

  return (
    <div className="w-full max-w-6xl mx-auto pt-8 py-2 relative">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-2">
        We Are Kalimata Group
      </h2>
      <p className="text-center text-gray-700 mb-8">Our Certification</p>

      {/* Logo Slider */}
      <div className="overflow-hidden relative">
        <div
          ref={containerRef}
          className={`flex ${transitionEnabled ? "transition-transform duration-700 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${currentIndex * slideWidth}%)` }}
        >
          {allLogos.map((logo, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-1/4 p-4 flex justify-center"
            >
              <img
                src={logo}
                alt={`Certification ${idx}`}
                className="h-[120px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
