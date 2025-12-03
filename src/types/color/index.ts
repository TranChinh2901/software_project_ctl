export interface Color {
  id: number;
  name_color: string;
  hex_code?: string;
}

export interface CreateColorDto {
  name_color: string;
  hex_code?: string;
}

export interface UpdateColorDto {
  name_color?: string;
  hex_code?: string;
}
