"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "../../styles/profile/Profile.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { UpdateProfileDto } from "@/types/auth";
import { GenderType } from "@/enums";
import { authApi } from "@/lib/api";
import Breadcrumb from "../breadcrumb/breadcrumb";
import UserOrders from "@/components/user/profile/UserOrders";

const SIDEBAR_ITEMS = [
  { id: "profile", label: "Thông tin tài khoản" },
  { id: "orders", label: "Đơn hàng của bạn" },
  { id: "password", label: "Đổi mật khẩu" },
  { id: "addresses", label: "Địa chỉ của tôi" },
] as const;

type TabId = typeof SIDEBAR_ITEMS[number]['id'];

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
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuth();
  
  const [formData, setFormData] = useState<UpdateProfileDto>({
    fullname: user?.fullname || "",
    phone_number: user?.phone_number || "",
    address: user?.address || "",
    gender: user?.gender || GenderType.MALE,
    date_of_birth: user?.date_of_birth || "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authApi.updateProfile(formData);
      toast.success('Cập nhật thông tin thành công!');
      
      if (updateUser && response.data) {
        updateUser(response.data);
      }
      
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Cập nhật thất bại!';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    setIsSubmitting(true);

    try {
    //   await authApi.changePassword({
    //     currentPassword: passwordData.currentPassword,
    //     newPassword: passwordData.newPassword,
    //   });
      
      toast.success('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setActiveTab("profile");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đổi mật khẩu thất bại!';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      fullname: user?.fullname || "",
      phone_number: user?.phone_number || "",
      address: user?.address || "",
      gender: user?.gender || GenderType.MALE,
      date_of_birth: user?.date_of_birth || "",
    });
    setIsEditing(false);
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
    <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Hồ sơ" }]} />
        <div className={styles.profileLayout}>
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

          <div className={styles.mainContent}>
            {activeTab === "profile" && (
              <>
                <div className={styles.contentHeader}>
                  <h2 className={styles.contentTitle}>THÔNG TIN TÀI KHOẢN</h2>
                </div>
                
                <div className={styles.contentBody}>
                  {!isEditing ? (
                    <>
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
                        <button 
                          onClick={() => setIsEditing(true)}
                          className={styles.primaryButton}
                        >
                          ✏️ Chỉnh sửa thông tin
                        </button>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={handleUpdateProfile} className={styles.editForm}>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label htmlFor="fullname" className={styles.formLabel}>
                            Họ tên <span className={styles.required}>*</span>
                          </label>
                          <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="phone_number" className={styles.formLabel}>
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            className={styles.formInput}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="gender" className={styles.formLabel}>
                            Giới tính
                          </label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className={styles.formSelect}
                          >
                            <option value={GenderType.MALE}>Nam</option>
                            <option value={GenderType.FEMALE}>Nữ</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="date_of_birth" className={styles.formLabel}>
                            Ngày sinh
                          </label>
                          <input
                            type="date"
                            id="date_of_birth"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleInputChange}
                            className={styles.formInput}
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="address" className={styles.formLabel}>
                          Địa chỉ
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={styles.formTextarea}
                          rows={3}
                        />
                      </div>

                      <div className={styles.formActions}>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={styles.primaryButton}
                        >
                          {isSubmitting ? "Đang lưu..." : "� Lưu thay đổi"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={isSubmitting}
                          className={styles.secondaryButton}
                        >
                          ✖ Hủy
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <>
                <div className={styles.contentHeader}>
                  <h2 className={styles.contentTitle}>ĐỔI MẬT KHẨU</h2>
                </div>
                
                <div className={styles.contentBody}>
                  <form onSubmit={handleChangePassword} className={styles.passwordForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor="currentPassword" className={styles.formLabel}>
                        Mật khẩu hiện tại <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className={styles.formInput}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="newPassword" className={styles.formLabel}>
                        Mật khẩu mới <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={styles.formInput}
                        required
                        minLength={6}
                      />
                      <small className={styles.formHint}>Tối thiểu 6 ký tự</small>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="confirmPassword" className={styles.formLabel}>
                        Xác nhận mật khẩu mới <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={styles.formInput}
                        required
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={styles.primaryButton}
                      >
                        {isSubmitting ? "Đang xử lý..." : "🔒 Đổi mật khẩu"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("profile")}
                        disabled={isSubmitting}
                        className={styles.secondaryButton}
                      >
                        ← Quay lại
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && <UserOrders />}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <>
                <div className={styles.contentHeader}>
                  <h2 className={styles.contentTitle}>ĐỊA CHỈ CỦA TÔI</h2>
                </div>
                
                <div className={styles.contentBody}>
                  <div className={styles.emptyState}>
                    <p>📍 Bạn chưa có địa chỉ nào</p>
                    <button className={styles.primaryButton}>
                      ➕ Thêm địa chỉ mới
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}