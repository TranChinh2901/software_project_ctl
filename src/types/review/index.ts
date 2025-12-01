import { Product } from '../product';

export interface ReviewUser {
  id: number;
  email: string;
  username?: string;
  fullname?: string;
}

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  user?: ReviewUser;
  product?: Product;
  rating: number;
  comment: string;
  is_approved?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateReviewDto {
  product_id: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
  is_approved?: boolean;
}
