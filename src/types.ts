export interface Colorway {
  name: string;
  hex: string;
  image: string;
  bgHex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'Running' | 'Training' | 'Basketball' | 'Lifestyle' | 'Trail';
  gender: 'Men' | 'Women' | 'Unisex';
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  colorways: Colorway[];
  sizes: number[];
  description: string;
  features: string[];
  specs: {
    cushioning: string;
    drop: string;
    weight: string;
    terrain: string;
  };
  isBestSeller?: boolean;
  isNew?: boolean;
  stock: number;
  reviews?: ProductReview[];
}

export interface CartItem {
  id: string; // unique combo of product_id + size + color
  productId: string;
  name: string;
  price: number;
  size: number;
  color: string;
  image: string;
  quantity: number;
  maxStock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: number;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: 'Order Placed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}

export interface FilterState {
  category: string;
  gender: string;
  selectedSize: number | null;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
  searchQuery: string;
  onSaleOnly: boolean;
}
