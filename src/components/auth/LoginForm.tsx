"use client";
import React from "react";
import styles from '../../styles/auth/LoginForm.module.css';
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import Link from "next/link";
import { useAuthForm } from "../../hooks/useAuthForm";
import { useFormValidation } from "../../hooks/useFormValidation";
import { loginValidationRules } from "../../utils/validation";

export default function LoginForm() {
  const { loading, handleLogin } = useAuthForm();
  
  const {
    values,
    errors,
    setValue,
    setTouched,
    validateAll
  } = useFormValidation(
    { email: "", password: "" },
    loginValidationRules
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    await handleLogin(values);
  };

  return (
    <div className={styles.loginContainer}>
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Đăng nhập" }]} />
      <form onSubmit={onSubmit} className={styles.loginForm}>
        <div className={styles.mainForm}>
          <h2>Đăng nhập</h2>
          <p>Nếu bạn chưa có tài khoản, đăng ký <Link style={{ color: '#ff6347' }} href="/account/register">tại đây</Link></p>
          
          <div>
            <input
              type="email"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              onBlur={() => setTouched('email')}
              placeholder="Email"
              autoComplete="email"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          
          <div>
            <input
              type="password"
              value={values.password}
              onChange={(e) => setValue('password', e.target.value)}
              onBlur={() => setTouched('password')}
              placeholder="Mật khẩu"
              autoComplete="current-password"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>
        
          <button disabled={loading} type="submit">
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </div>
      </form>
    </div>
  );
}
