'use client';

import { useState, useEffect } from 'react';
import { MdDelete, MdClose, MdSave, MdEdit, MdRefresh } from 'react-icons/md';
import { productVariantApi, colorApi } from '@/lib/api';
import { ProductVariant, SizeType, CreateProductVariantDto, UpdateProductVariantDto } from '@/types/product-variant';
import { Color, CreateColorDto } from '@/types/color';
import toast from 'react-hot-toast';
import styles from './ProductVariants.module.css';

interface ProductVariantsProps {
  productId: number | null;
  productPrice?: number;
}

export default function ProductVariants({ productId, productPrice = 0 }: ProductVariantsProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [formData, setFormData] = useState({
    size: SizeType.M,
    color_id: '',
    price: '',
    quantity: '',
  });
  const [newColorData, setNewColorData] = useState({
    name_color: '',
    hex_code: '',
  });
  
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<SizeType[]>([]);
  const [bulkQuantity, setBulkQuantity] = useState('');

  useEffect(() => {
    if (productId) {
      fetchVariants();
    }
    fetchColors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchVariants = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const response = await productVariantApi.getByProduct(productId);
      const variantsData = response.data || [];
      setVariants(Array.isArray(variantsData) ? variantsData : []);
    } catch (error) {
      console.error('Error fetching variants:', error);
      toast.error('Không thể tải danh sách variants');
    } finally {
      setLoading(false);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await colorApi.getAll();
      const colorsData = response.data?.colors || response.data || [];
      setColors(Array.isArray(colorsData) ? colorsData : []);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const handleEdit = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setFormData({
      size: variant.size || SizeType.M,
      color_id: variant.color?.id.toString() || '',
      price: variant.price.toString(),
      quantity: variant.quantity.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa variant này?')) return;

    try {
      await productVariantApi.delete(id);
      toast.success('Xóa variant thành công!');
      fetchVariants();
    } catch (error) {
      console.error('Error deleting variant:', error);
      toast.error('Không thể xóa variant');
    }
  };

  const handleBulkGenerate = async () => {
    if (!productId) {
      toast.error('Vui lòng lưu sản phẩm trước');
      return;
    }

    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 màu và 1 size');
      return;
    }

    try {
      setLoading(true);
      let createdCount = 0;
      let skippedCount = 0;

      for (const colorId of selectedColors) {
        for (const size of selectedSizes) {
          const exists = variants.some(
            (v) => v.color?.id === colorId && v.size === size
          );

          if (exists) {
            skippedCount++;
            continue;
          }

          const dto: CreateProductVariantDto = {
            product_id: productId,
            size: size,
            color_id: colorId,
            price: productPrice, 
            quantity: bulkQuantity ? parseInt(bulkQuantity) : 0, 
          };

          await productVariantApi.create(dto as unknown as Record<string, unknown>);
          createdCount++;
        }
      }

      toast.success(`Tạo ${createdCount} variants! (Bỏ qua ${skippedCount} trùng)`);
      
      setSelectedColors([]);
      setSelectedSizes([]);
      setBulkQuantity('');
      
      fetchVariants();
    } catch (error) {
      console.error('Error bulk generating variants:', error);
      toast.error('Không thể tạo variants hàng loạt');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      toast.error('Vui lòng lưu sản phẩm trước khi thêm variants');
      return;
    }

    if (!formData.price || !formData.quantity) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      if (editingVariant) {
        const dto: UpdateProductVariantDto = {
          size: formData.size,
          color_id: formData.color_id ? parseInt(formData.color_id) : undefined,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        };
        console.log('🔄 Updating variant:', editingVariant.id, dto);
        const response = await productVariantApi.update(editingVariant.id, dto as Record<string, unknown>);
        console.log('✅ Update response:', response);
        toast.success('Cập nhật variant thành công!');
      } else {
        const dto: CreateProductVariantDto = {
          product_id: productId,
          size: formData.size,
          color_id: formData.color_id ? parseInt(formData.color_id) : undefined,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
        };
        console.log('➕ Creating variant:', dto);
        const response = await productVariantApi.create(dto as unknown as Record<string, unknown>);
        console.log('✅ Create response:', response);
        toast.success('Thêm variant thành công!');
      }

      setShowModal(false);
      fetchVariants();
    } catch (error) {
      console.error('❌ Error saving variant:', error);
      toast.error('Không thể lưu variant');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'color_id' && value === 'create-new') {
      console.log('🎨 Opening color modal...');
      setShowColorModal(true);
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewColorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateColor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newColorData.name_color.trim()) {
      toast.error('Vui lòng nhập tên màu');
      return;
    }

    try {
      const dto: CreateColorDto = {
        name_color: newColorData.name_color.trim(),
        hex_code: newColorData.hex_code || undefined,
      };

      const response = await colorApi.create(dto as unknown as Record<string, unknown>);
      const newColor = response.data;

      toast.success('Thêm màu mới thành công!');
      
      await fetchColors();
      
      setFormData((prev) => ({ ...prev, color_id: newColor.id.toString() }));
      
      setNewColorData({ name_color: '', hex_code: '' });
      setShowColorModal(false);
    } catch (error: unknown) {
      console.error('Error creating color:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const errResponse = error as { response?: { data?: { message?: string } } };
        toast.error(errResponse.response?.data?.message || 'Không thể tạo màu mới');
      } else {
        toast.error('Không thể tạo màu mới');
      }
    }
  };

  if (!productId) {
    return (
      <div className={styles.emptyState}>
        <p>Vui lòng lưu sản phẩm trước khi thêm variants</p>
      </div>
    );
  }

  const availableSizes = [SizeType.S, SizeType.M, SizeType.L, SizeType.XL];

  return (
    <div className={styles.container}>
      <div className={styles.bulkGenerator}>
        <h4>Tạo variants hàng loạt</h4>
        <p className={styles.bulkDescription}>
          Chọn màu sắc và size, hệ thống tự động tạo tất cả biến thể với giá từ sản phẩm gốc
        </p>

        <div className={styles.bulkForm}>
          <div className={styles.bulkFormGroup}>
            <label>Chọn màu sắc:</label>
            <div className={styles.checkboxGrid}>
              {colors.map((color) => (
                <label key={color.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedColors([...selectedColors, color.id]);
                      } else {
                        setSelectedColors(selectedColors.filter((id) => id !== color.id));
                      }
                    }}
                  />
                  <span className={styles.colorOption}>
                    {color.hex_code && (
                      <span
                        className={styles.colorSwatch}
                        style={{ backgroundColor: color.hex_code }}
                      />
                    )}
                    {color.name_color}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.bulkFormGroup}>
            <label>Chọn size:</label>
            <div className={styles.checkboxGrid}>
              {availableSizes.map((size) => (
                <label key={size} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSizes([...selectedSizes, size]);
                      } else {
                        setSelectedSizes(selectedSizes.filter((s) => s !== size));
                      }
                    }}
                  />
                  <span className={styles.sizeBadge}>{size}</span>
                </label>
              ))}
            </div>
          </div>
          <div className={styles.bulkFormGroup}>
            <label>Số lượng chung:</label>
            <input
              type="number"
              value={bulkQuantity}
              onChange={(e) => setBulkQuantity(e.target.value)}
              placeholder="Nhập số lượng cho tất cả variants (để trống = 0)"
              className={styles.input}
              min="0"
            />
          </div>

          <div className={styles.bulkInfoBox}>
            <p><strong>Lưu ý:</strong></p>
            <ul>
              <li>Giá của variants sẽ lấy từ <strong>giá sản phẩm gốc</strong> ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productPrice)})</li>
              <li>Tất cả variants sẽ có <strong>cùng số lượng</strong> mà bạn nhập ở trên</li>
            </ul>
          </div>

          <button
            type="button"
            className={styles.bulkGenerateBtn}
            onClick={handleBulkGenerate}
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : `Tạo ${selectedColors.length * selectedSizes.length} variants`}
          </button>
        </div>
      </div>

      <div className={styles.header}>
        <h3>Biến thể sản phẩm</h3>
        <button type="button" className={styles.refreshButton} onClick={fetchVariants}>
          <MdRefresh /> Làm mới
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Đang tải...</p>
        </div>
      ) : variants.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Chưa có biến thể nào. Nhấn "Thêm biến thể" để tạo mới.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Size</th>
                <th>Màu sắc</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id}>
                  <td>
                    <span className={styles.sizeBadge}>{variant.size || '-'}</span>
                  </td>
                  <td>
                    {variant.color ? (
                      <span className={styles.colorInfo}>{variant.color.name_color}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={styles.price}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price)}
                  </td>
                  <td>
                    <span className={variant.quantity > 0 ? styles.inStock : styles.outOfStock}>
                      {variant.quantity}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() => handleEdit(variant)}
                        title="Cập nhật"
                      >
                        <MdEdit />
                      </button>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(variant.id)}
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
        </div>
      )}

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingVariant ? 'Sửa biến thể' : 'Thêm biến thể mới'}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <MdClose />
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Size</label>
                  <select name="size" value={formData.size} onChange={handleChange} className={styles.select}>
                    <option value={SizeType.S}>S</option>
                    <option value={SizeType.M}>M</option>
                    <option value={SizeType.L}>L</option>
                    <option value={SizeType.XL}>XL</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Màu sắc</label>
                  <select name="color_id" value={formData.color_id} onChange={handleChange} className={styles.select}>
                    <option value="">-- Chọn màu --</option>
                    {colors.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name_color} {color.hex_code ? `(${color.hex_code})` : ''}
                      </option>
                    ))}
                    <option value="create-new" style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                      + Tạo màu mới
                    </option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Giá *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Số lượng *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button 
                  type="button" 
                  className={styles.submitBtn}
                  onClick={(e) => {
                    const syntheticEvent = e as unknown as React.FormEvent;
                    handleSubmit(syntheticEvent);
                  }}
                >
                  <MdSave /> {editingVariant ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showColorModal && (
        <div className={styles.colorModalOverlay} onClick={() => setShowColorModal(false)}>
          <div className={styles.modalContentSmall} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Tạo màu mới</h3>
              <button className={styles.closeBtn} onClick={() => setShowColorModal(false)}>
                <MdClose />
              </button>
            </div>

            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Tên màu *</label>
                <input
                  type="text"
                  name="name_color"
                  value={newColorData.name_color}
                  onChange={handleColorChange}
                  className={styles.input}
                  placeholder="Ví dụ: Xanh Navy, Đỏ Đô, ..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Mã màu (Hex) - Tùy chọn</label>
                <div className={styles.colorInputWrapper}>
                  <input
                    type="text"
                    name="hex_code"
                    value={newColorData.hex_code}
                    onChange={handleColorChange}
                    className={styles.input}
                    placeholder="#FF5733"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                  <input
                    type="color"
                    value={newColorData.hex_code || '#000000'}
                    onChange={(e) => setNewColorData((prev) => ({ ...prev, hex_code: e.target.value }))}
                    className={styles.colorPicker}
                  />
                </div>
                <small className={styles.helpText}>Ví dụ: #FF5733</small>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowColorModal(false)}>
                  Hủy
                </button>
                <button 
                  type="button" 
                  className={styles.submitBtn}
                  onClick={(e) => {
                    const syntheticEvent = e as unknown as React.FormEvent;
                    handleCreateColor(syntheticEvent);
                  }}
                >
                  <MdSave /> Tạo màu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
