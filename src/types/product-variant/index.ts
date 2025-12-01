export enum SizeType {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL'
}

export interface ProductVariant {
  id: number;
  size?: SizeType;
  price: number;
  quantity: number;
  product_id: number;
  color?: {
    id: number;
    name_color: string;
  };
}

export interface CreateProductVariantDto {
  product_id: number;
  color_id?: number;
  size?: SizeType;
  price: number;
  quantity: number;
}

export interface UpdateProductVariantDto {
  color_id?: number;
  size?: SizeType;
  price?: number;
  quantity?: number;
}
