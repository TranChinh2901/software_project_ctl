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