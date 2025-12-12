'use client';

import { useState, useEffect } from 'react';
import { 
  MdStar,
  MdStarBorder,
  MdDelete,
  MdCheckCircle,
  MdRefresh,
  MdVisibility,
} from 'react-icons/md';
import { reviewApi } from '@/lib/api';
import { Review } from '@/types/review';
import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';
import styles from '@/styles/admin/Reviews.module.css';
import toast from 'react-hot-toast';
import ReviewDetailModal from './ReviewDetailModal';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterApproved, setFilterApproved] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {};
      if (filterRating !== 'all') params.rating = parseInt(filterRating);
      if (filterApproved !== 'all') params.is_approved = filterApproved === 'approved';
      if (searchQuery) params.search = searchQuery;

      const response = await reviewApi.getAll(params);
      const reviewsData = Array.isArray(response.data) ? response.data : response.data?.reviews || [];
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Không thể tải danh sách đánh giá');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filterRating, filterApproved]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchReviews();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleViewDetail = (review: Review) => {
    setSelectedReview(review);
    setDetailModalOpen(true);
  };

  const handleApprove = async (reviewId: number) => {
    try {
      await reviewApi.approve(reviewId);
      toast.success('Đã duyệt đánh giá thành công');
      fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Không thể duyệt đánh giá');
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;

    try {
      await reviewApi.delete(reviewId);
      toast.success('Đã xóa đánh giá thành công');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Không thể xóa đánh giá');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={styles.star}>
            {star <= rating ? <MdStar /> : <MdStarBorder />}
          </span>
        ))}
      </div>
    );
  };

  const calculateStats = () => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.is_approved).length;
    const pending = reviews.filter(r => !r.is_approved).length;
    const avgRating = total > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : '0.0';

    return { total, approved, pending, avgRating };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <PageContainer title="Quản lý đánh giá">
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Quản lý đánh giá">
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Tổng đánh giá</p>
              <h3 className={styles.statValue}>{stats.total}</h3>
            </div>
            <div className={styles.statIcon}>
              <MdStar />
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Đã duyệt</p>
              <h3 className={styles.statValue}>{stats.approved}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.iconApproved}`}>
              <MdCheckCircle />
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Chờ duyệt</p>
              <h3 className={styles.statValue}>{stats.pending}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.iconPending}`}>
              <MdStar />
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Đánh giá TB</p>
              <h3 className={styles.statValue}>{stats.avgRating} ⭐</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.iconRating}`}>
              <MdStar />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <label>Đánh giá:</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả</option>
              <option value="5">5 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="1">1 ⭐</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Trạng thái:</label>
            <select
              value={filterApproved}
              onChange={(e) => setFilterApproved(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả</option>
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>

          <div className={styles.searchGroup}>
            <input
              type="text"
              placeholder="Tìm kiếm theo sản phẩm, người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <Button onClick={fetchReviews} variant="secondary">
            <MdRefresh /> Làm mới
          </Button>
        </div>
      </Card>
      <div className={styles.reviewsList}>
        {reviews.length === 0 ? (
          <Card>
            <div className={styles.emptyState}>
              <MdStar className={styles.emptyIcon} />
              <p>Không có đánh giá nào</p>
            </div>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewUser}>
                  <div className={styles.userAvatar}>
                    {review.user?.fullname?.charAt(0) || review.user?.username?.charAt(0) || 'U'}
                  </div>
                  <div className={styles.userInfo}>
                    <h4>{review.user?.fullname || review.user?.username || 'Anonymous'}</h4>
                    <p className={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className={styles.reviewStatus}>
                  {review.is_approved ? (
                    <span className={styles.approvedBadge}>
                      <MdCheckCircle /> Đã duyệt
                    </span>
                  ) : (
                    <span className={styles.pendingBadge}>
                      Chờ duyệt
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.reviewBody}>
                <div className={styles.reviewProduct}>
                  <strong>Sản phẩm:</strong> {review.product?.name_product || `Product #${review.product_id}`}
                </div>
                {renderStars(review.rating)}
                <p className={styles.reviewComment}>{review.comment}</p>
              </div>

              <div className={styles.reviewActions}>
                <button
                  onClick={() => handleViewDetail(review)}
                  className={`${styles.actionBtn} ${styles.viewBtn}`}
                >
                  <MdVisibility /> Chi tiết
                </button>
                {!review.is_approved && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    className={`${styles.actionBtn} ${styles.approveBtn}`}
                  >
                    <MdCheckCircle /> Duyệt
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                >
                  <MdDelete /> Xóa
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {detailModalOpen && selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedReview(null);
          }}
          onApprove={() => {
            handleApprove(selectedReview.id);
            setDetailModalOpen(false);
            setSelectedReview(null);
          }}
          onDelete={() => {
            handleDelete(selectedReview.id);
            setDetailModalOpen(false);
            setSelectedReview(null);
          }}
        />
      )}
    </PageContainer>
  );
}
