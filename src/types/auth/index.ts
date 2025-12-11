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
  user(accessToken: (accessToken: any, refreshToken: any, user: any) => unknown, refreshToken: (accessToken: (accessToken: any, refreshToken: any, user: any) => unknown, refreshToken: any, user: any) => unknown, user: any): unknown;
  refreshToken(accessToken: (accessToken: any, refreshToken: any, user: any) => unknown, refreshToken: any, user: any): unknown;
  accessToken(accessToken: any, refreshToken: any, user: any): unknown;
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
  gender: string | number | readonly string[] | undefined;
  date_of_birth: string | number | readonly string[] | undefined;
  username?: string;
  email?: string;
  full_name?: string;
  phone?: string;
  avatar?: string;
}
