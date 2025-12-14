'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductGallery } from '@/types/product-gallery';
import { ProductVariant, SizeType } from '@/types/product-variant';
import { productApi, productGalleryApi, productVariantApi } from '@/lib/api';
import styles from '@/styles/products/ProductDetail.module.css';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import ProductCard from '@/components/user/products/ProductCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';
import SizeGuideModal from './guide/SizeGuideModal';

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart, isAuthenticated } = useCart();
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  

  const [product, setProduct] = useState<Product | null>(null);
  const [gallery, setGallery] = useState<ProductGallery[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SizeType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'policy' | 'reviews'>('description');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const allImages = [
    ...(product?.image_product ? [{ id: 'main', url: product.image_product }] : []),
    ...gallery.map(g => ({ id: g.id.toString(), url: g.image_url }))
  ];

  const selectedImage = allImages[selectedImageIndex]?.url || '';



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

        if (productData?.category?.id) {
          const relatedRes = await productApi.getAll({ category_id: productData.category.id, limit: 100 });
          const relatedData = relatedRes?.data?.data?.products || relatedRes?.data?.products || [];
          setRelatedProducts(relatedData.filter((p: Product) => p.id !== productId));
        }

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
  
  const colorData = variants.reduce((acc, v) => {
    if (v.color && v.color.name_color && !acc.find(c => c.name === v.color?.name_color)) {
      acc.push({
        name: v.color.name_color,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        image: (v.color as any).image_color || null
      });
    }
    return acc;
  }, [] as { name: string; image: string | null }[]);

const handleClick = () => {
  setShowSizeGuide(true);
};
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

  const handleImageNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
    } else {
      setSelectedImageIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    if (!product) return;

    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Vui lòng chọn kích thước');
      return;
    }

    if (colorData.length > 0 && !selectedColor) {
      toast.error('Vui lòng chọn màu sắc');
      return;
    }
    const selectedColorData = colorData.find(c => c.name === selectedColor);
    const colorImage = selectedColorData?.image || undefined;

    addToCart(product, quantity, selectedSize || undefined, selectedColor || undefined, colorImage);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng');
      return;
    }

    if (!product) return;
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Vui lòng chọn kích thước');
      return;
    }

    if (colorData.length > 0 && !selectedColor) {
      toast.error('Vui lòng chọn màu sắc');
      return;
    }
    const selectedColorData = colorData.find(c => c.name === selectedColor);
    const colorImage = selectedColorData?.image || undefined;

    addToCart(product, quantity, selectedSize || undefined, selectedColor || undefined, colorImage);
    router.push('/checkout');
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
      <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sản phẩm', href: '/products' }, { label: product.name_product }]} />

      <div className={styles.productContent}>
        <div className={styles.thumbnailGallery}>
          {allImages.map((img, index) => (
            <div 
              key={img.id}
              className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.thumbnailActive : ''}`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <Image
                src={img.url}
                alt={`Product ${index + 1}`}
                width={85}
                height={105}
                className={styles.thumbnailImage}
              />
            </div>
          ))}
        </div>

        <div className={styles.mainImageSection}>
          <div className={styles.mainImageWrapper}>
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.name_product}
                fill
                className={styles.mainImage}
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            ) : (
              <div className={styles.imagePlaceholder}>No Image</div>
            )}
            
            {allImages.length > 1 && (
              <>
                <button 
                  className={`${styles.imageNavBtn} ${styles.prevBtn}`}
                  onClick={() => handleImageNav('prev')}
                  aria-label="Previous image"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button 
                  className={`${styles.imageNavBtn} ${styles.nextBtn}`}
                  onClick={() => handleImageNav('next')}
                  aria-label="Next image"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </>
            )}
          </div>

          <div className={styles.shareSection}>
            <span className={styles.shareLabel}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Chia sẻ:
            </span>
            <div className={styles.socialIcons}>
              <button className={`${styles.socialIcon} ${styles.facebook}`} aria-label="Share on Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </button>
              <button className={`${styles.socialIcon} ${styles.pinterest}`} aria-label="Share on Pinterest">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </button>
              <button className={`${styles.socialIcon} ${styles.twitter}`} aria-label="Share on Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.productHeader}>
            <h1 className={styles.productName}>{product.name_product}</h1>
            <div className={styles.productStatus}>
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>Tình trạng:</span>
                <span className={styles.statusValue}>Còn hàng</span>
              </div>
              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>Mã SKU:</span>
                <span className={styles.skuValue}>SP{product.id.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </div>

          <div className={styles.priceSection}>
            <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
            {product.origin_price && product.origin_price > product.price && (
              <span className={styles.originalPrice}>{formatPrice(product.origin_price)}</span>
            )}
          </div>

          {product.small_description && (
            <p className={styles.shortDescription}>{product.small_description}</p>
          )}

          {/* Color Options */}
          {colorData.length > 0 && (
            <div className={styles.optionSection}>
              <h3 className={styles.optionLabel}>
                Màu sắc: <span className={styles.optionLabelValue}>{selectedColor || 'Chọn màu'}</span>
              </h3>
              <div className={styles.colorOptions}>
                {colorData.map((color) => (
                  <button
                    key={color.name}
                    className={`${styles.colorBtn} ${selectedColor === color.name ? styles.colorBtnActive : ''}`}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  >
                    {color.image ? (
                      <Image
                        src={color.image}
                        alt={color.name}
                        width={40}
                        height={40}
                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                      />
                    ) : (
                      color.name.substring(0, 2)
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div className={styles.optionSection}>
              <h3 className={styles.optionLabel}>
                Kích thước: <span className={styles.optionLabelValue}>{selectedSize || 'Chọn size'}</span>
              </h3>
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

          <div className={styles.optionSection}>
            <h3 className={styles.optionLabel}>Số lượng:</h3>
            <div className={styles.quantitySection}>
              <div className={styles.quantitySelector}>
                <button 
                  className={styles.quantityBtn}
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button 
                  className={styles.quantityBtn}
                  onClick={() => handleQuantityChange('increase')}
                >
                  +
                </button>
              </div>
              <span className={styles.sizeGuide} onClick={handleClick}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 3H3v18h18V3zM3 9h18M9 21V9"/>
                </svg>
                Hướng dẫn chọn size
              </span>
               {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Thêm vào giỏ
            </button>
            <button 
              className={`${styles.wishlistBtn} ${isWishlisted ? styles.active : ''}`}
              onClick={() => {
                if (product) {
                  toggleWishlist(product);
                  if (isWishlisted) {
                    toast.success('Đã xóa khỏi danh sách yêu thích');
                  } else {
                    toast.success('Đã thêm vào danh sách yêu thích');
                  }
                }
              }}
              aria-label={isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button className={styles.compareBtn} aria-label="Compare">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5"/>
                <path d="M21 3l-7 7"/>
                <path d="M8 21H3v-5"/>
                <path d="M3 21l7-7"/>
              </svg>
            </button>
          </div>

          <button className={styles.buyNowBtn} onClick={handleBuyNow}>
            Mua ngay
          </button>

        
          {/* Shipping Info */}
          <div className={styles.shippingInfo}>
            <div className={styles.shippingItem}>
              <span className={`${styles.shippingIcon} ${styles.delivery}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </span>
              <span className={styles.shippingText}>
                Giao hàng toàn quốc
                <a href="#" className={styles.shippingLink}>Xem chi tiết</a>
              </span>
            </div>
            <div className={styles.shippingItem}>
              <span className={`${styles.shippingIcon} ${styles.freeShip}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 12 20 22 4 22 4 12"/>
                  <rect x="2" y="7" width="20" height="5"/>
                  <line x1="12" y1="22" x2="12" y2="7"/>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                </svg>
              </span>
              <span className={styles.shippingText}>Miễn phí vận chuyển cho đơn hàng từ 500K</span>
            </div>
            <div className={styles.shippingItem}>
              <span className={`${styles.shippingIcon} ${styles.return}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
              </span>
              <span className={styles.shippingText}>Đổi trả miễn phí trong 30 ngày</span>
            </div>
            <div className={styles.shippingItem}>
              <span className={`${styles.shippingIcon} ${styles.support}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <span className={styles.shippingText}>Hỗ trợ 24/7: 1900 xxxx</span>
            </div>
          </div>

        </div>
      </div>
      <div className={styles.productTabsSection}>
        <div className={styles.tabsHeader}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'description' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Thông tin sản phẩm
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'policy' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('policy')}
          >
            Chính sách đổi trả
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Đánh giá sản phẩm
          </button>
        </div>

        <div className={styles.tabContent}>
          <div className={`${styles.tabPane} ${activeTab === 'description' ? styles.tabPaneActive : ''}`}>
            <div className={styles.productDescription}>
              <h3>{product.name_product}</h3>
              <div className={styles.descriptionWrapper}>
                <div className={`${styles.descriptionContent} ${isDescriptionExpanded ? styles.expanded : styles.collapsed}`}>
                  {product.meta_description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.meta_description.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <p>Chưa có mô tả chi tiết cho sản phẩm này.</p>
                  )}
                  {product.small_description && (
                    <p><strong>Mô tả ngắn:</strong> {product.small_description}</p>
                  )}
                </div>
                {!isDescriptionExpanded && (product.meta_description?.length || 0) > 300 && (
                  <div className={styles.descriptionGradient}></div>
                )}
                {(product.meta_description?.length || 0) > 300 && (
                  <button 
                    className={`${styles.showMoreBtn} ${isDescriptionExpanded ? styles.expanded : ''}`}
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  >
                    {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Policy Tab */}
          <div className={`${styles.tabPane} ${activeTab === 'policy' ? styles.tabPaneActive : ''}`}>
            <div className={styles.returnPolicy}>
              <h2 className={styles.policyTitle}>CHÍNH SÁCH ĐỔI TRẢ CỦA SHOP</h2>
              <p className={styles.policyIntro}>
                Shop cam kết mang đến cho khách hàng những sản phẩm chất lượng và dịch vụ tuyệt vời. 
                Nếu bạn gặp phải bất kỳ vấn đề gì về sản phẩm sau khi nhận hàng, chúng tôi sẽ hỗ trợ bạn 
                trong việc đổi trả theo chính sách dưới đây:
              </p>

              <h3>1. Điều kiện đổi trả</h3>
              <p>Để được đổi trả sản phẩm, quý khách cần đảm bảo các điều kiện sau:</p>
              <ul>
                <li>Sản phẩm còn nguyên tem, mác, chưa qua sử dụng và không có dấu hiệu đã được giặt, là, hay thay đổi trạng thái ban đầu.</li>
                <li>Sản phẩm không thuộc danh mục không được đổi trả (ví dụ: sản phẩm giảm giá, đồ lót, phụ kiện đã mở hộp, sản phẩm bị hư hỏng do lỗi của khách hàng).</li>
                <li>Đơn hàng được yêu cầu đổi trả trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng.</li>
              </ul>

              <h3>2. Quy trình đổi trả</h3>
              <p>Để tiến hành đổi trả sản phẩm, vui lòng thực hiện các bước sau:</p>
              <ul>
                <li><strong>Bước 1:</strong> Liên hệ với bộ phận Chăm sóc khách hàng qua tổng đài miễn phí <strong>1800 6061 (nhánh 1)</strong> hoặc gửi email về địa chỉ hỗ trợ (sẽ có trong phần hỗ trợ khách hàng của website).</li>
                <li><strong>Bước 2:</strong> Cung cấp thông tin về đơn hàng (mã đơn hàng, sản phẩm cần đổi trả, lý do đổi trả).</li>
                <li><strong>Bước 3:</strong> Chờ bộ phận chăm sóc khách hàng xác nhận yêu cầu của bạn và cung cấp hướng dẫn cụ thể.</li>
                <li><strong>Bước 4:</strong> Đóng gói sản phẩm (bao gồm tem, mác, hóa đơn) và gửi về địa chỉ do Shop cung cấp.</li>
                <li><strong>Bước 5:</strong> Sau khi Shop nhận lại sản phẩm, chúng tôi sẽ kiểm tra tình trạng sản phẩm và tiến hành đổi trả hoặc hoàn tiền nếu đủ điều kiện.</li>
              </ul>

              <h3>3. Chi phí vận chuyển đổi trả</h3>
              <ul>
                <li><strong>Miễn phí đổi trả:</strong> Trong trường hợp sản phẩm bị lỗi do nhà sản xuất hoặc Shop giao sai sản phẩm, chi phí vận chuyển sẽ được Shop chịu.</li>
                <li><strong>Khách hàng chịu chi phí:</strong> Nếu khách hàng muốn đổi trả vì lý do cá nhân (không liên quan đến lỗi sản phẩm, không hài lòng về màu mã, kích cỡ, v.v.), khách hàng sẽ chịu phí vận chuyển đổi trả.</li>
              </ul>

              <h3>4. Đổi sản phẩm</h3>
              <p>
                Quý khách có thể yêu cầu đổi sản phẩm với cùng loại hoặc sản phẩm khác có giá trị tương đương. 
                Nếu sản phẩm đổi có giá trị cao hơn, quý khách sẽ thanh toán phần chênh lệch.
              </p>
              <p>Trường hợp sản phẩm muốn đổi không còn hàng, Shop sẽ hoàn lại số tiền cho quý khách.</p>

              <h3>5. Hoàn tiền</h3>
              <p>
                Shop sẽ hoàn tiền cho khách hàng qua phương thức thanh toán ban đầu trong trường hợp sản phẩm 
                không đáp ứng yêu cầu và khách hàng không muốn đổi sản phẩm khác.
              </p>
              <p>
                Thời gian hoàn tiền sẽ được thực hiện trong vòng <strong>7-10 ngày làm việc</strong> kể từ khi 
                Shop nhận lại sản phẩm và xác nhận đủ điều kiện hoàn trả.
              </p>

              <h3>6. Sản phẩm không áp dụng chính sách đổi trả</h3>
              <p>Shop không chấp nhận đổi trả đối với các sản phẩm sau:</p>
              <ul>
                <li>Sản phẩm đã qua sử dụng hoặc không còn nguyên trạng (đã bị giặt, thay đổi kích cỡ, chất lượng).</li>
                <li>Sản phẩm giảm giá hoặc khuyến mãi đặc biệt (trừ khi có lỗi từ nhà sản xuất).</li>
                <li>Sản phẩm thuộc danh mục không thể đổi trả theo quy định của công ty.</li>
              </ul>

              <p className={styles.policyNote}>
                Chúng tôi hy vọng rằng chính sách đổi trả của Shop sẽ mang đến cho quý khách hàng sự an tâm khi mua sắm 
                tại hệ thống của chúng tôi. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận Chăm sóc khách hàng 
                để được hỗ trợ nhanh chóng và chính xác nhất.
              </p>
            </div>
          </div>

          {/* Reviews Tab */}
          <div className={`${styles.tabPane} ${activeTab === 'reviews' ? styles.tabPaneActive : ''}`}>
            <div className={styles.reviewsTab}>
              <h3>Đánh giá từ khách hàng</h3>
              <div className={styles.noReviews}>
                <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                <button className={styles.writeReviewBtn}>Viết đánh giá đầu tiên</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Sản phẩm liên quan</h2>
          <div className={styles.relatedProducts}>
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
