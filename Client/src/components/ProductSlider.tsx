import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";

export default function ProductSection() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-6xl mx-auto py-8 pb-0 mb-0 px-4">
      {/* Section Title */}
      <h2 className="text-3xl font-bold mb-8 text-center">Our Products</h2>

      {/* Product Grid for Desktop / Horizontal Slider for Mobile */}
      <div
        className="
          flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4
          sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:pb-0
        "
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="
              flex-shrink-0 w-72 snap-center
              sm:w-full sm:max-w-sm bg-white rounded-2xl shadow-lg
              overflow-hidden hover:scale-105 transform transition duration-300 cursor-pointer
            "
            onClick={() => navigate(`/internal-products/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
              <p className="text-gray-700 text-sm mb-3">{product.description}</p>
              <p className="text-xs text-primary font-medium mb-2">
                Category: {product.category}
              </p>
              <ul className="text-sm text-gray-600 list-disc pl-5">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
