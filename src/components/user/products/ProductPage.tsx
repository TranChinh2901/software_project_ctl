'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import BrandSlider from './BrandSlider';
import ProductList from './ProductList';
import FilterSidebar from './FilterSidebar';
import { brandApi, productApi, categoryApi, colorApi, productGalleryApi, productVariantApi } from '@/lib/api';
import { Brand } from '@/types/brand';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { Color } from '@/types/color';
import { ProductGallery } from '@/types/product-gallery';
import { SizeType } from '@/types/product-variant';
import { ProductStatus } from '@/enums/product/product.enum';
import styles from '../../../styles/products/Product.module.css';
interface ApiResponse<T> {
  data?: T;
  products?: T;
  message?: string;
}
const ProductsPages = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [galleries, setGalleries] = useState<Record<number, ProductGallery[]>>({});
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<SizeType[]>([]);
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('Sản phẩm');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productParams: Record<string, unknown> = {};
        if (searchQuery) {
          productParams.search = searchQuery;
        }
        
        const [brandsRes, productsRes, categoriesRes, colorsRes, galleriesRes] = await Promise.all([
          brandApi.getAll(),
          productApi.getAll(productParams),
          categoryApi.getAll(),
          colorApi.getAll(),
          productGalleryApi.getAll(),
        ]);
        const brandsData = (brandsRes as any)?.data || brandsRes;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productsResponse = (productsRes as any)?.data;
        const productsData = productsResponse?.products || productsResponse || productsRes;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const categoriesData = (categoriesRes as any)?.data || categoriesRes;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const colorsData = (colorsRes as any)?.data || colorsRes;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const galleriesData = (galleriesRes as any)?.data || galleriesRes;
        setBrands(Array.isArray(brandsData) ? brandsData : []);
        
        const activeProducts = Array.isArray(productsData) 
          ? productsData.filter((product: Product) => {
              const statusValue = String(product.status).toLowerCase();
              const isActive = product.status === ProductStatus.ACTIVE || statusValue === 'active';
              const isNotDeleted = !product.is_deleted;
              
              return isActive && isNotDeleted;
            })
          : [];
        setProducts(activeProducts);
        setFilteredProducts(activeProducts);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setColors(Array.isArray(colorsData) ? colorsData : []);
        if (Array.isArray(galleriesData)) {
          const galleryMap: Record<number, ProductGallery[]> = {};
          galleriesData.forEach((gallery: ProductGallery) => {
            if (!galleryMap[gallery.product_id]) {
              galleryMap[gallery.product_id] = [];
            }
            galleryMap[gallery.product_id].push(gallery);
          });
          setGalleries(galleryMap);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend đang chạy.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  const applyFilters = useCallback(async () => {
    let filtered = [...products];

    if (selectedBrand) {
      const brandCategories = categories.filter(cat => cat.brand?.id === selectedBrand);
      const brandCategoryIds = brandCategories.map(cat => cat.id);
      filtered = filtered.filter(product => 
        product.category && brandCategoryIds.includes(product.category.id)
      );
      
      const brand = brands.find(b => b.id === selectedBrand);
      setCategoryName(brand?.name_brand || 'Sản phẩm');
    } else {
      setCategoryName('Sản phẩm');
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        product.category && selectedCategories.includes(product.category.id)
      );
    }
    if (selectedColors.length > 0 || selectedSizes.length > 0) {
      const productIdsToKeep: number[] = [];
      
      for (const product of filtered) {
        try {
          const variantsRes = await productVariantApi.getByProduct(product.id);
          const variantsData = (variantsRes as ApiResponse<{ color?: { id: number }, size?: SizeType }[]>).data || variantsRes;
          
          if (Array.isArray(variantsData)) {
            let matchesColor = selectedColors.length === 0;
            let matchesSize = selectedSizes.length === 0;

            for (const variant of variantsData) {
              if (selectedColors.length > 0 && variant.color && selectedColors.includes(variant.color.id)) {
                matchesColor = true;
              }
              if (selectedSizes.length > 0 && variant.size && selectedSizes.includes(variant.size)) {
                matchesSize = true;
              }
            }

            if (matchesColor && matchesSize) {
              productIdsToKeep.push(product.id);
            }
          }
        } catch {
          productIdsToKeep.push(product.id);
        }
      }

      filtered = filtered.filter(product => productIdsToKeep.includes(product.id));
    }
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name_product.localeCompare(b.name_product));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name_product.localeCompare(a.name_product));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedBrand, selectedCategories, selectedColors, selectedSizes, sortBy, categories, brands]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleBrandSelect = (brandId: number | null) => {
    setSelectedBrand(brandId);
    if (brandId !== selectedBrand) {
      setSelectedCategories([]);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleColorChange = (colorId: number) => {
    setSelectedColors(prev => 
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handleSizeChange = (size: SizeType) => {
    setSelectedSizes(prev => 
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleClearFilters = () => {
    setSelectedBrand(null);
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortBy('default');
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const filteredCategories = selectedBrand
    ? categories.filter(cat => cat.brand?.id === selectedBrand)
    : categories;

  return (
    <div className={styles.productContainer}>
      <Breadcrumb items={[
        { label: 'Trang chủ', href: '/' }, 
        { label: searchQuery ? `Tìm kiếm: "${searchQuery}"` : 'Sản phẩm' }
      ]} />
      {searchQuery && (
        <div style={{ 
          padding: '16px 20px', 
          backgroundColor: '#fff5f3', 
          border: '1px solid #ffe0db', 
          borderRadius: '8px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <p style={{ margin: 0, color: '#333' }}>
            🔍 Kết quả tìm kiếm cho <strong>&quot;{searchQuery}&quot;</strong>: {filteredProducts.length} sản phẩm
          </p>
          <Link 
            href="/products" 
            style={{ 
              color: '#ff6347', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Xóa bộ lọc
          </Link>
        </div>
      )}
      {error && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffc107', 
          borderRadius: '8px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#856404' }}>⚠️ {error}</p>
        </div>
      )}
      <BrandSlider
        brands={brands}
        selectedBrand={selectedBrand}
        onBrandSelect={handleBrandSelect}
      />
      <div className={styles.mainContent}>
        <div className={styles.productsColumn}>
          <ProductList
            products={filteredProducts}
            galleries={galleries}
            categoryName={categoryName}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            loading={loading}
          />
        </div>
        <div className={styles.categoriesColumn}>
          <FilterSidebar
            categories={filteredCategories}
            colors={colors}
            selectedCategories={selectedCategories}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            onCategoryChange={handleCategoryChange}
            onColorChange={handleColorChange}
            onSizeChange={handleSizeChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPages;
