"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MdSearch,
  MdRefresh,
  MdVisibility,
  MdDelete,
  MdFilterList,
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
  MdLocalShipping,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdPending,
} from "react-icons/md";
import { orderApi } from "@/lib/api";
import PageContainer from "@/components/admin/PageContainer";
import Button from "@/components/admin/Button";
import Card from "@/components/admin/Card";
import styles from "@/styles/admin/Orders.module.css";
import toast from "react-hot-toast";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/enums";
import OrderDetailModal from "./OrderDetailModal";

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
  };
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipping: 0,
    completed: 0,
    cancelled: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const response = await orderApi.getAll({ limit: 1000 });
      const allOrders = response?.data?.data || response?.data || [];
      const ordersArray = Array.isArray(allOrders) ? allOrders : [];

      setStats({
        total: ordersArray.length,
        pending: ordersArray.filter((o: Order) => o.status === OrderStatus.PENDING).length,
        confirmed: ordersArray.filter((o: Order) => o.status === OrderStatus.CONFIRMED).length,
        shipping: ordersArray.filter((o: Order) => o.status === OrderStatus.SHIPPING).length,
        completed: ordersArray.filter((o: Order) => o.status === OrderStatus.COMPLETED).length,
        cancelled: ordersArray.filter((o: Order) => o.status === OrderStatus.CANCELLED).length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (selectedStatus) params.status = selectedStatus;
      if (searchDebounce) params.search = searchDebounce;

      const response = await orderApi.getAll(params);
      console.log("Orders API Response:", response);

      const ordersData = response?.data?.data || response?.data || [];
      const pagination = response?.data?.pagination;

      setOrders(Array.isArray(ordersData) ? ordersData : []);

      if (pagination) {
        setTotalItems(pagination.total || 0);
        setTotalPages(pagination.totalPages || Math.ceil((pagination.total || 0) / itemsPerPage));
      } else {
        setTotalItems(ordersData.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, selectedStatus, searchDebounce]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchDebounce, selectedStatus]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderApi.updateStatus(orderId, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${orderId}? Hành động này không thể hoàn tác!`)) return;

    try {
      await orderApi.delete(orderId);
      toast.success("Xóa đơn hàng thành công");
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error("Error deleting order:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Không thể xóa đơn hàng");
    }
  };

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
      [OrderStatus.PENDING]: {
        label: "Chờ xử lý",
        className: styles.statusPending,
        icon: <MdPending />,
      },
      [OrderStatus.CONFIRMED]: {
        label: "Đã xác nhận",
        className: styles.statusConfirmed,
        icon: <MdAccessTime />,
      },
      [OrderStatus.SHIPPING]: {
        label: "Đang giao",
        className: styles.statusShipping,
        icon: <MdLocalShipping />,
      },
      [OrderStatus.COMPLETED]: {
        label: "Hoàn thành",
        className: styles.statusCompleted,
        icon: <MdCheckCircle />,
      },
      [OrderStatus.CANCELLED]: {
        label: "Đã hủy",
        className: styles.statusCancelled,
        icon: <MdCancel />,
      },
    };
    return config[status] || { label: status, className: "", icon: null };
  };

  const getPaymentStatusConfig = (status: PaymentStatus) => {
    const config = {
      [PaymentStatus.UNPAID]: { label: "Chưa thanh toán", className: styles.paymentUnpaid },
      [PaymentStatus.PAID]: { label: "Đã thanh toán", className: styles.paymentPaid },
      [PaymentStatus.REFUNDED]: { label: "Đã hoàn tiền", className: styles.paymentRefunded },
    };
    return config[status] || { label: status, className: "" };
  };

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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageBtn} ${i === currentPage ? styles.active : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems} đơn hàng
        </div>
        <div className={styles.paginationControls}>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className={styles.pageSizeSelect}
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
          </select>

          <div className={styles.pageButtons}>
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <MdFirstPage />
            </button>
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <MdChevronLeft />
            </button>
            {pages}
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <MdChevronRight />
            </button>
            <button
              className={styles.pageBtn}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <MdLastPage />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContainer
      title="Quản lý đơn hàng"
      description="Quản lý và theo dõi tất cả đơn hàng"
      action={
        <Button variant="secondary" onClick={() => { fetchOrders(); fetchStats(); }}>
          <MdRefresh /> Làm mới
        </Button>
      }
    >
      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.iconTotal}`}>
              <MdPending />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Tổng đơn hàng</div>
              <div className={styles.statValue}>{stats.total}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.iconPending}`}>
              <MdAccessTime />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Chờ xử lý</div>
              <div className={styles.statValue}>{stats.pending}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.iconShipping}`}>
              <MdLocalShipping />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Đang giao</div>
              <div className={styles.statValue}>{stats.shipping}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.iconCompleted}`}>
              <MdCheckCircle />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Hoàn thành</div>
              <div className={styles.statValue}>{stats.completed}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.statContent}>
            <div className={`${styles.statIcon} ${styles.iconCancelled}`}>
              <MdCancel />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Đã hủy</div>
              <div className={styles.statValue}>{stats.cancelled}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className={styles.filterCard}>
        <div className={styles.filterContainer}>
          <div className={styles.searchBox}>
            <MdSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo mã đơn hàng, email khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterGroup}>
            <MdFilterList className={styles.filterIcon} />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tất cả trạng thái</option>
              <option value={OrderStatus.PENDING}>Chờ xử lý</option>
              <option value={OrderStatus.CONFIRMED}>Đã xác nhận</option>
              <option value={OrderStatus.SHIPPING}>Đang giao</option>
              <option value={OrderStatus.COMPLETED}>Hoàn thành</option>
              <option value={OrderStatus.CANCELLED}>Đã hủy</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className={styles.emptyState}>
              <MdLocalShipping className={styles.emptyIcon} />
              <p>Không có đơn hàng nào</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mã ĐH</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thanh toán</th>
                  <th>Phương thức</th>
                  <th>Ngày đặt</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const paymentConfig = getPaymentStatusConfig(order.payment_status);
                  const nextStatuses = getNextStatuses(order.status);

                  return (
                    <tr key={order.id}>
                      <td className={styles.idCell}>#{order.id}</td>
                      <td>
                        <div className={styles.customerInfo}>
                          <div className={styles.customerName}>
                            {order.user?.fullname || order.user?.full_name || "Khách hàng"}
                          </div>
                          <div className={styles.customerEmail}>{order.user?.email}</div>
                        </div>
                      </td>
                      <td className={styles.priceCell}>{formatPrice(order.total_amount)}</td>
                      <td>
                        <div className={styles.statusWrapper}>
                          <span className={`${styles.statusBadge} ${statusConfig.className}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                          {nextStatuses.length > 0 && (
                            <select
                              className={styles.statusSelect}
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleUpdateStatus(order.id, e.target.value as OrderStatus);
                                  e.target.value = "";
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Cập nhật
                              </option>
                              {nextStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {getStatusConfig(status).label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.paymentBadge} ${paymentConfig.className}`}>
                          {paymentConfig.label}
                        </span>
                      </td>
                      <td>
                        <span className={styles.paymentMethod}>{order.payment_method}</span>
                      </td>
                      <td className={styles.dateCell}>{formatDate(order.created_at)}</td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={`${styles.actionBtn} ${styles.viewBtn}`}
                            onClick={() => handleViewOrder(order)}
                            title="Xem chi tiết"
                          >
                            <MdVisibility />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Xóa đơn hàng"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {renderPagination()}
      </Card>

      {modalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setModalOpen(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={(status: OrderStatus) => {
            handleUpdateStatus(selectedOrder.id, status);
            setModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </PageContainer>
  );
}
