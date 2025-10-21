"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "../../styles/profile/Profile.module.css";

const SIDEBAR_ITEMS = [
  // { id: "account", label: "Trang tài khoản" },
  { id: "profile", label: "Thông tin tài khoản" },
  { id: "orders", label: "Đơn hàng của bạn" },
  { id: "password", label: "Đổi mật khẩu" },
  { id: "addresses", label: "Số địa chỉ (0)" },
] as const;

interface InfoFieldProps {
  label: string;
  value: string | undefined;
  defaultText?: string;
}

const InfoField = ({ label, value, defaultText = "Chưa cập nhật" }: InfoFieldProps) => (
  <div className={styles.infoField}>
    <label className={styles.fieldLabel}>{label}:</label>
    <div className={styles.fieldValue}>{value || defaultText}</div>
  </div>
);

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  if (!loading && !isAuthenticated) {
    router.push('/account/login?message=Vui lòng đăng nhập để xem hồ sơ');
    return null;
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <span>Đang tải...</span>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Trang chủ
          </Link>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>Trang khách hàng</span>
        </nav>

        <div className={styles.profileLayout}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>TRANG TÀI KHOẢN</h2>
              <p className={styles.sidebarGreeting}>
                Xin chào, <span className={styles.userName}>{user?.fullname || "Khách hàng"}</span>!
              </p>
            </div>
            <nav className={styles.sidebarNav}>
              <ul className={styles.navList}>
                {SIDEBAR_ITEMS.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`${styles.navItem} ${
                        activeTab === item.id ? styles.navItemActive : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>THÔNG TIN TÀI KHOẢN</h2>
            </div>
            
            <div className={styles.contentBody}>
              {user ? (
                <div className={styles.profileInfo}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoColumn}>
                      <InfoField label="Họ tên" value={user.fullname} />
                      <InfoField label="Email" value={user.email} />
                      <InfoField label="Điện thoại" value={user.phone_number} />
                    </div>

                    <div className={styles.infoColumn}>
                      <InfoField 
                        label="Giới tính" 
                        value={user.gender ? (user.gender === "male" ? "Nam" : "Nữ") : undefined} 
                      />
                      <InfoField 
                        label="Ngày sinh" 
                        value={user.date_of_birth 
                          ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
                          : undefined
                        } 
                      />
                      <div className={styles.infoField}>
                        <label className={styles.fieldLabel}>Trạng thái:</label>
                        <div className={styles.fieldValue}>
                          <span className={`${styles.statusBadge} ${
                            user.is_verified ? styles.verified : styles.unverified
                          }`}>
                            {user.is_verified ? '✓ Đã xác thực' : '⚠ Chưa xác thực'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.addressSection}>
                    <InfoField label="Địa chỉ" value={user.address} />
                  </div>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>Không có thông tin tài khoản</p>
                </div>
              )}
              
              <div className={styles.actionButtons}>
                <button className={styles.primaryButton}>
                  ✏️ Chỉnh sửa thông tin
                </button>
                <button className={styles.secondaryButton}>
                  🔒 Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}