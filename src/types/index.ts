// Barber Marketplace Types

export interface User {
  id: string;
  name: string;
  phone: string;
  city: string;
  role: 'customer' | 'vendor' | 'admin';
  createdAt: Date;
}

export interface VendorBilling {
  planType: 'subscription' | 'commission';
  subscriptionTier?: 'basic' | 'premium' | 'enterprise';
  subscriptionPrice?: number;
  commissionRate?: number;
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  commissionEarned?: number;
  subscriptionStatus?: 'active' | 'expired' | 'pending';
  nextBillingDate?: Date;
  lastPaymentDate?: Date;
  outstandingAmount: number;
}

export interface ShopCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  shopCount: number;
  isActive: boolean;
  createdAt: Date;
}

export interface BarberShop {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  };
  phone: string;
  email: string;
  workingHours: WorkingHours[];
  services: Service[];
  gallery: string[];
  offers: Offer[];
  isOpen: boolean;
  isVerified: boolean;
  isPremium: boolean;
  ownerId: string;
  createdAt: Date;
  billing?: VendorBilling;
  categoryId: string; // Primary shop category
  categories: string[]; // All categories the shop serves
}

export interface WorkingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (0-100) or fixed amount in PKR
  minOrderValue?: number;
  maxDiscountAmount?: number; // cap for percentage discounts
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number; // total uses allowed
  usedCount: number;
  perUserLimit?: number; // uses per customer
  applicableServices?: string[]; // service IDs, empty = all
  shopId: string;
  shopName: string;
  isActive: boolean;
  createdAt: Date;
  // Approval workflow
  createdBy: 'vendor' | 'admin';
  approvalStatus: 'approved' | 'pending' | 'rejected';
  approvedAt?: Date;
  rejectedReason?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  validUntil: Date;
  code: string;
  categoryId?: string;
  isActive?: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  shopId: string;
  shopName: string;
  services: Service[];
  date: Date;
  timeSlot: string;
  status: 'booked' | 'completed' | 'cancelled' | 'no-show';
  totalPrice: number;
  subtotalPrice?: number;
  discountCode?: string;
  discountAmount?: number;
  notes?: string;
  createdAt: Date;
  cancelledAt?: Date;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  shopId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerImage: string;
  shopName: string;
  rating: number;
  comment: string;
  city: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface FilterOptions {
  city: string;
  minRating: number;
  maxPrice: number;
  services: string[];
  hasOffers: boolean;
  isOpen: boolean;
  categoryId?: string;
}

export type BookingStatus = 'booked' | 'completed' | 'cancelled' | 'no-show';
