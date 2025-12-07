'use client';
import { useState } from 'react';
import { Category } from '@/types/category';
import { Color } from '@/types/color';
import { SizeType } from '@/types/product-variant';
import styles from '../../../styles/products/Product.module.css';

interface FilterSidebarProps {
  categories: Category[];
  colors: Color[];
  selectedCategories: number[];
  selectedColors: number[];
  selectedSizes: SizeType[];
  onCategoryChange: (categoryId: number) => void;
  onColorChange: (colorId: number) => void;
  onSizeChange: (size: SizeType) => void;
  onClearFilters: () => void;
}

const SIZES: SizeType[] = [SizeType.S, SizeType.M, SizeType.L, SizeType.XL];

const FilterSidebar = ({
  categories,
  colors,
  selectedCategories,
  selectedColors, 
  selectedSizes,
  onCategoryChange,
  onColorChange,
  onSizeChange,
  onClearFilters,
}: FilterSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    colors: true,
    sizes: true,
  });
  
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>({});

  const toggleSection = (section: 'categories' | 'colors' | 'sizes') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleBrand = (brandName: string) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brandName]: !prev[brandName]
    }));
  };

  const categoriesByBrand = categories.reduce((acc, category) => {
    const brandName = category.brand?.name_brand || 'Khác';
    if (!acc[brandName]) {
      acc[brandName] = [];
    }
    acc[brandName].push(category);
    return acc;
  }, {} as Record<string, Category[]>);

  const hasActiveFilters = selectedCategories.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0;

  return (
    <div className={styles.filterSidebar}>
      {hasActiveFilters && (
        <button className={styles.clearFiltersBtn} onClick={onClearFilters}>
          Xóa bộ lọc
        </button>
      )}
      <div className={styles.filterSection}>
        <div 
          className={styles.filterHeader} 
          onClick={() => toggleSection('categories')}
        >
          <h3>Danh mục sản phẩm</h3>
          <span className={`${styles.expandIcon} ${expandedSections.categories ? styles.expanded : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </span>
        </div>
        
        {expandedSections.categories && (
          <div className={styles.filterContent}>
            {Object.entries(categoriesByBrand).map(([brandName, brandCategories]) => (
              <div key={brandName} className={styles.categoryGroup}>
                <div 
                  className={styles.categoryGroupHeader}
                  onClick={() => toggleBrand(brandName)}
                >
                  <span className={styles.brandNameLabel}>{brandName}</span>
                  <span className={`${styles.expandIcon} ${expandedBrands[brandName] ? styles.expanded : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                  </span>
                </div>
                {expandedBrands[brandName] && (
                  <div className={styles.categoryList}>
                    {brandCategories.map((category) => (
                      <label 
                        key={category.id} 
                        className={`${styles.filterItem} ${selectedCategories.includes(category.id) ? styles.filterItemActive : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => onCategoryChange(category.id)}
                          className={styles.filterCheckbox}
                        />
                        <span className={styles.filterLabel}>{category.name_category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <div 
          className={styles.filterHeader} 
          onClick={() => toggleSection('colors')}
        >
          <h3>Màu phổ biến</h3>
          <span className={`${styles.expandIcon} ${expandedSections.colors ? styles.expanded : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </span>
        </div>
        
        {expandedSections.colors && (
          <div className={styles.filterContent}>
            <div className={styles.colorGrid}>
              {colors.map((color) => (
                <button
                  key={color.id}
                  className={`${styles.colorItem} ${selectedColors.includes(color.id) ? styles.colorItemActive : ''}`}
                  onClick={() => onColorChange(color.id)}
                  title={color.name_color}
                >
                  <span 
                    className={styles.colorCircle}
                    style={{ backgroundColor: color.hex_code || '#ccc' }}
                  ></span>
                  <span className={styles.colorName}>{color.name_color}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.filterSection}>
        <div 
          className={styles.filterHeader} 
          onClick={() => toggleSection('sizes')}
        >
          <h3>Size</h3>
          <span className={`${styles.expandIcon} ${expandedSections.sizes ? styles.expanded : ''}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </span>
        </div>
        
        {expandedSections.sizes && (
          <div className={styles.filterContent}>
            <div className={styles.sizeGrid}>
              {SIZES.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeItem} ${selectedSizes.includes(size) ? styles.sizeItemActive : ''}`}
                  onClick={() => onSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
