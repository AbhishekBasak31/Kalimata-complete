import pipeFittingsImg from "@/assets/pipe-fittings.jpg";
import valveBodiesImg from "@/assets/valve-bodies.jpg";
import manholeCoversImg from "@/assets/manhole-covers.jpg";
import pumpCasingsImg from "@/assets/pump-casings.jpg";

import railwaySholdersImg from "@/assets/railway-shoulder.jpg";
import railwayInsertsImg from "@/assets/railway-inserts.jpg";
import railwayBoltsImg from "@/assets/railway-bolts.jpg";
import railwayCouplersImg from "@/assets/railway-couplers.jpg";

import housingBracketImg from "@/assets/housing-bracket.jpg";
import housingPanelImg from "@/assets/housing-panel.jpg";
import housingCoverImg from "@/assets/housing-cover.jpg";
import housingSupportImg from "@/assets/housing-support.jpg";

import CDMJB1106 from "@/assets/CDMJB1106.jpg";

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  image: string;
  keyDetails: string[];
}

export const subcategories: SubCategory[] = [
  // ======================================================
  // 🔹 DUCTILE IRON CASTING
  // ======================================================
  {
    id: "pipe-fittings",
    name: "Pipe Fittings",
    categoryId: "ductile-iron-casting",
    description: "Leak-proof high-pressure fittings",
    image: CDMJB1106,
    keyDetails: [
      "ISO/ASTM certified",
      "Corrosion protected"
    ],
  },
  // {
  //   id: "valve-bodies",
  //   name: "Valve Bodies",
  //   categoryId: "ductile-iron-casting",
  //   description: "Precision-cast valve components",
  //   image: valveBodiesImg,
  //   keyDetails: [
  //     "Wear resistant",
  //     "Tight tolerance machining"
  //   ],
  // },
  {
    id: "manhole-covers",
    name: "Manhole Covers",
    categoryId: "ductile-iron-casting",
    description: "Heavy-duty surface access covers",
    image: manholeCoversImg,
    keyDetails: [
      "EN124 compliant",
      "Anti-skid design"
    ],
  },
  // {
  //   id: "pump-casings",
  //   name: "Pump Casings",
  //   categoryId: "ductile-iron-casting",
  //   description: "Durable fluid pump housings",
  //   image: pumpCasingsImg,
  //   keyDetails: [
  //     "Optimized flow",
  //     "Fatigue resistant"
  //   ],
  // },

  // ======================================================
  // 🔹 RAILWAY PARTS
  // ======================================================
  {
    id: "railway-shoulders",
    name: "Railway Shoulders",
    categoryId: "railway-parts",
    description: "Track alignment and support",
    image: railwaySholdersImg,
    keyDetails: [
      "Even load distribution",
      "All-weather durability"
    ],
  },
  // {
  //   id: "railway-inserts",
  //   name: "Railway Inserts",
  //   categoryId: "railway-parts",
  //   description: "High-performance SG iron inserts",
  //   image: railwayInsertsImg,
  //   keyDetails: [
  //     "Wear resistant",
  //     "Heat resistant"
  //   ],
  // },
  // {
  //   id: "railway-bolts",
  //   name: "Railway Bolts & Fasteners",
  //   categoryId: "railway-parts",
  //   description: "Rail fastening hardware solutions",
  //   image: railwayBoltsImg,
  //   keyDetails: [
  //     "Anti-vibration",
  //     "Corrosion protected"
  //   ],
  // },
  {
    id: "railway-couplers",
    name: "Elastic Rail Clip With Flat Toe",
    categoryId: "railway-parts",
    description: "Secure rail-to-sleeper connection",
    image: railwayCouplersImg,
    keyDetails: [
      "Fatigue tested",
      "Forged precision"
    ],
  },

  // ======================================================
  // 🔹 HOUSING COMPONENTS
  // ======================================================
  {
    id: "housing-brackets",
    name: "Housing Brackets",
    categoryId: "housing-components",
    description: "Support brackets for assemblies",
    image: housingBracketImg,
    keyDetails: [
      "Strong steel",
      "Easy mounting"
    ],
  },
  {
    id: "housing-panels",
    name: "Housing Panels",
    categoryId: "housing-components",
    description: "Panels for protective housing",
    image: housingPanelImg,
    keyDetails: [
      "Precision cut",
      "Powder coated"
    ],
  },
  {
    id: "housing-covers",
    name: "Access Housing Covers",
    categoryId: "housing-components",
    description: "Protective access panel covers",
    image: housingCoverImg,
    keyDetails: [
      "Quick removal",
      "Weather-proof"
    ],
  },
  {
    id: "housing-supports",
    name: "Housing Support Rods",
    categoryId: "housing-components",
    description: "Reinforcement rods for housings",
    image: housingSupportImg,
    keyDetails: [
      "Alloy steel",
      "Multiple sizes"
    ],
  },
];
