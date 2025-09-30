"use client";
import React, { useState } from "react";
import { register as apiRegister, saveToken } from "../../services/auth";
import { useRouter } from "next/navigation";
import styles from '../../styles/auth/RegisterForm.module.css';
import { toast } from "react-hot-toast";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import Link from "next/link";

export default function RegisterForm() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [date_of_birth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        fullname,
        email,
        password,
        phone_number,
        gender,
        date_of_birth,
        address,
      };
      const res = await apiRegister(payload);
      if (res?.token) saveToken(res.token);
      toast.success("Đăng ký thành công! ");
      router.push("/account/login");
    } catch (err: unknown) {
      let message: string | null = null;
      if (err && typeof err === "object") {
        const obj = err as Record<string, unknown>;
        if (typeof obj.message === "string") message = obj.message;
        else if (typeof obj.error === "string") message = obj.error;
        else if (Array.isArray(obj.errors)) {
          const first = obj.errors[0] as Record<string, unknown> | undefined;
          if (first && typeof first.message === "string")
            message = first.message;
        }
      }
        toast.error(message || "Đăng ký thất bại");
      setError(message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.registerContainer}>
      <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Register" }]} />
      <form onSubmit={onSubmit} className={styles.registerForm}>
     <div className={styles.mainForm}>
       <h2>Đăng ký</h2>
       <p>Đã có tài khoản, đăng nhập <Link style={{ color: '#ff6347' }} href="/account/login">tại đây</Link></p>
      <div>
        <input
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Họ tên"
        />
      </div>
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
        />
      </div>
      <div>
        <input
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Số điện thoại"
        />
      </div>
      <div>
        <input
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          placeholder="Giới tính"
        />
      </div>
      <div>
        <input
          value={date_of_birth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          placeholder="Ngày sinh"
        />
      </div>
      <div>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Địa chỉ"
        />
      </div>
       <button disabled={loading} type="submit" className={styles.buttonRegister}>
        {loading ? "Đang..." : "Đăng ký"}
      </button>
     </div>
     
    </form>
    </div>
  );
}
