'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '@/types';
import styles from '@/styles/homepage/ListBrand.module.css';

interface ListBrandProps {
  brands: Brand[];
  loading?: boolean;
}
  
const ListBrand = ({ brands, loading }: ListBrandProps) => {
  if (loading) {
    return (
      <section className={styles.brandSection}>
        <div className={styles.container}>
          <div className={styles.loading}>Đang tải thương hiệu...</div>
        </div>
      </section>
    );
  }

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className={styles.brandSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Thương hiệu nổi bật</h2>
        </div>

        <div className={styles.brandGrid}>
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.id}`}
              className={styles.brandCard}
            >
              <div className={styles.brandImageWrapper}>
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={brand.name_brand}
                    width={110}
                    height={110}
                    className={styles.brandImage}
                  />
                ) : (
                  <div className={styles.brandImagePlaceholder}>
                    {brand.name_brand.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className={styles.brandName}>{brand.name_brand}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListBrand;