'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { logout } from '../../services/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import styles from '../../styles/admin/AdminSidebar.module.css';

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toast = useToast();

  const menuItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: '📊'
    },
    {
      href: '/admin/test',
      label: 'Test Layout',
      icon: '🎯'
    },
    {
      href: '/admin/users',
      label: 'Quản lý Users',
      icon: '👥'
    },
    {
      href: '/admin/products',
      label: 'Quản lý Sản phẩm',
      icon: '📦'
    },
    {
      href: '/admin/orders',
      label: 'Quản lý Đơn hàng',
      icon: '📋'
    },
    {
      href: '/admin/categories',
      label: 'Quản lý Danh mục',
      icon: '📂'
    },
    {
      href: '/admin/blogs',
      label: 'Quản lý Blogs',
      icon: '📝'
    },
    {
      href: '/admin/vouchers',
      label: 'Quản lý Voucher',
      icon: '🎫'
    }
  ];

  const handleLogout = async () => {
    try {
      logout(); // Sử dụng AuthContext logout
      toast.success('Đăng xuất thành công!', 'LOGOUT_SUCCESS');
      router.push('/'); // Redirect về trang chủ
    } catch {
      toast.error('Có lỗi xảy ra khi đăng xuất', 'LOGOUT_ERROR');
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className={styles.mobileMenuBtn}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        ☰
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className={`${styles.adminSidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <h2>{isCollapsed ? 'A' : 'Admin Panel'}</h2>
          </div>
          <button 
            className={styles.collapseBtn}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '➡️' : '⬅️'}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  {!isCollapsed && <span className={styles.label}>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <button 
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            <span className={styles.icon}>🚪</span>
            {!isCollapsed && <span className={styles.label}>Đăng xuất</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
