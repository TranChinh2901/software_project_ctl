'use client';

import { useEffect, useState } from 'react';
import { getUser } from '../../services/auth';
import { User } from '../../types/auth';
import styles from '../../styles/admin/AdminHeader.module.css';

const AdminHeader = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Chỉ lấy user từ localStorage, đơn giản hơn
    const user = getUser();
    setCurrentUser(user);
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
                <span className={`${styles.userRole} ${currentUser.role === 'ADMIN' ? styles.admin : styles.user}`}>
                  {currentUser.role}
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
