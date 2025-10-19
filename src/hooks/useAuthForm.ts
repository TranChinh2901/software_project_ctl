import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LoginDto, RegisterDto } from '../types/auth';
import { login as apiLogin, register as apiRegister, saveToken, saveUser } from '../services/auth';

export const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (data: LoginDto) => {
    setLoading(true);
    try {
      const response = await apiLogin(data);
      
      if (response.accessToken && response.user) {
        saveToken(response.accessToken);
        saveUser(response.user);
        toast.success("Đăng nhập thành công!");
        
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
        const redirectPath = response.user.role === 'ADMIN' ? '/admin' : '/';
        router.push(returnUrl || redirectPath);
      } else {
        throw new Error("Không nhận được token từ server");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đăng nhập thất bại";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterDto) => {
    setLoading(true);
    try {
      await apiRegister(data);
      // Register không bao giờ trả về token nữa
      // Luôn luôn chuyển về trang login
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/account/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đăng ký thất bại";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleLogin,
    handleRegister
  };
};
