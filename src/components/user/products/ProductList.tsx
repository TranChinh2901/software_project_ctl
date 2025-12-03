'use client';
import { Product } from '@/types/product';
import { ProductGallery } from '@/types/product-gallery';
import ProductCard from './ProductCard';
import styles from '../../../styles/products/Product.module.css';

interface ProductListProps {
  products: Product[];
  galleries: Record<number, ProductGallery[]>;
  categoryName?: string;
  sortBy: string;
  onSortChange: (value: string) => void;
  loading?: boolean;
}

const ProductList = ({ 
  products, 
  galleries, 
  categoryName = 'Sản phẩm',
  sortBy,
  onSortChange,
  loading = false
}: ProductListProps) => {
  return (
    <div className={styles.productListContainer}>
      {/* Header */}
      <div className={styles.productListHeader}>
        <h2 className={styles.categoryTitle}>{categoryName}</h2>
        
        <div className={styles.sortWrapper}>
          <label htmlFor="sortSelect" className={styles.sortLabel}>Sắp xếp theo</label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="default">Mặc định</option>
            <option value="price_asc">Giá: Thấp đến cao</option>
            <option value="price_desc">Giá: Cao đến thấp</option>
            <option value="name_asc">Tên: A-Z</option>
            <option value="name_desc">Tên: Z-A</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className={styles.loadingGrid}>
          {[...Array(8)].map((_, index) => (
            <div key={index} className={styles.productCardSkeleton}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonPrice}></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className={styles.emptyProducts}>
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              gallery={galleries[product.id] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
