'use client';

import { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete,
  MdViewCarousel,
  MdRefresh,
  MdCheckCircle,
  MdCancel,
} from 'react-icons/md';
import { bannerApi } from '@/lib/api';
import { Banner } from '@/types/banner';
import { BannerType } from '@/enums/banner/banner.enum';

import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';
import BannerModal from '@/components/admin/banners/edit/BannerModal';
import styles from '@/styles/admin/Banners.module.css';
import toast from 'react-hot-toast';

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerApi.getAll();
      const bannersData = Array.isArray(response.data) ? response.data : [];
      setBanners(bannersData);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Không thể tải danh sách banner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDeleteBanner = async (bannerId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    
    try {
      await bannerApi.delete(bannerId);
      toast.success('Xóa banner thành công');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Không thể xóa banner');
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedBanner(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (banner: Banner) => {
    setSelectedBanner(banner);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBanner(null);
  };

  const handleModalSuccess = () => {
    fetchBanners();
  };

  return (
    <PageContainer
      title="Quản lý Banner"
      description="Danh sách tất cả banner trong hệ thống"
      action={
        <>
          <Button 
            variant="secondary" 
            size="md" 
            icon={<MdRefresh />}
            onClick={fetchBanners}
          >
            Làm mới
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            icon={<MdAdd />}
            onClick={handleOpenCreateModal}
          >
            Thêm Banner
          </Button>
        </>
      }
    >
      <Card>
        {loading ? (
          <div className={styles.loading}>Đang tải...</div>
        ) : banners.length === 0 ? (
          <div className={styles.empty}>
            <MdViewCarousel className={styles.emptyIcon} />
            <p>Không có banner nào</p>
          </div>
        ) : (
          <div className={styles.bannersGrid}>
            {banners.map((banner) => (
              <div key={banner.id} className={styles.bannerCard}>
                <div className={styles.bannerImageContainer}>
                  <img
                    src={banner.image_url || '/placeholder-banner.jpg'}
                    alt={banner.title}
                    className={styles.bannerImage}
                  />
                  <div className={styles.bannerOverlay}>
                    <div className={styles.bannerActions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleOpenEditModal(banner)}
                        title="Chỉnh sửa"
                      >
                        <MdEdit />
                      </button>
                      <button
                        className={styles.actionButtonb}
                        onClick={() => handleDeleteBanner(banner.id)}
                        title="Xóa"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.bannerInfo}>
                  <div className={styles.bannerHeader}>
                    <h3 className={styles.bannerTitle}>
                      {banner.title.length > 50 
                        ? `${banner.title.substring(0, 50)}...` 
                        : banner.title}
                    </h3>
                    <span className={`${styles.statusBadge} ${styles[banner.status]}`}>
                      {banner.status === BannerType.ACTIVE ? (
                        <>
                          <MdCheckCircle /> Kích hoạt
                        </>
                      ) : (
                        <>
                          <MdCancel /> Vô hiệu
                        </>
                      )}
                    </span>
                  </div>
                  {banner.subtitle && (
                    <p className={styles.bannerSubtitle}>
                      {banner.subtitle.length > 30 
                        ? `${banner.subtitle.substring(0, 30)}...` 
                        : banner.subtitle}
                    </p>
                  )}
                  {banner.description && (
                    <p className={styles.bannerDescription}>
                      {banner.description.length > 50 
                        ? `${banner.description.substring(0, 50)}...` 
                        : banner.description}
                    </p>
                  )}
                  <div className={styles.bannerMeta}>
                    <span className={styles.metaItem}>
                      Thứ tự: {banner.display_order}
                    </span>
                    {banner.button_text && (
                      <span className={styles.metaItem}>
                        Nút: {banner.button_text}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <BannerModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        banner={selectedBanner}
      />
    </PageContainer>
  );
}