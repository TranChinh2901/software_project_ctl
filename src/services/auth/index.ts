import { 
  LoginDto, 
  RegisterDto, 
  ApiResponse, 
  LoginResponse, 
  RegisterResponse,
  User
} from "@/types/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4001";

async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  
  const json: ApiResponse<T> = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || "API call failed");
  }
  
  return json.data;
}


export async function register(data: RegisterDto): Promise<RegisterResponse> {
  return apiCall<RegisterResponse>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginDto): Promise<LoginResponse> {
  return apiCall<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function saveToken(token: string): void {
  localStorage.setItem("nd_token", token);
  document.cookie = `nd_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export function saveUser(user: User): void {
  localStorage.setItem("nd_user", JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem("nd_token");
}

export function getUser(): User | null {
  const userStr = localStorage.getItem("nd_user");
  return userStr ? JSON.parse(userStr) : null;
}

export function logout(): void {
  localStorage.removeItem("nd_token");
  localStorage.removeItem("nd_user");
  document.cookie = "nd_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  return apiCall<LoginResponse>("/api/v1/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getProfile(): Promise<User> {
  const token = getToken();
  if (!token) throw new Error("No authentication token found");

  return apiCall<User>("/api/v1/auth/profile", {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
}

const authService = { 
  register, 
  login, 
  saveToken, 
  saveUser, 
  getToken, 
  getUser, 
  logout, 
  refreshToken,
  getProfile
};

export default authService;
