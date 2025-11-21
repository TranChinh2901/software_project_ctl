'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAuth } from '@/contexts/AuthContext';
import { RoleType } from '@/enums';
import styles from '@/styles/admin/AdminLayout.module.css';
import toast from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để truy cập trang quản trị!');
      router.push('/login');
      return;
    }
    if (user?.role !== RoleType.ADMIN) {
      toast.error('Bạn không có quyền truy cập trang này!');
      router.push('/');
      return;
    }
  }, [user, isAuthenticated, isLoading, router]);
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Đang tải...
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== RoleType.ADMIN) {
    return null;
  }

  return (
    <div className={styles.layoutContainer}>
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className={styles.mainWrapper}>
        <AdminHeader />
        <main className={styles.mainContent}>
          <div className={styles.contentInner}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
