import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { subcategories } from "@/data/subcategory";

const shuffleArray = <T,>(array: T[]): T[] => {
  return array
    .map((a) => [Math.random(), a] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
};

export default function SubcategoryScroller() {
  const [shuffledSubs, setShuffledSubs] = useState(subcategories);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const CARD_WIDTH = 240; // increased card width for larger visible area
  const GAP = 32; // gap between cards
  const CARDS_PER_SLIDE = 4;
  const AUTO_SCROLL_INTERVAL = 15000; // 15 seconds

  // Shuffle on mount
  useEffect(() => {
    setShuffledSubs(shuffleArray(subcategories));
  }, []);

  const totalSlides = Math.ceil(shuffledSubs.length / CARDS_PER_SLIDE);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, AUTO_SCROLL_INTERVAL);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const getXOffset = () => {
    const maxIndex = totalSlides - 1;
    const offset = currentSlide * (CARD_WIDTH * CARDS_PER_SLIDE + GAP * (CARDS_PER_SLIDE - 1));
    const maxOffset =
      shuffledSubs.length * CARD_WIDTH +
      (shuffledSubs.length - 1) * GAP -
      CARDS_PER_SLIDE * CARD_WIDTH -
      GAP * (CARDS_PER_SLIDE - 1);
    return offset > maxOffset ? maxOffset : offset;
  };

  return (
    <section className="py-12 bg-gray-100 relative overflow-hidden">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6">
        Explore Products
      </h3>

      <div
        ref={containerRef}
        className="overflow-hidden mx-auto"
        style={{
          width: `${CARD_WIDTH * CARDS_PER_SLIDE + GAP * (CARDS_PER_SLIDE - 1) + 40}px`, // extra space to make visible area wider
        }}
      >
        <motion.div
          animate={{ x: -getXOffset() }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="flex gap-8 cursor-grab select-none"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.05}
          onDragEnd={(e, info) => {
            const delta = -info.offset.x;
            const newIndex = Math.round(delta / (CARD_WIDTH * CARDS_PER_SLIDE + GAP * (CARDS_PER_SLIDE - 1)));
            setCurrentSlide(Math.min(Math.max(newIndex, 0), totalSlides - 1));
          }}
        >
          {shuffledSubs.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <div className="relative h-36 w-full overflow-hidden">
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-gray-900 mb-1">{sub.name}</h4>
                <p className="text-gray-600 text-xs">{sub.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full transition ${
                idx === currentSlide ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
