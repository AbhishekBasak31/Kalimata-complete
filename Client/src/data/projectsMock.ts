export interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  status: "upcoming" | "live" | "completed";
  highlights: string[];
}

export const projectsMock: Project[] = [
  {
    id: "1",
    title: "Greenfield Factory Expansion",
    description: "Expanding our foundry with state-of-the-art casting technology.",
    images: ["/upcoming-project.jpg", "/upcoming-project-2.jpg"],
    status: "upcoming",
    highlights: [
      "State-of-the-art machinery",
      "ISO-certified process",
      "Advanced CNC machining",
      "Sustainable construction practices",
    ],
  },
  {
    id: "2",
    title: "AI Inspection Upgrade",
    description: "Installing AI-powered quality inspection systems.",
    images: ["/upcoming-project.jpg", "/upcoming-project-2.jpg"],
    status: "upcoming",
    highlights: [
      "AI-based inspection",
      "Real-time quality monitoring",
      "Integration with ERP",
    ],
  },
  {
    id: "3",
    title: "Automotive Parts Plant",
    description: "Currently operational with advanced CNC machines.",
    images: ["/live-project.jpg", "/live-project-2.jpg"],
    status: "live",
    highlights: [
      "High-efficiency production",
      "Advanced automation",
      "ISO-certified quality",
    ],
  },
  {
    id: "4",
    title: "Steel Casting Line 2",
    description: "Live production line enhancing output capacity.",
    images: ["/live-project.jpg", "/live-project-2.jpg"],
    status: "live",
    highlights: ["Optimized workflow", "High-capacity production", "Energy efficient"],
  },
  {
    id: "5",
    title: "New Sand Plant",
    description: "Completed installation of a modern sand plant.",
    images: ["/completed-project.jpg", "/completed-project-2.jpg"],
    status: "completed",
    highlights: ["Modern equipment", "Automated processes", "High precision molds"],
  },
  {
    id: "6",
    title: "Heat Treatment Facility",
    description: "Completed furnace setup for advanced heat treatment.",
    images: ["/completed-project.jpg", "/completed-project-2.jpg"],
    status: "completed",
    highlights: ["Advanced furnace", "Temperature control systems", "High durability"],
  },
];
