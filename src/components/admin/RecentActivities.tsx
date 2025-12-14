'use client';

import { useEffect, useState } from 'react';
import { productApi, userApi } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './RecentActivities.module.css';

interface Product {
  id: number;
  name_product: string;
  price: number;
  stock_quantity: number;
  created_at: string;
}
interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
  created_at: string;
}
interface Activity {
  type: 'product' | 'user';
  data: Product | User;
  created_at: string;
}

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const productsRes = await productApi.getAll({
        sort: 'newest',
        limit: 5
      });
      
      const usersRes = await userApi.getAll({
        sort: 'newest',
        limit: 5
      });
      const mergedActivities: Activity[] = [];
      if (productsRes?.data?.products) {
        productsRes.data.products.forEach((product: Product) => {
          mergedActivities.push({
            type: 'product',
            data: product,
            created_at: product.created_at
          });
        });
      }
      
      if (usersRes?.data) {
        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        users.forEach((user: User) => {
          mergedActivities.push({
            type: 'user',
            data: user,
            created_at: user.created_at
          });
        });
      }
      
      const sortedActivities = mergedActivities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      
      setActivities(sortedActivities);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      toast.error('Không thể tải hoạt động gần đây');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
    
    const interval = setInterval(fetchRecentActivities, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className={styles.activitiesContainer}>
      <div className={styles.header}>
        <h3>Hoạt động gần đây</h3>
        <button onClick={fetchRecentActivities} className={styles.refreshBtn} title="Làm mới">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>
      
      {activities.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Chưa có hoạt động nào</p>
        </div>
      ) : (
        <ul className={styles.activitiesList}>
          {activities.map((activity, index) => (
            <li key={`${activity.type}-${activity.data.id}-${index}`} className={styles.activityItem}>
              <div className={styles.activityIcon}>
                {activity.type === 'product' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              
              <div className={styles.activityContent}>
                {activity.type === 'product' ? (
                  <>
                    <p className={styles.activityTitle}>
                      <span className={styles.activityType}>Sản phẩm mới:</span> {(activity.data as Product).name_product}
                    </p>
                    <p className={styles.activityDetails}>
                      Giá: {formatPrice((activity.data as Product).price)} • Tồn kho: {(activity.data as Product).stock_quantity}
                    </p>
                  </>
                ) : (
                  <>
                    <p className={styles.activityTitle}>
                      <span className={styles.activityType}>Người dùng mới:</span> {(activity.data as User).fullname}
                    </p>
                    <p className={styles.activityDetails}>
                      {(activity.data as User).email} • {(activity.data as User).role}
                    </p>
                  </>
                )}
                <p className={styles.activityTime}>{formatTime(activity.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
