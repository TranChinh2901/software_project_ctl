'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductGallery } from '@/types/product-gallery';
import { useWishlist } from '@/contexts/WishlistContext';
import styles from '../../../styles/products/Product.module.css';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  gallery?: ProductGallery[];
}

const ProductCard = ({ product, gallery }: ProductCardProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  
  const colorImages = gallery?.slice(0, 4) || [];
  
  let discountPercent = 0;
  if (product.discount && product.discount > 0) {
    discountPercent = product.discount;
  } else if (product.origin_price && product.price && product.origin_price > product.price) {
    discountPercent = Math.round(((product.origin_price - product.price) / product.origin_price) * 100);
  } 
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (isWishlisted) {
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } else {
      toast.success('Đã thêm vào danh sách yêu thích');
    }
  };
  return (
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
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ''}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isWishlisted ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <Link href={`/products/${product.id}`} className={styles.optionsBtn}>
          Tùy chọn
        </Link>
      </div>
      {colorImages.length > 0 && (
        <div className={styles.colorVariants}>
          {colorImages.map((img, index) => (
            <div key={img.id || index} className={styles.colorVariantImage}>
              <Image
                src={img.image_url}
                alt={`Variant ${index + 1}`}
                width={24}
                height={24}
                className={styles.colorThumbnail}
              />
            </div>
          ))}
        </div>
      )}
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
  );
};

export default ProductCard;
