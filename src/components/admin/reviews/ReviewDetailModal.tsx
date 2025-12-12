'use client';

import { Review } from '@/types/review';
import { MdClose, MdStar, MdStarBorder, MdCheckCircle, MdDelete } from 'react-icons/md';
import styles from '@/styles/admin/Reviews.module.css';

interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  onApprove: () => void;
  onDelete: () => void;
}

export default function ReviewDetailModal({ review, onClose, onApprove, onDelete }: ReviewDetailModalProps) {
  const renderStars = (rating: number) => {
    return (
      <div className={styles.starsLarge}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={styles.starLarge}>
            {star <= rating ? <MdStar /> : <MdStarBorder />}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Chi tiết đánh giá #{review.id}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <MdClose />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.section}>
            <h3>Thông tin người đánh giá</h3>
            <div className={styles.userDetail}>
              <div className={styles.userAvatarLarge}>
                {review.user?.fullname?.charAt(0) || review.user?.username?.charAt(0) || 'U'}
              </div>
              <div>
                <p className={styles.userName}>
                  {review.user?.fullname || review.user?.username || 'Anonymous'}
                </p>
                <p className={styles.userEmail}>{review.user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Sản phẩm</h3>
            <p className={styles.productName}>
              {review.product?.name_product || `Product #${review.product_id}`}
            </p>
          </div>

          <div className={styles.section}>
            <h3>Đánh giá</h3>
            {renderStars(review.rating)}
            <p className={styles.ratingText}>{review.rating}/5 sao</p>
          </div>

          <div className={styles.section}>
            <h3>Nội dung</h3>
            <p className={styles.commentDetail}>{review.comment}</p>
          </div>

          <div className={styles.section}>
            <h3>Trạng thái</h3>
            {review.is_approved ? (
              <span className={styles.approvedBadgeLarge}>
                <MdCheckCircle /> Đã duyệt
              </span>
            ) : (
              <span className={styles.pendingBadgeLarge}>
                Chờ duyệt
              </span>
            )}
          </div>

          <div className={styles.section}>
            <h3>Thời gian</h3>
            <div className={styles.dateInfo}>
              <p><strong>Tạo lúc:</strong> {new Date(review.created_at).toLocaleString('vi-VN')}</p>
              {review.updated_at && (
                <p><strong>Cập nhật:</strong> {new Date(review.updated_at).toLocaleString('vi-VN')}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.closeBtn}>
            Đóng
          </button>
          {!review.is_approved && (
            <button onClick={onApprove} className={styles.approveBtnModal}>
              <MdCheckCircle /> Duyệt đánh giá
            </button>
          )}
          <button onClick={onDelete} className={styles.deleteBtnModal}>
            <MdDelete /> Xóa đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}
