'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { momoApi } from '@/lib/api';
import styles from '@/styles/products/Checkout.module.css';

function MomoReturnContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const hasCleared = useRef(false);
  const hasVerified = useRef(false);
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  // Gọi API verify payment khi redirect từ MoMo
  useEffect(() => {
    const verifyPayment = async () => {
      if (hasVerified.current) return;
      
      const resultCode = searchParams.get('resultCode');
      const momoOrderId = searchParams.get('orderId');
      const transId = searchParams.get('transId');
      const amountParam = searchParams.get('amount');
      const extraData = searchParams.get('extraData');
      
      // Chỉ verify khi thanh toán thành công và đã đăng nhập
      if (resultCode === '0' && isAuthenticated && momoOrderId) {
        hasVerified.current = true;
        
        try {
          console.log('Verifying MoMo payment...');
          await momoApi.verifyPayment({
            orderId: momoOrderId,
            resultCode: parseInt(resultCode),
            transId: transId || undefined,
            amount: amountParam ? parseInt(amountParam) : undefined,
            extraData: extraData || undefined
          });
          console.log('Payment verified successfully');
        } catch (error) {
          console.error('Error verifying payment:', error);
          // Không hiển thị lỗi cho user vì payment đã thành công ở MoMo
        }
      }
    };

    verifyPayment();
  }, [searchParams, isAuthenticated]);

  // Xử lý clear cart khi thanh toán thành công
  useEffect(() => {
    const resultCode = searchParams.get('resultCode');
    const successParam = searchParams.get('success');
    const isSuccess = resultCode === '0' || successParam === 'true';
    
    // Chỉ clear cart 1 lần khi thành công và có user
    if (isSuccess && user?.id && !hasCleared.current) {
      hasCleared.current = true;
      
      // Xóa trực tiếp localStorage cart của user
      localStorage.removeItem(`cart_user_${user.id}`);
      
      // Clear cart context
      clearCart();
      
      // Xóa pending order id
      localStorage.removeItem('pending_order_id');
    }
  }, [searchParams, clearCart, user]);

  useEffect(() => {
    // MoMo sẽ redirect với các params này
    const resultCode = searchParams.get('resultCode');
    const momoMessage = searchParams.get('message');
    const extraData = searchParams.get('extraData');
    const transId = searchParams.get('transId');
    const amountParam = searchParams.get('amount');
    
    // Fallback từ backend redirect
    const successParam = searchParams.get('success');
    const orderIdParam = searchParams.get('order_id');
    
    // Lấy orderId từ localStorage nếu không có
    const storedOrderId = localStorage.getItem('pending_order_id');
    
    // Parse extraData để lấy order_id gốc
    let orderIdFromExtra: string | null = null;
    if (extraData) {
      try {
        const decoded = JSON.parse(atob(extraData));
        orderIdFromExtra = decoded.order_id?.toString();
      } catch (e) {
        console.error('Error parsing extraData:', e);
      }
    }
    
    // Set order ID (ưu tiên: extraData > param > localStorage)
    setOrderId(orderIdFromExtra || orderIdParam || storedOrderId);
    setTransactionId(transId);
    setAmount(amountParam);
    
    // Xác định trạng thái thanh toán
    // resultCode = 0 là thành công (từ MoMo direct)
    // success = 'true' là từ backend redirect
    if (resultCode === '0' || successParam === 'true') {
      setStatus('success');
      setMessage(momoMessage || 'Thanh toán thành công');
    } else {
      setStatus('failed');
      setMessage(momoMessage || searchParams.get('message') || 'Thanh toán thất bại hoặc bị hủy');
    }
  }, [searchParams]);

  const formatPrice = (price: string | null) => {
    if (!price) return '---';
    return new Intl.NumberFormat('vi-VN').format(Number(price)) + 'đ';
  };

  const formatDate = () => {
    return new Date().toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading') {
    return (
      <div className={styles.returnContainer}>
        <div className={styles.resultCard}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang xử lý kết quả thanh toán...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.returnContainer}>
      <div className={styles.resultCard}>
        {status === 'success' ? (
          <>
            <div className={`${styles.resultIcon} ${styles.resultIconSuccess}`}>
              ✓
            </div>
            <h1 className={`${styles.resultTitle} ${styles.resultTitleSuccess}`}>
              Thanh toán thành công!
            </h1>
            <p className={styles.resultMessage}>
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
            </p>
          </>
        ) : (
          <>
            <div className={`${styles.resultIcon} ${styles.resultIconFailed}`}>
              ✕
            </div>
            <h1 className={`${styles.resultTitle} ${styles.resultTitleFailed}`}>
              Thanh toán thất bại
            </h1>
            <p className={styles.resultMessage}>
              {message || 'Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}
            </p>
          </>
        )}

        <div className={styles.resultDetails}>
          {orderId && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Mã đơn hàng:</span>
              <span className={styles.detailValue}>#{orderId}</span>
            </div>
          )}
          {transactionId && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Mã giao dịch MoMo:</span>
              <span className={styles.detailValue}>{transactionId}</span>
            </div>
          )}
          {amount && status === 'success' && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Số tiền:</span>
              <span className={styles.detailValue}>{formatPrice(amount)}</span>
            </div>
          )}
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Phương thức:</span>
            <span className={styles.detailValue}>Ví MoMo</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Thời gian:</span>
            <span className={styles.detailValue}>{formatDate()}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Trạng thái:</span>
            <span className={styles.detailValue}>
              {status === 'success' ? '✅ Đã thanh toán' : '❌ Chưa thanh toán'}
            </span>
          </div>
        </div>

        <div className={styles.resultActions}>
          {status === 'success' ? (
            <>
              {orderId && (
                <Link href={`/profile/orders/${orderId}`} className={styles.viewOrderBtn}>
                  Xem đơn hàng
                </Link>
              )}
              <Link href="/products" className={styles.continueBtn}>
                Tiếp tục mua sắm
              </Link>
            </>
          ) : (
            <>
              <Link href="/checkout" className={styles.viewOrderBtn}>
                Thử lại
              </Link>
              <Link href="/cart" className={styles.continueBtn}>
                Quay lại giỏ hàng
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MomoReturnPage() {
  return (
    <Suspense fallback={
      <div className={styles.returnContainer}>
        <div className={styles.resultCard}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang tải...</p>
          </div>
        </div>
      </div>
    }>
      <MomoReturnContent />
    </Suspense>
  );
}
