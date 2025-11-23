// ====================================
// PRODUCT TYPES
// ====================================

import { ProductStatus } from "@/enums/product.enum";


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
// CATEGORY TYPES
// ====================================

export interface Category {
  id: number;
  name_category: string;
  image_category?: string;
  description_category?: string;
  brand?: Brand;
  updated_at: string;
}

// ====================================
// BRAND TYPES
// ====================================

export interface Brand {
  id: number;
  name_brand: string;
  logo_url?: string;
  description_brand?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBrandDto {
  name_brand: string;
  logo?: File;
  description_brand?: string;
}

export interface UpdateBrandDto {
  name_brand?: string;
  logo?: File;
  description_brand?: string;
}

// ====================================
// CATEGORY DTOs
// ====================================

export interface CreateCategoryDto {
  name_category: string;
  image_category?: File;
  description_category?: string;
  brand_id?: number;
}

export interface UpdateCategoryDto {
  name_category?: string;
  image_category?: File;
  description_category?: string;
  brand_id?: number;
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
