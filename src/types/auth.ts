export enum GenderType {
  MALE = 'male',
  FEMALE = 'female'
}

export enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullname: string;
  email: string;
  password: string;
  phone_number?: string;
  address?: string;
  gender: GenderType;
  date_of_birth: Date;
  role?: RoleType;
}

export interface Profile {
  id: string;
  fullname: string;
  email: string;
  role: RoleType;
  phone_number?: string;
  gender?: GenderType;
}
export interface UpdateProfileDto {
  fullname?: string;
  phone_number?: string;
  address?: string;
  gender?: GenderType;
  date_of_birth?: Date;
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  role: RoleType;
  phone_number?: string;
  address?: string;
  gender: GenderType;
  date_of_birth: Date;
  avatar?: string;
  is_verified: boolean;
}

export interface AuthResponse {
  message: string;
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface ApiResponse<T = unknown> {
  message: string;
  statusCode: number;
  data: T;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
