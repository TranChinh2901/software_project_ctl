export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: {
      id: number;
      email: string;
      username: string;
      full_name?: string;
      role: string;
    };
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    email: string;
    username: string;
    full_name?: string;
  };
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  avatar?: string;
}
