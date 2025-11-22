'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MdDashboard, 
  MdAnalytics,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdFolder,
  MdLocalOffer,
  MdStar,
  MdArticle,
  MdImage,
  MdCardGiftcard,
  MdSettings
} from 'react-icons/md';
import styles from '@/styles/admin/AdminSidebar.module.css';
import { useAuth } from '@/contexts/AuthContext';

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const menuSections: MenuSection[] = [
  {
    title: 'Tổng quan',
    items: [
      { href: '/admin', label: 'Dashboard', icon: <MdDashboard /> },
      { href: '/admin/analytics', label: 'Phân tích', icon: <MdAnalytics /> },
    ],
  },
  {
    title: 'Quản lý',
    items: [
      { href: '/admin/products', label: 'Sản phẩm', icon: <MdInventory /> },
      { href: '/admin/orders', label: 'Đơn hàng', icon: <MdShoppingCart />, badge: 5 },
      { href: '/admin/users', label: 'Người dùng', icon: <MdPeople /> },
      { href: '/admin/categories', label: 'Danh mục', icon: <MdFolder /> },
      { href: '/admin/brands', label: 'Thương hiệu', icon: <MdLocalOffer /> },
      { href: '/admin/reviews', label: 'Đánh giá', icon: <MdStar /> },
    ],
  },
  {
    title: 'Nội dung',
    items: [
      { href: '/admin/blogs', label: 'Blog', icon: <MdArticle /> },
      { href: '/admin/banners', label: 'Banner', icon: <MdImage /> },
    ],
  },
  {
    title: 'Hệ thống',
    items: [
      { href: '/admin/vouchers', label: 'Voucher', icon: <MdCardGiftcard /> },
      { href: '/admin/settings', label: 'Cài đặt', icon: <MdSettings /> },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
    const { user } = useAuth()
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>A</div>
        <span className={styles.logoText}>Admin Panel</span>
        <button 
          className={styles.toggleButton}
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          <span className={styles.toggleIcon}>◀</span>
        </button>
      </div>

      <nav className={styles.navigation}>
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.menuSection}>
            <div className={styles.menuTitle}>{section.title}</div>
            <ul className={styles.menuList}>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href} className={styles.menuItem}>
                    <Link
                      href={item.href}
                      className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`}
                      data-tooltip={item.label}
                    >
                      <span className={styles.menuIcon}>{item.icon}</span>
                      <span className={styles.menuLabel}>{item.label}</span>
                      {item.badge && (
                        <span className={styles.menuBadge}>{item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.userSection}>
        <div className={styles.userAvatar}>AD</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}> {user?.fullname || 'Admin User'}</div>
          <div className={styles.userRole}>Quản trị viên</div>
        </div>
      </div>
    </aside>
  );
}
