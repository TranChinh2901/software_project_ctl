import { OrderStatus, PaymentMethod, PaymentStatus } from '@/enums';

import { Product } from '../product';
import { User } from '../user';

// ====================================
// ORDER TYPES
// ====================================

export interface Order {
  id: number;
  user_id: number;
  user?: User;
  order_items: OrderItem[];
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  discount?: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  shipping_address: ShippingAddress;
  notes?: string;
  cancel_reason?: string;
  created_at: string;
  updated_at: string;
}

// ====================================
// ORDER ITEM TYPES
// ====================================

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  price: number;
  total: number;
}

// ====================================
// SHIPPING ADDRESS TYPES
// ====================================

export interface ShippingAddress {
  fullname: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  country: string;
}

// ====================================
// ORDER DTOs
// ====================================

export interface CreateOrderDto {
  order_items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

// ====================================
// CART TYPES
// ====================================

export interface CartItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping_fee: number;
}
