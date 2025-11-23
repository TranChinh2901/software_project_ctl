import { Brand } from "../brand";

export interface Category {
  id: number;
  name_category: string;
  image_category?: string;
  description_category?: string;
  brand?: Brand;
  updated_at: string;
}

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
