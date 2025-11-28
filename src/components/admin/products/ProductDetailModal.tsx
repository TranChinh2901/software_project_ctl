'use client';

import { MdClose, MdCategory, MdBrandingWatermark, MdCheckCircle, MdCancel, MdInventory } from 'react-icons/md';
import { Product } from '@/types/product';
import { ProductStatus } from '@/enums/product/product.enum';
import styles from '@/styles/admin/ProductDetailModal.module.css';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  product
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết sản phẩm</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Product Image */}
          {product.image_product && (
            <div className={styles.imageSection}>
              <img 
                src={product.image_product} 
                alt={product.name_product}
                className={styles.productImage}
              />
            </div>
          )}

          {/* Product Info */}
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <span className={styles.label}>ID:</span>
              <span className={styles.value}>#{product.id}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Tên sản phẩm:</span>
              <span className={styles.value}>{product.name_product}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Giá bán:</span>
              <span className={styles.value} style={{ color: '#ff6347', fontWeight: 700 }}>
                {formatPrice(product.price)}
              </span>
            </div>

            {product.origin_price && (
              <div className={styles.infoRow}>
                <span className={styles.label}>Giá gốc:</span>
                <span className={styles.value} style={{ textDecoration: 'line-through', color: '#9ca3af' }}>
                  {formatPrice(product.origin_price)}
                </span>
              </div>
            )}

            {product.discount && product.discount > 0 && (
              <div className={styles.infoRow}>
                <span className={styles.label}>Giảm giá:</span>
                <span className={styles.discountBadge}>-{product.discount}%</span>
              </div>
            )}

            <div className={styles.infoRow}>
              <span className={styles.label}>
                <MdCategory /> Danh mục:
              </span>
              <span className={styles.categoryBadge}>
                {product.category?.name_category || 'N/A'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>
                <MdBrandingWatermark /> Thương hiệu:
              </span>
              <span className={styles.brandBadge}>
                {product.brand?.name_brand || 'N/A'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>
                <MdInventory /> Tồn kho:
              </span>
              <span className={styles.value}>
                {product.stock_quantity || 0} sản phẩm
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Trạng thái:</span>
              <span className={`${styles.statusBadge} ${product.status === ProductStatus.ACTIVE ? styles.statusActive : styles.statusInactive}`}>
                {product.status === ProductStatus.ACTIVE ? (
                  <>
                    <MdCheckCircle /> Đang bán
                  </>
                ) : (
                  <>
                    <MdCancel /> Ngừng bán
                  </>
                )}
              </span>
            </div>

            {product.small_description && (
              <div className={styles.infoRow} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className={styles.label}>Mô tả ngắn:</span>
                <p className={styles.description}>{product.small_description}</p>
              </div>
            )}

            {product.meta_description && (
              <div className={styles.infoRow} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className={styles.label}>Mô tả chi tiết:</span>
                <p className={styles.description}>{product.meta_description}</p>
              </div>
            )}

            <div className={styles.infoRow}>
              <span className={styles.label}>Ngày tạo:</span>
              <span className={styles.value}>{formatDate(product.created_at)}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Cập nhật lần cuối:</span>
              <span className={styles.value}>{formatDate(product.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
