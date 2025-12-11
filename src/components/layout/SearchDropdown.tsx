'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSearch, FaClock } from 'react-icons/fa';
import { productApi } from '@/lib/api';
import { Product } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../../styles/header/search.module.css';

interface SearchDropdownProps {
  onClose?: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Tạo key riêng cho mỗi user
  const getStorageKey = useCallback(() => {
    if (isAuthenticated && user?.id) {
      return `recentSearches_user_${user.id}`;
    }
    return 'recentSearches_guest';
  }, [isAuthenticated, user?.id]);

  // Load recent searches from localStorage theo user
  useEffect(() => {
    const key = getStorageKey();
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches([]);
      }
    } else {
      setRecentSearches([]);
    }
  }, [getStorageKey]);

  // Save recent search theo user
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const key = getStorageKey();
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  // Clear recent searches theo user
  const clearRecentSearches = () => {
    const key = getStorageKey();
    setRecentSearches([]);
    localStorage.removeItem(key);
  };

  // Search products
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await productApi.getAll({ 
        search: searchQuery, 
        limit: 6,
        page: 1 
      });
      
      console.log('Search API Response:', response);
      
      // Handle nested response format
      // apiClient interceptor đã unwrap response.data một lần
      // Nên response ở đây = { data: { products: [...] } } hoặc { data: [...] }
      let productsData: Product[] = [];
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = response as any;
      
      if (res?.data?.products && Array.isArray(res.data.products)) {
        productsData = res.data.products;
      } else if (res?.data?.data && Array.isArray(res.data.data)) {
        productsData = res.data.data;
      } else if (res?.products && Array.isArray(res.products)) {
        productsData = res.products;
      } else if (res?.data && Array.isArray(res.data)) {
        productsData = res.data;
      } else if (Array.isArray(res)) {
        productsData = res;
      }
      
      console.log('Extracted products:', productsData);
      setResults(productsData);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        searchProducts(query);
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchProducts]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onClose?.();
    }
  };

  // Handle product click
  const handleProductClick = (productName: string) => {
    saveRecentSearch(query.trim() || productName);
    setIsOpen(false);
    onClose?.();
  };

  // Handle recent search click
  const handleRecentClick = (searchTerm: string) => {
    setQuery(searchTerm);
    searchProducts(searchTerm);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    searchProducts(suggestion);
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Calculate discount
  const getDiscount = (product: Product) => {
    if (product.discount && product.discount > 0) {
      return product.discount;
    }
    if (product.origin_price && product.price && product.origin_price > product.price) {
      return Math.round(((product.origin_price - product.price) / product.origin_price) * 100);
    }
    return 0;
  };

  const suggestions = ['Áo thun', 'Quần jean', 'Váy đầm', 'Áo khoác', 'Giày dép'];

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <form onSubmit={handleSubmit} className={styles.searchBox}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
        />
        <button type="submit" className={styles.searchBtn}>
          <FaSearch />
        </button>
      </form>

      {/* Overlay */}
      {isOpen && <div className={styles.searchOverlay} onClick={() => setIsOpen(false)} />}

      {/* Dropdown */}
      {isOpen && (
        <div className={styles.searchDropdown}>
          {/* Loading State */}
          {isLoading && (
            <div className={styles.searchLoading}>
              <div className={styles.spinner}></div>
              <span>Đang tìm kiếm...</span>
            </div>
          )}

          {/* Results */}
          {!isLoading && query.trim() && results.length > 0 && (
            <>
              <div className={styles.searchDropdownHeader}>
                <h4>Kết quả tìm kiếm</h4>
                <span className={styles.resultCount}>{results.length} sản phẩm</span>
              </div>
              <div className={styles.searchDropdownBody}>
                {results.map((product) => {
                  const discount = getDiscount(product);
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className={styles.searchItem}
                      onClick={() => handleProductClick(product.name_product)}
                    >
                      <div className={styles.searchItemImage}>
                        {product.image_product ? (
                          <Image
                            src={product.image_product}
                            alt={product.name_product}
                            fill
                            sizes="70px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: '#f5f5f5',
                            color: '#999',
                            fontSize: '10px'
                          }}>
                            No Image
                          </div>
                        )}
                      </div>
                      <div className={styles.searchItemInfo}>
                        <h5 className={styles.searchItemName}>{product.name_product}</h5>
                        {product.category && (
                          <p className={styles.searchItemCategory}>
                            {product.category.name_category}
                          </p>
                        )}
                        <div className={styles.searchItemPrice}>
                          <span className={styles.currentPrice}>
                            {formatPrice(product.price)}
                          </span>
                          {product.origin_price && product.origin_price > product.price && (
                            <span className={styles.originalPrice}>
                              {formatPrice(product.origin_price)}
                            </span>
                          )}
                          {discount > 0 && (
                            <span className={styles.discountBadge}>-{discount}%</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link
                href={`/products?search=${encodeURIComponent(query)}`}
                className={styles.viewAllBtn}
                onClick={() => {
                  saveRecentSearch(query.trim());
                  setIsOpen(false);
                }}
              >
                Xem tất cả kết quả →
              </Link>
            </>
          )}

          {/* No Results */}
          {!isLoading && query.trim() && results.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <h4>Không tìm thấy sản phẩm</h4>
              <p>Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}

          {/* Initial State - Suggestions & Recent */}
          {!isLoading && !query.trim() && (
            <>
              {/* Suggestions */}
              <div className={styles.suggestions}>
                <h5 className={styles.suggestionsTitle}>Gợi ý tìm kiếm</h5>
                <div className={styles.suggestionTags}>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className={styles.suggestionTag}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className={styles.recentSearches}>
                  <div className={styles.recentHeader}>
                    <h5>Tìm kiếm gần đây</h5>
                    <button className={styles.clearBtn} onClick={clearRecentSearches}>
                      Xóa tất cả
                    </button>
                  </div>
                  <div className={styles.recentList}>
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className={styles.recentItem}
                        onClick={() => handleRecentClick(search)}
                      >
                        <FaClock />
                        <span>{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
