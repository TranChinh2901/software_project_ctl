import { GenderType, RoleType } from "@/enums";


export interface User {
  id: number;
  fullname: string;
  email: string;
  phone_number: string;
  address?: string;
  avatar?: string;
  gender?: GenderType;
  date_of_birth?: string;
  is_verified: boolean;
  role: RoleType;
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  message: string;
  data: User[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: RoleType;
  is_verified?: boolean;
}

export interface CreateUserDto {
  fullname: string;
  email: string;
  phone_number: string;
  password: string;
  address?: string;
  gender?: GenderType;
  date_of_birth?: string;
  role?: RoleType;
}

export interface UpdateUserDto {
  fullname?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  avatar?: string;
  gender?: GenderType;
  date_of_birth?: string;
  role?: RoleType;
  is_verified?: boolean;
}
