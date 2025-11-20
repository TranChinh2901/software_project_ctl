'use client';

import { ReactNode } from 'react';
import styles from '@/styles/admin/Card.module.css';

interface CardProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  noPadding?: boolean;
  className?: string;
}

export default function Card({ 
  children, 
  title, 
  action,
  noPadding = false,
  className = '' 
}: CardProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      {(title || action) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      <div className={`${styles.content} ${noPadding ? styles.noPadding : ''}`}>
        {children}
      </div>
    </div>
  );
}
