'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/types/product';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  wishlistCount: number;
  isAuthenticated: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const getWishlistKey = (userId: number) => {
  return `wishlist_user_${userId}`;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (user?.id) {
      const storageKey = getWishlistKey(user.id);
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlist(parsed);
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        setWishlist([]);
      }
      setCurrentUserId(user.id);
    } else {
      setWishlist([]);
      setCurrentUserId(null);
    }

    setIsLoaded(true);
  }, [user, authLoading]);
  useEffect(() => {
    if (!isLoaded || authLoading || !currentUserId) return;

    const storageKey = getWishlistKey(currentUserId);
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist, isLoaded, currentUserId, authLoading]);

  const addToWishlist = useCallback((product: Product) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  }, [isAuthenticated]);

  const removeFromWishlist = useCallback((productId: number) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thực hiện');
      return;
    }

    setWishlist(prev => prev.filter(p => p.id !== productId));
  }, [isAuthenticated]);

  const isInWishlist = useCallback((productId: number) => {
    if (!isAuthenticated) return false;
    return wishlist.some(p => p.id === productId);
  }, [wishlist, isAuthenticated]);

  const toggleWishlist = useCallback((product: Product) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, [isAuthenticated]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        isAuthenticated,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
