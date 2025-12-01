export interface ProductGallery {
  id: number;
  image_url: string;
  product_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductGalleryGrouped {
  id: number;
  product_id: number;
  image_url: string[];
  product?: {
    id: number;
    name_product: string;
  };
}

export interface CreateProductGalleryDto {
  product_id: number;
  image_url: File[];
}
