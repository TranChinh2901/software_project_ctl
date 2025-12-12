'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MdClose,
  MdCategory,
  MdDescription,
  MdImage,
  MdCloudUpload,
  MdSave,
  MdBusiness,
} from 'react-icons/md';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/category';
import { Brand } from '@/types/brand';
import { categoryApi, brandApi } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './CategoryModal.module.css';

interface CategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface CategoryFormData {
  name_category: string;
  description_category: string;
  brand_id: string;
}

export default function CategoryModal({
  isOpen,
  category,
  onClose,
  onSuccess,
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name_category: '',
    description_category: '',
    brand_id: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brands, setBrands] = useState<Brand[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (category && isOpen) {
      setFormData({
        name_category: category.name_category,
        description_category: category.description_category || '',
        brand_id: category.brand?.id?.toString() || '',
      });
      setImagePreview(category.image_category || '');
      setImageFile(null);
      setErrors({});
    } else if (isOpen) {
      setFormData({
        name_category: '',
        description_category: '',
        brand_id: '',
      });
      setImagePreview('');
      setImageFile(null);
      setErrors({});
    }
  }, [category, isOpen]);

  const fetchBrands = async () => {
    try {
      const response = await brandApi.getAll();
      const brandsData = Array.isArray(response.data) ? response.data : [];
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Không thể tải danh sách thương hiệu');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name_category.trim()) {
      newErrors.name_category = 'Vui lòng nhập tên danh mục';
    }

    if (!formData.brand_id) {
      newErrors.brand_id = 'Vui lòng chọn thương hiệu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('name_category', formData.name_category.trim());
      formDataToSend.append('description_category', formData.description_category.trim());
      formDataToSend.append('brand_id', formData.brand_id);
      
      if (imageFile) {
        formDataToSend.append('image_category', imageFile);
      }

      if (category) {
        await categoryApi.update(category.id, formDataToSend);
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await categoryApi.create(formDataToSend);
        toast.success('Thêm danh mục thành công!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Không thể lưu danh mục');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <MdCategory />
            <span>{category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</span>
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
                  <MdCategory />
                  Tên danh mục <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <MdCategory className={styles.inputIcon} />
                  <input
                    type="text"
                    name="name_category"
                    value={formData.name_category}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.name_category ? styles.error : ''}`}
                    placeholder="Nhập tên danh mục"
                  />
                </div>
                {errors.name_category && (
                  <span className={styles.errorMessage}>{errors.name_category}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdBusiness />
                  Thương hiệu <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <MdBusiness className={styles.inputIcon} />
                  <select
                    name="brand_id"
                    value={formData.brand_id}
                    onChange={handleChange}
                    className={`${styles.select} ${errors.brand_id ? styles.error : ''}`}
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name_brand}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.brand_id && (
                  <span className={styles.errorMessage}>{errors.brand_id}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdDescription />
                  Mô tả
                </label>
                <textarea
                  name="description_category"
                  value={formData.description_category}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Nhập mô tả danh mục"
                  rows={4}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdImage />
                  Hình ảnh danh mục
                </label>
                <div className={styles.imageUploadContainer}>
                  <div className={`${styles.imagePreview} ${imagePreview ? styles.hasImage : ''}`}>
                    {imagePreview ? (
                      <>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          className={styles.removeImageButton}
                          onClick={handleRemoveImage}
                        >
                          <MdClose />
                        </button>
                      </>
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <MdCloudUpload className={styles.uploadIcon} />
                        <div className={styles.uploadText}>
                          <strong onClick={() => fileInputRef.current?.click()}>
                            Chọn ảnh
                          </strong>
                          {' '}hoặc kéo thả vào đây
                          <br />
                          <small>PNG, JPG, GIF tối đa 5MB</small>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className={styles.fileInput}
                  />
                  <button
                    type="button"
                    className={styles.uploadButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <MdCloudUpload />
                    Chọn file
                  </button>
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
                  Đang lưu...
                </>
              ) : (
                <>
                  <MdSave />
                  {category ? 'Cập nhật' : 'Thêm mới'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
