"use client";
import React, { useState } from "react";
import styles from '../../styles/auth/RegisterForm.module.css';
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import Link from "next/link";
import { RegisterDto, GenderType } from "../../types/auth";
import { useAuthForm } from "../../hooks/useAuthForm";
import { useToast } from "../../hooks/useToast";

export default function RegisterForm() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [phone_number, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<string>(""); 
  const [date_of_birth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const { handleRegister, loading } = useAuthForm();
  const toast = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!fullname.trim() || !email.trim() || !password.trim() || !date_of_birth || !gender) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc", "REGISTER_ERROR");
      return;
    }
    
    try {
      const registerData: RegisterDto = {
        fullname: fullname.trim(),
        email: email.trim(),
        password,
        phone_number: phone_number.trim() || undefined,
        gender: gender as GenderType, 
        date_of_birth: new Date(date_of_birth),
        address: address.trim() || undefined,
      };
      
      await handleRegister(registerData);
    } catch {
    }
  }
  
  return (
    <div className={styles.registerContainer}>
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Đăng ký" }]} />
      <form onSubmit={onSubmit} className={styles.registerForm}>
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
          onChange={(e) => setGender(e.target.value)}
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
      
       <button disabled={loading} type="submit" className={styles.buttonRegister}>
        {loading ? "Đang xử lý..." : "Đăng ký"}
      </button>
     </div>
     
    </form>
    </div>
  );
}
