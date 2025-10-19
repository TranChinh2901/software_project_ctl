"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";
import auth from "@/services/auth";
import styles from "./Profile.module.css";

const sidebarItems = [
  { id: "account", label: "Trang tài khoản", active: false },
  { id: "profile", label: "Thông tin tài khoản", active: true },
  { id: "orders", label: "Đơn hàng của bạn", active: false },
  { id: "password", label: "Đổi mật khẩu", active: false },
  { id: "addresses", label: "Số địa chỉ (0)", active: false },
];

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get user from localStorage
        const userData = auth.getUser();
        const token = auth.getToken();
        
        // Debug log để kiểm tra dữ liệu
        console.log("User data from localStorage:", userData);
        console.log("Token:", token);
        
        // Nếu không có token hoặc user, redirect về login
        if (!token || !userData) {
          router.push('/account/login?message=Vui lòng đăng nhập để xem hồ sơ');
          return;
        }
        
        setUser(userData);
      } catch (err) {
        console.error("Failed to load profile:", err);
        router.push('/account/login?message=Có lỗi xảy ra, vui lòng đăng nhập lại');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

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
                {sidebarItems.map((item) => (
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
                      <div className={styles.infoField}>
                        <label className={styles.fieldLabel}>Họ tên:</label>
                        <div className={styles.fieldValue}>{user.fullname}</div>
                      </div>
                      
                      <div className={styles.infoField}>
                        <label className={styles.fieldLabel}>Email:</label>
                        <div className={styles.fieldValue}>{user.email}</div>
                      </div>
                      
                      <div className={styles.infoField}>
                        <label className={styles.fieldLabel}>Điện thoại:</label>
                        <div className={styles.fieldValue}>
                          {user.phone_number || "Chưa cập nhật"}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoColumn}>
                      <div className={styles.infoField}>
                        <label className={styles.fieldLabel}>Giới tính:</label>
                        <div className={styles.fieldValue}>
                          {user.gender ? (user.gender === "male" ? "Nam" : "Nữ") : "Chưa cập nhật"}
                        </div>
                      </div>
                      
                      <div className={styles.infoField}>
                        <label className={styles.fieldLabel}>Ngày sinh:</label>
                        <div className={styles.fieldValue}>
                          {user.date_of_birth 
                            ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
                            : "Chưa cập nhật"
                          }
                        </div>
                      </div>
                      
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
                    <label className={styles.fieldLabel}>Địa chỉ:</label>
                    <div className={styles.fieldValue}>
                      {user.address || "Chưa cập nhật"}
                    </div>
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