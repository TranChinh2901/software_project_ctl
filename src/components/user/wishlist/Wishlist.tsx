'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import styles from '@/styles/products/Product.module.css';
import wishlistStyles from '@/styles/products/Wishlist.module.css';
import toast from 'react-hot-toast';
import { Product } from '@/types/product';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';

const WishlistCard = ({ product, onRemove }: { product: Product; onRemove: () => void }) => {
  let discountPercent = 0;
  if (product.discount && product.discount > 0) {
    discountPercent = product.discount;
  } else if (product.origin_price && product.price && product.origin_price > product.price) {
    discountPercent = Math.round(((product.origin_price - product.price) / product.origin_price) * 100);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove();
  };

  return (
   <div>
     <div className={styles.productCard}>
        
      <div className={styles.productImageContainer}>
        <Link href={`/products/${product.id}`} className={styles.productLink}>
          <div className={styles.productImageWrapper}>
            {product.image_product ? (
              <Image
                src={product.image_product}
                alt={product.name_product}
                fill
                className={styles.productImage}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className={styles.productImagePlaceholder}>
                <span>No Image</span>
              </div>
            )}
          </div>
        </Link>
        
        {discountPercent > 0 && (
          <span className={styles.discountBadge}>
            -{discountPercent}%
          </span>
        )}
        
        <button 
          className={`${styles.wishlistBtn} ${styles.wishlisted}`}
          onClick={handleRemoveClick}
          aria-label="Xóa khỏi yêu thích"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <Link href={`/products/${product.id}`} className={styles.optionsBtn}>
          Tùy chọn
        </Link>
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>
          <Link href={`/products/${product.id}`}>
            {product.name_product}
          </Link>
        </h3>
        
        <div className={styles.priceWrapper}>
          <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
          {product.origin_price && product.origin_price > product.price && (
            <span className={styles.originalPrice}>{formatPrice(product.origin_price)}</span>
          )}
        </div>
      </div>
    </div>
   </div>
  );
};

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const handleRemove = (productId: number, productName: string) => {
    removeFromWishlist(productId);
    toast.success(`Đã xóa "${productName}" khỏi danh sách yêu thích`);
  };

  const handleClearAll = () => {
    if (wishlist.length === 0) return;
    clearWishlist();
    toast.success('Đã xóa tất cả sản phẩm khỏi danh sách yêu thích');
  };

  if (wishlist.length === 0) {
    return (
      <div className={wishlistStyles.wishlistContainer}>
           <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Yêu thích' }]} />
      
        <div className={wishlistStyles.emptyState}>
          <div className={wishlistStyles.emptyIcon}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          
          <h2 className={wishlistStyles.emptyTitle}>Danh sách yêu thích trống</h2>
          <p className={wishlistStyles.emptyText}>
            Bạn chưa có sản phẩm nào trong danh sách yêu thích.
            <br />
            Hãy khám phá và thêm những sản phẩm bạn yêu thích!
          </p>
          <Link href="/products" className={wishlistStyles.shopNowBtn}>
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={wishlistStyles.wishlistContainer}>
         <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Yêu thích' }]} />
      <div className={wishlistStyles.header}>
        <h1 className={wishlistStyles.title}>
          Danh sách yêu thích 
          <span className={wishlistStyles.count}>({wishlist.length} sản phẩm)</span>
        </h1>
        <button className={wishlistStyles.clearAllBtn} onClick={handleClearAll}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Xóa tất cả
        </button>
      </div>

      <div className={wishlistStyles.wishlistGrid}>
        {wishlist.map((product) => (
          <WishlistCard
            key={product.id}
            product={product}
            onRemove={() => handleRemove(product.id, product.name_product)}
          />
        ))}
      </div>

      <div className={wishlistStyles.bottomActions}>
        <Link href="/products" className={wishlistStyles.continueShoppingBtn}>
          ← Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
