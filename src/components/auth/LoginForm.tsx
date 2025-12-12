"use client";
import React, { useState } from "react";
import styles from '../../styles/auth/login/login.module.css';
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
// import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RoleType } from "@/enums";
import { authApi } from "@/lib/api";
import Breadcrumb from "../breadcrumb/breadcrumb";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      login(response.accessToken, response.refreshToken, response.user);
      toast.success("Đăng nhập thành công!");
      if (response.user.role === RoleType.ADMIN) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        toast.error( "Đăng nhập thất bại");
      } else {
        toast.error("Đăng nhập thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
          <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Đăng nhập" }]} />
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.mainForm}>
          <h2>Đăng nhập</h2>
          <p>Nếu bạn chưa có tài khoản, đăng ký <Link style={{ color: '#ff6347' }} href="/account/register">tại đây</Link></p>
          
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              autoComplete="current-password"
              required
            />
          </div>
        
          <button type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </div>
      </form>
    </div>
  );
}