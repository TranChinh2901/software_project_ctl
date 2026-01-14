// 'use client';

// import { Voucher, VoucherType } from '@/types/voucher';
// import styles from '@/styles/homepage/ListVoucher.module.css';
// import toast from 'react-hot-toast';

// interface ListVoucherProps {
//   vouchers: Voucher[];
//   loading?: boolean;
// }

// const ListVoucher = ({ vouchers, loading }: ListVoucherProps) => {
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
//   };

//   const isExpired = (expiryDate: Date | string) => {
//     return new Date(expiryDate) < new Date();
//   };

//   const copyVoucherCode = (code: string) => {
//     navigator.clipboard.writeText(code);
//     toast.success(`Đã sao chép mã: ${code}`);
//   };

//   if (loading) {
//     return (
//       <section className={styles.voucherSection}>
//         <div className={styles.container}>
//           <div className={styles.loading}>Đang tải voucher...</div>
//         </div>
//       </section>
//     );
//   }

//   const activeVouchers = vouchers.filter(
//     (v) => v.status === VoucherType.ACTIVE && !isExpired(v.expiry_date) && v.quantity > 0
//   );
// console.log(vouchers);

//   if (!activeVouchers || activeVouchers.length === 0) {
//     return null;
//   }

//   return (
//     <section className={styles.voucherSection}>
//       <div className={styles.container}>
//         <div className={styles.sectionHeader}>
//           <div className={`${styles.headerLine} ${styles.headerLineLeft}`}></div>
//           <span className={styles.diamond}>◆</span>
//           <h2 className={styles.sectionTitle}>Dành riêng cho bạn</h2>
//           <span className={styles.diamond}>◆</span>
//           <div className={styles.headerLine}></div>
//         </div>

//         <div className={styles.voucherGrid}>
//           {activeVouchers.slice(0, 4).map((voucher) => (
//             <div
//               key={voucher.id}
//               className={`${styles.voucherCard} ${isExpired(voucher.expiry_date) ? styles.voucherExpired : ''}`}
//             >
//               <div className={styles.voucherContent}>
//                 <div className={styles.voucherTop}>
//                   <div className={styles.voucherIcon}>
//                     <svg viewBox="0 0 24 24" fill="currentColor">
//                       <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
//                     </svg>
//                   </div>
//                   <div className={styles.voucherInfo}>
//                     <div className={styles.voucherLabel}>Giảm giá</div>
//                     <div className={styles.voucherDiscount}>
//                       Giảm {voucher.discount_voucher}%
//                     </div>
//                   </div>
//                 </div>
//                 {voucher.min_order_value && voucher.min_order_value > 0 && (
//                   <div className={styles.voucherCondition}>
//                     Cho ĐH từ {formatPrice(voucher.min_order_value)}
//                   </div>
//                 )}
//               </div>
//               <div className={styles.voucherBottom}>
//                 <button
//                   className={styles.voucherBtn}
//                   onClick={() => copyVoucherCode(voucher.code)}
//                 >
//                   Sao chép mã
//                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
//                     <rect x="9" y="3" width="6" height="4" rx="1" />
//                   </svg>
//                 </button>
//                 <div className={styles.voucherCode}>Mã: {voucher.code}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ListVoucher;

'use client';
import styles from '@/styles/homepage/ListVoucher.module.css';

const ListVoucher = () => {
  return (
  //  <div className={styles.listVoucherContainer}>
  //    <h2 className={styles.h2}>
     
  //   </h2>
  //   <p></p>
  //  </div>
  <></>
  )
}

export default ListVoucher
