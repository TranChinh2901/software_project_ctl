"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/auth';
import { getToken, getUser, logout as authLogout } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = getToken();
      const savedUser = getUser();
      
      if (token && savedUser) setUser(savedUser);
      setLoading(false);
    };

    initAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nd_token' || e.key === 'nd_user') {
        const savedUser = getUser();
        setUser(e.newValue ? savedUser : null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('nd_token', token);
    localStorage.setItem('nd_user', JSON.stringify(userData));
    document.cookie = `nd_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    
    setUser(userData);
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    localStorage.setItem('nd_user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
