export type SpaceType = 'floor1' | 'floor1_garden' | 'floor2' | 'entire_venue';

export type EventType = 'wedding' | 'corporate' | 'private' | 'ramadan' | 'other';

export type BookingStatus = 'pending' | 'approved' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'refunded';

export interface Space {
  id: SpaceType;
  name: string;
  capacity: number;
  basePrice: number;
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

export const SPACES: Space[] = [
  {
    id: 'floor1',
    name: 'Floor 1',
    capacity: 200,
    basePrice: 5000,
    description: 'Elegant main floor with marble finishes and crystal chandeliers',
  },
  {
    id: 'floor1_garden',
    name: 'Floor 1 Outdoor Garden',
    capacity: 150,
    basePrice: 3000,
    description: 'Beautiful outdoor garden space with natural ambiance',
  },
  {
    id: 'floor2',
    name: 'Floor 2',
    capacity: 180,
    basePrice: 4500,
    description: 'Upper level with panoramic views and intimate setting',
  },
  {
    id: 'entire_venue',
    name: 'Entire Venue',
    capacity: 530,
    basePrice: 12000,
    description: 'Complete venue access including all floors and garden',
  },
];

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
