"use client";

import Image from "next/image";
import { MdClose, MdPerson, MdLocationOn, MdPhone, MdEmail, MdNotes } from "react-icons/md";
import { OrderStatus, PaymentStatus } from "@/enums";
import styles from "@/styles/admin/Orders.module.css";

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: {
    id: number;
    name_product: string;
    image_product?: string;
  };
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  note?: string;
  status: OrderStatus;
  cancel_reason?: string;
  payment_method: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  user?: {
    id: number;
    fullname?: string;
    full_name?: string;
    email: string;
  };
  shipping_address?: {
    id: number;
    address: string;
    phone: string;
  };
}

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (status: OrderStatus) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: OrderStatus) => {
    const config = {
      [OrderStatus.PENDING]: { label: "Chờ xử lý", className: styles.statusPending },
      [OrderStatus.CONFIRMED]: { label: "Đã xác nhận", className: styles.statusConfirmed },
      [OrderStatus.SHIPPING]: { label: "Đang giao", className: styles.statusShipping },
      [OrderStatus.COMPLETED]: { label: "Hoàn thành", className: styles.statusCompleted },
      [OrderStatus.CANCELLED]: { label: "Đã hủy", className: styles.statusCancelled },
    };
    return config[status] || { label: status, className: "" };
  };

  const getPaymentStatusConfig = (status: PaymentStatus) => {
    const config = {
      [PaymentStatus.UNPAID]: { label: "Chưa thanh toán", className: styles.paymentUnpaid },
      [PaymentStatus.PAID]: { label: "Đã thanh toán", className: styles.paymentPaid },
      [PaymentStatus.REFUNDED]: { label: "Đã hoàn tiền", className: styles.paymentRefunded },
    };
    return config[status] || { label: status, className: "" };
  };

  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.payment_status);

  const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    const statusFlow: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.SHIPPING, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };
    return statusFlow[currentStatus] || [];
  };

  const nextStatuses = getNextStatuses(order.status);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết đơn hàng #{order.id}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Trạng thái đơn hàng</h3>
            <div className={styles.statusRow}>
              <span className={`${styles.statusBadge} ${statusConfig.className}`}>
                {statusConfig.label}
              </span>
              <span className={`${styles.paymentBadge} ${paymentConfig.className}`}>
                {paymentConfig.label}
              </span>
              <span className={styles.paymentMethod}>{order.payment_method}</span>
            </div>
            {order.cancel_reason && (
              <div className={styles.cancelReason}>
                <strong>Lý do hủy:</strong> {order.cancel_reason}
              </div>
            )}
          </div>

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Thông tin khách hàng</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <MdPerson className={styles.infoIcon} />
                <div>
                  <label>Họ tên</label>
                  <span>{order.user?.fullname || order.user?.full_name || "N/A"}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <MdEmail className={styles.infoIcon} />
                <div>
                  <label>Email</label>
                  <span>{order.user?.email || "N/A"}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <MdPhone className={styles.infoIcon} />
                <div>
                  <label>Điện thoại</label>
                  <span>{order.shipping_address?.phone || "N/A"}</span>
                </div>
              </div>
              <div className={styles.infoItem}>
                <MdLocationOn className={styles.infoIcon} />
                <div>
                  <label>Địa chỉ</label>
                  <span>{order.shipping_address?.address || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Sản phẩm ({order.order_items?.length || 0})</h3>
            <div className={styles.orderItems}>
              {order.order_items?.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    {item.product?.image_product ? (
                      <Image
                        src={item.product.image_product}
                        alt={item.product.name_product}
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>No Image</div>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>
                      {item.product?.name_product || `Sản phẩm #${item.product_id}`}
                    </div>
                    <div className={styles.itemMeta}>
                      <span>SL: {item.quantity}</span>
                      <span>Đơn giá: {formatPrice(item.price)}</span>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.note && (
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>
                <MdNotes /> Ghi chú
              </h3>
              <p className={styles.orderNote}>{order.note}</p>
            </div>
          )}

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Tổng đơn hàng</h3>
            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span>Ngày đặt hàng:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Cập nhật lần cuối:</span>
                <span>{formatDate(order.updated_at)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Tổng tiền:</span>
                <span className={styles.totalAmount}>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {nextStatuses.length > 0 && (
          <div className={styles.modalFooter}>
            <div className={styles.updateStatusSection}>
              <span>Cập nhật trạng thái:</span>
              {nextStatuses.map((status) => (
                <button
                  key={status}
                  className={`${styles.statusBtn} ${
                    status === OrderStatus.CANCELLED
                      ? styles.cancelStatusBtn
                      : styles.nextStatusBtn
                  }`}
                  onClick={() => onUpdateStatus(status)}
                >
                  {getStatusConfig(status).label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
