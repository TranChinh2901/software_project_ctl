import { BlogType } from "@/enums";

export interface Author {
  id: number;
  username: string;
  full_name?: string;
}

export interface Blog {
    id: number;
    title: string;
    content: string;
    image_blogs?: string;
    author_id?: number;
    author?: Author;
    status: BlogType;
    // created_at?: Date;
    // updated_at?: Date;
}

export interface CreateBlogDto {
  title: string;
  content?: string;
  image_blogs?: string;
  status: BlogType;
  author_id?: number;
}

export interface UpdateBlogDto {
  title?: string;
  content?: string;
  image_blogs?: string;
  status?: BlogType;
  author_id?: number;
}

