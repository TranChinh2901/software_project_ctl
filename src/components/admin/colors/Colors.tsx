'use client';

import { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete,
  MdPalette,
  MdRefresh,
} from 'react-icons/md';
import { colorApi } from '@/lib/api';
import { Color } from '@/types/color';
import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';
import ColorModal from './edit/ColorModal';
import styles from '@/styles/admin/Colors.module.css';
import toast from 'react-hot-toast';

export default function Colors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchColors = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {};
      if (searchQuery) params.search = searchQuery;

      const response = await colorApi.getAll(params);
      const colorsData = Array.isArray(response.data) ? response.data : [];
      setColors(colorsData);
    } catch (error) {
      console.error('Error fetching colors:', error);
      toast.error('Không thể tải danh sách màu sắc');
      setColors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchColors();
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleAddColor = () => {
    setSelectedColor(null);
    setModalOpen(true);
  };

  const handleEditColor = (color: Color) => {
    setSelectedColor(color);
    setModalOpen(true);
  };

  const handleDeleteColor = async (colorId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa màu sắc này?')) return;

    try {
      await colorApi.delete(colorId);
      toast.success('Đã xóa màu sắc thành công');
      fetchColors();
    } catch (error) {
      console.error('Error deleting color:', error);
      toast.error('Không thể xóa màu sắc');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedColor(null);
  };

  const handleModalSuccess = () => {
    fetchColors();
    handleModalClose();
  };

  if (loading) {
    return (
      <PageContainer title="Quản lý màu sắc">
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Quản lý màu sắc">
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Tổng màu sắc</p>
              <h3 className={styles.statValue}>{colors.length}</h3>
            </div>
            <div className={styles.statIcon}>
              <MdPalette />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className={styles.toolbar}>
          <div className={styles.searchGroup}>
            <input
              type="text"
              placeholder="Tìm kiếm màu sắc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.actions}>
            <Button onClick={fetchColors} variant="secondary">
              <MdRefresh /> Làm mới
            </Button>
            <Button onClick={handleAddColor}>
              <MdAdd /> Thêm màu
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên màu</th>
                <th>Mã màu (Hex)</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {colors.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    Không có màu sắc nào
                  </td>
                </tr>
              ) : (
                colors.map((color) => (
                  <tr key={color.id}>
                    <td className={styles.colorId}>#{color.id}</td>
                    <td>
                      <div className={styles.colorName}>
                        <span 
                          className={styles.colorDot}
                          style={{ background: color.hex_code || '#ccc' }}
                        ></span>
                        {color.name_color}
                      </div>
                    </td>
                    <td>
                      {color.hex_code ? (
                        <span className={styles.hexCode}>{color.hex_code}</span>
                      ) : (
                        <span className={styles.noHex}>-</span>
                      )}
                    </td>
                    <td>
                      {color.created_at
                        ? new Date(color.created_at).toLocaleDateString('vi-VN')
                        : 'N/A'}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => handleEditColor(color)}
                          className={`${styles.actionButton} ${styles.editButton}`}
                          title="Chỉnh sửa"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteColor(color.id)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          title="Xóa"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalOpen && (
        <ColorModal
          color={selectedColor}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </PageContainer>
  );
}
