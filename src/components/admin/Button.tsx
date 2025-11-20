'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from '@/styles/admin/Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props 
}: ButtonProps) {
  const variantClass = styles[variant] || styles.primary;
  const sizeClass = styles[size] || styles.md;

  return (
    <button 
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}
