'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import styles from '@/styles/admin/AdminLayout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
