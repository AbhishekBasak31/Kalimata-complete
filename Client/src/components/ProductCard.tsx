import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  price?: string;
  onEnquiryClick: (productId: string) => void;
  isHorizontal?: boolean; // optional prop for horizontal layout
  categorySlug?: string;   // ✅ new optional prop
  subCategorySlug?: string; // ✅ new optional prop
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  description,
  price,
  onEnquiryClick,
  isHorizontal = false, // default vertical layout
  categorySlug,
  subCategorySlug,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate if categorySlug and subCategorySlug provided
    if (categorySlug && subCategorySlug) {
      navigate(`/products/${categorySlug}/${subCategorySlug}`);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 shadow hover:shadow-lg transition-shadow flex cursor-pointer ${
        isHorizontal ? "flex-row gap-4 mx-auto" : "flex-col"
      }`}
      style={isHorizontal ? { width: "900px" } : undefined} // fixed width for horizontal
      onClick={handleCardClick}
    >
      <img
        src={image}
        alt={name}
        className={`rounded-md object-cover ${
          isHorizontal ? "w-48 h-48 flex-shrink-0" : "w-full h-48 mb-4"
        }`}
      />
      <div className={`${isHorizontal ? "flex-1" : ""} flex flex-col justify-between`}>
        <div>
          <h3 className="font-bold text-lg mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          {price && <p className="font-semibold mb-2">Price: {price}</p>}
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation(); // prevent card click navigation
            onEnquiryClick(id);
          }}
          className={`bg-primary hover:bg-primary/90 text-primary-foreground ${
            isHorizontal ? "w-48 mt-4" : "w-full"
          }`}
        >
          Enquire
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
