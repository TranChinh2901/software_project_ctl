"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { orderApi } from "@/lib/api";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/enums";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import toast from "react-hot-toast";
import styles from "@/styles/profile/Orders.module.css";

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
}

export default function UserOrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderApi.getUserOrders();
      console.log("User Orders Response:", response);
      
      const ordersData = response?.data || response || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem đơn hàng");
      router.push("/account/login?redirect=/profile/orders");
      return;
    }

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [authLoading, isAuthenticated, router, fetchOrders]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
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

  const handleCancelOrder = async (orderId: number) => {
    const reason = prompt("Vui lòng nhập lý do hủy đơn hàng:");
    if (!reason) return;

    try {
      await orderApi.cancel(orderId, reason);
      toast.success("Hủy đơn hàng thành công");
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Không thể hủy đơn hàng");
    }
  };

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const statusTabs = [
    { key: "all", label: "Tất cả" },
    { key: OrderStatus.PENDING, label: "Chờ xử lý" },
    { key: OrderStatus.CONFIRMED, label: "Đã xác nhận" },
    { key: OrderStatus.SHIPPING, label: "Đang giao" },
    { key: OrderStatus.COMPLETED, label: "Hoàn thành" },
    { key: OrderStatus.CANCELLED, label: "Đã hủy" },
  ];

  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumb items={[
        { label: "Trang chủ", href: "/" },
        { label: "Tài khoản", href: "/profile" },
        { label: "Đơn hàng của tôi" }
      ]} />

      <div className={styles.statusTabs}>
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabBtn} ${selectedStatus === tab.key ? styles.active : ""}`}
            onClick={() => setSelectedStatus(tab.key)}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span className={styles.tabCount}>
                {orders.filter(o => o.status === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className={styles.ordersList}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>Không có đơn hàng nào</h3>
            <p>Bạn chưa có đơn hàng nào trong mục này</p>
            <Link href="/products" className={styles.shopBtn}>
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const canCancel = order.status === OrderStatus.PENDING;

            return (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>Đơn hàng #{order.id}</span>
                    <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${statusConfig.className}`}>
                    {statusConfig.label}
                  </span>
                </div>

                <div className={styles.orderItems}>
                  {order.order_items?.slice(0, 2).map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <div className={styles.itemImage}>
                        {item.product?.image_product ? (
                          <Image
                            src={item.product.image_product}
                            alt={item.product.name_product || "Product"}
                            width={80}
                            height={80}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className={styles.imagePlaceholder}>No Image</div>
                        )}
                      </div>
                      <div className={styles.itemDetails}>
                        <h4 className={styles.itemName}>
                          {item.product?.name_product || `Sản phẩm #${item.product_id}`}
                        </h4>
                        <p className={styles.itemMeta}>
                          Số lượng: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className={styles.itemPrice}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  {order.order_items && order.order_items.length > 2 && (
                    <div className={styles.moreItems}>
                      +{order.order_items.length - 2} sản phẩm khác
                    </div>
                  )}
                </div>
                <div className={styles.orderFooter}>
                  <div className={styles.orderTotal}>
                    <span>Tổng tiền:</span>
                    <span className={styles.totalAmount}>{formatPrice(order.total_amount)}</span>
                  </div>
                  <div className={styles.orderActions}>
                    <Link
                      href={`/profile/orders/${order.id}`}
                      className={styles.detailBtn}
                    >
                      Xem chi tiết
                    </Link>
                    {canCancel && (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Hủy đơn
                      </button>
                    )}
                    {order.status === OrderStatus.COMPLETED && (
                      <button className={styles.reorderBtn}>
                        Mua lại
                      </button>
                    )}
                  </div>
                </div>
                {order.status === OrderStatus.CANCELLED && order.cancel_reason && (
                  <div className={styles.cancelReason}>
                    <strong>Lý do hủy:</strong> {order.cancel_reason}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
