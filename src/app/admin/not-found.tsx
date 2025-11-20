'use client';

import Link from 'next/link';
import { 
  MdHome, 
  MdArrowBack,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdSettings,
  MdSearch,
  MdDescription,
  MdHelp
} from 'react-icons/md';
import Button from '@/components/admin/Button';
import styles from '@/styles/admin/NotFound.module.css';

export default function AdminNotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <div className={styles.icon404}>404</div>
          <div className={styles.iconDecoration}>
            <MdDescription className={styles.decorItem} />
            <MdSearch className={styles.decorItem} />
            <MdHelp className={styles.decorItem} />
          </div>
        </div>

        <h1 className={styles.title}>Không tìm thấy trang</h1>
        <p className={styles.description}>
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          <br />
          Vui lòng kiểm tra lại URL hoặc quay về trang chủ.
        </p>

        <div className={styles.actions}>
          <Link href="/admin">
            <Button variant="primary" size="lg" icon={<MdHome />}>
              Về trang Dashboard
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            size="lg" 
            icon={<MdArrowBack />}
            onClick={() => window.history.back()}
          >
            Quay lại
          </Button>
        </div>

        <div className={styles.suggestions}>
          <p className={styles.suggestionsTitle}>Có thể bạn đang tìm:</p>
          <div className={styles.suggestionsList}>
            <Link href="/admin/products" className={styles.suggestionItem}>
              <MdInventory className={styles.suggestionIcon} />
              <span>Quản lý sản phẩm</span>
            </Link>
            <Link href="/admin/orders" className={styles.suggestionItem}>
              <MdShoppingCart className={styles.suggestionIcon} />
              <span>Quản lý đơn hàng</span>
            </Link>
            <Link href="/admin/users" className={styles.suggestionItem}>
              <MdPeople className={styles.suggestionIcon} />
              <span>Quản lý người dùng</span>
            </Link>
            <Link href="/admin/settings" className={styles.suggestionItem}>
              <MdSettings className={styles.suggestionIcon} />
              <span>Cài đặt hệ thống</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
