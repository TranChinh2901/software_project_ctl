import { 
  LoginDto, 
  RegisterDto, 
  ApiResponse, 
  LoginResponse, 
  RegisterResponse,
  User
} from "../../types/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4001";


export async function register(data: RegisterDto): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  const json: ApiResponse<RegisterResponse> = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || "Registration failed");
  }
  
  return json.data;
}

export async function login(data: LoginDto): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  const json: ApiResponse<LoginResponse> = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || "Login failed");
  }
  
  return json.data;
}

export function saveToken(token: string): void {
  try {
    localStorage.setItem("nd_token", token);
    document.cookie = `nd_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  } catch (error) {
    console.error("Failed to save token:", error);
  }
}

export function saveUser(user: User): void {
  try {
    localStorage.setItem("nd_user", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save user:", error);
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem("nd_token");
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
}

export function getUser(): User | null {
  try {
    const userStr = localStorage.getItem("nd_user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}

export function logout(): void {
  try {
    localStorage.removeItem("nd_token");
    localStorage.removeItem("nd_user");
    document.cookie = "nd_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } catch (error) {
    console.error("Failed to remove auth data:", error);
  }
}

export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  
  const json: ApiResponse<LoginResponse> = await res.json();
  
  if (!res.ok) {
    throw new Error(json.message || "Token refresh failed");
  }
  
  return json.data;
}

export async function getProfile(): Promise<User> {
  const token = getToken();
  console.log("Token from localStorage:", token);
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${API_BASE}/api/v1/auth/profile`, {
    method: "GET",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json" 
    },
  });
  
  console.log("Profile API response status:", res.status);
  
  const json: ApiResponse<User> = await res.json();
  console.log("Profile API response:", json);
  
  if (!res.ok) {
    throw new Error(json.message || "Failed to get profile");
  }
  
  return json.data;
}

const auth = { 
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
export default auth;
