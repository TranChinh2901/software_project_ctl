'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../../services/auth';
import { RoleType } from '../../types/auth';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

interface DecodedToken {
  id: string;
  email: string;
  role: RoleType;
  exp: number;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const token = getToken();
        
        if (!token) {
          router.replace('/?message=Vui lòng đăng nhập để truy cập trang quản trị');
          return;
        }
        const tokenPayload = JSON.parse(atob(token.split('.')[1])) as DecodedToken;
        
        if (tokenPayload.exp * 1000 < Date.now()) {
          localStorage.removeItem('nd_token');
          document.cookie = 'nd_token=; Max-Age=0; path=/';
          router.replace('/?message=Phiên đăng nhập đã hết hạn');
          return;
        }
        if (tokenPayload.role !== RoleType.ADMIN) {
          router.replace('/?message=Bạn không có quyền truy cập trang quản trị');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking authorization:', error);
        router.replace('/?message=Có lỗi xảy ra khi xác thực');
      }
    };

    checkAuthorization();
  }, [router]);
  if (isAuthorized === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f7fafc',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3182ce',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#4a5568', fontSize: '16px' }}>
            Đang kiểm tra quyền truy cập...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  return <>{children}</>;
};

export default AdminProtectedRoute;
