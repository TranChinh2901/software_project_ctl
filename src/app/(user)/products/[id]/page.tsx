'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductGallery } from '@/types/product-gallery';
import { ProductVariant, SizeType } from '@/types/product-variant';
import { productApi, productGalleryApi, productVariantApi } from '@/lib/api';
import styles from '@/styles/products/ProductDetail.module.css';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';

const ProductDetailPage = () => {
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [gallery, setGallery] = useState<ProductGallery[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<SizeType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      
      setLoading(true);
      setError(null);

      try {
        const productRes = await productApi.getById(productId);
        const productData = productRes?.data?.data || productRes?.data;
        
        if (productData) {
          setProduct(productData);
          setSelectedImage(productData.image_product || '');
        }

        const galleryRes = await productGalleryApi.getAll();
        const allGallery = galleryRes?.data?.data || galleryRes?.data || [];
        const productGallery = allGallery.filter(
          (g: ProductGallery) => g.product_id === productId
        );
        setGallery(productGallery);
        const variantsRes = await productVariantApi.getByProduct(productId);
        const variantsData = variantsRes?.data?.data || variantsRes?.data || [];
        setVariants(variantsData);

      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const availableSizes = [...new Set(variants.map(v => v.size).filter((s): s is SizeType => s !== undefined))];
  const availableColors = [...new Set(variants.map(v => v.color?.name_color).filter((c): c is string => c !== undefined))];
  let discountPercent = 0;
  if (product?.discount && product.discount > 0) {
    discountPercent = product.discount;
  } else if (product?.origin_price && product?.price && product.origin_price > product.price) {
    discountPercent = Math.round(((product.origin_price - product.price) / product.origin_price) * 100);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', {
      productId,
      quantity,
      selectedSize,
      selectedColor
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Không tìm thấy sản phẩm</h2>
        <p>{error || 'Sản phẩm không tồn tại hoặc đã bị xóa'}</p>
        <Link href="/products" className={styles.backLink}>
          ← Quay lại trang sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.productDetailContainer}>
         <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sản phẩm' }, { label: product.name_product }]} />

      <div className={styles.productContent}>
        {/* Left - Images */}
        <div className={styles.productImages}>
          <div className={styles.mainImageWrapper}>
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.name_product}
                fill
                className={styles.mainImage}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className={styles.imagePlaceholder}>No Image</div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className={styles.thumbnailGallery}>
            {product.image_product && (
              <div 
                className={`${styles.thumbnail} ${selectedImage === product.image_product ? styles.thumbnailActive : ''}`}
                onClick={() => setSelectedImage(product.image_product!)}
              >
                <Image
                  src={product.image_product}
                  alt="Main"
                  width={80}
                  height={80}
                  className={styles.thumbnailImage}
                />
              </div>
            )}
            {gallery.map((item) => (
              <div 
                key={item.id}
                className={`${styles.thumbnail} ${selectedImage === item.image_url ? styles.thumbnailActive : ''}`}
                onClick={() => setSelectedImage(item.image_url)}
              >
                <Image
                  src={item.image_url}
                  alt={`Gallery ${item.id}`}
                  width={80}
                  height={80}
                  className={styles.thumbnailImage}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>{product.name_product}</h1>

          {/* Price */}
          <div className={styles.priceSection}>
            <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
            {product.origin_price && product.origin_price > product.price && (
              <>
                <span className={styles.originalPrice}>{formatPrice(product.origin_price)}</span>
                {discountPercent > 0 && (
                  <span className={styles.discountBadge}>-{discountPercent}%</span>
                )}
              </>
            )}
          </div>

          {product.small_description && (
            <p className={styles.shortDescription}>{product.small_description}</p>
          )}

          {availableSizes.length > 0 && (
            <div className={styles.optionSection}>
              <h3 className={styles.optionLabel}>Kích thước:</h3>
              <div className={styles.sizeOptions}>
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableColors.length > 0 && (
            <div className={styles.optionSection}>
              <h3 className={styles.optionLabel}>Màu sắc:</h3>
              <div className={styles.colorOptions}>
                {availableColors.map((color) => (
                  <button
                    key={color}
                    className={`${styles.colorBtn} ${selectedColor === color ? styles.colorBtnActive : ''}`}
                    onClick={() => setSelectedColor(color || '')}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.optionSection}>
            <h3 className={styles.optionLabel}>Số lượng:</h3>
            <div className={styles.quantitySelector}>
              <button 
                className={styles.quantityBtn}
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button 
                className={styles.quantityBtn}
                onClick={() => handleQuantityChange('increase')}
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
            <button className={styles.buyNowBtn}>
              Mua ngay
            </button>
          </div>

          {product.meta_description && (
            <div className={styles.metaDescription}>
              <h3>Mô tả sản phẩm</h3>
              <p>{product.meta_description}</p>
            </div>
          )}

          {product.category && (
            <div className={styles.categoryInfo}>
              <span>Danh mục: </span>
              <Link href={`/products?category=${product.category.id}`}>
                {product.category.name_category}
              </Link>
              {product.category.brand && (
                <>
                  <span> | Thương hiệu: </span>
                  <Link href={`/products?brand=${product.category.brand.id}`}>
                    {product.category.brand.name_brand}
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
