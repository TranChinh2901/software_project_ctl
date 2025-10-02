'use client';

import { useState, useEffect } from 'react';
import styles from '../../../styles/admin/AdminUsers.module.css';

interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
  phone_number?: string;
  is_verified: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        fullname: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        role: 'USER',
        phone_number: '0123456789',
        is_verified: true,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        fullname: 'Trần Thị B',
        email: 'tranthib@email.com',
        role: 'USER',
        phone_number: '0987654321',
        is_verified: false,
        created_at: '2024-02-20T14:45:00Z'
      },
      {
        id: '3',
        fullname: 'Admin User',
        email: 'admin@ndstyle.com',
        role: 'ADMIN',
        phone_number: '0111222333',
        is_verified: true,
        created_at: '2024-01-01T09:00:00Z'
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleVerificationToggle = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, is_verified: !user.is_verified } : user
    ));
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Đang tải danh sách users...</p>
      </div>
    );
  }

  return (
    <div className={styles.usersPage}>
      <div className={styles.header}>
        <h1>Quản lý Users</h1>
        <p>Tổng số users: <strong>{users.length}</strong></p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.addBtn}>
          ➕ Thêm User
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th>Xác thực</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td className={styles.nameCell}>
                  <div className={styles.avatar}>
                    {user.fullname.charAt(0).toUpperCase()}
                  </div>
                  {user.fullname}
                </td>
                <td>{user.email}</td>
                <td>{user.phone_number || 'Chưa có'}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`${styles.roleSelect} ${user.role === 'ADMIN' ? styles.admin : styles.user}`}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleVerificationToggle(user.id)}
                    className={`${styles.statusBtn} ${user.is_verified ? styles.verified : styles.unverified}`}
                  >
                    {user.is_verified ? '✓ Đã xác thức' : '⚠ Chưa xác thức'}
                  </button>
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} title="Chỉnh sửa">
                      ✏️
                    </button>
                    <button className={styles.deleteBtn} title="Xóa">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.pageBtn}
          >
            ← Trước
          </button>
          
          <span className={styles.pageInfo}>
            Trang {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={styles.pageBtn}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
