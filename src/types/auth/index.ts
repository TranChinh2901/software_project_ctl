import { GenderType, RoleType } from '@/enums';

// ====================================
// USER TYPES (Response từ API)
// ====================================
export interface User {
  id: number;
  fullname: string;
  email: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  gender?: GenderType;
  date_of_birth?: string;
  is_verified: boolean;
  role: RoleType;
  created_at?: string;
  updated_at?: string;
}

// ====================================
// AUTH DTOs (Data gửi lên API)
// ====================================

// DTO cho Login - chỉ cần email + password
export interface LoginDto {
  email: string;
  password: string;
}

// DTO cho Register - đầy đủ thông tin
export interface RegisterDto {
  fullname: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  gender: GenderType;
  date_of_birth: string; // Format: YYYY-MM-DD
}

// DTO cho Update Profile
export interface UpdateProfileDto {
  fullname?: string;
  phone_number?: string;
  address?: string;
  gender?: GenderType;
  date_of_birth?: string;
  avatar?: string;
}

// ====================================
// AUTH RESPONSES (Data nhận từ API)
// ====================================

// Response khi login thành công
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Response khi register thành công
export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    fullname: string;
    email: string;
    role: string;
  };
}

// Response khi refresh token
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
