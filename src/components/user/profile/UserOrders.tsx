'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { orderApi } from '@/lib/api';
import { Order } from '@/types/order';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@/enums';
import toast from 'react-hot-toast';
import styles from '@/styles/profile/UserOrders.module.css';

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getUserOrders() as { data: Order[] };
      setOrders(response.data || []);
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
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING: return 'Chờ xác nhận';
      case OrderStatus.CONFIRMED: return 'Đã xác nhận';
      case OrderStatus.SHIPPING: return 'Đang giao hàng';
      case OrderStatus.COMPLETED: return 'Hoàn thành';
      case OrderStatus.CANCELLED: return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING: return styles.statusPending;
      case OrderStatus.CONFIRMED: return styles.statusConfirmed;
      case OrderStatus.SHIPPING: return styles.statusShipping;
      case OrderStatus.COMPLETED: return styles.statusCompleted;
      case OrderStatus.CANCELLED: return styles.statusCancelled;
      default: return '';
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

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case PaymentMethod.COD: return 'Thanh toán khi nhận hàng';
      case PaymentMethod.MOMO: return 'Ví MoMo';
      case PaymentMethod.VNPAY: return 'VNPay';
      default: return method;
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    const reason = prompt('Nhập lý do hủy đơn hàng:');
    if (!reason) return;

    try {
      await orderApi.cancel(orderId, reason);
      toast.success('Đã gửi yêu cầu hủy đơn hàng');
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Không thể hủy đơn hàng');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📦</div>
        <h3>Bạn chưa có đơn hàng nào</h3>
        <p>Hãy khám phá và đặt hàng ngay!</p>
        <Link href="/products" className={styles.shopButton}>
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.orderInfo}>
                <span className={styles.orderId}>Đơn hàng #{order.id}</span>
                <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
              </div>
              <div className={styles.orderStatuses}>
                <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
                <span className={`${styles.paymentBadge} ${
                  order.payment_status === PaymentStatus.PAID ? styles.paid : styles.unpaid
                }`}>
                  {getPaymentStatusLabel(order.payment_status as string)}
                </span>
              </div>
            </div>

            <div className={styles.orderItems}>
              {order.order_items?.slice(0, 2).map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    {item.product?.image_product ? (
                      <Image
                        src={item.product.image_product}
                        alt={item.product.name_product || 'Product'}
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className={styles.noImage}>📷</div>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>
                      {item.product?.name_product || `Sản phẩm #${item.product_id}`}
                    </span>
                    <span className={styles.itemQuantity}>x{item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              {order.order_items && order.order_items.length > 2 && (
                <p className={styles.moreItems}>
                  + {order.order_items.length - 2} sản phẩm khác
                </p>
              )}
            </div>

            <div className={styles.orderFooter}>
              <div className={styles.orderPayment}>
                <span className={styles.paymentMethod}>
                  {getPaymentMethodLabel(order.payment_method)}
                </span>
                <span className={styles.orderTotal}>
                  Tổng: <strong>{formatPrice(order.total_amount)}</strong>
                </span>
              </div>
              <div className={styles.orderActions}>
                <Link
                  href={`/profile/orders/${order.id}`}
                  className={styles.detailButton}
                >
                  Xem chi tiết
                </Link>
                {order.status === OrderStatus.PENDING && (
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Hủy đơn
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
