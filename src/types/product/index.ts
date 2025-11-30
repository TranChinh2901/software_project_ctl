// ====================================
// PRODUCT TYPES
// ====================================

import { ProductStatus } from "@/enums/product/product.enum";
import { Brand } from "../brand";


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
  category?: {
    id: number;
    name_category: string;
    brand?: Brand; // Brand is accessed through category
  };
  // brand removed from root - access via category.brand
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
  // brand_id removed - brand comes from category
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
  // brand_id removed - brand comes from category
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
