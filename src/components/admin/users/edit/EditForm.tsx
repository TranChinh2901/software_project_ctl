'use client';

import { useState, useEffect } from 'react';
import {
  MdClose,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdWc,
  MdCake,
  MdSecurity,
  MdVerifiedUser,
  MdSave,
} from 'react-icons/md';
import { User, UpdateUserDto } from '@/types/user';
import { RoleType, GenderType } from '@/enums';
import { userApi } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './EditUserModal.module.css';

interface EditUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserDto>({
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    gender: undefined,
    date_of_birth: undefined,
    role: RoleType.USER,
    is_verified: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        fullname: user.fullname,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address || '',
        gender: user.gender,
        date_of_birth: user.date_of_birth 
          ? new Date(user.date_of_birth).toISOString().split('T')[0]
          : undefined,
        role: user.role,
        is_verified: user.is_verified,
      });
      setErrors({});
    }
  }, [user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullname?.trim()) {
      newErrors.fullname = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = 'Vui lòng nhập số điện thoại';
    }

    if (!formData.role) {
      newErrors.role = 'Vui lòng chọn vai trò';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    try {
      setLoading(true);
      await userApi.update(user.id, formData as Record<string, unknown>);
      toast.success('Cập nhật người dùng thành công!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Không thể cập nhật người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleVerified = () => {
    setFormData((prev) => ({ ...prev, is_verified: !prev.is_verified }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <MdPerson />
            <span>Chỉnh sửa thông tin người dùng</span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdPerson />
                  Họ và tên <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <MdPerson className={styles.inputIcon} />
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.fullname ? styles.error : ''}`}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                {errors.fullname && (
                  <span className={styles.errorMessage}>{errors.fullname}</span>
                )}
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <MdEmail />
                    Email <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <MdEmail className={styles.inputIcon} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.email ? styles.error : ''}`}
                      placeholder="Nhập email"
                    />
                  </div>
                  {errors.email && (
                    <span className={styles.errorMessage}>{errors.email}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <MdPhone />
                    Số điện thoại <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <MdPhone className={styles.inputIcon} />
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className={`${styles.input} ${errors.phone_number ? styles.error : ''}`}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  {errors.phone_number && (
                    <span className={styles.errorMessage}>{errors.phone_number}</span>
                  )}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdLocationOn />
                  Địa chỉ
                </label>
                <div className={styles.inputWrapper}>
                  <MdLocationOn className={styles.inputIcon} />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Nhập địa chỉ"
                    rows={2}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <MdWc />
                    Giới tính
                  </label>
                  <div className={styles.inputWrapper}>
                    <MdWc className={styles.inputIcon} />
                    <select
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value={GenderType.MALE}>Nam</option>
                      <option value={GenderType.FEMALE}>Nữ</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <MdCake />
                    Ngày sinh
                  </label>
                  <div className={styles.inputWrapper}>
                    <MdCake className={styles.inputIcon} />
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth || ''}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdSecurity />
                  Vai trò <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <MdSecurity className={styles.inputIcon} />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.role ? styles.error : ''}`}
                  >
                    <option value={RoleType.USER}>Người dùng</option>
                    <option value={RoleType.ADMIN}>Quản trị viên</option>
                  </select>
                </div>
                {errors.role && (
                  <span className={styles.errorMessage}>{errors.role}</span>
                )}
              </div>
              <div className={styles.formGroup}>
                <div className={styles.switchGroup}>
                  <div className={styles.switchLabel}>
                    <MdVerifiedUser />
                    Trạng thái xác thực
                  </div>
                  <div
                    className={`${styles.switch} ${formData.is_verified ? styles.checked : ''}`}
                    onClick={toggleVerified}
                  >
                    <div className={styles.switchThumb} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.loadingSpinner} />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <MdSave />
                  Cập nhật
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
