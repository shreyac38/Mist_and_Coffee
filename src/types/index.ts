export type DietaryType = 'veg' | 'vegan' | 'gluten-free';

export interface ProductCustomizationOptions {
  milks: string[];
  sweetnessLevels: string[];
  temperatures: ('Hot' | 'Iced')[];
  iceLevels?: string[];
  extraShotAvailable?: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number; // in INR ₹
  image: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isBestSeller: boolean;
  isSignature: boolean;
  isAvailable: boolean;
  rating: number;
  reviewsCount: number;
  origin?: string;
  roastLevel?: string;
  tastingNotes?: string[];
  options: ProductCustomizationOptions;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  displayOrder: number;
}

export interface CartItem {
  id: string; // unique item instance id
  product: Product;
  quantity: number;
  selectedMilk?: string;
  selectedSweetness?: string;
  selectedTemperature?: 'Hot' | 'Iced';
  selectedIce?: string;
  extraShots: number;
  specialNote?: string;
  itemPrice: number; // base + milk surcharge + extra shots
  lineTotal: number;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'pickup' | 'delivery' | 'dine-in';
export type PaymentMethod = 'cod' | 'counter_upi';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: OrderType;
  deliveryAddress?: string;
  preferredTime?: string;
  specialInstructions?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  estimatedMinutes: number;
  createdAt: string;
  updatedAt?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  guests: number;
  seatingPreference: string;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
}

export type LoyaltyTier = 'Little Sipper' | 'Coffee Lover' | 'Mist Insider';

export interface LoyaltyTransaction {
  id: string;
  date: string;
  type: 'earned' | 'redeemed' | 'bonus';
  points: number;
  description: string;
  orderId?: string;
}

export interface LoyaltyAccount {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  currentPoints: number;
  lifetimePoints: number;
  tier: LoyaltyTier;
  createdAt: string;
  transactions: LoyaltyTransaction[];
}

export interface RewardVoucher {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  discountValue: number;
  discountType: 'flat' | 'percentage' | 'free_item';
  icon: string;
  isAvailable: boolean;
  minBillINR: number;
}

export interface BusinessSettings {
  cafeName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  instagram: string;
  deliveryFeeStandard: number;
  freeDeliveryThreshold: number;
  taxPercentage: number;
  isAcceptingOrders: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
}
