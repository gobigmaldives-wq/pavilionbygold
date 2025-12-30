export type SpaceType = 'floor1' | 'floor1_garden' | 'floor2' | 'entire_venue';

export type EventType = 'wedding' | 'corporate' | 'private' | 'ramadan' | 'other';

export type BookingStatus = 'pending' | 'approved' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'refunded';

export interface Space {
  id: SpaceType;
  name: string;
  capacity: number;
  basePriceMVR: number;
  basePriceUSD: number;
  description: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface BookingRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  companyName?: string;
  eventType: EventType;
  eventDate: string;
  space: SpaceType;
  guestCount: number;
  notes?: string;
  agreedToRules: boolean;
  agreedAt: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  space: SpaceType;
  guestCount: number;
  eventType: EventType;
  baseAmount: number;
  addOns: { name: string; amount: number }[];
  discount: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  depositAmount: number;
  depositDueDate: string;
  balanceAmount: number;
  balanceDueDate: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  createdAt: string;
}

// Pre-opening rates (valid until March 31, 2026)
export const SPACES: Space[] = [
  {
    id: 'floor1',
    name: 'Floor 1',
    capacity: 140,
    basePriceMVR: 14000,
    basePriceUSD: 900,
    description: 'Elegant main floor with marble finishes and crystal chandeliers',
  },
  {
    id: 'floor1_garden',
    name: 'Floor 1 Outdoor Garden',
    capacity: 60,
    basePriceMVR: 10000,
    basePriceUSD: 650,
    description: 'Beautiful outdoor garden space with natural ambiance',
  },
  {
    id: 'floor2',
    name: 'Floor 2',
    capacity: 160,
    basePriceMVR: 14000,
    basePriceUSD: 900,
    description: 'Upper level with panoramic views and intimate setting',
  },
  {
    id: 'entire_venue',
    name: 'Entire Venue',
    capacity: 360,
    basePriceMVR: 37000,
    basePriceUSD: 2400,
    description: 'Complete venue access including all floors and garden',
  },
];

// Regular rates (after March 31, 2026)
export const SPACES_REGULAR: Space[] = [
  {
    id: 'floor1',
    name: 'Floor 1',
    capacity: 140,
    basePriceMVR: 20000,
    basePriceUSD: 1300,
    description: 'Elegant main floor with marble finishes and crystal chandeliers',
  },
  {
    id: 'floor1_garden',
    name: 'Floor 1 Outdoor Garden',
    capacity: 60,
    basePriceMVR: 12000,
    basePriceUSD: 780,
    description: 'Beautiful outdoor garden space with natural ambiance',
  },
  {
    id: 'floor2',
    name: 'Floor 2',
    capacity: 160,
    basePriceMVR: 25000,
    basePriceUSD: 1620,
    description: 'Upper level with panoramic views and intimate setting',
  },
  {
    id: 'entire_venue',
    name: 'Entire Venue',
    capacity: 360,
    basePriceMVR: 55000,
    basePriceUSD: 3570,
    description: 'Complete venue access including all floors and garden',
  },
];

// Cutoff date for pre-opening rates
export const PRE_OPENING_CUTOFF = new Date('2026-04-01');

// Floor 2 availability date (February 1st, 2025)
export const FLOOR2_AVAILABLE_DATE = new Date('2026-02-01');

// Get the correct space pricing based on event date, filtering out unavailable spaces
export const getSpacesForDate = (eventDate?: Date): Space[] => {
  const baseSpaces = !eventDate || eventDate < PRE_OPENING_CUTOFF ? SPACES : SPACES_REGULAR;
  
  // If no event date or event date is before Floor 2 availability, filter out Floor 2
  if (!eventDate || eventDate < FLOOR2_AVAILABLE_DATE) {
    return baseSpaces.filter(space => space.id !== 'floor2');
  }
  
  return baseSpaces;
};

// Get a specific space with correct pricing for a date
export const getSpaceByIdForDate = (id: SpaceType, eventDate?: Date): Space | undefined => {
  const spaces = getSpacesForDate(eventDate);
  return spaces.find(space => space.id === id);
};

export const ADD_ONS: AddOn[] = [
  { id: 'av', name: 'AV Equipment', price: 800 },
  { id: 'catering', name: 'Catering Setup', price: 1200 },
  { id: 'decor', name: 'Premium Decor', price: 1500 },
  { id: 'security', name: 'Security Services', price: 600 },
  { id: 'cleaning', name: 'Extra Cleaning', price: 400 },
  { id: 'garden_setup', name: 'Garden Setup', price: 500 },
  { id: 'stage', name: 'Stage & Lighting', price: 1000 },
];

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'private', label: 'Private Party' },
  { value: 'ramadan', label: 'Ramadan Event' },
  { value: 'other', label: 'Other' },
];

export const getSpaceById = (id: SpaceType): Space | undefined => {
  return SPACES.find(space => space.id === id);
};
