'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi, momoApi } from '@/lib/api';
import { PaymentMethod } from '@/enums';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import toast from 'react-hot-toast';
import styles from '@/styles/products/Checkout.module.css';

interface ShippingInfo {
  fullname: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  note: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullname: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    note: ''
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thanh toán');
      router.push('/account/login?redirect=/checkout');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullname: user.fullname || '',
        phone: user.phone_number || '',
      }));
    }
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const subtotal = getCartTotal();
  const shippingFee = 0; 
  const total = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!shippingInfo.fullname.trim()) {
      toast.error('Vui lòng nhập họ tên');
      return false;
    }
    if (!shippingInfo.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(shippingInfo.phone)) {
      toast.error('Số điện thoại không hợp lệ');
      return false;
    }
    if (!shippingInfo.address.trim()) {
      toast.error('Vui lòng nhập địa chỉ');
      return false;
    }
    if (!shippingInfo.city.trim()) {
      toast.error('Vui lòng nhập tỉnh/thành phố');
      return false;
    }
    if (!shippingInfo.district.trim()) {
      toast.error('Vui lòng nhập quận/huyện');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const orderData = {
        user_id: user?.id,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          color: item.color
        })),
        shipping_address: {
          fullname: shippingInfo.fullname,
          phone_number: shippingInfo.phone,
          address: shippingInfo.address,
          ward: shippingInfo.ward,
          district: shippingInfo.district,
          city: shippingInfo.city
        },
        payment_method: paymentMethod,
        note: shippingInfo.note
      };

      const orderResponse = await orderApi.create(orderData) as { data?: { id: number }, id?: number };
      const orderId = orderResponse?.data?.id || orderResponse?.id;

      if (!orderId) {
        throw new Error('Không thể tạo đơn hàng');
      }

      if (paymentMethod === PaymentMethod.MOMO) {
        const momoResponse = await momoApi.createPayment({
          order_id: orderId,
          amount: total,
          orderInfo: `Thanh toán đơn hàng #${orderId}`
        });

        console.log('MoMo Response:', momoResponse);

        if (momoResponse && momoResponse.resultCode === 0 && momoResponse.payUrl) {
          localStorage.setItem('pending_order_id', orderId.toString());
          
          toast.success('Đang chuyển đến trang thanh toán MoMo...');
          window.location.href = momoResponse.payUrl;
          return;
        } else {
          throw new Error(momoResponse?.message || 'Lỗi tạo thanh toán MoMo');
        }
      } else {
        clearCart();
        toast.success('Đặt hàng thành công!');
        router.push(`/profile/orders/${orderId}`);
      }
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      toast.error(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }
  if (cart.length === 0) {
    return (
      <div className={styles.checkoutContainer}>
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Thanh toán' }]} />
        <div className={styles.emptyCheckout}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>Giỏ hàng trống</h2>
          <p className={styles.emptyText}>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
          <Link href="/cart" className={styles.backToCartBtn}>
            Quay lại giỏ hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <Breadcrumb items={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Giỏ hàng', href: '/cart' },
        { label: 'Thanh toán' }
      ]} />
      
      <h1 className={styles.checkoutTitle}>Thanh toán</h1>

      <form onSubmit={handleSubmit} className={styles.checkoutLayout}>
        <div className={styles.checkoutForm}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Thông tin giao hàng</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Họ và tên <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={shippingInfo.fullname}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Số điện thoại <span className={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="0901234567"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Tỉnh/Thành phố <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="TP. Đà Năngx"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Quận/Huyện <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  value={shippingInfo.district}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Quận Thanh Khê"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phường/Xã</label>
                <input
                  type="text"
                  name="ward"
                  value={shippingInfo.ward}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Xã, Phường,...."
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>
                  Địa chỉ cụ thể <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Số nhà, tên đường..."
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Ghi chú</label>
                <textarea
                  name="note"
                  value={shippingInfo.note}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Phương thức thanh toán</h2>
            <div className={styles.paymentMethods}>
              <label 
                className={`${styles.paymentOption} ${paymentMethod === PaymentMethod.COD ? styles.active : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PaymentMethod.COD}
                  checked={paymentMethod === PaymentMethod.COD}
                  onChange={() => setPaymentMethod(PaymentMethod.COD)}
                  className={styles.paymentRadio}
                />
                <div className={`${styles.paymentIcon} ${styles.codIcon}`}>
                  COD
                </div>
                <div className={styles.paymentDetails}>
                  <div className={styles.paymentName}>Thanh toán khi nhận hàng (COD)</div>
                  <div className={styles.paymentDesc}>Thanh toán bằng tiền mặt khi nhận hàng</div>
                </div>
              </label>

              <label 
                className={`${styles.paymentOption} ${paymentMethod === PaymentMethod.MOMO ? styles.active : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PaymentMethod.MOMO}
                  checked={paymentMethod === PaymentMethod.MOMO}
                  onChange={() => setPaymentMethod(PaymentMethod.MOMO)}
                  className={styles.paymentRadio}
                />
                <div className={`${styles.paymentIcon} ${styles.momoIcon}`}>
                  MoMo
                </div>
                <div className={styles.paymentDetails}>
                  <div className={styles.paymentName}>Ví điện tử MoMo</div>
                  <div className={styles.paymentDesc}>Thanh toán qua ví MoMo, quét QR code</div>
                </div>
              </label>

              <label 
                className={`${styles.paymentOption} ${paymentMethod === PaymentMethod.VNPAY ? styles.active : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={PaymentMethod.VNPAY}
                  checked={paymentMethod === PaymentMethod.VNPAY}
                  onChange={() => setPaymentMethod(PaymentMethod.VNPAY)}
                  className={styles.paymentRadio}
                />
                <div className={`${styles.paymentIcon} ${styles.vnpayIcon}`}>
                  VNPAY
                </div>
                <div className={styles.paymentDetails}>
                  <div className={styles.paymentName}>Thanh toán VNPay</div>
                  <div className={styles.paymentDesc}>ATM/Visa/MasterCard/QR Pay</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.orderSummary}>
          <h2 className={styles.summaryTitle}>Đơn hàng của bạn</h2>
          
          <div className={styles.summaryItems}>
            {cart.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.summaryItemImage}>
                  {item.product.image_product ? (
                    <Image
                      src={item.product.image_product}
                      alt={item.product.name_product}
                      width={60}
                      height={75}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: 60, height: 75, background: '#f0f0f0' }} />
                  )}
                </div>
                <div className={styles.summaryItemInfo}>
                  <div className={styles.summaryItemName}>{item.product.name_product}</div>
                  <div className={styles.summaryItemVariant}>
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && ' | '}
                    {item.color && `Màu: ${item.color}`}
                    {' x '}{item.quantity}
                  </div>
                  <div className={styles.summaryItemPrice}>
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summaryTotals}>
            <div className={styles.summaryRow}>
              <span>Tạm tính:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Phí vận chuyển:</span>
              <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Tổng cộng:</span>
              <span className={styles.totalAmount}>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.submitBtn} ${paymentMethod === PaymentMethod.MOMO ? styles.submitBtnMomo : ''}`}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner} style={{ width: 20, height: 20 }}></div>
                Đang xử lý...
              </>
            ) : paymentMethod === PaymentMethod.MOMO ? (
              'Thanh toán với MoMo'
            ) : paymentMethod === PaymentMethod.VNPAY ? (
              ' Thanh toán với VNPay'
            ) : (
              ' Đặt hàng (COD)'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
