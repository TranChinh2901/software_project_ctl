'use client';

import { useState } from 'react';
import { Order } from '@/types/order';
import { OrderStatus } from '@/enums';
import { orderApi } from '@/lib/api';
import { MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import styles from '@/styles/admin/Orders.module.css';

interface UpdateStatusModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateStatusModal({ order, onClose, onSuccess }: UpdateStatusModalProps) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === order.status) {
      toast.error('Vui lòng chọn trạng thái mới');
      return;
    }

    try {
      setLoading(true);
      await orderApi.updateStatus(order.id, { status, note });
      toast.success('Cập nhật trạng thái thành công');
      onSuccess();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const getNextStatuses = () => {
    switch (order.status) {
      case OrderStatus.PENDING:
        return [OrderStatus.CONFIRMED, OrderStatus.CANCELLED];
      case OrderStatus.CONFIRMED:
        return [OrderStatus.SHIPPING, OrderStatus.CANCELLED];
      case OrderStatus.SHIPPING:
        return [OrderStatus.COMPLETED, OrderStatus.CANCELLED];
      default:
        return [];
    }
  };

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

  const nextStatuses = getNextStatuses();

  if (nextStatuses.length === 0) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Cập nhật trạng thái</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <MdClose />
            </button>
          </div>
          <div className={styles.modalBody}>
            <p>Đơn hàng này không thể cập nhật trạng thái.</p>
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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Cập nhật trạng thái đơn hàng #{order.id}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label>Trạng thái hiện tại:</label>
              <p className={styles.currentStatus}>{getStatusLabel(order.status)}</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status">Trạng thái mới: *</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={styles.formSelect}
                required
              >
                <option value={order.status}>-- Chọn trạng thái --</option>
                {nextStatuses.map((s) => (
                  <option key={s} value={s}>
                    {getStatusLabel(s)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="note">Ghi chú:</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={styles.formTextarea}
                placeholder="Nhập ghi chú (không bắt buộc)"
                rows={3}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
