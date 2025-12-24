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
    images: ["antman"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "drake-tee",
    name: "DRAKE",
    price: 299000,
    currency: "IDR",
    drop: "archive-001",
    dropLabel: "ARCHIVE 001",
    category: "tee",
    color: "Off-white",
    availability: "limited",
    availabilityLabel: "Limited Run",
    description: [
      "Premium cotton blend",
      "Portrait graphic print",
      "Regular fit",
      "Produced once — No restock"
    ],
    images: ["drake"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "brent-tee",
    name: "BRENT FAIYAZ",
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
    images: ["brent"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "tyler-tee",
    name: "TYLER THE CREATOR",
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
      "Chromakopia inspired",
      "Boxy cut",
      "Produced once — No restock"
    ],
    images: ["tyler"],
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

// Size guide data
export const sizeGuide = {
  measurements: [
    { size: 'S', chest: '50', length: '70', shoulder: '46' },
    { size: 'M', chest: '54', length: '72', shoulder: '48' },
    { size: 'L', chest: '58', length: '74', shoulder: '50' },
    { size: 'XL', chest: '62', length: '76', shoulder: '52' },
  ],
  unit: 'cm',
  notes: [
    'Measurements are in centimeters',
    'Oversized fit — we recommend sizing down for a more fitted look',
    'Models wear size L (height 180cm, chest 96cm)'
  ]
};
