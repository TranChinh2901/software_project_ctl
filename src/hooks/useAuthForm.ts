import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginDto, RegisterDto } from '@/types/auth';
import { login as apiLogin, register as apiRegister } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';

export const useAuthForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  const handleLogin = async (data: LoginDto) => {
    setLoading(true);
    try {
      const response = await apiLogin(data);
      
      if (!response.accessToken || !response.user) {
        throw new Error("Không nhận được token từ server");
      }

      login(response.user, response.accessToken);
      toast.success("Đăng nhập thành công!", "LOGIN_SUCCESS");
      
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      const redirectPath = response.user.role === 'ADMIN' ? '/admin' : '/';
      router.push(returnUrl || redirectPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đăng nhập thất bại";
      toast.error(message, "LOGIN_ERROR");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterDto) => {
    setLoading(true);
    try {
      await apiRegister(data);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.", "REGISTER_SUCCESS");
      router.push("/account/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Đăng ký thất bại";
      toast.error(message, "REGISTER_ERROR");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleLogin, handleRegister };
};
