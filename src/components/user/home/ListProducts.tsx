'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import ProductCard from '@/components/user/products/ProductCard';
import styles from '@/styles/homepage/ListProducts.module.css';

interface ListProductsProps {
  products: Product[];
  loading?: boolean;
}

type TabType = 'new' | 'sale' | 'popular';

const ListProducts = ({ products, loading }: ListProductsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('new');

  const tabs = [
    { key: 'new' as TabType, label: 'Hàng mới về' },
    { key: 'sale' as TabType, label: 'Giá tốt' },
    { key: 'popular' as TabType, label: 'Bán chạy' },
  ];

  const getFilteredProducts = () => {
    if (!products || !Array.isArray(products)) return [];
    
    let filtered = [...products];
    
    switch (activeTab) {
      case 'new':
        filtered = filtered.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
      case 'sale':
        filtered = filtered.filter(p => p.discount && p.discount > 0);
        filtered = filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => (a.stock_quantity || 0) - (b.stock_quantity || 0));
        break;
    }
    
    return filtered.slice(0, 8);
  };

  if (loading) {
    return (
      <section className={styles.productSection}>
        <div className={styles.container}>
          <div className={styles.loading}>Đang tải sản phẩm...</div>
        </div>
      </section>
    );
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <section className={styles.productSection}>
        <div className={styles.container}>
          <div className={styles.emptyState}>Chưa có sản phẩm nào</div>
        </div>
      </section>
    );
  }

  const filteredProducts = getFilteredProducts();

  return (
    <section className={styles.productSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.headerLine} ${styles.headerLineLeft}`}></div>
          <span className={styles.diamond}>◆</span>
          <h2 className={styles.sectionTitle}>Gợi ý hôm nay</h2>
          <span className={styles.diamond}>◆</span>
          <div className={styles.headerLine}></div>
        </div>

        <div className={styles.tabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>

        <div className={styles.viewMoreContainer}>
          <Link href="/products" className={styles.viewMoreBtn}>
            Xem tất cả sản phẩm
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ListProducts;
