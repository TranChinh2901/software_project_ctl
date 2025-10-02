'use client';

import { useEffect, useState } from 'react';
import styles from '../../styles/admin/AdminDashboard.module.css';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Simulate loading stats - replace with actual API calls
    const loadStats = async () => {
      // Mock data - replace with real API calls
      setTimeout(() => {
        setStats({
          totalUsers: 1250,
          totalProducts: 892,
          totalOrders: 2341,
          totalRevenue: 125800000
        });
      }, 500);
    };

    loadStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard Admin</h1>
        <p>Tổng quan hệ thống ND Style</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Tổng Users</h3>
            <p className={styles.statNumber}>{stats.totalUsers.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statContent}>
            <h3>Tổng Sản phẩm</h3>
            <p className={styles.statNumber}>{stats.totalProducts.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <h3>Tổng Đơn hàng</h3>
            <p className={styles.statNumber}>{stats.totalOrders.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <h3>Doanh thu</h3>
            <p className={styles.statNumber}>{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3>Thống kê gần đây</h3>
          <div className={styles.chartPlaceholder}>
            <p>📈 Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Đơn hàng mới nhất</h3>
          <div className={styles.recentOrders}>
            <div className={styles.orderItem}>
              <span>Đơn hàng #12345</span>
              <span>1.200.000 VND</span>
            </div>
            <div className={styles.orderItem}>
              <span>Đơn hàng #12346</span>
              <span>850.000 VND</span>
            </div>
            <div className={styles.orderItem}>
              <span>Đơn hàng #12347</span>
              <span>2.100.000 VND</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
