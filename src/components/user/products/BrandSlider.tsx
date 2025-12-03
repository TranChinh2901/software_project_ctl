'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Brand } from '@/types/brand';
import styles from '../../../styles/products/Product.module.css';

interface BrandSliderProps {
  brands: Brand[];
  selectedBrand: number | null;
  onBrandSelect: (brandId: number | null) => void;
}

const BrandSlider = ({ brands, selectedBrand, onBrandSelect }: BrandSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }
    return () => {
      if (slider) {
        slider.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [brands, checkScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const itemWidth = 190; // width of brand item + gap
      const scrollAmount = itemWidth * 2; // scroll 2 items at a time
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBrandClick = (brandId: number) => {
    if (selectedBrand === brandId) {
      onBrandSelect(null); // Deselect if already selected
    } else {
      onBrandSelect(brandId);
    }
  };

  return (
    <div className={styles.brandSliderContainer}>
      <button 
        className={`${styles.sliderButton} ${styles.sliderButtonLeft}`}
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        style={{ opacity: canScrollLeft ? 1 : 0.3, pointerEvents: canScrollLeft ? 'auto' : 'none' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>
      
      <div className={styles.brandSlider} ref={sliderRef}>
        {brands.map((brand) => (
          <div
            key={brand.id}
            className={`${styles.brandItem} ${selectedBrand === brand.id ? styles.brandItemActive : ''}`}
            onClick={() => handleBrandClick(brand.id)}
          >
            <div className={styles.brandImageWrapper}>
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={brand.name_brand}
                  width={130}
                  height={130}
                  className={styles.brandImage}
                />
              ) : (
                <div className={styles.brandPlaceholder}>
                  <span>{brand.name_brand.charAt(0)}</span>
                </div>
              )}
            </div>
            <span className={styles.brandName}>{brand.name_brand}</span>
          </div>
        ))}
      </div>

      <button 
        className={`${styles.sliderButton} ${styles.sliderButtonRight}`}
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        style={{ opacity: canScrollRight ? 1 : 0.3, pointerEvents: canScrollRight ? 'auto' : 'none' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9,6 15,12 9,18"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default BrandSlider;
