"use client";
import React, { useState } from "react";
import styles from '../../styles/auth/register/register.module.css';
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RegisterDto } from "@/types/auth";
import { GenderType } from "@/enums";
import { authApi } from "@/lib/api";
import Breadcrumb from "../breadcrumb/breadcrumb";

export default function RegisterForm() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [phone_number, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<GenderType | "">(""); 
  const [date_of_birth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullname.trim() || !email.trim() || !password.trim() || !date_of_birth || !gender) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    
    setLoading(true);
    try {
      const registerData: RegisterDto = {
        fullname: fullname.trim(),
        email: email.trim(),
        password,
        phone_number: phone_number.trim() || undefined,
        gender: gender as GenderType,
        date_of_birth,
        address: address.trim() || undefined,
      };
      
      await authApi.register(registerData);
      
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push('/account/login');
    } catch (error: unknown) {
      console.error('Register error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || "Đăng ký thất bại");
      } else {
        toast.error("Đăng ký thất bại");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.registerContainer}>
          <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Đăng ký" }]} />
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <div className={styles.mainForm}>
          <h2>Đăng ký</h2>
          <p>Đã có tài khoản, đăng nhập <Link style={{ color: '#ff6347' }} href="/account/login">tại đây</Link></p>
      
          <div>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Họ tên *"
              required
              autoComplete="name"
            />
          </div>
          
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email *"
              required
              autoComplete="email"
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu *"
              required
              autoComplete="new-password"
            />  
          </div>
          
          <div>
            <input
              type="tel"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Số điện thoại"
              autoComplete="tel"
            />
          </div>
          
          <div className={styles.genderSelectContainer}>
            <select 
              className={styles.genderSelect}
              value={gender}
              onChange={(e) => setGender(e.target.value as GenderType)}
              required
            >
              <option value="" disabled>Chọn giới tính *</option>
              <option value={GenderType.MALE}>Nam</option>
              <option value={GenderType.FEMALE}>Nữ</option>
            </select>
          </div>
          
          <div>
            <input
              type="date"
              value={date_of_birth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              placeholder="Ngày sinh *"
              required
            />
          </div>
          
          <div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ"
              autoComplete="address-line1"
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </div>
      </form>
    </div>
  );
}