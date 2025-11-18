// ====================================
// PRODUCT TYPES
// ====================================

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  discount?: number;
  stock: number;
  images: string[];
  category_id: number;
  category?: Category;
  brand_id?: number;
  brand?: Brand;
  specifications?: Record<string, unknown>;
  rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

// ====================================
// CATEGORY TYPES
// ====================================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
}

// ====================================
// BRAND TYPES
// ====================================

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// ====================================
// PRODUCT DTOs
// ====================================

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  stock: number;
  category_id: number;
  brand_id?: number;
  images: string[];
  specifications?: Record<string, unknown>;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  original_price?: number;
  stock?: number;
  category_id?: number;
  brand_id?: number;
  images?: string[];
  specifications?: Record<string, unknown>;
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
