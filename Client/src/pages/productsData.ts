// src/data/products.ts (cleaned, no price field)

export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface SubCategory {
  name: string;
  slug: string;
  images: string[];
  products: Product[];
}

export interface Category {
  name: string;
  slug: string;
  subCategories: SubCategory[];
}

export const productCategories: Category[] = [
  {
    name: "Metal Castings",
    slug: "metal-castings",
    subCategories: [
      {
        name: "Iron Castings",
        slug: "iron-castings",
        images: [
          "https://images.unsplash.com/photo-1697281679290-ad7be1b10682?q=80&w=1170&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1751979362679-8687eb4d9301?q=80&w=735&auto=format&fit=crop",
        ],
        products: [
          {
            id: "iron1",
            name: "Iron Valve",
            image:
              "https://images.unsplash.com/photo-1542041424505-01527297cc72?q=80&w=1170&auto=format&fit=crop",
            description: "Durable iron valve for industrial use.",
          },
          {
            id: "iron2",
            name: "Iron Pipe",
            image:
              "https://images.unsplash.com/photo-1529269421632-e9253d14d3a9?q=80&w=1170&auto=format&fit=crop",
            description: "High-quality iron pipe for construction.",
          },
          {
            id: "iron3",
            name: "Iron Gear",
            image:
              "https://images.unsplash.com/photo-1571291341483-2fdc082c59ba?q=80&w=1170&auto=format&fit=crop",
            description: "Precision iron gear for machinery.",
          },
        ],
      },
      {
        name: "Steel Castings",
        slug: "steel-castings",
        images: [
          "https://images.unsplash.com/photo-1662826323790-47114fdb8c1c?q=80&w=1170&auto=format&fit=crop",
          "https://plus.unsplash.com/premium_photo-1682141511588-b40e020dac54?q=80&w=1170&auto=format&fit=crop",
        ],
        products: [
          {
            id: "steel1",
            name: "Steel Flange",
            image:
              "https://plus.unsplash.com/premium_photo-1754265661212-78c06fe78e95?q=80&w=1074&auto=format&fit=crop",
            description: "Precision steel flange for machinery.",
          },
          {
            id: "steel2",
            name: "Steel Rod",
            image:
              "https://images.unsplash.com/photo-1755289832483-c633ada42a8c?q=80&w=1146&auto=format&fit=crop",
            description: "High-grade steel rod for construction.",
          },
        ],
      },
      {
        name: "Aluminum Castings",
        slug: "aluminum-castings",
        images: [
          "https://images.unsplash.com/photo-1727373203579-7b8984cb8120?q=80&w=1631&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1709244596178-4c2656d02d1e?q=80&w=687&auto=format&fit=crop",
        ],
        products: [
          {
            id: "alum1",
            name: "Aluminum Plate",
            image:
              "https://plus.unsplash.com/premium_photo-1681400129221-0f64ad756481?q=80&w=1074&auto=format&fit=crop",
            description: "Lightweight aluminum plate for industrial use.",
          },
          {
            id: "alum2",
            name: "Aluminum Sheet",
            image:
              "https://plus.unsplash.com/premium_photo-1669069604785-2c889d231996?q=80&w=1170&auto=format&fit=crop",
            description: "High-quality aluminum sheet for construction.",
          },
        ],
      },
      {
        name: "Bronze Castings",
        slug: "bronze-castings",
        images: [
          "https://images.unsplash.com/photo-1697281679290-ad7be1b10682?q=80&w=1170&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1651713389313-5e1f7bfa9efb?q=80&w=1170&auto=format&fit=crop",
        ],
        products: [
          {
            id: "bronze1",
            name: "Bronze Gear",
            image:
              "https://images.unsplash.com/photo-1582043568773-a7a2b57239f5?q=80&w=1170&auto=format&fit=crop",
            description: "Durable bronze gear for machinery.",
          },
        ],
      },
    ],
  },
  {
    name: "Industrial Components",
    slug: "industrial-components",
    subCategories: [
      {
        name: "Machinery Parts",
        slug: "machinery-parts",
        images: [
          "https://images.unsplash.com/photo-1608198092983-9d6b0f9c992d?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1608198093003-cd69a0f98253?auto=format&fit=crop&w=400&q=80",
        ],
        products: [
          {
            id: "mach1",
            name: "Gearbox",
            image:
              "https://images.unsplash.com/photo-1612874742055-57e9b0a1e7c2?auto=format&fit=crop&w=400&q=80",
            description: "Durable gearbox for industrial machines.",
          },
          {
            id: "mach2",
            name: "Motor Shaft",
            image:
              "https://images.unsplash.com/photo-1612874742070-1d8f5c7b2a1b?auto=format&fit=crop&w=400&q=80",
            description: "High-quality motor shaft for machinery.",
          },
        ],
      },
      {
        name: "Automotive Parts",
        slug: "automotive-parts",
        images: [
          "https://images.unsplash.com/photo-1602524209588-98994f1bcd2b?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1602524209589-9b3f3d6b7a4b?auto=format&fit=crop&w=400&q=80",
        ],
        products: [
          {
            id: "auto1",
            name: "Brake Disc",
            image:
              "https://images.unsplash.com/photo-1612831455560-1c2f5d0a3b4c?auto=format&fit=crop&w=400&q=80",
            description: "Precision brake disc for vehicles.",
          },
        ],
      },
      {
        name: "Valve Bodies",
        slug: "valve-bodies",
        images: [
          "https://images.unsplash.com/photo-1725916631310-4d7cdf815079?q=80&w=1302&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?q=80&w=1170&auto=format&fit=crop",
        ],
        products: [
          {
            id: "valve1",
            name: "Industrial Valve Body",
            image:
              "https://images.unsplash.com/photo-1582642880428-3e2c04ad14ec?q=80&w=1170&auto=format&fit=crop",
            description: "High-precision valve body for industrial use.",
          },
        ],
      },
      {
        name: "Pipe Fittings",
        slug: "pipe-fittings",
        images: [
          "https://images.unsplash.com/photo-1560636201-c08c2b24e147?q=80&w=1624&auto=format&fit=crop",
          "https://media.istockphoto.com/id/984071296/photo/hydraulic-quick-couplers.jpg?s=1024x1024&w=is&k=20&c=60SDeMaJirJgfoPIA-KY2rCpdhtG4ithxCqb8BV2Fx0",
        ],
        products: [
          {
            id: "pipe1",
            name: "Industrial Pipe Fitting",
            image:
              "https://images.unsplash.com/photo-1538474705339-e87de81450e8?q=80&w=1170&auto=format&fit=crop",
            description: "Durable pipe fitting for construction.",
          },
        ],
      },
    ],
  },
  {
    name: "Custom Solutions",
    slug: "custom-solutions",
    subCategories: [
      {
        name: "Prototype Casting",
        slug: "prototype-casting",
        images: [
          "https://images.unsplash.com/photo-1612831455565-3f2c7d0b2e1f?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1612831455568-5d7c0e2f1a3b?auto=format&fit=crop&w=400&q=80",
        ],
        products: [
          {
            id: "proto1",
            name: "Custom Gear",
            image:
              "https://images.unsplash.com/photo-1612831455570-6b2f0c3e1a4d?auto=format&fit=crop&w=400&q=80",
            description: "Bespoke gear for prototypes.",
          },
        ],
      },
      {
        name: "Art Castings",
        slug: "art-castings",
        images: [
          "https://images.unsplash.com/photo-1624393321120-0c8d9e1f3a80?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1624393321110-1d9e0f2a4b90?auto=format&fit=crop&w=400&q=80",
        ],
        products: [
          {
            id: "art1",
            name: "Decorative Art Cast",
            image:
              "https://images.unsplash.com/photo-1624393321100-2e0f1g3b5c00?auto=format&fit=crop&w=400&q=80",
            description: "Beautiful art casting for decoration.",
          },
        ],
      },
      {
        name: "Decorative Items",
        slug: "decorative-items",
        images: [
          "https://images.unsplash.com/photo-1612831455572-7c2d5f1e3a4b?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1612831455575-8d3f1b2c4e5f?auto=format&fit=crop&w=400&q=80",
        ],
        products: [
          {
            id: "decor1",
            name: "Decorative Statue",
            image:
              "https://images.unsplash.com/photo-1612831455578-9f2b1c3d5e6f?auto=format&fit=crop&w=400&q=80",
            description: "Artistic decorative statue.",
          },
        ],
      },
      {
        name: "Custom Designs",
        slug: "custom-designs",
        images: [
          "https://images.unsplash.com/photo-1624393321090-3f1g2h4c6d10?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1624393321080-4g2h3i5d7e20?auto=format&fit=crop&w=400&q=80",
        ],
        products: [
          {
            id: "custom1",
            name: "Bespoke Metal Design",
            image:
              "https://images.unsplash.com/photo-1624393321070-5h3i4j6e8f30?auto=format&fit=crop&w=400&q=80",
            description: "Tailor-made metal design for clients.",
          },
        ],
      },
    ],
  },
];
