"use client";

import { useState, useEffect } from "react";
import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdRefresh,
  MdImage,
  MdInventory,
  MdShoppingCart,
  MdWarning,
  MdFilterList,
  MdCategory,
  MdBusiness,
  MdChevronLeft,
  MdChevronRight,
  MdFirstPage,
  MdLastPage,
} from "react-icons/md";
import { productApi, categoryApi, brandApi } from "@/lib/api";
import PageContainer from "@/components/admin/PageContainer";
import Button from "@/components/admin/Button";
import Card from "@/components/admin/Card";
import styles from "@/styles/admin/Products.module.css";
import toast from "react-hot-toast";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import { ProductStatus } from "@/enums/product/product.enum";
import ProductModal from "./edit/ProductModal";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inStock: 0,
    outOfStock: 0,
  });

  const fetchStats = async () => {
    try {
      const params: Record<string, unknown> = { limit: 1000 };
      if (searchDebounce) params.search = searchDebounce;
      if (selectedCategoryId) params.category_id = parseInt(selectedCategoryId);
      if (selectedBrandId) params.brand_id = parseInt(selectedBrandId);
      
      const response = await productApi.getAll(params);
      const allProducts = response.data?.products || response.data || [];
      const productsArray = Array.isArray(allProducts) ? allProducts : [];
      
      setStats({
        total: productsArray.length,
        active: productsArray.filter((p: Product) => p.status === ProductStatus.ACTIVE).length,
        inStock: productsArray.filter((p: Product) => 
          (p.stock_quantity !== undefined && p.stock_quantity !== null && p.stock_quantity > 0) 
          && p.status !== ProductStatus.OUT_OF_STOCK
        ).length,
        outOfStock: productsArray.filter((p: Product) => 
          p.status === ProductStatus.OUT_OF_STOCK 
          || p.stock_quantity === undefined 
          || p.stock_quantity === null 
          || p.stock_quantity === 0
        ).length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      if (searchDebounce) params.search = searchDebounce;
      if (selectedCategoryId) params.category_id = parseInt(selectedCategoryId);
      if (selectedBrandId) params.brand_id = parseInt(selectedBrandId);
      
      const response = await productApi.getAll(params);
      const productsData = response.data?.products || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      
      if (response.data?.total !== undefined) {
        setTotalItems(response.data.total);
        setTotalPages(response.data.totalPages || Math.ceil(response.data.total / itemsPerPage));
      } else {
        setTotalItems(productsData.length);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await brandApi.getAll();
      const brandsData = Array.isArray(response.data) ? response.data : [];
      setBrands(brandsData);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce, selectedCategoryId, selectedBrandId, currentPage, itemsPerPage]);
  useEffect(() => {
    fetchStats();
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce, selectedCategoryId, selectedBrandId]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    try {
      await productApi.delete(productId);
      toast.success("Xóa sản phẩm thành công");
      fetchProducts();
      fetchStats(); 
    } catch (error) {
      console.error("Error deleting product:", error);
      const err = error as {
        response?: { data?: { message?: string }; status?: number };
      };
      const errorMessage =
        err.response?.data?.message || "Không thể xóa sản phẩm";
      toast.error(errorMessage);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleModalSuccess = () => {
    fetchProducts();
    fetchStats(); 
  };

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
            onClick={handleOpenCreateModal}
          >
            Thêm sản phẩm
          </Button>
        </>
      }
    >
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div
              className={styles.statIcon}
              style={{ background: "#ff634715", color: "#ff6347" }}
            >
              <MdInventory />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>
                {selectedCategoryId || selectedBrandId || searchDebounce
                  ? "Sản phẩm đã lọc"
                  : "Tổng sản phẩm"}
              </div>
              <div className={styles.statValue}>{stats.total}</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div
              className={styles.statIcon}
              style={{ background: "#48bb7815", color: "#48bb78" }}
            >
              <MdShoppingCart />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Đang bán</div>
              <div className={styles.statValue}>{stats.active}</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div
              className={styles.statIcon}
              style={{ background: "#3b82f615", color: "#3b82f6" }}
            >
              <MdInventory />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Còn hàng</div>
              <div className={styles.statValue}>{stats.inStock}</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div
              className={styles.statIcon}
              style={{ background: "#f5970615", color: "#f59706" }}
            >
              <MdWarning />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Hết hàng</div>
              <div className={styles.statValue}>{stats.outOfStock}</div>
            </div>
          </div>
        </Card>
      </div>

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
            />
          </div>

          <div className={styles.filterGroup}>
            <MdFilterList className={styles.filterIcon} />
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name_category}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <MdFilterList className={styles.filterIcon} />
            <select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name_brand}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card noPadding>
        <div className={styles.tableContainer}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <MdInventory className={styles.emptyIcon} />
              <p>Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Thương hiệu</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Ngày cập nhật</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className={styles.idCell}>#{product.id}</td>

                    <td>
                      <div className={styles.imageCell}>
                        {product.image_product ? (
                          <img
                            src={product.image_product}
                            alt={product.name_product}
                            className={styles.productImage}
                          />
                        ) : (
                          <div className={styles.imagePlaceholder}>
                            <MdImage />
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className={styles.productName}>
                        {product.name_product}
                      </div>
                      {product.small_description && (
                        <div className={styles.productDesc}>
                          {product.small_description.length > 50
                            ? `${product.small_description.substring(0, 50)}...`
                            : product.small_description}
                        </div>
                      )}
                    </td>

                    <td>
                      {product.category ? (
                        <div className={styles.categoryInfo}>
                          <MdCategory />
                          <span>{product.category.name_category}</span>
                        </div>
                      ) : (
                        <span className={styles.noData}>Chưa phân loại</span>
                      )}
                    </td>

                    <td>
                      {product.category?.brand ? (
                        <div className={styles.brandInfo}>
                          <MdBusiness />
                          <span>{product.category.brand.name_brand}</span>
                        </div>
                      ) : (
                        <span className={styles.noData}>N/A</span>
                      )}
                    </td>

                    <td>
                      <div className={styles.priceInfo}>
                        <div className={styles.priceRow}>
                          <div className={styles.currentPrice}>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.price)}
                          </div>
                          {product.discount && product.discount > 0 && (
                            <span className={styles.discountBadge}>
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                        {product.origin_price && product.origin_price > product.price && (
                          <div className={styles.originPrice}>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.origin_price)}
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div
                        className={`${styles.stockInfo} ${
                          product.stock_quantity === 0
                            ? styles.outOfStock
                            : (product.stock_quantity || 0) < 10
                            ? styles.lowStock
                            : ""
                        }`}
                      >
                        {product.stock_quantity || 0}
                      </div>
                    </td>

                    <td>
                      {(() => {
                        const statusValue = product.status as string;
                        
                        let displayText = "Đang bán";
                        let statusClass = styles.statusActive;
                        
                        if (product.stock_quantity === 0) {
                          displayText = "Hết hàng";
                          statusClass = styles.outOfStock;
                        } else if (statusValue === 'active' || statusValue === ProductStatus.ACTIVE) {
                          displayText = "Đang bán";
                          statusClass = styles.statusActive;
                        } else if (statusValue === 'inactive' || statusValue === ProductStatus.INACTIVE) {
                          displayText = "Ngừng bán";
                          statusClass = styles.statusInactive;
                        } else if (statusValue === 'out_of_stock' || statusValue === ProductStatus.OUT_OF_STOCK) {
                          displayText = "Hết hàng";
                          statusClass = styles.outOfStock;
                        }
                        
                        return (
                          <span className={`${styles.statusBadge} ${statusClass}`}>
                            {displayText}
                          </span>
                        );
                      })()}
                    </td>

                    <td>
                      <div className={styles.dateInfo}>
                        {new Date(product.updated_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>

                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleOpenEditModal(product)}
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
        
        {!loading && products.length > 0 && (
          <div className={styles.pagination}>
            <div className={styles.paginationInfo}>
              <span>Hiển thị</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className={styles.limitSelect}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>/ {totalItems} sản phẩm</span>
            </div>
            
            <div className={styles.paginationControls}>
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                title="Trang đầu"
              >
                <MdFirstPage />
              </button>
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Trang trước"
              >
                <MdChevronLeft />
              </button>
              
              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, index, arr) => (
                    <span key={page}>
                      {index > 0 && arr[index - 1] !== page - 1 && (
                        <span className={styles.pageEllipsis}>...</span>
                      )}
                      <button
                        className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </span>
                  ))}
              </div>
              
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Trang sau"
              >
                <MdChevronRight />
              </button>
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                title="Trang cuối"
              >
                <MdLastPage />
              </button>
            </div>
          </div>
        )}
      </Card>

      {modalOpen && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}
    </PageContainer>
  );
}
