export interface Color {
  id: number;
  name_color: string;
  hex_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateColorDto {
  name_color: string;
  hex_code?: string;
}

export interface UpdateColorDto {
  name_color?: string;
  hex_code?: string;
}
