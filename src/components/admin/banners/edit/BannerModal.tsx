'use client';

import { useState, useEffect } from 'react';
import { MdClose, MdImage } from 'react-icons/md';
import { bannerApi } from '@/lib/api';
import { Banner } from '@/types/banner';
import { BannerType } from '@/enums/banner/banner.enum';
import Button from '@/components/admin/Button';
import styles from './BannerModal.module.css';
import toast from 'react-hot-toast';

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  banner?: Banner | null;
}

export default function BannerModal({ isOpen, onClose, onSuccess, banner }: BannerModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    button_text: '',
    button_link: '',
    status: BannerType.ACTIVE,
    display_order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        description: banner.description || '',
        image_url: banner.image_url,
        button_text: banner.button_text || '',
        button_link: banner.button_link || '',
        status: banner.status,
        display_order: banner.display_order,
      });
      setImagePreview(banner.image_url);
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image_url: '',
        button_text: '',
        button_link: '',
        status: BannerType.ACTIVE,
        display_order: 0,
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [banner, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề banner');
      return;
    }

    if (formData.title.length > 100) {
      toast.error('Tiêu đề không được vượt quá 100 ký tự');
      return;
    }

    if (!imageFile && !banner) {
      toast.error('Vui lòng chọn hình ảnh banner');
      return;
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      
      submitData.append('title', formData.title);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('description', formData.description);
      submitData.append('button_text', formData.button_text);
      submitData.append('button_link', formData.button_link);
      submitData.append('status', formData.status);
      submitData.append('display_order', formData.display_order.toString());
      
      if (imageFile) {
        submitData.append('image_url', imageFile);
      } else if (banner) {
        submitData.append('image_url', formData.image_url);
      }

      if (banner) {
        await bannerApi.update(banner.id, submitData);
        toast.success('Cập nhật banner thành công');
      } else {
        await bannerApi.create(submitData);
        toast.success('Tạo banner thành công');
      }
      
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Error saving banner:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu banner');
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
            {banner ? 'Chỉnh sửa Banner' : 'Thêm Banner Mới'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tiêu đề <span className={styles.required}>*</span>
                <span className={styles.charCount}>
                  ({formData.title.length}/100)
                </span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề banner"
                maxLength={100}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phụ đề</label>
              <input
                type="text"
                className={styles.input}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Nhập phụ đề"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Mô tả</label>
              <textarea
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Hình ảnh {!banner && <span className={styles.required}>*</span>}
              </label>
              <div className={styles.imageUploadContainer}>
                <input
                  type="file"
                  id="bannerImage"
                  className={styles.fileInput}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="bannerImage" className={styles.fileInputLabel}>
                  <MdImage />
                  <span>Chọn hình ảnh</span>
                </label>
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Text nút</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  placeholder="Ví dụ: Xem ngay"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Link nút</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  placeholder="/products"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Trạng thái</label>
                <select
                  className={styles.select}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as BannerType })}
                >
                  <option value={BannerType.ACTIVE}>Kích hoạt</option>
                  <option value={BannerType.INACTIVE}>Vô hiệu hóa</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Thứ tự hiển thị</label>
                <input
                  type="number"
                  className={styles.input}
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
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
              {loading ? 'Đang lưu...' : banner ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
