'use client';

import { useState, useEffect } from 'react';
import { MdClose, MdCloudUpload } from 'react-icons/md';
import { blogApi } from '@/lib/api';
import { Blog } from '@/types/blog';
import { BlogType } from '@/enums';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/admin/RichTextEditor';
import styles from './BlogModal.module.css';
import toast from 'react-hot-toast';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog?: Blog | null;
  onSuccess: () => void;
}

export default function BlogModal({ isOpen, onClose, blog, onSuccess }: BlogModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: BlogType.ACTIVE,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        status: blog.status || BlogType.ACTIVE,
      });
      setImagePreview(blog.image_blogs || '');
    } else {
      resetForm();
    }
  }, [blog]);

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      status: BlogType.ACTIVE,
    });
    setImageFile(null);
    setImagePreview('');
  };

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
      toast.error('Vui lòng nhập tiêu đề bài viết');
      return;
    }

    if (formData.content && formData.content.trim().length < 10) {
      toast.error('Nội dung phải có ít nhất 10 ký tự');
      return;
    }

    if (!user) {
      toast.error('Bạn cần đăng nhập để tạo bài viết');
      return;
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      
      if (formData.content && formData.content.trim().length >= 10) {
        submitData.append('content', formData.content.trim());
      }
      
      submitData.append('status', formData.status);
      if (imageFile) {
        submitData.append('image_blogs', imageFile);
      }

      console.log('FormData being sent:');
      for (const [key, value] of submitData.entries()) {
        console.log(key, ':', value);
      }

      if (blog) {
        await blogApi.update(blog.id, submitData);
        toast.success('Cập nhật bài viết thành công');
      } else {
        await blogApi.create(submitData);
        toast.success('Tạo bài viết mới thành công');
      }
      
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving blog:', error);
      const err = error as { 
        response?: { 
          data?: { 
            message?: string; 
            error?: string; 
            details?: Array<{ field?: string; message?: string }> | string[]
          } 
        } 
      };
      
      const errorMessage = err.response?.data?.message || err.response?.data?.error ||
        (blog ? 'Không thể cập nhật bài viết' : 'Không thể tạo bài viết mới');
      if (err.response?.data?.details && Array.isArray(err.response.data.details)) {
        err.response.data.details.forEach((detail) => {
          const msg = typeof detail === 'string' ? detail : (detail as { message?: string }).message || JSON.stringify(detail);
          toast.error(msg);
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{blog ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {user && (
            <div className={styles.authorInfo}>
              <span className={styles.authorLabel}>Tác giả:</span>
              <span className={styles.authorName}>
                {user.fullname || user.email}
              </span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="title">
              Tiêu đề <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Nội dung</label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Nhập nội dung bài viết..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Trạng thái</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogType })}
            >
              <option value={BlogType.ACTIVE}>Hoạt động</option>
              <option value={BlogType.INACTIVE}>Không hoạt động</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Hình ảnh</label>
            <div className={styles.imageUploadContainer}>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              <label htmlFor="image" className={styles.fileLabel}>
                <MdCloudUpload className={styles.uploadIcon} />
                <span>Chọn hình ảnh</span>
              </label>
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (blog ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
