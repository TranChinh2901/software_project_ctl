"use client";

import { useState, useEffect, useRef } from "react";
import {
  MdClose,
  MdBusiness,
  MdDescription,
  MdImage,
  MdCloudUpload,
  MdSave,
} from "react-icons/md";

import { brandApi } from "@/lib/api";
import toast from "react-hot-toast";
import styles from "./BrandModal.module.css";
import { Brand } from "@/types/brand";

interface BrandModalProps {
  isOpen: boolean;
  brand: Brand | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface BrandFormData {
  name_brand: string;
  description_brand: string;
}
export default function BrandModal({
  isOpen,
  brand,
  onClose,
  onSuccess,
}: BrandModalProps) {
  const [formData, setFormData] = useState<BrandFormData>({
    name_brand: "",
    description_brand: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (brand && isOpen) {
      setFormData({
        name_brand: brand.name_brand,
        description_brand: brand.description_brand || "",
      });
      setLogoPreview(brand.logo_url || "");
      setLogoFile(null);
      setErrors({});
    } else if (isOpen) {
      setFormData({
        name_brand: "",
        description_brand: "",
      });
      setLogoPreview("");
      setLogoFile(null);
      setErrors({});
    }
  }, [brand, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name_brand.trim()) {
      newErrors.name_brand = "Vui lòng nhập tên thương hiệu";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setLogoFile(null);
    setLogoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("name_brand", formData.name_brand.trim());
      formDataToSend.append(
        "description_brand",
        formData.description_brand.trim()
      );

      if (logoFile) {
        formDataToSend.append("logo", logoFile);
      }

      for (const pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      if (brand) {
        await brandApi.update(brand.id, formDataToSend);
        toast.success("Cập nhật thương hiệu thành công!");
      } else {
        await brandApi.create(formDataToSend);
        toast.success("Thêm thương hiệu thành công!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving brand:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Không thể lưu thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <MdBusiness />
            <span>
              {brand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
            </span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdBusiness />
                  Tên thương hiệu <span className={styles.required}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <MdBusiness className={styles.inputIcon} />
                  <input
                    type="text"
                    name="name_brand"
                    value={formData.name_brand}
                    onChange={handleChange}
                    className={`${styles.input} ${
                      errors.name_brand ? styles.error : ""
                    }`}
                    placeholder="Nhập tên thương hiệu"
                  />
                </div>
                {errors.name_brand && (
                  <span className={styles.errorMessage}>
                    {errors.name_brand}
                  </span>
                )}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdDescription />
                  Mô tả
                </label>
                <div className={styles.inputWrapper}>
                  <textarea
                    name="description_brand"
                    value={formData.description_brand}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Nhập mô tả thương hiệu"
                    rows={4}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MdImage />
                  Logo thương hiệu
                </label>
                <div className={styles.imageUploadContainer}>
                  <div
                    className={`${styles.imagePreview} ${
                      logoPreview ? styles.hasImage : ""
                    }`}
                  >
                    {logoPreview ? (
                      <>
                        <img
                          src={logoPreview}
                          alt="Preview"
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          className={styles.removeImageButton}
                          onClick={handleRemoveImage}
                        >
                          <MdClose />
                        </button>
                      </>
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <MdCloudUpload className={styles.uploadIcon} />
                        <div className={styles.uploadText}>
                          <strong onClick={() => fileInputRef.current?.click()}>
                            Chọn ảnh
                          </strong>{" "}
                          hoặc kéo thả vào đây
                          <br />
                          <small>PNG, JPG, GIF tối đa 5MB</small>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className={styles.fileInput}
                  />
                  <button
                    type="button"
                    className={styles.uploadButton}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <MdCloudUpload />
                    Chọn file
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.loadingSpinner} />
                  Đang lưu...
                </>
              ) : (
                <>
                  <MdSave />
                  {brand ? "Cập nhật" : "Thêm mới"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
