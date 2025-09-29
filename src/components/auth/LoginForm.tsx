"use client";
import React, { useState } from "react";
import { login as apiLogin, saveToken } from "../../services/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) return setError("Vui lòng nhập email và mật khẩu");
    setLoading(true);
    try {
      const res = await apiLogin({ email, password });
      const token =
        res?.token || res?.accessToken || res?.access_token || res?.data?.token;
      if (token) saveToken(token);
      toast.success("Đăng nhập thành công! ");
      router.push("/");
    } catch (err: unknown) {
      let message: string | null = null;
      if (err && typeof err === "object") {
        const obj = err as Record<string, unknown>;
        if (typeof obj.message === 'string') message = obj.message;
        else if (typeof obj.error === 'string') message = obj.error;
        else if (Array.isArray(obj.errors)) {
          const first = obj.errors[0] as Record<string, unknown> | undefined;
          if (first && typeof first.message === 'string') message = first.message;
        }
      }
      toast.error(message || "Đăng nhập thất bại");
      setError(message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2>Đăng nhập</h2>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <div style={{ marginBottom: 8 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div style={{ marginBottom: 8 }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
        />
      </div>
      <button disabled={loading} type="submit">
        {loading ? "Đang..." : "Đăng nhập"}
      </button>
    </form>
  );
}
