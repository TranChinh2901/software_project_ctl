'use client';

import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { voucherApi } from '@/lib/api';
import { Voucher } from '@/types/voucher';
import { VoucherType } from '@/enums/voucher/voucher.enum';
import Button from '@/components/admin/Button';
import styles from './VoucherModal.module.css';
import toast from 'react-hot-toast';

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  voucher?: Voucher | null;
}

export default function VoucherModal({ isOpen, onClose, onSuccess, voucher }: VoucherModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    discount_voucher: 0,
    expiry_date: '',
    status: VoucherType.ACTIVE,
    min_order_value: 0,
    quantity: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (voucher) {
      const expiryDate = voucher.expiry_date 
        ? new Date(voucher.expiry_date).toISOString().split('T')[0]
        : '';
      
      setFormData({
        code: voucher.code,
        discount_voucher: voucher.discount_voucher,
        expiry_date: expiryDate,
        status: voucher.status,
        min_order_value: voucher.min_order_value || 0,
        quantity: voucher.quantity,
      });
    } else {
      setFormData({
        code: '',
        discount_voucher: 0,
        expiry_date: '',
        status: VoucherType.ACTIVE,
        min_order_value: 0,
        quantity: 0,
      });
    }
  }, [voucher, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code.trim()) {
      toast.error('Vui lòng nhập mã voucher');
      return;
    }

    if (formData.discount_voucher <= 0) {
      toast.error('Giá trị giảm giá phải lớn hơn 0');
      return;
    }

    if (!formData.expiry_date) {
      toast.error('Vui lòng chọn ngày hết hạn');
      return;
    }

    if (formData.quantity < 0) {
      toast.error('Số lượng không được âm');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        min_order_value: formData.min_order_value || undefined,
      };

      if (voucher) {
        await voucherApi.update(voucher.id, submitData);
        toast.success('Cập nhật voucher thành công');
      } else {
        await voucherApi.create(submitData);
        toast.success('Tạo voucher thành công');
      }
      
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Error saving voucher:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu voucher');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {voucher ? 'Chỉnh sửa Voucher' : 'Thêm Voucher Mới'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Mã Voucher <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: SAVE50K"
                  maxLength={50}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Giá trị giảm (VNĐ) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={formData.discount_voucher}
                  onChange={(e) => setFormData({ ...formData, discount_voucher: parseFloat(e.target.value) || 0 })}
                  placeholder="50000"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Ngày hết hạn <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  className={styles.input}
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Số lượng</label>
                <input
                  type="number"
                  className={styles.input}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="100"
                  min="0"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Giá trị đơn hàng tối thiểu (VNĐ)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={formData.min_order_value}
                  onChange={(e) => setFormData({ ...formData, min_order_value: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Trạng thái</label>
                <select
                  className={styles.select}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as VoucherType })}
                >
                  <option value={VoucherType.ACTIVE}>Kích hoạt</option>
                  <option value={VoucherType.INACTIVE}>Vô hiệu hóa</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : voucher ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
