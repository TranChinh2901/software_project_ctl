"use client";
import React, { useState } from "react";
import { login as apiLogin, saveToken, saveUser } from "../../services/auth";
import { useRouter } from "next/navigation";
import styles from '../../styles/auth/LoginForm.module.css';
import toast from "react-hot-toast";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import Link from "next/link";
import { LoginDto } from "../../types/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }
    
    setLoading(true);
    
    try {
      const loginData: LoginDto = { email: email.trim(), password };
      console.log('Login payload:', loginData);
      
      const response = await apiLogin(loginData);
      console.log('Login response:', response);
      
      if (response.accessToken && response.user) {
        saveToken(response.accessToken);
        saveUser(response.user);
        toast.success("Đăng nhập thành công!");
        
        // Redirect theo role
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
        
        if (response.user.role === 'ADMIN') {
          router.push(returnUrl || '/admin');
        } else {
          router.push(returnUrl || '/');
        }
      } else {
        toast.error("Không nhận được token từ server");
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      let message = "Đăng nhập thất bại";
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Đăng nhập" }]} />
      <form onSubmit={onSubmit} className={styles.loginForm}>
       
       <div className={styles.mainForm}>
         <h2>Đăng nhập</h2>
          <p>Nếu bạn chưa có tài khoản, đăng ký <Link style={{ color: '#ff6347' }} href="/account/register">tại đây</Link></p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
          />
     
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            required
            autoComplete="current-password"
          />
        
        <button disabled={loading} type="submit">
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
       </div>
      </form>
    </div>
  );
}
