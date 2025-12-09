'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import styles from '@/styles/products/Cart.module.css';

export default function CartItems() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyIcon}>
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h2 className={styles.emptyTitle}>Giỏ hàng trống</h2>
        <p className={styles.emptyText}>
          Bạn chưa có sản phẩm nào trong giỏ hàng.
          <br />
          Hãy khám phá và thêm sản phẩm yêu thích!
        </p>
        <Link href="/products" className={styles.shopNowBtn}>
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartItemsContainer}>
      <h2 className={styles.cartTitle}>Sản phẩm trong giỏ ({cart.length})</h2>
      
      <div className={styles.cartItems}>
        {cart.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.itemImage}>
              {item.product.image_product ? (
                <Image
                  src={item.product.image_product}
                  alt={item.product.name_product}
                  width={100}
                  height={120}
                  className={styles.productImage}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span>No Image</span>
                </div>
              )}
            </div>

            <div className={styles.itemDetails}>
              <Link href={`/products/${item.product.id}`} className={styles.itemName}>
                {item.product.name_product}
              </Link>
              
              <div className={styles.itemVariants}>
                {item.size && <span className={styles.variantTag}>Size: {item.size}</span>}
                {item.color && <span className={styles.variantTag}>Màu: {item.color}</span>}
              </div>

              <div className={styles.itemPrice}>
                {formatPrice(item.product.price)}
              </div>
            </div>

            <div className={styles.itemQuantity}>
              <button 
                className={styles.quantityBtn}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span className={styles.quantityValue}>{item.quantity}</span>
              <button 
                className={styles.quantityBtn}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div className={styles.itemTotal}>
              {formatPrice(item.product.price * item.quantity)}
            </div>

            <button 
              className={styles.removeBtn}
              onClick={() => removeFromCart(item.id)}
              aria-label="Xóa sản phẩm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
