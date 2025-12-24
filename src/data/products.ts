export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  drop: string;
  dropLabel: string;
  category: string;
  color: string;
  availability: string;
  availabilityLabel: string;
  description: string[];
  images: string[];
  sizes: string[];
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "ant-man-tee",
    name: "ANT MAN",
    price: 299000,
    currency: "IDR",
    drop: "archive-001",
    dropLabel: "ARCHIVE 001",
    category: "tee",
    color: "Black",
    availability: "limited",
    availabilityLabel: "Limited Run",
    description: [
      "Heavy cotton construction",
      "Screen printed graphics",
      "Oversized fit",
      "Produced once — No restock"
    ],
    images: [
      "/placeholder-product-1.jpg",
      "/placeholder-product-2.jpg",
      "/placeholder-product-3.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "if-youre-reading-this-tee",
    name: "IF YOU'RE READING THIS",
    price: 299000,
    currency: "IDR",
    drop: "archive-001",
    dropLabel: "ARCHIVE 001",
    category: "tee",
    color: "White",
    availability: "limited",
    availabilityLabel: "Limited Run",
    description: [
      "Premium cotton blend",
      "Typographic print",
      "Regular fit",
      "Produced once — No restock"
    ],
    images: [
      "/placeholder-product-1.jpg",
      "/placeholder-product-2.jpg",
      "/placeholder-product-3.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "brent-tee",
    name: "BRENT",
    price: 299000,
    currency: "IDR",
    drop: "archive-001",
    dropLabel: "ARCHIVE 001",
    category: "tee",
    color: "Black",
    availability: "limited",
    availabilityLabel: "Limited Run",
    description: [
      "Heavyweight jersey",
      "Back print detail",
      "Relaxed silhouette",
      "Produced once — No restock"
    ],
    images: [
      "/placeholder-product-1.jpg",
      "/placeholder-product-2.jpg",
      "/placeholder-product-3.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "wnm-studio-tee",
    name: "WNM STUDIO",
    price: 279000,
    currency: "IDR",
    drop: "archive-002",
    dropLabel: "ARCHIVE 002",
    category: "tee",
    color: "Off-white",
    availability: "limited",
    availabilityLabel: "Limited Run",
    description: [
      "Organic cotton",
      "Embroidered logo",
      "Boxy cut",
      "Produced once — No restock"
    ],
    images: [
      "/placeholder-product-1.jpg",
      "/placeholder-product-2.jpg",
      "/placeholder-product-3.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  }
];

export const drops = [
  {
    id: "archive-001",
    name: "ARCHIVE 001",
    tagline: "The Beginning",
    date: "2025",
    productCount: 3
  },
  {
    id: "archive-002", 
    name: "ARCHIVE 002",
    tagline: "Studio Collection",
    date: "2025",
    productCount: 1
  }
];

export const formatPrice = (price: number, currency: string = "IDR"): string => {
  if (currency === "IDR") {
    return `${(price / 1000).toFixed(0)}K IDR`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price);
};
