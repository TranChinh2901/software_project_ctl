'use client';

import Link from 'next/link';
import { MdInfo, MdInventory } from 'react-icons/md';

export default function AdminColorsPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        background: '#e3f2fd',
        padding: '1rem',
        borderRadius: '50%',
        marginBottom: '1.5rem'
      }}>
        <MdInfo style={{ fontSize: '48px', color: '#1976d2' }} />
      </div>
      
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1a1a1a', marginBottom: '1rem' }}>
        Quản lý màu sắc đã được chuyển
      </h2>
      
      <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', marginBottom: '2rem', lineHeight: 1.6 }}>
        Màu sắc giờ đây được quản lý trực tiếp trong phần <strong>Biến thể sản phẩm</strong>. 
        Bạn có thể tạo màu mới ngay khi thêm biến thể cho sản phẩm, giúp quy trình làm việc nhanh hơn và tránh trùng lặp dữ liệu.
      </p>
      
      <Link 
        href="/admin/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '12px 24px',
          background: '#ff6347',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 500,
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#ff4526'}
        onMouseOut={(e) => e.currentTarget.style.background = '#ff6347'}
      >
        <MdInventory style={{ fontSize: '20px' }} />
        Đi đến Quản lý Sản phẩm
      </Link>
    </div>
  );
}
