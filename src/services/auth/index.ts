import { 
  LoginDto, 
  RegisterDto, 
  ApiResponse, 
  LoginResponse, 
  RegisterResponse 
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
  } catch (error) {
    console.error("Failed to save token:", error);
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

export function logout(): void {
  try {
    localStorage.removeItem("nd_token");
  } catch (error) {
    console.error("Failed to remove token:", error);
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

const auth = { register, login, saveToken, getToken, logout, refreshToken };
export default auth;
