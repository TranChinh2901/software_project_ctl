'use client';

import { useState, useEffect, use } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdEdit, 
  MdDelete,
  MdPeople,
  MdFilterList,
  MdRefresh,
  MdVerified,
  MdEmail,
  MdPhone,
  MdLocationOn
} from 'react-icons/md';
import { userApi } from '@/lib/api';
import { User } from '@/types/user';
import { RoleType } from '@/enums';
import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';
import EditUserModalOriginal from '@/components/admin/users/EditUserModalOriginal';
import styles from '@/styles/admin/Users.module.css';
import toast from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: 10,
      };
      
      if (filterRole !== 'all') {
        params.role = filterRole;
      }

      const response = await userApi.getAll(params);
      setUsers(response.data || []);
      
      // if (response.total && response.limit) {
      //   setTotalPages(Math.ceil(response.total / response.limit));
      // }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterRole]);

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    
    try {
      await userApi.delete(userId);
      toast.success('Xóa người dùng thành công');
      fetchUsers();
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



  const filteredUsers = users.filter(user => 
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number.includes(searchTerm)
  );

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
            onClick={fetchUsers}
          >
            Làm mới
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            icon={<MdAdd />}
          >
            Thêm người dùng
          </Button>
        </>
      }
    >
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#ff634715', color: '#ff6347' }}>
              <MdPeople />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Tổng người dùng</div>
              <div className={styles.statValue}>{users.length}</div>
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
              <div className={styles.statValue}>
                {users.filter(u => u.is_verified).length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
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

      {/* Users Table */}
      <Card noPadding>
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
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
                {filteredUsers.map((user) => (
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

        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.paginationButton}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Trước
            </button>
            
            <div className={styles.paginationInfo}>
              Trang {currentPage} / {totalPages}
            </div>
            
            <button 
              className={styles.paginationButton}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        )}
      </Card>

      {/* Edit User Modal */}
      <EditUserModalOriginal
        isOpen={editModalOpen}
        user={selectedUser}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </PageContainer>
  );
}
