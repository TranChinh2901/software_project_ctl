'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import styles from '@/styles/products/Cart.module.css';

export default function CartSummary() {
  const router = useRouter();
  const { cart, getCartTotal, getCartCount } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const subtotal = getCartTotal();
  const shipping = 0; 
  const total = subtotal + shipping;
  const itemCount = getCartCount();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className={styles.cartSummary}>
      <h2 className={styles.summaryTitle}>Tổng đơn hàng</h2>
      
      <div className={styles.summaryDetails}>
        <div className={styles.summaryRow}>
          <span>Số lượng sản phẩm:</span>
          <span>{itemCount}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Tạm tính:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Phí vận chuyển:</span>
          <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
        </div>
        
        <div className={styles.summaryTotal}>
          <span>Tổng cộng:</span>
          <span className={styles.totalPrice}>{formatPrice(total)}</span>
        </div>
      </div>

      <div className={styles.summaryActions}>
        <button 
          className={styles.checkoutBtn}
          onClick={handleCheckout}
        >
          Tiến hành thanh toán
        </button>
        <Link href="/products" className={styles.continueBtn}>
          Tiếp tục mua hàng
        </Link>
      </div>
    </div>
  );
}
