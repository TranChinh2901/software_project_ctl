'use client';

import { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdEdit, 
  MdDelete,
  MdInventory,
  MdFilterList,
  MdRefresh,
  MdImage,
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdVisibility
} from 'react-icons/md';
import { productApi, categoryApi, brandApi } from '@/lib/api';
import { Product  } from '@/types/product';
import { Category } from '@/types/category';
import { Brand } from '@/types/brand';
import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';
import styles from '@/styles/admin/Products.module.css';
import toast from 'react-hot-toast';
import { ProductStatus } from '@/enums/product/product.enum';
import ProductModal from './ProductModal';
import ProductDetailModal from './ProductDetailModal';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: 10,
      };
      
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      if (filterCategory !== 'all') {
        params.category_id = parseInt(filterCategory);
      }

      if (filterBrand !== 'all') {
        params.brand_id = parseInt(filterBrand);
      }

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const response = await productApi.getAll(params);
      console.log('Products API response:', response);
      
      // apiClient interceptor already returns response.data
      // Backend returns: { success: true, message: "...", data: { products, total, page, limit, totalPages } }
      if (response && response.data) {
        const responseData = response.data;
        setProducts(responseData.products || []);
        
        // Use totalPages from backend if available, otherwise calculate
        if (responseData.totalPages) {
          setTotalPages(responseData.totalPages);
        } else if (responseData.total && responseData.limit) {
          setTotalPages(Math.ceil(responseData.total / responseData.limit));
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll({ limit: 100 });
      console.log('Categories API response:', response);
      
      // apiClient interceptor already returns response.data
      if (response && response.data) {
        const responseData = response.data;
        setCategories(responseData.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await brandApi.getAll({ limit: 100 });
      console.log('Brands API response:', response);
      
      // apiClient interceptor already returns response.data
      if (response && response.data) {
        const responseData = response.data;
        setBrands(responseData.brands || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterStatus, filterCategory, filterBrand]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      await productApi.delete(productId);
      toast.success('Xóa sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Không thể xóa sản phẩm');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setViewingProduct(null);
  };

  const handleSuccess = () => {
    fetchProducts();
    handleCloseModal();
  };

  const getStockBadgeClass = (stock?: number) => {
    if (!stock || stock === 0) return styles.outOfStock;
    if (stock < 10) return styles.lowStock;
    return styles.inStock;
  };

  const getStockLabel = (stock?: number) => {
    if (!stock || stock === 0) return 'Hết hàng';
    if (stock < 10) return `Sắp hết (${stock})`;
    return `Còn ${stock}`;
  };

  const getStockIcon = (stock?: number) => {
    if (!stock || stock === 0) return <MdCancel />;
    if (stock < 10) return <MdWarning />;
    return <MdCheckCircle />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredProducts = products.filter(product => 
    product.name_product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.small_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === ProductStatus.ACTIVE).length;
  const lowStockProducts = products.filter(p => (p.stock_quantity || 0) < 10 && (p.stock_quantity || 0) > 0).length;
  const outOfStockProducts = products.filter(p => !p.stock_quantity || p.stock_quantity === 0).length;

  return (
    <PageContainer
      title="Quản lý sản phẩm"
      description="Danh sách tất cả sản phẩm trong hệ thống"
      action={
        <>
          <Button 
            variant="secondary" 
            size="md" 
            icon={<MdRefresh />}
            onClick={fetchProducts}
          >
            Làm mới
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            icon={<MdAdd />}
            onClick={handleAddProduct}
          >
            Thêm sản phẩm
          </Button>
        </>
      }
    >
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#ff634715', color: '#ff6347' }}>
              <MdInventory />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Tổng sản phẩm</div>
              <div className={styles.statValue}>{totalProducts}</div>
            </div>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#48bb7815', color: '#48bb78' }}>
              <MdCheckCircle />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Đang bán</div>
              <div className={styles.statValue}>{activeProducts}</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#f59e0b15', color: '#f59e0b' }}>
              <MdWarning />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Sắp hết hàng</div>
              <div className={styles.statValue}>{lowStockProducts}</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#ef444415', color: '#ef4444' }}>
              <MdCancel />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Hết hàng</div>
              <div className={styles.statValue}>{outOfStockProducts}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <div className={styles.filterContainer}>
          <div className={styles.searchBox}>
            <MdSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mô tả..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <MdFilterList className={styles.filterIcon} />
            <select 
              className={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={ProductStatus.ACTIVE}>Đang bán</option>
              <option value={ProductStatus.INACTIVE}>Ngừng bán</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select 
              className={styles.filterSelect}
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name_category}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select 
              className={styles.filterSelect}
              value={filterBrand}
              onChange={(e) => {
                setFilterBrand(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tất cả thương hiệu</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name_brand}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card noPadding>
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <MdInventory className={styles.emptyIcon} />
              <p>Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Danh mục</th>
                  <th>Thương hiệu</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className={styles.idCell}>#{product.id}</td>
                    
                    <td>
                      <div className={styles.productInfo}>
                        {product.image_product ? (
                          <img 
                            src={product.image_product} 
                            alt={product.name_product}
                            className={styles.productImage}
                          />
                        ) : (
                          <div className={styles.productImagePlaceholder}>
                            <MdImage />
                          </div>
                        )}
                        <div className={styles.productDetails}>
                          <div className={styles.productName}>{product.name_product}</div>
                          {product.small_description && (
                            <div className={styles.productDescription}>
                              {product.small_description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className={styles.priceInfo}>
                        <div className={styles.currentPrice}>
                          {formatPrice(product.price)}
                        </div>
                        {product.origin_price && product.origin_price > product.price && (
                          <>
                            <div className={styles.originalPrice}>
                              {formatPrice(product.origin_price)}
                            </div>
                            {product.discount && (
                              <span className={styles.discount}>-{product.discount}%</span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    
                    <td>
                      {product.category ? (
                        <span className={styles.categoryBadge}>
                          {product.category.name_category}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </td>

                    <td>
                      {product.brand ? (
                        <span className={styles.brandBadge}>
                          {product.brand.name_brand}
                        </span>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </td>
                    
                    <td>
                      <span className={`${styles.stockBadge} ${getStockBadgeClass(product.stock_quantity)}`}>
                        {getStockIcon(product.stock_quantity)}
                        {getStockLabel(product.stock_quantity)}
                      </span>
                    </td>
                    
                    <td>
                      <span className={`${styles.statusBadge} ${product.status === ProductStatus.ACTIVE ? styles.statusActive : styles.statusInactive}`}>
                        {product.status === ProductStatus.ACTIVE ? (
                          <>
                            <MdCheckCircle />
                            Đang bán
                          </>
                        ) : (
                          <>
                            <MdCancel />
                            Ngừng bán
                          </>
                        )}
                      </span>
                    </td>
                    
                    <td className={styles.dateCell}>
                      {new Date(product.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    
                    <td>
                      <div className={styles.actions}>
                        <button 
                          className={styles.actionButton}
                          onClick={() => handleViewProduct(product)}
                          title="Xem chi tiết"
                        >
                          <MdVisibility />
                        </button>
                        <button 
                          className={styles.actionButton}
                          onClick={() => handleEditProduct(product)}
                          title="Chỉnh sửa"
                        >
                          <MdEdit />
                        </button>
                        <button 
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Xóa"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.paginationButton}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Trước
            </button>
            
            <div className={styles.paginationInfo}>
              Trang {currentPage} / {totalPages}
            </div>
            
            <button 
              className={styles.paginationButton}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Sau
            </button>
          </div>
        )}
      </Card>

      {/* Modals */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
        categories={categories}
        brands={brands}
        onSuccess={handleSuccess}
      />

      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        product={viewingProduct}
      />
    </PageContainer>
  );
}
