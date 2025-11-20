'use client';

import { ReactNode } from 'react';
import styles from '@/styles/admin/PageContainer.module.css';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export default function PageContainer({ 
  children, 
  title, 
  description,
  action 
}: PageContainerProps) {
  return (
    <div className={styles.container}>
      {(title || action) && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {action && <div className={styles.actions}>{action}</div>}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
