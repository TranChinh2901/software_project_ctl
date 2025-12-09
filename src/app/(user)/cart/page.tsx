'use client';

import CartItems from '@/components/user/cart/CartItems';
import CartSummary from '@/components/user/cart/CartSummary';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import { useCart } from '@/contexts/CartContext';
import styles from '@/styles/products/Cart.module.css';

export default function CartPage() {
  const { cart } = useCart();
  const isEmpty = cart.length === 0;

  return (
    <div className={styles.cartPageContainer}>
      <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng' }]} />
      
      {isEmpty ? (
        <CartItems />
      ) : (
        <div className={styles.cartLayout}>
          <div className={styles.cartItemsSection}>
            <CartItems />
          </div>
          <div className={styles.cartSummarySection}>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
