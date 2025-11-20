// src/data/categories.ts
import ductileIronImg from "@/assets/ductile-iron.jpg";
import railwayPartsImg from "@/assets/railway-parts.jpg";
import housingComponentsImg from "@/assets/housing-components.jpg"; // New image import
import CDMJB2206 from "@/assets/CDMJB2206.jpg";

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  keyDetails: string[];
}

export const categories: Category[] = [
  {
    id: "ductile-iron-casting",
    name: "Ductile Iron Castings",
    description:
      "High-quality ductile iron castings engineered for strength, precision, and reliability.",
    image: ductileIronImg,
    keyDetails: [
      "Superior tensile strength",
      "Corrosion resistance",
      "Custom casting capabilities",
    ],
  },
  // ======================================================
  // 🔹 RAILWAY PARTS CATEGORY
  // ======================================================
  {
    id: "railway-parts",
    name: "Railway Fastenings",
    description:
      "Comprehensive range of railway components ensuring performance and safety.",
    image: railwayPartsImg,
    keyDetails: [
      "Designed for heavy-duty use",
      "Meets global railway standards",
      "Tested for long-term durability",
    ],
  },
  {
  id: "housing-components",
  name: "Housing Components",
  description:
    "Precision-engineered housing components for industrial and mechanical applications.",
  image: housingComponentsImg,
  keyDetails: [
    "Brackets and supports for stability",
    "Panels and covers for protection",
    "High-strength alloy steel",
    "Customizable for specific assemblies",
  ],
},
];
