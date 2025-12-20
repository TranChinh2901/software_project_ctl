'use client';

// import { VoucherType } from '@/modules/orders/enum/order.enum';
import styles from '@/styles/homepage/ListVoucher.module.css';
import { VoucherType } from '@/types/voucher';
import toast from 'react-hot-toast';

interface Voucher {
  id: number;
  code: string;
  discount_voucher: number;
  expiry_date: string;
  status: VoucherType;
  min_order_value?: number;
  quantity: number;
}

interface Props {
  vouchers: Voucher[];
  loading?: boolean;
}

const ListVoucher = ({ vouchers, loading }: Props) => {
  const isExpired = (date: string) => new Date(date) < new Date();

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value) + 'đ';

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã ${code}`);
  };

  if (loading) return <p>Đang tải voucher...</p>;

  const activeVouchers = vouchers.filter(
    (v) =>
      v.status === VoucherType.ACTIVE &&
      v.quantity > 0 &&
      !isExpired(v.expiry_date)
  );

  if (activeVouchers.length === 0) return null;

  return (
    <section className={styles.listVoucherContainer}>
      <h2 className={styles.h2}>DÀNH RIÊNG CHO BẠN</h2>

      <div className={styles.voucherGrid}>
        {activeVouchers.slice(0, 4).map((v) => (
          <div key={v.id} className={styles.voucherCard}>
            <div className={styles.voucherTop}>
              <span className={styles.discount}>
                Giảm {v.discount_voucher}
                {v.discount_voucher <= 100 ? '%' : 'đ'}
              </span>
            </div>

            {v.min_order_value && (
              <p className={styles.condition}>
                Đơn tối thiểu {formatPrice(v.min_order_value)}
              </p>
            )}

            <div className={styles.voucherBottom}>
              <span className={styles.code}>Mã: {v.code}</span>
              <button
                className={styles.copyBtn}
                onClick={() => copyCode(v.code)}
              >
                Sao chép
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ListVoucher;
