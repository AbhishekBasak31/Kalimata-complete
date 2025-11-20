import React from "react";

interface ScrollableImagesProps {
  images: string[];
}

const ScrollableImages: React.FC<ScrollableImagesProps> = ({ images }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto py-4">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Subcategory Image ${index + 1}`}
          className="w-64 h-40 object-cover rounded-lg flex-shrink-0"
        />
      ))}
    </div>
  );
};

export default ScrollableImages;
