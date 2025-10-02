'use client';

import { useEffect, useState } from 'react';
import { getUser, getUserRole, decodeToken, getToken } from '../../services/auth';
import { User, RoleType, GenderType } from '../../types/auth';
import styles from '../../styles/admin/AdminHeader.module.css';

const AdminHeader = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<RoleType | null>(null);

  useEffect(() => {
    const loadUserInfo = () => {
      try {
        // Lấy thông tin user từ localStorage
        const user = getUser();
        const role = getUserRole();
        
        // Nếu không có user trong localStorage, thử decode từ token
        if (!user && !role) {
          const token = getToken();
          if (token) {
            const decoded = decodeToken(token);
            if (decoded) {
              setUserRole(decoded.role);
              // Tạo user object từ token
              setCurrentUser({
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                fullname: decoded.email.split('@')[0], // Tạm thời dùng email
                gender: GenderType.MALE,
                date_of_birth: new Date(),
                is_verified: true
              });
            }
          }
        } else {
          setCurrentUser(user);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadUserInfo();
  }, []);

  return (
    <div className={styles.adminHeader}>
      <div className={styles.headerContent}>
        <div className={styles.breadcrumb}>
          <span className={styles.breadcrumbText}>Admin Panel</span>
        </div>
        
        <div className={styles.userInfo}>
          {currentUser && (
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                {currentUser.fullname ? currentUser.fullname.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>
                  {currentUser.fullname || currentUser.email}
                </span>
                <span className={`${styles.userRole} ${userRole === RoleType.ADMIN ? styles.admin : styles.user}`}>
                  {userRole || 'USER'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
