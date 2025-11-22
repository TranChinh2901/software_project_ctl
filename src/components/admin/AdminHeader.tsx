'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MdSearch, 
  MdNotifications, 
  MdMessage,
  MdKeyboardArrowDown,
  MdPerson,
  MdSettings,
  MdLogout
} from 'react-icons/md';
import styles from '@/styles/admin/AdminHeader.module.css';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { User } from '@/types/user';

export default function AdminHeader() {
  const pathname = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
   const { user, logout } = useAuth()
    const router = useRouter()

  const generateBreadcrumb = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbItems = [
      { label: 'Trang chủ', href: '/admin' }
    ];

    if (paths.length > 1) {
      const pageMap: { [key: string]: string } = {
        'products': 'Sản phẩm',
        'orders': 'Đơn hàng',
        'users': 'Người dùng',
        'categories': 'Danh mục',
        'brands': 'Thương hiệu',
        'reviews': 'Đánh giá',
        'blogs': 'Blog',
        'banners': 'Banner',
        'vouchers': 'Voucher',
        'settings': 'Cài đặt',
        'analytics': 'Phân tích',
      };

      paths.slice(1).forEach((path, index) => {
        const label = pageMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
        const href = '/' + paths.slice(0, index + 2).join('/');
        breadcrumbItems.push({ label, href });
      });
    }

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumb();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
     e.preventDefault()
      logout()
      toast.success("Đăng xuất thành công!")
      console.log("Logout success")
    router.push('/')
  }
  

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <nav className={styles.breadcrumb}>
          {breadcrumbItems.map((item, index) => (
            <div key={item.href} className={styles.breadcrumbItem}>
              {index > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
              {index === breadcrumbItems.length - 1 ? (
                <span className={styles.breadcrumbCurrent}>{item.label}</span>
              ) : (
                <Link href={item.href} className={styles.breadcrumbLink}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* <div className={styles.searchWrapper}>
          <MdSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className={styles.searchInput}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div> */}
      </div>

      <div className={styles.rightSection}>
        <button className={styles.iconButton} aria-label="Thông báo">
          <MdNotifications />
          <span className={styles.notificationBadge} />
        </button>

        <button className={styles.iconButton} aria-label="Tin nhắn">
          <MdMessage />
        </button>

        <div className={styles.divider} />

        <div className={styles.dropdown}>
          <div 
            className={styles.userMenu}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className={styles.userMenuAvatar}>
              {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'AD'}
            </div>
            <div className={styles.userMenuInfo}>
              <div className={styles.userMenuName}>
                {user?.fullname || 'Admin User'}
              </div>
              <div className={styles.userMenuRole}>Quản trị viên</div>
            </div>
            <MdKeyboardArrowDown className={styles.userMenuIcon} />
          </div>

          <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.dropdownMenuOpen : ''}`}>
            <Link href="/admin/profile" className={styles.dropdownItem}>
              <MdPerson className={styles.dropdownItemIcon} />
              <span>Tài khoản của tôi</span>
            </Link>
            <Link href="/admin/settings" className={styles.dropdownItem}>
              <MdSettings className={styles.dropdownItemIcon} />
              <span>Cài đặt</span>
            </Link>
            <div className={styles.dropdownDivider} />
            <button 
              className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
              onClick={handleLogout}
            >
              <MdLogout className={styles.dropdownItemIcon} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
