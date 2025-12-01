'use client';

import { Order } from '@/types/order';
import { OrderStatus, PaymentStatus } from '@/enums';
import { MdClose, MdCheckCircle, MdCancel, MdLocalShipping } from 'react-icons/md';
import styles from '@/styles/admin/Orders.module.css';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết đơn hàng #{order.id}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <MdClose />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Order Info */}
          <div className={styles.section}>
            <h3>Thông tin đơn hàng</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Mã đơn hàng:</span>
                <span className={styles.value}>#{order.id}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Ngày đặt:</span>
                <span className={styles.value}>
                  {new Date(order.created_at).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Trạng thái:</span>
                <span className={styles.value}>{getStatusLabel(order.status)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Thanh toán:</span>
                <span className={styles.value}>
                  {getPaymentStatusLabel((order as any).payment_status || 'unpaid')}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Phương thức:</span>
                <span className={styles.value}>{order.payment_method}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className={styles.section}>
            <h3>Thông tin khách hàng</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Họ tên:</span>
                <span className={styles.value}>
                  {order.shipping_address?.fullname || order.user?.fullname || 'N/A'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Số điện thoại:</span>
                <span className={styles.value}>
                  {order.shipping_address?.phone || 'N/A'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{order.user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className={styles.section}>
              <h3>Địa chỉ giao hàng</h3>
              <p className={styles.address}>
                {order.shipping_address.address}, {order.shipping_address.ward},{' '}
                {order.shipping_address.district}, {order.shipping_address.city}
              </p>
            </div>
          )}

          {/* Order Items */}
          <div className={styles.section}>
            <h3>Sản phẩm</h3>
            <div className={styles.orderItems}>
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>
                        {item.product?.name_product || `Product #${item.product_id}`}
                      </span>
                      <span className={styles.itemQuantity}>x{item.quantity}</span>
                    </div>
                    <div className={styles.itemPrice}>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.price * item.quantity)}
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có sản phẩm</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.section}>
            <h3>Tổng kết</h3>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Tạm tính:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(order.subtotal || order.total_amount)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Phí vận chuyển:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(order.shipping_fee || 0)}
                </span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className={styles.summaryRow}>
                  <span>Giảm giá:</span>
                  <span className={styles.discount}>
                    -{new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(order.discount)}
                  </span>
                </div>
              )}
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Tổng cộng:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(order.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className={styles.section}>
              <h3>Ghi chú</h3>
              <p className={styles.notes}>{order.notes}</p>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.closeBtn}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
