const API_BASE = process.env.NEXT_URL ?? "http://localhost:4000";

export async function register(data: {
  name?: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export function saveToken(token: string) {
  try {
    localStorage.setItem("nd_token", token);
  } catch {}
}

export function getToken() {
  try {
    return localStorage.getItem("nd_token");
  } catch {
    return null;
  }
}

export function logout() {
  try {
    localStorage.removeItem("nd_token");
  } catch {}
}

const auth = { register, login, saveToken, getToken, logout };
export default auth;
