'use client';
import { useState, useEffect } from 'react';
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
  itemsPerPage?: number;
}

const ProductList = ({ 
  products, 
  galleries, 
  categoryName = 'Sản phẩm',
  sortBy,
  onSortChange,
  loading = false,
  itemsPerPage = 6
}: ProductListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length, sortBy]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };
  return (
    <div className={styles.productListContainer}>
      <div className={styles.productListHeader}>
        <div className={styles.headerLeft}>
          <h2 className={styles.categoryTitle}>{categoryName}</h2>
          <span className={styles.productCount}>({products.length} sản phẩm)</span>
        </div>
        
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
        <>
          <div className={styles.productGrid}>
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                gallery={galleries[product.id] || []}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={`${styles.pageBtn} ${styles.pageNavBtn}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>

              {getPageNumbers().map((page, index) => (
                typeof page === 'number' ? (
                  <button
                    key={index}
                    className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className={styles.pageEllipsis}>{page}</span>
                )
              ))}

              <button
                className={`${styles.pageBtn} ${styles.pageNavBtn}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,6 15,12 9,18"></polyline>
                </svg>
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className={styles.pageInfo}>
              Hiển thị {startIndex + 1} - {Math.min(endIndex, products.length)} trong {products.length} sản phẩm
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
