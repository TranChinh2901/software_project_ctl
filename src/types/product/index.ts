// ====================================
// PRODUCT TYPES
// ====================================

import { ProductStatus } from "@/enums/product.enum";
import { Brand } from "../brand";
import { Category } from "../category";


export interface Product {
  id: number;
  name_product: string;
  price: number;
  origin_price?: number;
  small_description?: string;
  meta_description?: string;
  image_product?: string;
  status: ProductStatus;
  stock_quantity?: number;
  discount?: number;
  is_on_sale: boolean;
  category?: Category;
  brand?: Brand;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}


// ====================================
// PRODUCT DTOs
// ====================================

export interface CreateProductDto {
  name_product: string;
  price: number;
  origin_price?: number;
  small_description?: string;
  meta_description?: string;
  image_product?: File | string;
  status: ProductStatus;
  stock_quantity?: number;
  discount?: number;
  category_id: number;
  brand_id?: number;
}

export interface UpdateProductDto {
  name_product?: string;
  price?: number;
  origin_price?: number;
  small_description?: string;
  meta_description?: string;
  image_product?: File | string;
  status?: ProductStatus;
  stock_quantity?: number;
  discount?: number;
  category_id?: number;
  brand_id?: number;
}

// ====================================
// PRODUCT FILTER
// ====================================

export interface ProductFilter {
  category_id?: number;
  brand_id?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: 'price' | 'name' | 'created_at';
  order?: 'asc' | 'desc';
}
