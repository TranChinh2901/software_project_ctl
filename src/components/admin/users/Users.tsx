'use client';

import { useState, useEffect } from 'react';
import { 
  MdSearch, 
  MdEdit, 
  MdDelete,
  MdPeople,
  MdFilterList,
  MdRefresh,
  MdVerified,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdArrowBack,
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
} from 'react-icons/md';
import { userApi } from '@/lib/api';
import { User } from '@/types/user';
import { RoleType } from '@/enums';
import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';
import EditForm from '@/components/admin/users/edit/EditForm';
import styles from '@/styles/admin/Users.module.css';
import toast from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
  });

  const fetchStats = async () => {
    try {
      const params: Record<string, unknown> = { limit: 1000 };
      if (filterRole !== 'all') {
        params.role = filterRole;
      }
      if (searchDebounce) {
        params.search = searchDebounce;
      }
      
      const response = await userApi.getAll(params);
      const allUsers = response.data?.users || response.data || [];
      const usersArray = Array.isArray(allUsers) ? allUsers : [];
      
      setStats({
        total: usersArray.length,
        verified: usersArray.filter((u: User) => u.is_verified).length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (filterRole !== 'all') {
        params.role = filterRole;
      }
      if (searchDebounce) {
        params.search = searchDebounce;
      }
      
      const response = await userApi.getAll(params);
      const usersData = response.data?.users || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
      
      if (response.data?.total !== undefined) {
        setTotalItems(response.data.total);
        setTotalPages(response.data.totalPages || Math.ceil(response.data.total / itemsPerPage));
      } else {
        const total = Array.isArray(usersData) ? usersData.length : 0;
        setTotalItems(total);
        setTotalPages(Math.ceil(total / itemsPerPage) || 1);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, filterRole, searchDebounce]);

  useEffect(() => {
    fetchStats();
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRole, searchDebounce]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    
    try {
      await userApi.delete(userId);
      toast.success('Xóa người dùng thành công');
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Không thể xóa người dùng');
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleEditSuccess = () => {
    fetchUsers();
    fetchStats();
  };

  const getRoleBadgeClass = (role: RoleType) => {
    switch (role) {
      case RoleType.ADMIN:
        return styles.roleAdmin;
      default:
        return styles.roleUser;
    }
  };

  const getRoleLabel = (role: RoleType) => {
    switch (role) {
      case RoleType.ADMIN:
        return 'Quản trị viên';
      default:
        return 'Người dùng';
    }
  };

  return (
    <PageContainer
      title="Quản lý người dùng"
      description="Danh sách tất cả người dùng trong hệ thống"
      action={
        <>
          <Button 
            variant="secondary" 
            size="md" 
            icon={<MdRefresh />}
            onClick={() => { fetchUsers(); fetchStats(); }}
          >
            Làm mới
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            icon={<MdArrowBack />}
          >
            Quay lại Dashboard
          </Button>
        </>
      }
    >
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#ff634715', color: '#ff6347' }}>
              <MdPeople />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>
                {filterRole !== 'all' || searchDebounce ? 'Người dùng đã lọc' : 'Tổng người dùng'}
              </div>
              <div className={styles.statValue}>{stats.total}</div>
            </div>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#48bb7815', color: '#48bb78' }}>
              <MdVerified />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Đã xác thực</div>
              <div className={styles.statValue}>{stats.verified}</div>
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
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <MdFilterList className={styles.filterIcon} />
            <select 
              className={styles.filterSelect}
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Tất cả vai trò</option>
              <option value={RoleType.USER}>Người dùng</option>
              <option value={RoleType.ADMIN}>Quản trị viên</option>
            </select>
          </div>
        </div>
      </Card>

      <Card noPadding>
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : users.length === 0 ? (
            <div className={styles.emptyState}>
              <MdPeople className={styles.emptyIcon} />
              <p>Không tìm thấy người dùng nào</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Thông tin người dùng</th>
                  <th>Liên hệ</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.idCell}>#{user.id}</td>
                    
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.fullname} />
                          ) : (
                            <span>{user.fullname.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className={styles.userDetails}>
                          <div className={styles.userName}>{user.fullname}</div>
                          {user.address && (
                            <div className={styles.userAddress}>
                              <MdLocationOn />
                              {user.address}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                          <MdEmail />
                          <span>{user.email}</span>
                        </div>
                        <div className={styles.contactItem}>
                          <MdPhone />
                          <span>{user.phone_number}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    
                    <td>
                      <span className={`${styles.statusBadge} ${user.is_verified ? styles.verified : styles.unverified}`}>
                        {user.is_verified ? (
                          <>
                            <MdVerified />
                            Đã xác thực
                          </>
                        ) : (
                          'Chưa xác thực'
                        )}
                      </span>
                    </td>
                    
                    <td className={styles.dateCell}>
                      {new Date(user.created_at).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}{" "}
                      - {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    
                    <td>
                      <div className={styles.actions}>
                        <button 
                          className={styles.actionButton}
                          onClick={() => handleEditUser(user)}
                          title="Chỉnh sửa"
                        >
                          <MdEdit />
                        </button>
                        <button 
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteUser(user.id)}
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
          )}
        </div>

        {!loading && users.length > 0 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              <span>Hiển thị</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className={styles.limitSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>/ {totalItems} người dùng</span>
            </div>
            
            <div className={styles.paginationControls}>
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                title="Trang đầu"
              >
                <MdFirstPage />
              </button>
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Trang trước"
              >
                <MdChevronLeft />
              </button>
              
              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, index, arr) => (
                    <span key={page}>
                      {index > 0 && arr[index - 1] !== page - 1 && (
                        <span className={styles.pageEllipsis}>...</span>
                      )}
                      <button
                        className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </span>
                  ))}
              </div>
              
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Trang sau"
              >
                <MdChevronRight />
              </button>
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                title="Trang cuối"
              >
                <MdLastPage />
              </button>
            </div>
          </div>
        )}
      </Card>

      <EditForm
        isOpen={editModalOpen}
        user={selectedUser}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </PageContainer>
  );
}
