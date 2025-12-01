'use client';

import { useState, useEffect } from 'react';
import { 
  MdShoppingCart,
  MdRefresh,
  MdVisibility,
  MdCancel,
  MdCheckCircle,
  MdLocalShipping,
  MdPending,
} from 'react-icons/md';
import { orderApi } from '@/lib/api';
import { Order } from '@/types/order';
import { OrderStatus, PaymentStatus } from '@/enums';
import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';

import styles from '@/styles/admin/Orders.module.css';
import toast from 'react-hot-toast';
import OrderDetailModal from './OrderDetailModal';
import UpdateStatusModal from './UpdateStatusModal';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterPayment !== 'all') params.payment_status = filterPayment;
      if (searchQuery) params.search = searchQuery;

      const response = await orderApi.getAll(params);
      const ordersData = Array.isArray(response.data) ? response.data : response.data?.orders || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, filterPayment]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchOrders();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setStatusModalOpen(true);
  };

  const handleCancelOrder = async (orderId: number) => {
    const reason = prompt('Nhập lý do hủy đơn hàng:');
    if (!reason) return;

    try {
      await orderApi.cancel(orderId, reason);
      toast.success('Đã hủy đơn hàng thành công');
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Không thể hủy đơn hàng');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING: return styles.statusPending;
      case OrderStatus.CONFIRMED: return styles.statusConfirmed;
      case OrderStatus.SHIPPING: return styles.statusShipping;
      case OrderStatus.COMPLETED: return styles.statusCompleted;
      case OrderStatus.CANCELLED: return styles.statusCancelled;
      default: return styles.statusPending;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING: return <MdPending />;
      case OrderStatus.CONFIRMED: return <MdCheckCircle />;
      case OrderStatus.SHIPPING: return <MdLocalShipping />;
      case OrderStatus.COMPLETED: return <MdCheckCircle />;
      case OrderStatus.CANCELLED: return <MdCancel />;
      default: return <MdPending />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING: return 'Chờ xử lý';
      case OrderStatus.CONFIRMED: return 'Đã xác nhận';
      case OrderStatus.SHIPPING: return 'Đang giao';
      case OrderStatus.COMPLETED: return 'Hoàn thành';
      case OrderStatus.CANCELLED: return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case PaymentStatus.UNPAID: return 'Chưa thanh toán';
      case PaymentStatus.PAID: return 'Đã thanh toán';
      case PaymentStatus.REFUNDED: return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
    completed: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
    cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
    revenue: orders
      .filter(o => o.status === OrderStatus.COMPLETED)
      .reduce((sum, o) => sum + o.total_amount, 0),
  };

  if (loading) {
    return (
      <PageContainer title="Quản lý đơn hàng" icon={<MdShoppingCart />}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Quản lý đơn hàng" icon={<MdShoppingCart />}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Tổng đơn hàng</p>
              <h3 className={styles.statValue}>{stats.total}</h3>
            </div>
            <div className={styles.statIcon}>
              <MdShoppingCart />
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Chờ xử lý</p>
              <h3 className={styles.statValue}>{stats.pending}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.iconPending}`}>
              <MdPending />
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Hoàn thành</p>
              <h3 className={styles.statValue}>{stats.completed}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.iconCompleted}`}>
              <MdCheckCircle />
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Doanh thu</p>
              <h3 className={styles.statValue}>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(stats.revenue)}
              </h3>
            </div>
            <div className={`${styles.statIcon} ${styles.iconRevenue}`}>
              <MdShoppingCart />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <label>Trạng thái đơn hàng:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả</option>
              <option value={OrderStatus.PENDING}>Chờ xử lý</option>
              <option value={OrderStatus.CONFIRMED}>Đã xác nhận</option>
              <option value={OrderStatus.SHIPPING}>Đang giao</option>
              <option value={OrderStatus.COMPLETED}>Hoàn thành</option>
              <option value={OrderStatus.CANCELLED}>Đã hủy</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Thanh toán:</label>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả</option>
              <option value={PaymentStatus.UNPAID}>Chưa thanh toán</option>
              <option value={PaymentStatus.PAID}>Đã thanh toán</option>
              <option value={PaymentStatus.REFUNDED}>Đã hoàn tiền</option>
            </select>
          </div>

          <div className={styles.searchGroup}>
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <Button onClick={fetchOrders} variant="outline">
            <MdRefresh /> Làm mới
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th>Phương thức</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyState}>
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.orderId}>#{order.id}</td>
                    <td>{order.user?.fullname || order.shipping_address?.fullname || 'N/A'}</td>
                    <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className={styles.amount}>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(order.total_amount)}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.paymentStatus}>
                        {getPaymentStatusLabel(order.payment_status)}
                      </span>
                    </td>
                    <td>{order.payment_method}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleViewDetail(order)}
                          className={styles.actionButton}
                          title="Xem chi tiết"
                        >
                          <MdVisibility />
                        </button>
                        {order.status !== OrderStatus.CANCELLED && 
                         order.status !== OrderStatus.COMPLETED && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order)}
                              className={`${styles.actionButton} ${styles.updateButton}`}
                              title="Cập nhật trạng thái"
                            >
                              <MdCheckCircle />
                            </button>
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className={`${styles.actionButton} ${styles.cancelButton}`}
                              title="Hủy đơn"
                            >
                              <MdCancel />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      {detailModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {statusModalOpen && selectedOrder && (
        <UpdateStatusModal
          order={selectedOrder}
          onClose={() => {
            setStatusModalOpen(false);
            setSelectedOrder(null);
          }}
          onSuccess={() => {
            fetchOrders();
            setStatusModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </PageContainer>
  );
}
