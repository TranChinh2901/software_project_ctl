"use client";

import { useState, useEffect } from "react";
import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdCategory,
  MdRefresh,
  MdImage,
  MdBusiness,
  MdFilterList,
} from "react-icons/md";
import { categoryApi, brandApi } from "@/lib/api";
import PageContainer from "@/components/admin/PageContainer";
import Button from "@/components/admin/Button";
import Card from "@/components/admin/Card";
import styles from "@/styles/admin/Categories.module.css";
import toast from "react-hot-toast";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import CategoryModal from "./edit/CategoryModal";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAll();
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
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

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      await categoryApi.delete(categoryId);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      const err = error as {
        response?: { data?: { message?: string }; status?: number };
      };
      const errorMessage =
        err.response?.data?.message || "Không thể xóa danh mục";
      toast.error(errorMessage);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const handleModalSuccess = () => {
    fetchCategories();
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description_category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesBrand =
      selectedBrandId === "" ||
      category.brand?.id.toString() === selectedBrandId;

    return matchesSearch && matchesBrand;
  });

  const totalCategories = filteredCategories.length;
  const categoriesWithImage = filteredCategories.filter(
    (c) => c.image_category
  ).length;

  const uniqueBrands = new Set(
    categories.filter((c) => c.brand).map((c) => c.brand!.id)
  ).size;

  return (
    <PageContainer
      title="Quản lý danh mục"
      description="Danh sách tất cả danh mục trong hệ thống"
      action={
        <>
          <Button
            variant="secondary"
            size="md"
            icon={<MdRefresh />}
            onClick={fetchCategories}
          >
            Làm mới
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<MdAdd />}
            onClick={handleOpenCreateModal}
          >
            Thêm danh mục
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
              <MdCategory />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>
                {selectedBrandId ? "Danh mục đã lọc" : "Tổng danh mục"}
              </div>
              <div className={styles.statValue}>{totalCategories}</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div
              className={styles.statIcon}
              style={{ background: "#3b82f615", color: "#3b82f6" }}
            >
              <MdBusiness />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Thương hiệu</div>
              <div className={styles.statValue}>{uniqueBrands}</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div
              className={styles.statIcon}
              style={{ background: "#48bb7815", color: "#48bb78" }}
            >
              <MdImage />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Có hình ảnh</div>
              <div className={styles.statValue}>{categoriesWithImage}</div>
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
          ) : filteredCategories.length === 0 ? (
            <div className={styles.emptyState}>
              <MdCategory className={styles.emptyIcon} />
              <p>Không tìm thấy danh mục nào</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Tên danh mục</th>
                  <th>Thương hiệu</th>
                  <th>Mô tả</th>
                  <th>Ngày cập nhật</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className={styles.idCell}>#{category.id}</td>

                    <td>
                      <div className={styles.imageCell}>
                        {category.image_category ? (
                          <img
                            src={category.image_category}
                            alt={category.name_category}
                            className={styles.categoryImage}
                          />
                        ) : (
                          <div className={styles.imagePlaceholder}>
                            <MdCategory />
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className={styles.categoryName}>
                        {category.name_category}
                      </div>
                    </td>

                    <td>
                      {category.brand ? (
                        <div className={styles.brandInfo}>
                          <MdBusiness />
                          <span>{category.brand.name_brand}</span>
                        </div>
                      ) : (
                        <span className={styles.noBrand}>
                          Chưa có thương hiệu
                        </span>
                      )}
                    </td>

                    <td>
                      <div className={styles.description}>
                        {category?.description_category
                          ? category.description_category.length > 70
                            ? `${category.description_category.substring(
                                0,
                                70
                              )}...`
                            : category.description_category
                          : "Chưa có mô tả"}
                      </div>
                    </td>

                    <td>
                      <div className={styles.dateInfo}>
                        {new Date(category.updated_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>

                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleOpenEditModal(category)}
                          title="Chỉnh sửa"
                        >
                          <MdEdit />
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDeleteCategory(category.id)}
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
      </Card>
      <CategoryModal
        isOpen={modalOpen}
        category={selectedCategory}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />
    </PageContainer>
  );
}
