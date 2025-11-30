'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MdClose,
  MdShoppingBag,
  MdDescription,
  MdImage,
  MdAttachMoney,
  MdInventory,
  MdDiscount,
  MdCategory,
  MdSave,
} from 'react-icons/md';

import { productApi } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './ProductModal.module.css';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { ProductStatus } from '@/enums/product/product.enum';

interface ProductModalProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

interface ProductFormData {
  name_product: string;
  small_description: string;
  meta_description: string;
  price: string;
  origin_price: string;
  discount: string;
  stock_quantity: string;
  category_id: string;
  status: ProductStatus;
}

export default function ProductModal({
  product,
  categories,
  onClose,
  onSuccess,
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name_product: '',
    small_description: '',
    meta_description: '',
    price: '',
    origin_price: '',
    discount: '0',
    stock_quantity: '0',
    category_id: '',
    status: ProductStatus.ACTIVE,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name_product: product.name_product,
        small_description: product.small_description || '',
        meta_description: product.meta_description || '',
        price: product.price.toString(),
        origin_price: product.origin_price?.toString() || '',
        discount: product.discount?.toString() || '0',
        stock_quantity: product.stock_quantity?.toString() || '0',
        category_id: product.category?.id.toString() || '',
        status: product.status,
      });
      setImagePreview(product.image_product || '');
      setImageFile(null);
      setErrors({});
    } else {
      setFormData({
        name_product: '',
        small_description: '',
        meta_description: '',
        price: '',
        origin_price: '',
        discount: '0',
        stock_quantity: '0',
        category_id: '',
        status: ProductStatus.ACTIVE,
      });
      setImagePreview('');
      setImageFile(null);
      setErrors({});
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name_product.trim()) {
      newErrors.name_product = 'Vui lòng nhập tên sản phẩm';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Vui lòng nhập giá hợp lệ';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Vui lòng chọn danh mục';
    }
    
    if (formData.origin_price && parseFloat(formData.origin_price) < parseFloat(formData.price)) {
      newErrors.origin_price = 'Giá gốc phải lớn hơn giá bán';
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
      formDataToSend.append('name_product', formData.name_product.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('stock_quantity', formData.stock_quantity || '0');
      formDataToSend.append('discount', formData.discount || '0');
      
      if (formData.small_description) {
        formDataToSend.append('small_description', formData.small_description.trim());
      }
      
      if (formData.meta_description) {
        formDataToSend.append('meta_description', formData.meta_description.trim());
      }
      
      if (formData.origin_price) {
        formDataToSend.append('origin_price', formData.origin_price);
      }

      if (imageFile) {
        formDataToSend.append('image_product', imageFile);
      }

      if (product) {
        await productApi.update(product.id, formDataToSend);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await productApi.create(formDataToSend);
        toast.success('Thêm sản phẩm thành công!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Không thể lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formBody}>
            {/* Image Upload */}
            <div className={styles.imageSection}>
              <label className={styles.label}>
                <MdImage /> Hình ảnh sản phẩm
              </label>
              {imagePreview ? (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={handleRemoveImage}
                  >
                    <MdClose />
                  </button>
                </div>
              ) : (
                <div
                  className={styles.uploadBox}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <MdImage className={styles.uploadIcon} />
                  <p>Click để chọn ảnh</p>
                  <span>PNG, JPG (max. 5MB)</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>

            {/* Form Fields */}
            <div className={styles.fieldsSection}>
              {/* Product Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdShoppingBag /> Tên sản phẩm *
                </label>
                <input
                  type="text"
                  name="name_product"
                  value={formData.name_product}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Nhập tên sản phẩm"
                />
                {errors.name_product && (
                  <span className={styles.error}>{errors.name_product}</span>
                )}
              </div>

              {/* Category */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdCategory /> Danh mục *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_category} {category.brand ? `(${category.brand.name_brand})` : ''}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <span className={styles.error}>{errors.category_id}</span>
                )}
              </div>

              {/* Price Fields */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <MdAttachMoney /> Giá bán *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="0"
                    min="0"
                  />
                  {errors.price && (
                    <span className={styles.error}>{errors.price}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <MdAttachMoney /> Giá gốc
                  </label>
                  <input
                    type="number"
                    name="origin_price"
                    value={formData.origin_price}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="0"
                    min="0"
                  />
                  {errors.origin_price && (
                    <span className={styles.error}>{errors.origin_price}</span>
                  )}
                </div>
              </div>

              {/* Stock & Discount */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <MdInventory /> Số lượng
                  </label>
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

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <MdDiscount /> Giảm giá (%)
                  </label>
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
                  <option value={ProductStatus.OUT_OF_STOCK}>Hết hàng</option>
                </select>
              </div>

              {/* Small Description */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdDescription /> Mô tả ngắn
                </label>
                <textarea
                  name="small_description"
                  value={formData.small_description}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Mô tả ngắn gọn về sản phẩm"
                  rows={3}
                />
              </div>

              {/* Meta Description */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdDescription /> Mô tả SEO
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Mô tả cho SEO"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              <MdSave />
              {loading ? 'Đang lưu...' : product ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
