"use client";
import React, { useState } from "react";
import { login as apiLogin, saveToken } from "../../services/auth";
import { useRouter } from "next/navigation";
import styles from '../../styles/auth/LoginForm.module.css';
import toast from "react-hot-toast";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }
    setLoading(true);
    try {
      const res = await apiLogin({ email, password });
      const token =
        res?.token || res?.accessToken || res?.access_token || res?.data?.token;

      if (token) {
        saveToken(token);
        toast.success("Đăng nhập thành công! ");
        router.push("/");
      } else {
        toast.error("Không nhận được token từ server");
      }
    } catch (err: unknown) {
      let message: string | null = null;
      if (err && typeof err === "object") {
        const obj = err as Record<string, unknown>;
        if (typeof obj.message === "string") message = obj.message;
        else if (typeof obj.error === "string") message = obj.error;
        else if (Array.isArray(obj.errors)) {
          const first = obj.errors[0] as Record<string, unknown> | undefined;
          if (first && typeof first.message === "string") message = first.message;
        }
      }
      toast.error(message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Login" }]} />
      <form onSubmit={onSubmit} className={styles.loginForm}>
       
       <div className={styles.mainForm}>
         <h2>Đăng nhập</h2>
          <p>Nếu bạn chưa có tài khoản, đăng ký <Link style={{ color: '#ff6347' }} href="/account/register">tại đây</Link></p>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
     
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
          />
        
        <button disabled={loading} type="submit">
          {loading ? "Đang..." : "Đăng nhập"}
        </button>
       </div>
      </form>
    </div>
  );
}
