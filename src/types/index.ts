export type Category = 
  | 'Bandhgalas'
  | 'Sherwanis'
  | 'Kurta Sets'
  | 'Nehru Jackets'
  | 'Indo-Western'
  | 'Shirts' 
  | 'T-Shirts' 
  | 'Jeans' 
  | 'Trousers' 
  | 'Jackets' 
  | 'Accessories'
  | 'Footwear';

export type FitType = 'Slim Fit' | 'Regular Fit' | 'Oversized';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ProductVariant {
  id: string;
  size: ProductSize;
  colorName: string;
  colorHex: string;
  stock: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: Category;
  collection: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimited?: boolean;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: ProductSize[];
  variants: ProductVariant[];
  fit: FitType;
  material: string;
  fabricDetails: string[];
  careInstructions: string[];
  description: string;
  stock: number;
  reviews: Review[];
}

export interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  image: string;
  productCount: number;
  tagline: string;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: ProductSize;
  color: string;
  quantity: number;
  category: Category;
}

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  houseFlat: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  addressType: 'Home' | 'Work' | 'Other';
  isDefault?: boolean;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Payment Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface TrackingStep {
  status: OrderStatus;
  date: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  address: Address;
  deliveryMethod: 'Standard' | 'Express';
  estimatedDelivery: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  status: OrderStatus;
  trackingNumber: string;
  courier: string;
  trackingTimeline: TrackingStep[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: 'customer' | 'admin';
  savedAddresses: Address[];
  sizePreferences?: {
    height?: number;
    weight?: number;
    chest?: number;
    waist?: number;
    preferredFit?: FitType;
    recommendedSize?: ProductSize;
  };
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent?: number;
  flatDiscount?: number;
  minOrderValue: number;
  validUntil: string;
}
