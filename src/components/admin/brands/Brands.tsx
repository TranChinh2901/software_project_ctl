'use client';

import { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdEdit, 
  MdDelete,
  MdBusiness,
  MdRefresh,
  MdImage,
} from 'react-icons/md';
import { brandApi } from '@/lib/api';

import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';
import BrandModal from '@/components/admin/brands/edit/BrandModal';
import styles from '@/styles/admin/Brands.module.css';
import toast from 'react-hot-toast';
import { Brand } from '@/types/brand';

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandApi.getAll();
      const brandsData = Array.isArray(response.data) ? response.data : [];
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Không thể tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDeleteBrand = async (brandId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) return;
    
    try {
      const response = await brandApi.delete(brandId);
      console.log('Delete response:', response);
      toast.success('Xóa thương hiệu thành công');
      fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      const err = error as { response?: { data?: { message?: string }; status?: number } };
      console.error('Error details:', err.response);
      const errorMessage = err.response?.data?.message || 'Không thể xóa thương hiệu';
      toast.error(errorMessage);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedBrand(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBrand(null);
  };

  const handleModalSuccess = () => {
    fetchBrands();
  };

  const filteredBrands = brands.filter(brand => 
    brand.name_brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description_brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBrands = brands.length;
  const brandsWithLogo = brands.filter(b => b.logo_url).length;

  return (
    <PageContainer
      title="Quản lý thương hiệu"
      description="Danh sách tất cả thương hiệu trong hệ thống"
      action={
        <>
          <Button 
            variant="secondary" 
            size="md" 
            icon={<MdRefresh />}
            onClick={fetchBrands}
          >
            Làm mới
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            icon={<MdAdd />}
            onClick={handleOpenCreateModal}
          >
            Thêm thương hiệu
          </Button>
        </>
      }
    >
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#ff634715', color: '#ff6347' }}>
              <MdBusiness />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Tổng thương hiệu</div>
              <div className={styles.statValue}>{totalBrands}</div>
            </div>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#48bb7815', color: '#48bb78' }}>
              <MdImage />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Có logo</div>
              <div className={styles.statValue}>{brandsWithLogo}</div>
            </div>
          </div>
        </Card>
      </div>
      <Card className={styles.filterCard}>
        <div className={styles.filterContainer}>
          <div className={styles.searchBox}>
            <MdSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mô tả..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>
      {loading ? (
        <Card>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Đang tải dữ liệu...</p>
          </div>
        </Card>
      ) : filteredBrands.length === 0 ? (
        <Card>
          <div className={styles.emptyState}>
            <MdBusiness className={styles.emptyIcon} />
            <p>Không tìm thấy thương hiệu nào</p>
          </div>
        </Card>
      ) : (
        <div className={styles.brandsGrid}>
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className={styles.brandCard}>
              <div className={styles.brandCardContent}>
                <div className={styles.brandLogoContainer}>
                  {brand.logo_url ? (
                    <img 
                      src={brand.logo_url} 
                      alt={brand.name_brand}
                      className={styles.brandLogo}
                    />
                  ) : (
                    <MdBusiness className={styles.brandLogoPlaceholder} />
                  )}
                </div>
                <div className={styles.brandInfo}>
                  <div className={styles.brandName}>{brand.name_brand}</div>
                  <div className={styles.brandDescription}>
                    {brand.description_brand?.trim() || 'Chưa có mô tả'}
                  </div>
                </div>
              </div>
              <div className={styles.brandFooter}>
                <div className={styles.brandDate}>
                  {new Date(brand.created_at).toLocaleDateString('vi-VN')}
                </div>
                <div className={styles.brandActions}>
                  <button 
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleOpenEditModal(brand)}
                    title="Chỉnh sửa"
                  >
                    <MdEdit />
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteBrand(brand.id)}
                    title="Xóa"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <BrandModal
        isOpen={modalOpen}
        brand={selectedBrand}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />
    </PageContainer>
  );
}
