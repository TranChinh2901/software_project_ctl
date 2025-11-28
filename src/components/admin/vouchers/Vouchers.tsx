'use client';

import { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdEdit, 
  MdDelete,
  MdLocalOffer,
  MdRefresh,
  MdCheckCircle,
  MdCancel,
} from 'react-icons/md';
import { voucherApi } from '@/lib/api';
import { Voucher } from '@/types/voucher';
import { VoucherType } from '@/enums/voucher/voucher.enum';

import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';
import VoucherModal from '@/components/admin/vouchers/edit/VoucherModal';
import styles from '@/styles/admin/Vouchers.module.css';
import toast from 'react-hot-toast';

export default function Vouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherApi.getAll();
      const vouchersData = Array.isArray(response.data) ? response.data : [];
      setVouchers(vouchersData);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleDeleteVoucher = async (voucherId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
    
    try {
      await voucherApi.delete(voucherId);
      toast.success('Xóa voucher thành công');
      fetchVouchers();
    } catch (error) {
      console.error('Error deleting voucher:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Không thể xóa voucher');
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedVoucher(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVoucher(null);
  };

  const handleModalSuccess = () => {
    fetchVouchers();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const isExpired = (date: Date | string) => {
    return new Date(date) < new Date();
  };

  return (
    <PageContainer
      title="Quản lý Voucher"
      description="Danh sách tất cả voucher trong hệ thống"
      action={
        <>
          <Button 
            variant="secondary" 
            size="md" 
            icon={<MdRefresh />}
            onClick={fetchVouchers}
          >
            Làm mới
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            icon={<MdAdd />}
            onClick={handleOpenCreateModal}
          >
            Thêm Voucher
          </Button>
        </>
      }
    >
      <Card>
        {loading ? (
          <div className={styles.loading}>Đang tải...</div>
        ) : vouchers.length === 0 ? (
          <div className={styles.empty}>
            <MdLocalOffer className={styles.emptyIcon} />
            <p>Không có voucher nào</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Giảm giá</th>
                  <th>ĐH tối thiểu</th>
                  <th>Số lượng</th>
                  <th>Hết hạn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher.id} className={isExpired(voucher.expiry_date) ? styles.expiredRow : ''}>
                    <td>
                      <div className={styles.codeCell}>
                        <MdLocalOffer className={styles.codeIcon} />
                        <span className={styles.code}>{voucher.code}</span>
                      </div>
                    </td>
                    <td className={styles.discountCell}>
                      {formatCurrency(voucher.discount_voucher)}
                    </td>
                    <td>
                      {voucher.min_order_value 
                        ? formatCurrency(voucher.min_order_value)
                        : <span className={styles.noLimit}>Không</span>
                      }
                    </td>
                    <td>
                      <span className={styles.quantity}>{voucher.quantity}</span>
                    </td>
                    <td>
                      <span className={isExpired(voucher.expiry_date) ? styles.expiredDate : styles.validDate}>
                        {formatDate(voucher.expiry_date)}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[voucher.status]}`}>
                        {voucher.status === VoucherType.ACTIVE ? (
                          <>
                            <MdCheckCircle /> Kích hoạt
                          </>
                        ) : (
                          <>
                            <MdCancel /> Vô hiệu
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleOpenEditModal(voucher)}
                          title="Chỉnh sửa"
                        >
                          <MdEdit />
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteVoucher(voucher.id)}
                          title="Xóa"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <VoucherModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        voucher={selectedVoucher}
      />
    </PageContainer>
  );
}
