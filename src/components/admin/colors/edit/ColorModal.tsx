'use client';

import { useState, useEffect } from 'react';
import { Color } from '@/types/color';
import { colorApi } from '@/lib/api';
import { MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import styles from '@/styles/admin/Colors.module.css';

interface ColorModalProps {
  color: Color | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ColorModal({ color, onClose, onSuccess }: ColorModalProps) {
  const [formData, setFormData] = useState({
    name_color: '',
    hex_code: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (color) {
      setFormData({
        name_color: color.name_color,
        hex_code: color.hex_code || '',
      });
    }
  }, [color]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_color.trim()) {
      toast.error('Vui lòng nhập tên màu');
      return;
    }

    try {
      setLoading(true);
      const submitData: { name_color: string; hex_code?: string } = {
        name_color: formData.name_color.trim(),
      };

      if (formData.hex_code) {
        submitData.hex_code = formData.hex_code;
      }

      if (color) {
        await colorApi.update(color.id, submitData);
        toast.success('Cập nhật màu sắc thành công');
      } else {
        await colorApi.create(submitData);
        toast.success('Thêm màu sắc thành công');
      }
      onSuccess();
    } catch (error: unknown) {
      console.error('Error saving color:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMsg = err.response?.data?.message || 
                      (color ? 'Không thể cập nhật màu sắc' : 'Không thể thêm màu sắc');
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{color ? 'Chỉnh sửa màu sắc' : 'Thêm màu sắc mới'}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="name_color">Tên màu: *</label>
              <input
                type="text"
                id="name_color"
                name="name_color"
                value={formData.name_color}
                onChange={handleChange}
                placeholder="VD: Đỏ, Xanh, Đen..."
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="hex_code">Mã màu (Hex) - Tùy chọn:</label>
              <div className={styles.colorInputWrapper}>
                <input
                  type="text"
                  id="hex_code"
                  name="hex_code"
                  value={formData.hex_code}
                  onChange={handleChange}
                  placeholder="#FF5733"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className={styles.formInput}
                />
                <input
                  type="color"
                  value={formData.hex_code || '#000000'}
                  onChange={(e) => setFormData(prev => ({ ...prev, hex_code: e.target.value }))}
                  className={styles.colorPicker}
                />
              </div>
              <small className={styles.hint}>
                VD: #FF5733 (màu đỏ cam)
              </small>
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
              {loading ? 'Đang xử lý...' : (color ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
