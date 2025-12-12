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
  MdDelete,
  MdCollections,
} from 'react-icons/md';

import { productApi, productGalleryApi } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './ProductModal.module.css';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { ProductStatus } from '@/enums/product/product.enum';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { ProductGallery } from '@/types/product-gallery';
import ProductVariants from '../variants/ProductVariants';

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
  const [galleryImages, setGalleryImages] = useState<ProductGallery[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'variants'>('info');

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
      
      loadGalleryImages(product.id);
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
      setGalleryImages([]);
      setGalleryFiles([]);
      setGalleryPreviews([]);
    }
  }, [product]);

  const loadGalleryImages = async (productId: number) => {
    try {
      const response = await productGalleryApi.getAll()
    
      let allGalleries: ProductGallery[] = [];
      if (Array.isArray(response.data)) {
        allGalleries = response.data;
      } else if (response.data?.galleries) {
        allGalleries = response.data.galleries;
      } else if (response.data?.data) {
        allGalleries = response.data.data;
      }
      
      console.log('📸 All galleries:', allGalleries);
      const productGalleries = allGalleries.filter(
        (gallery: ProductGallery) => gallery.product_id === productId
      );
      setGalleryImages(productGalleries);
    } catch (error) {
      console.error('❌ Error loading gallery images:', error);
      setGalleryImages([]);
    }
  };

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
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} không phải là file ảnh`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} vượt quá 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;
    const previews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === validFiles.length) {
          setGalleryPreviews((prev) => [...prev, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setGalleryFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveGalleryPreview = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveGalleryImage = async (imageId: number) => {
    try {
      await productGalleryApi.delete(imageId);
      setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success('Xóa ảnh thành công!');
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast.error('Không thể xóa ảnh');
    }
  };

  const uploadGalleryImages = async (productId: number) => {
    if (galleryFiles.length === 0) return;

    try {
      const formData = new FormData();
      formData.append('product_id', productId.toString());
      galleryFiles.forEach((file) => {
        formData.append('image_url', file);
      });

      await productGalleryApi.create(formData);
      toast.success(`Đã upload ${galleryFiles.length} ảnh gallery!`);
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast.error('Không thể upload ảnh gallery');
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
        const cleanedHtml = formData.meta_description.replace(/<p><\/p>/g, '');
        if (cleanedHtml && cleanedHtml !== '<p></p>') {
          formDataToSend.append('meta_description', cleanedHtml);
        }
      }
      
      if (formData.origin_price) {
        formDataToSend.append('origin_price', formData.origin_price);
      }

      if (imageFile) {
        formDataToSend.append('image_product', imageFile);
      }

      console.log('FormData to send:', {
        name_product: formData.name_product,
        price: formData.price,
        category_id: formData.category_id,
        meta_description_length: formData.meta_description?.length || 0
      });

      let productId: number;

      if (product) {
        await productApi.update(product.id, formDataToSend);
        productId = product.id;
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        const response = await productApi.create(formDataToSend);
        productId = response.data?.product?.id || response.data?.id;
        toast.success('Thêm sản phẩm thành công!');
      }

      if (galleryFiles.length > 0 && productId) {
        await uploadGalleryImages(productId);
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

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'info' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Thông tin
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === 'variants' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('variants')}
            disabled={!product}
          >
            Biến thể {!product && '(Lưu sản phẩm trước)'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {activeTab === 'info' && (
          <div className={styles.formBody}>
            <div className={styles.mainContent}>
              <div className={styles.imagesColumn}>
                <div className={styles.imageSection}>
                  <label className={styles.label}>
                    <MdImage /> Hình ảnh chính
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
                <div className={styles.gallerySection}>
                  <label className={styles.label}>
                    <MdCollections /> Thư viện ảnh
                  </label>
                  <div className={styles.galleryGrid}>
                    {product && galleryImages.map((image) => (
                      <div key={image.id} className={styles.galleryItem}>
                        <img src={image.image_url} alt="Gallery" />
                        <button
                          type="button"
                          className={styles.removeGalleryBtn}
                          onClick={() => handleRemoveGalleryImage(image.id)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    ))}

                    {galleryPreviews.map((preview, index) => (
                      <div key={`preview-${index}`} className={styles.galleryItem}>
                        <img src={preview} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className={styles.removeGalleryBtn}
                          onClick={() => handleRemoveGalleryPreview(index)}
                        >
                          <MdDelete />
                        </button>
                        <span className={styles.newBadge}>Mới</span>
                      </div>
                    ))}

                    <div
                      className={styles.galleryAddBtn}
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      <MdImage />
                      <span>Thêm ảnh</span>
                    </div>
                  </div>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGallerySelect}
                    style={{ display: 'none' }}
                  />
                  <p className={styles.galleryHint}>
                    Có thể chọn nhiều ảnh cùng lúc. PNG, JPG (max. 5MB mỗi ảnh)
                  </p>
                </div>
              </div>

              <div className={styles.fieldsSection}>
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

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdDescription /> Mô tả chi tiết
                </label>
                <RichTextEditor
                  value={formData.meta_description}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, meta_description: value }));
                    if (errors.meta_description) {
                      setErrors((prev) => ({ ...prev, meta_description: '' }));
                    }
                  }}
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                />
              </div>
            </div>
            </div>
          </div>
          )}

          {activeTab === 'variants' && (
            <div className={styles.variantsTab}>
              <ProductVariants 
                productId={product?.id || null} 
                productPrice={parseFloat(formData.price) || 0}
              />
            </div>
          )}

          {activeTab === 'info' && (
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
          )}
        </form>
      </div>
    </div>
  );
}
