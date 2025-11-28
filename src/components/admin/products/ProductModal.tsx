'use client';

import { useState, useEffect } from 'react';
import { MdClose, MdCloudUpload } from 'react-icons/md';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import { productApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { ProductStatus } from '@/enums/product/product.enum';
import styles from '@/styles/admin/ProductModal.module.css';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  brands: Brand[];
  onSuccess: () => void;
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
  categories,
  brands,
  onSuccess
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name_product: '',
    price: '',
    origin_price: '',
    small_description: '',
    meta_description: '',
    status: ProductStatus.ACTIVE,
    stock_quantity: '',
    discount: '',
    category_id: '',
    brand_id: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name_product: product.name_product || '',
        price: product.price?.toString() || '',
        origin_price: product.origin_price?.toString() || '',
        small_description: product.small_description || '',
        meta_description: product.meta_description || '',
        status: product.status || ProductStatus.ACTIVE,
        stock_quantity: product.stock_quantity?.toString() || '',
        discount: product.discount?.toString() || '',
        category_id: product.category?.id?.toString() || '',
        brand_id: product.brand?.id?.toString() || '',
      });
      setImagePreview(product.image_product || '');
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      name_product: '',
      price: '',
      origin_price: '',
      small_description: '',
      meta_description: '',
      status: ProductStatus.ACTIVE,
      stock_quantity: '',
      discount: '',
      category_id: '',
      brand_id: '',
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name_product.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Vui lòng nhập giá hợp lệ');
      return;
    }
    if (!formData.category_id) {
      toast.error('Vui lòng chọn danh mục');
      return;
    }
    if (!formData.brand_id) {
      toast.error('Vui lòng chọn thương hiệu');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      formDataToSend.append('name_product', formData.name_product);
      formDataToSend.append('price', formData.price);
      if (formData.origin_price) formDataToSend.append('origin_price', formData.origin_price);
      if (formData.small_description) formDataToSend.append('small_description', formData.small_description);
      if (formData.meta_description) formDataToSend.append('meta_description', formData.meta_description);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('stock_quantity', formData.stock_quantity || '0');
      formDataToSend.append('discount', formData.discount || '0');
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('brand_id', formData.brand_id);
      
      if (imageFile) {
        formDataToSend.append('image_product', imageFile);
      }

      if (product) {
        await productApi.update(product.id, formDataToSend);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await productApi.create(formDataToSend);
        toast.success('Thêm sản phẩm thành công');
      }
      
      onSuccess();
      resetForm();
    } catch (error: unknown) {
      console.error('Error saving product:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            disabled={loading}
          >
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGrid}>
            {/* Image Upload */}
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Hình ảnh sản phẩm</label>
              <div className={styles.imageUploadContainer}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className={styles.imageUploadLabel}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <MdCloudUpload />
                      <p>Nhấn để chọn ảnh</p>
                      <span>PNG, JPG tối đa 5MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Product Name */}
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>
                Tên sản phẩm <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name_product"
                value={formData.name_product}
                onChange={handleChange}
                className={styles.input}
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            {/* Price */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Giá bán <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={styles.input}
                placeholder="0"
                min="0"
                step="1000"
                required
              />
            </div>

            {/* Origin Price */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Giá gốc</label>
              <input
                type="number"
                name="origin_price"
                value={formData.origin_price}
                onChange={handleChange}
                className={styles.input}
                placeholder="0"
                min="0"
                step="1000"
              />
            </div>

            {/* Stock Quantity */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Số lượng</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className={styles.input}
                placeholder="0"
                min="0"
              />
            </div>

            {/* Discount */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Giảm giá (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className={styles.input}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            {/* Category */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Danh mục <span className={styles.required}>*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_category}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Thương hiệu <span className={styles.required}>*</span>
              </label>
              <select
                name="brand_id"
                value={formData.brand_id}
                onChange={handleChange}
                className={styles.select}
                required
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name_brand}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.select}
              >
                <option value={ProductStatus.ACTIVE}>Đang bán</option>
                <option value={ProductStatus.INACTIVE}>Ngừng bán</option>
              </select>
            </div>

            {/* Small Description */}
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Mô tả ngắn</label>
              <textarea
                name="small_description"
                value={formData.small_description}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Nhập mô tả ngắn về sản phẩm"
                rows={2}
              />
            </div>

            {/* Meta Description */}
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label className={styles.label}>Mô tả chi tiết</label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Nhập mô tả chi tiết về sản phẩm"
                rows={4}
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={handleClose}
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
              {loading ? 'Đang xử lý...' : product ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
