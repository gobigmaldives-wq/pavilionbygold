// Package details with inclusions and wedding examples

export interface WeddingExample {
  name: string;
  date: string;
  guestCount: number;
}

export interface PackageDetail {
  id: string;
  name: string;
  description: string;
  priceRf: number;
  priceUsd: number;
  includes: string[];
  weddings: WeddingExample[];
}

export const DECOR_PACKAGE_DETAILS: PackageDetail[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Essential venue styling for an elegant touch",
    priceRf: 20000,
    priceUsd: 1300,
    includes: [
      "Basic floral centerpieces (5 tables)",
      "Table runners & napkins",
      "Welcome signage",
      "Basic lighting setup",
      "Entrance decoration",
      "Chair sashes (up to 100)",
    ],
    weddings: [
      { name: "Ahmed & Fathimath", date: "January 2025", guestCount: 80 },
      { name: "Ibrahim & Aishath", date: "December 2024", guestCount: 65 },
      { name: "Hassan & Mariyam", date: "November 2024", guestCount: 90 },
    ],
  },
  {
    id: "standard",
    name: "Standard",
    description: "Premium floral arrangements & enhanced lighting",
    priceRf: 50000,
    priceUsd: 3240,
    includes: [
      "Premium floral centerpieces (10 tables)",
      "Luxury table linens",
      "Custom welcome signage",
      "Enhanced ambient lighting",
      "Entrance arch decoration",
      "Chair covers with sashes",
      "Stage backdrop",
      "Photo corner setup",
      "Candle arrangements",
    ],
    weddings: [
      { name: "Ali & Aminath", date: "February 2025", guestCount: 120 },
      { name: "Mohamed & Hawwa", date: "January 2025", guestCount: 100 },
      { name: "Hussain & Naashia", date: "December 2024", guestCount: 140 },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Full venue transformation with luxury touches",
    priceRf: 100000,
    priceUsd: 6485,
    includes: [
      "Luxury floral centerpieces (unlimited)",
      "Designer table settings",
      "Custom-designed signage suite",
      "Professional lighting design",
      "Grand entrance installation",
      "Premium chair decor",
      "Elaborate stage design",
      "Multiple photo corners",
      "Hanging installations",
      "Aisle decoration",
      "Ceiling draping",
      "Custom props & accessories",
    ],
    weddings: [
      { name: "Abdulla & Shifana", date: "March 2025", guestCount: 200 },
      { name: "Yoosuf & Sana", date: "February 2025", guestCount: 180 },
      { name: "Ahmed & Fazla", date: "January 2025", guestCount: 220 },
    ],
  },
];

export const AV_PACKAGE_DETAILS: PackageDetail[] = [
  {
    id: "basic",
    name: "Basic AV",
    description: "Essential audio setup for speeches and announcements",
    priceRf: 15000,
    priceUsd: 975,
    includes: [
      "2 wireless microphones",
      "Basic speaker system",
      "Background music playback",
      "Simple DJ setup",
      "Sound technician (4 hours)",
    ],
    weddings: [
      { name: "Nashid & Zeena", date: "January 2025", guestCount: 60 },
      { name: "Faheem & Raufa", date: "December 2024", guestCount: 50 },
      { name: "Siraj & Muna", date: "November 2024", guestCount: 70 },
    ],
  },
  {
    id: "standard",
    name: "Standard AV",
    description: "Full sound system with visual displays",
    priceRf: 30000,
    priceUsd: 1950,
    includes: [
      "4 wireless microphones",
      "Professional speaker system",
      "Subwoofer setup",
      "LED projector & screen",
      "Video playback capability",
      "DJ booth with lighting",
      "Sound technician (6 hours)",
      "Ambient music curation",
    ],
    weddings: [
      { name: "Rameez & Shaira", date: "February 2025", guestCount: 110 },
      { name: "Faisal & Nadia", date: "January 2025", guestCount: 95 },
      { name: "Adam & Laila", date: "December 2024", guestCount: 120 },
    ],
  },
  {
    id: "premium",
    name: "Premium AV",
    description: "Professional setup with advanced lighting effects",
    priceRf: 50000,
    priceUsd: 3245,
    includes: [
      "6 wireless microphones",
      "Concert-grade speaker system",
      "Dual subwoofer setup",
      "Large LED wall display",
      "Live video mixing",
      "Professional DJ equipment",
      "Moving head lights",
      "LED uplighting (20 fixtures)",
      "Fog/haze machine",
      "Spotlight system",
      "Full technical crew",
      "Sound & lighting technician (8 hours)",
    ],
    weddings: [
      { name: "Zayan & Shifa", date: "March 2025", guestCount: 180 },
      { name: "Ismail & Reema", date: "February 2025", guestCount: 160 },
      { name: "Shameem & Yumna", date: "January 2025", guestCount: 200 },
    ],
  },
];

export const CATERING_PACKAGE_DETAILS: PackageDetail[] = [
  {
    id: "silver",
    name: "Silver Package",
    description: "Classic menu selection per person",
    priceRf: 160,
    priceUsd: 9,
    includes: [
      "Welcome drinks",
      "3 appetizer options",
      "Main course (2 proteins)",
      "Rice & naan bread",
      "2 dessert options",
      "Soft drinks & water",
      "Professional service staff",
      "Table setup & cleanup",
    ],
    weddings: [
      { name: "Asif & Jameela", date: "January 2025", guestCount: 100 },
      { name: "Naeem & Firasha", date: "December 2024", guestCount: 80 },
      { name: "Sameer & Nadha", date: "November 2024", guestCount: 90 },
    ],
  },
  {
    id: "gold",
    name: "Gold Package",
    description: "Enhanced menu with premium options per person",
    priceRf: 190,
    priceUsd: 12.5,
    includes: [
      "Welcome drinks & canapés",
      "5 appetizer options",
      "Main course (3 proteins)",
      "Live cooking station",
      "Premium rice varieties",
      "Bread station",
      "4 dessert options",
      "Fresh juices & mocktails",
      "Dedicated service team",
      "Premium tableware",
    ],
    weddings: [
      { name: "Waheed & Suma", date: "February 2025", guestCount: 130 },
      { name: "Rafeeq & Latheefa", date: "January 2025", guestCount: 110 },
      { name: "Nasheed & Azeema", date: "December 2024", guestCount: 145 },
    ],
  },
  {
    id: "platinum",
    name: "Platinum Package",
    description: "Luxury dining experience per person",
    priceRf: 230,
    priceUsd: 15,
    includes: [
      "Champagne welcome reception",
      "7 premium appetizers",
      "Main course (4 proteins)",
      "Multiple live stations",
      "Seafood display",
      "International cuisine options",
      "Gourmet dessert buffet",
      "Chocolate fountain",
      "Premium beverages & mocktails",
      "VIP service team",
      "Custom menu printing",
      "Chef's table experience",
    ],
    weddings: [
      { name: "Faiz & Shiuna", date: "March 2025", guestCount: 200 },
      { name: "Hameed & Rizna", date: "February 2025", guestCount: 170 },
      { name: "Tharik & Minha", date: "January 2025", guestCount: 190 },
    ],
  },
];

// Helper to get package details by ID
export const getPackageDetails = (
  type: "decor" | "av" | "catering",
  id: string
): PackageDetail | undefined => {
  switch (type) {
    case "decor":
      return DECOR_PACKAGE_DETAILS.find((p) => p.id === id);
    case "av":
      return AV_PACKAGE_DETAILS.find((p) => p.id === id);
    case "catering":
      return CATERING_PACKAGE_DETAILS.find((p) => p.id === id);
  }
};
