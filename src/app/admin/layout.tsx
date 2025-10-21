import React from 'react'

export const metadata = {
  title: 'Admin - ND Style'
}

import { ReactNode } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminHeader from '../../components/layout/AdminHeader';
import AdminProtectedRoute from '../../components/auth/AdminProtectedRoute';
import styles from '../../styles/admin/AdminLayout.module.css';
import '../../styles/admin/admin-reset.css';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Admin Panel - ND Style</title>
        <meta name="description" content="Trang quản trị hệ thống ND Style" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body 
        className="admin-reset" 
        style={{ 
          margin: 0, 
          padding: 0, 
          fontFamily: 'system-ui, sans-serif',
          height: '100vh',
          backgroundColor: '#f7fafc'
        }}
      >
        <AdminProtectedRoute>
          <div className={styles.adminLayout}>
            <AdminSidebar />
            <div className={styles.adminContent}>
              <AdminHeader />
              <main className={styles.adminMain}>
                {children}
              </main>
            </div>
          </div>
        </AdminProtectedRoute>
      </body>
    </html>
  );
}