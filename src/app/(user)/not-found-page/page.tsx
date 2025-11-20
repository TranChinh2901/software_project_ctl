// import Link from 'next/link';
// import styles from './not-found.module.css';
// import Breadcrumb from '@/components/breadcrumb/breadcrumb';

// export default function NotFoundPage() {
//   return (
//     <div className={styles.container}>
//       <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Không tìm thấy trang' }]} />
      
//       <div className={styles.content}>
//         <div className={styles.errorCode}>404</div>
//         <h1 className={styles.title}>Không tìm thấy trang</h1>
//         <p className={styles.description}>
//           Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
//         </p>
        
//         <Link href="/" className={styles.homeButton}>
//           <svg 
//             className={styles.icon} 
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path 
//               strokeLinecap="round" 
//               strokeLinejoin="round" 
//               strokeWidth={2} 
//               d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
//             />
//           </svg>
//           Quay lại trang chủ
//         </Link>
//       </div>
//     </div>
//   );
// }

import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import Link from 'next/link';
import styles from './notfound.module.css';
  
export default function NotFoundPage() {
  return (
    <div className={styles.containerNotfound}>
      <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'not-found' }]} />
      <div className={styles.notFoundContent} >
        <h1 >404</h1>
        <Link style={{color: '#FF6347', marginTop: '15px'}} href="/">Quay lại trang chủ</Link>  
      </div>
    </div>
  );
}