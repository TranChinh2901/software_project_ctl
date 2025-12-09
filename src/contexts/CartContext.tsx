'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/types/product';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { SizeType } from '@/types/product-variant';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: SizeType;
  color?: string;
  colorImage?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: SizeType, color?: string, colorImage?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: number, size?: SizeType, color?: string) => boolean;
  isAuthenticated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getCartKey = (userId: number) => {
  return `cart_user_${userId}`;
};

const createCartItemId = (productId: number, size?: SizeType, color?: string) => {
  return `${productId}_${size || 'nosize'}_${color || 'nocolor'}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (user?.id) {
      const storageKey = getCartKey(user.id);
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setCart(parsed);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCart([]);
      }
      setCurrentUserId(user.id);
    } else {
      setCart([]);
      setCurrentUserId(null);
    }

    setIsLoaded(true);
  }, [user, authLoading]);

  useEffect(() => {
    if (!isLoaded || authLoading || !currentUserId) return;

    const storageKey = getCartKey(currentUserId);
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart, isLoaded, currentUserId, authLoading]);

  const addToCart = useCallback((
    product: Product, 
    quantity: number = 1, 
    size?: SizeType, 
    color?: string,
    colorImage?: string
  ) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    const itemId = createCartItemId(product.id, size, color);

    setCart(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      
      if (existingItem) {
        return prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, {
        id: itemId,
        product,
        quantity,
        size,
        color,
        colorImage,
      }];
    });

    toast.success('Đã thêm vào giỏ hàng');
  }, [isAuthenticated]);

  const removeFromCart = useCallback((itemId: string) => {
    if (!isAuthenticated) return;
    
    setCart(prev => prev.filter(item => item.id !== itemId));
    toast.success('Đã xóa khỏi giỏ hàng');
  }, [isAuthenticated]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (!isAuthenticated) return;
    
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== itemId));
      return;
    }

    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  }, [isAuthenticated]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const isInCart = useCallback((productId: number, size?: SizeType, color?: string) => {
    const itemId = createCartItemId(productId, size, color);
    return cart.some(item => item.id === itemId);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
        isAuthenticated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
