'use client';

import { useState, useEffect } from 'react';
import { 
  MdAttachMoney, 
  MdShoppingCart, 
  MdPeople, 
  MdInventory,
  MdTrendingUp,
  MdAssessment,
  MdRefresh
} from 'react-icons/md';
import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';
import RecentActivities from '@/components/admin/RecentActivities';
import styles from '@/styles/admin/Dashboard.module.css';
import { productApi, userApi, orderApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: number;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  user?: {
    fullname?: string;
    email?: string;
  };
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, usersResponse, ordersResponse] = await Promise.all([
        productApi.getAll(),
        userApi.getAll(),
        orderApi.getAll({ limit: 1000 })
      ]);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productsRes = (productsResponse as any)?.data;
      const productsData = productsRes?.products || productsRes || [];
      const products = Array.isArray(productsData) ? productsData : [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const usersRes = (usersResponse as any)?.data;
      const usersData = usersRes?.users || usersRes || [];
      const users = Array.isArray(usersData) ? usersData : [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ordersRes = (ordersResponse as any)?.data;
      const ordersData = ordersRes?.data || ordersRes?.orders || ordersRes || [];
      const orders: Order[] = Array.isArray(ordersData) ? ordersData : [];
      const totalRevenue = orders.reduce((sum: number, order: Order) => {
        if (order.payment_status === 'paid' || order.status === 'completed') {
          return sum + (Number(order.total_amount) || 0);
        }
        return sum;
      }, 0);
      const sortedOrders = [...orders].sort((a: Order, b: Order) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      const recent = sortedOrders.slice(0, 5);
      
      setStats({
        totalRevenue: totalRevenue,
        totalOrders: orders.length, 
        totalCustomers: users.length, 
        totalProducts: products.length,
      });
      setRecentOrders(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: 'Tổng doanh thu',
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue),
      change: '+12.5%',
      trend: 'up',
      icon: <MdAttachMoney />,
      color: '#ff6347'
    },
    {
      label: 'Đơn hàng',
      value: stats.totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: <MdShoppingCart />,
      color: '#48bb78'
    },
    {
      label: 'Người dùng',
      value: stats.totalCustomers.toString(),
      change: '+23.1%',
      trend: 'up',
      icon: <MdPeople />,
      color: '#ed8936'
    },
    {
      label: 'Sản phẩm',
      value: stats.totalProducts.toString(),
      change: '+5.4%',
      trend: 'up',
      icon: <MdInventory />,
      color: '#9f7aea'
    },
  ];

  return (
    <PageContainer
      title="Dashboard"
      description="Tổng quan về hoạt động kinh doanh"
      action={
        <>
          <Button variant="secondary" size="md" icon={<MdRefresh />} onClick={fetchDashboardData}>
            Làm mới
          </Button>
          <Button variant="primary" size="md" icon={<MdAssessment />}>
            Xuất báo cáo
          </Button>
        </>
      }
    >
      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            {statCards.map((stat, index) => (
              <Card key={index} className={styles.statCard}>
                <div className={styles.statContent}>
                  <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>{stat.label}</div>
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={`${styles.statChange} ${styles[stat.trend]}`}>
                      {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <div className={styles.chartsGrid}>
        <Card title="Doanh thu theo tháng" className={styles.chartCard}>
          <div className={styles.chartPlaceholder}>
            <MdTrendingUp className={styles.chartIcon} />
            <p>Biểu đồ doanh thu sẽ hiển thị ở đây</p>
          </div>
        </Card>

        <Card title="Đơn hàng gần đây" className={styles.chartCard}>
          <div className={styles.ordersList}>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const getStatusLabel = (status: string) => {
                  const statusMap: Record<string, string> = {
                    'pending': 'Chờ xác nhận',
                    'confirmed': 'Đã xác nhận',
                    'shipping': 'Đang giao',
                    'completed': 'Hoàn thành',
                    'cancelled': 'Đã hủy',
                  };
                  return statusMap[status] || status;
                };
                
                const getStatusClass = (status: string) => {
                  const classMap: Record<string, string> = {
                    'pending': styles.statusPending,
                    'confirmed': styles.statusConfirmed,
                    'shipping': styles.statusShipping,
                    'completed': styles.statusCompleted,
                    'cancelled': styles.statusCancelled,
                  };
                  return classMap[status] || styles.statusPending;
                };
                
                const getTimeAgo = (dateString: string) => {
                  const date = new Date(dateString);
                  const now = new Date();
                  const diffMs = now.getTime() - date.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMs / 3600000);
                  const diffDays = Math.floor(diffMs / 86400000);
                  
                  if (diffMins < 60) return `${diffMins} phút trước`;
                  if (diffHours < 24) return `${diffHours} giờ trước`;
                  return `${diffDays} ngày trước`;
                };
                
                return (
                  <div key={order.id} className={styles.orderItem}>
                    <div className={styles.orderIcon}>
                      <MdShoppingCart />
                    </div>
                    <div className={styles.orderInfo}>
                      <div className={styles.orderTitle}>Đơn hàng #{order.id}</div>
                      <div className={styles.orderDate}>{getTimeAgo(order.created_at)}</div>
                    </div>
                    <div className={styles.orderAmount}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.total_amount) || 0)}
                    </div>
                    <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <p>Chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className={styles.bottomGrid}>
        <Card title="Sản phẩm bán chạy" className={styles.productCard}>
          <div className={styles.productList}>
            {[1, 2, 3, 4].map((product) => (
              <div key={product} className={styles.productItem}>
                <div className={styles.productImage}>
                  <MdInventory />
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>Tên sản phẩm {product}</div>
                  <div className={styles.productCategory}>Danh mục A</div>
                </div>
                <div className={styles.productStats}>
                  <div className={styles.productSold}>Đã bán: 245</div>
                  <div className={styles.productRevenue}>₫12,250,000</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <RecentActivities />
      </div>
    </PageContainer>
  );
}
