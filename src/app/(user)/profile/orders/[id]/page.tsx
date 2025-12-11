"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { orderApi } from "@/lib/api";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/enums";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import toast from "react-hot-toast";
import styles from "@/styles/profile/OrderDetail.module.css";

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
  payment_method: PaymentMethod;
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
    fullname?: string;
  };
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      const response = await orderApi.getById(parseInt(orderId));
      console.log("Order Detail Response:", response);
      
      const orderData = response?.data || response;
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem đơn hàng");
      router.push(`/account/login?redirect=/profile/orders/${orderId}`);
      return;
    }

    if (isAuthenticated && orderId) {
      fetchOrder();
    }
  }, [authLoading, isAuthenticated, router, orderId, fetchOrder]);

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
      [OrderStatus.PENDING]: { label: "Chờ xử lý", className: styles.statusPending, step: 1 },
      [OrderStatus.CONFIRMED]: { label: "Đã xác nhận", className: styles.statusConfirmed, step: 2 },
      [OrderStatus.SHIPPING]: { label: "Đang giao", className: styles.statusShipping, step: 3 },
      [OrderStatus.COMPLETED]: { label: "Hoàn thành", className: styles.statusCompleted, step: 4 },
      [OrderStatus.CANCELLED]: { label: "Đã hủy", className: styles.statusCancelled, step: 0 },
    };
    return config[status] || { label: status, className: "", step: 0 };
  };

  const getPaymentStatusConfig = (status: PaymentStatus) => {
    const config = {
      [PaymentStatus.UNPAID]: { label: "Chưa thanh toán", className: styles.paymentUnpaid },
      [PaymentStatus.PAID]: { label: "Đã thanh toán", className: styles.paymentPaid },
      [PaymentStatus.REFUNDED]: { label: "Đã hoàn tiền", className: styles.paymentRefunded },
    };
    return config[status] || { label: status, className: "" };
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    const reason = prompt("Vui lòng nhập lý do hủy đơn hàng:");
    if (!reason) return;

    try {
      await orderApi.cancel(order.id, reason);
      toast.success("Hủy đơn hàng thành công");
      fetchOrder();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Không thể hủy đơn hàng");
    }
  };

  if (authLoading || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Không tìm thấy đơn hàng</h2>
          <p>Đơn hàng này không tồn tại hoặc bạn không có quyền xem.</p>
          <Link href="/profile/orders" className={styles.backBtn}>
            Quay lại đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.payment_status);
  const canCancel = order.status === OrderStatus.PENDING;
  const isCancelled = order.status === OrderStatus.CANCELLED;

  const orderSteps = [
    { label: "Đặt hàng", step: 1 },
    { label: "Xác nhận", step: 2 },
    { label: "Đang giao", step: 3 },
    { label: "Hoàn thành", step: 4 },
  ];

  return (
    <div className={styles.container}>
      <Breadcrumb items={[
        { label: "Trang chủ", href: "/" },
        { label: "Đơn hàng của tôi", href: "/profile/orders" },
        { label: `Đơn hàng #${order.id}` }
      ]} />

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Chi tiết đơn hàng #{order.id}</h1>
          <p className={styles.orderDate}>Đặt ngày {formatDate(order.created_at)}</p>
        </div>
        <div className={styles.headerRight}>
          <span className={`${styles.statusBadge} ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Order Progress - Only show if not cancelled */}
      {!isCancelled && (
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            {orderSteps.map((item, index) => (
              <div
                key={item.step}
                className={`${styles.progressStep} ${
                  statusConfig.step >= item.step ? styles.completed : ""
                } ${statusConfig.step === item.step ? styles.current : ""}`}
              >
                <div className={styles.stepCircle}>
                  {statusConfig.step > item.step ? "✓" : item.step}
                </div>
                <span className={styles.stepLabel}>{item.label}</span>
                {index < orderSteps.length - 1 && (
                  <div
                    className={`${styles.stepLine} ${
                      statusConfig.step > item.step ? styles.completedLine : ""
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Notice */}
      {isCancelled && (
        <div className={styles.cancelledNotice}>
          <div className={styles.cancelledIcon}>❌</div>
          <div>
            <h3>Đơn hàng đã bị hủy</h3>
            {order.cancel_reason && <p>Lý do: {order.cancel_reason}</p>}
          </div>
        </div>
      )}

      <div className={styles.contentGrid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Order Items */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Sản phẩm đã đặt</h2>
            <div className={styles.itemsList}>
              {order.order_items?.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemImage}>
                    {item.product?.image_product ? (
                      <Image
                        src={item.product.image_product}
                        alt={item.product.name_product || "Product"}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>No Image</div>
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <Link 
                      href={`/products/${item.product_id}`}
                      className={styles.itemName}
                    >
                      {item.product?.name_product || `Sản phẩm #${item.product_id}`}
                    </Link>
                    <p className={styles.itemMeta}>
                      Đơn giá: {formatPrice(item.price)}
                    </p>
                    <p className={styles.itemQuantity}>
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <div className={styles.itemTotal}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Note */}
          {order.note && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Ghi chú</h2>
              <p className={styles.orderNote}>{order.note}</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Shipping Address */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Địa chỉ giao hàng</h2>
            <div className={styles.addressCard}>
              <p className={styles.addressName}>
                {order.shipping_address?.fullname || order.user?.fullname || order.user?.full_name || "Khách hàng"}
              </p>
              <p className={styles.addressPhone}>
                📞 {order.shipping_address?.phone || "Chưa có số điện thoại"}
              </p>
              <p className={styles.addressText}>
                📍 {order.shipping_address?.address || "Chưa có địa chỉ"}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Thanh toán</h2>
            <div className={styles.paymentInfo}>
              <div className={styles.paymentRow}>
                <span>Phương thức:</span>
                <span className={styles.paymentMethod}>{order.payment_method}</span>
              </div>
              <div className={styles.paymentRow}>
                <span>Trạng thái:</span>
                <span className={`${styles.paymentBadge} ${paymentConfig.className}`}>
                  {paymentConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Tổng đơn hàng</h2>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Tạm tính:</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Tổng cộng:</span>
                <span className={styles.totalAmount}>{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            {canCancel && (
              <button
                className={styles.cancelBtn}
                onClick={handleCancelOrder}
              >
                Hủy đơn hàng
              </button>
            )}
            <Link href="/profile/orders" className={styles.backBtn}>
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
