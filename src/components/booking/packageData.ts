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

// Event-type-specific Decor pricing
export const DECOR_PRICES_BY_EVENT: Record<string, { classic: { rf: number; usd: number }; standard: { rf: number; usd: number }; premium: { rf: number; usd: number } }> = {
  wedding: { classic: { rf: 20000, usd: 1300 }, standard: { rf: 50000, usd: 3240 }, premium: { rf: 100000, usd: 6485 } },
  corporate: { classic: { rf: 20000, usd: 1300 }, standard: { rf: 50000, usd: 3240 }, premium: { rf: 100000, usd: 6485 } },
  private: { classic: { rf: 10000, usd: 650 }, standard: { rf: 25000, usd: 1620 }, premium: { rf: 50000, usd: 3240 } },
  ramadan: { classic: { rf: 10000, usd: 650 }, standard: { rf: 25000, usd: 1620 }, premium: { rf: 50000, usd: 3240 } },
  other: { classic: { rf: 20000, usd: 1300 }, standard: { rf: 50000, usd: 3240 }, premium: { rf: 100000, usd: 6485 } },
};

// Event-type-specific AV pricing
export const AV_PRICES_BY_EVENT: Record<string, { basic: { rf: number; usd: number }; standard: { rf: number; usd: number }; premium: { rf: number; usd: number } }> = {
  wedding: { basic: { rf: 5000, usd: 325 }, standard: { rf: 10000, usd: 650 }, premium: { rf: 25000, usd: 1620 } },
  corporate: { basic: { rf: 25000, usd: 1620 }, standard: { rf: 50000, usd: 3240 }, premium: { rf: 80000, usd: 5190 } },
  private: { basic: { rf: 5000, usd: 325 }, standard: { rf: 15000, usd: 975 }, premium: { rf: 25000, usd: 1620 } },
  ramadan: { basic: { rf: 5000, usd: 325 }, standard: { rf: 15000, usd: 975 }, premium: { rf: 25000, usd: 1620 } },
  other: { basic: { rf: 5000, usd: 325 }, standard: { rf: 15000, usd: 975 }, premium: { rf: 50000, usd: 3245 } },
};

export const DECOR_PACKAGE_DETAILS: PackageDetail[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Essential venue styling for an elegant touch",
    priceRf: 20000,
    priceUsd: 1300,
    includes: [
      "Backdrop arch with themed florals",
      "Round table with white overlay",
      "White napoleon chair",
      "Basic floral centerpieces (15 tables)",
      "Table runners & napkins",
      "Welcome signage",
      "Basic lighting setup",
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
      "Backdrop arch with themed florals",
      "Round table with white overlay",
      "White napoleon chair",
      "Premium floral centerpieces (15 tables)",
      "Candle arrangements",
      "Table runners",
      "Custom welcome signage",
      "Enhanced ambient lighting",
      "Ceiling Decor",
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
      "Backdrop arch with themed florals",
      "Round table with white overlay",
      "White napoleon chair",
      "Luxury floral centerpieces (All tables)",
      "Designer table settings",
      "Custom-designed signage suite",
      "Professional lighting design",
      "Grand entrance installation",
      "Premium chair decor",
      "Elaborate stage design",
      "Photo corners",
      "Hanging installations",
      "Aisle decoration",
      "Ceiling Decor",
      "Custom props & accessories",
    ],
    weddings: [
      { name: "Abdulla & Shifana", date: "March 2025", guestCount: 200 },
      { name: "Yoosuf & Sana", date: "February 2025", guestCount: 180 },
      { name: "Ahmed & Fazla", date: "January 2025", guestCount: 220 },
    ],
  },
];

// Wedding AV Package Details
export const AV_PACKAGE_DETAILS_WEDDING: PackageDetail[] = [
  {
    id: "basic",
    name: "Basic AV",
    description: "Essential audio setup for intimate celebrations",
    priceRf: 5000,
    priceUsd: 325,
    includes: [
      "Sound system (BOSE S1)",
      "Background music playback",
    ],
    weddings: [
      { name: "Hassan & Mariyam", date: "March 2025", guestCount: 60 },
      { name: "Yoosuf & Aishath", date: "April 2025", guestCount: 50 },
    ],
  },
  {
    id: "standard",
    name: "Standard AV",
    description: "Enhanced audio-visual experience with lighting",
    priceRf: 10000,
    priceUsd: 650,
    includes: [
      "Sound system",
      "Background music playback",
      "2 Wireless microphones",
      "City lights around the venue",
    ],
    weddings: [
      { name: "Mohamed & Fathimath", date: "February 2025", guestCount: 100 },
      { name: "Ahmed & Aminath", date: "March 2025", guestCount: 120 },
    ],
  },
  {
    id: "premium",
    name: "Premium AV",
    description: "Complete professional sound & lighting experience",
    priceRf: 25000,
    priceUsd: 1620,
    includes: [
      "Sound system",
      "Background music playback",
      "2 Wireless microphones",
      "Full lighting setup (Moving head, LED par and city lights)",
      "Sound & lighting technician",
    ],
    weddings: [
      { name: "Ali & Hawwa", date: "January 2025", guestCount: 150 },
      { name: "Ibrahim & Mariyam", date: "February 2025", guestCount: 180 },
    ],
  },
];

// Corporate AV Package Details
export const AV_PACKAGE_DETAILS_CORPORATE: PackageDetail[] = [
  {
    id: "basic",
    name: "Basic AV",
    description: "Professional stage setup with sound system",
    priceRf: 25000,
    priceUsd: 1620,
    includes: [
      "Riser with black carpet (12x24ft)",
      "Lighting: 4 Beams, 10 Par lights, 6 City lights, 8 LED bar lights, 1 Warm blinder for front",
      "Sound: Line array 4 tops 2 subs",
    ],
    weddings: [],
  },
  {
    id: "standard",
    name: "Standard AV",
    description: "Full stage setup with LED screen",
    priceRf: 50000,
    priceUsd: 3240,
    includes: [
      "Riser with black carpet (12x24ft)",
      "Lighting: 4 Beams, 10 Par lights, 6 City lights, 8 LED bar lights, 1 Warm blinder for front",
      "Sound: Line array 4 tops 2 subs with sound controller",
      "LED Screen (12x08ft) with LED controller",
    ],
    weddings: [],
  },
  {
    id: "premium",
    name: "Premium AV",
    description: "Premium stage setup with enhanced lighting & large LED screen",
    priceRf: 80000,
    priceUsd: 5190,
    includes: [
      "Riser with black carpet (12x24ft)",
      "Lighting: 8 Beams, 20 Par lights, 10 City lights, 12 LED bar lights, 2 Warm blinders for front",
      "Sound: Line array 4 tops 2 subs with sound controller",
      "LED Screen (20x10ft) with LED controller",
    ],
    weddings: [],
  },
];

// Default AV Package Details (for backward compatibility)
export const AV_PACKAGE_DETAILS = AV_PACKAGE_DETAILS_WEDDING;

// Event-specific AV package details mapping
export const AV_DETAILS_BY_EVENT: Record<string, PackageDetail[]> = {
  wedding: AV_PACKAGE_DETAILS_WEDDING,
  corporate: AV_PACKAGE_DETAILS_CORPORATE,
  private: AV_PACKAGE_DETAILS_WEDDING,
  ramadan: AV_PACKAGE_DETAILS_WEDDING,
  other: AV_PACKAGE_DETAILS_WEDDING,
};

// Canope/Short Eats pricing
export const CATERING_CANOPE_DETAILS: PackageDetail[] = [
  {
    id: "silver",
    name: "Silver Package",
    description: "Classic canapé selection per person",
    priceRf: 190,
    priceUsd: 12,
    includes: [
      "Welcome drinks",
      "4 canapé varieties",
      "2 short eats options",
      "Mini desserts",
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
    description: "Enhanced canapé with premium options per person",
    priceRf: 220,
    priceUsd: 14,
    includes: [
      "Welcome drinks & mocktails",
      "6 canapé varieties",
      "4 short eats options",
      "Live canapé station",
      "Assorted mini desserts",
      "Fresh juices",
      "Dedicated service team",
      "Premium presentation",
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
    description: "Luxury canapé experience per person",
    priceRf: 300,
    priceUsd: 19,
    includes: [
      "Premium welcome reception",
      "8 gourmet canapé varieties",
      "6 short eats options",
      "Multiple live stations",
      "Seafood canapés",
      "International selection",
      "Gourmet mini desserts",
      "Premium beverages",
      "VIP service team",
      "Custom presentation",
    ],
    weddings: [
      { name: "Faiz & Shiuna", date: "March 2025", guestCount: 200 },
      { name: "Hameed & Rizna", date: "February 2025", guestCount: 170 },
      { name: "Tharik & Minha", date: "January 2025", guestCount: 190 },
    ],
  },
];

// Dinner pricing
export const CATERING_DINNER_DETAILS: PackageDetail[] = [
  {
    id: "silver",
    name: "Silver Package",
    description: "Classic dinner menu per person",
    priceRf: 220,
    priceUsd: 14,
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
    description: "Enhanced dinner with premium options per person",
    priceRf: 250,
    priceUsd: 16,
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
    description: "Luxury dinner experience per person",
    priceRf: 320,
    priceUsd: 21,
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

// Keep for backward compatibility - defaults to dinner
export const CATERING_PACKAGE_DETAILS = CATERING_DINNER_DETAILS;

// Helper to get package details by ID
export const getPackageDetails = (
  type: "decor" | "av" | "catering",
  id: string,
  eventType?: string
): PackageDetail | undefined => {
  switch (type) {
    case "decor":
      return DECOR_PACKAGE_DETAILS.find((p) => p.id === id);
    case "av":
      const avDetails = eventType ? (AV_DETAILS_BY_EVENT[eventType] || AV_PACKAGE_DETAILS) : AV_PACKAGE_DETAILS;
      return avDetails.find((p) => p.id === id);
    case "catering":
      return CATERING_PACKAGE_DETAILS.find((p) => p.id === id);
  }
};
