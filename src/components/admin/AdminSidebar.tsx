'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Sản phẩm', icon: '📦' },
  { href: '/admin/orders', label: 'Đơn hàng', icon: '🛒' },
  { href: '/admin/users', label: 'Người dùng', icon: '👥' },
  { href: '/admin/categories', label: 'Danh mục', icon: '📁' },
  { href: '/admin/settings', label: 'Cài đặt', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 hover:bg-gray-800 ${
              pathname === item.href ? 'bg-gray-800 border-l-4 border-blue-500' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
