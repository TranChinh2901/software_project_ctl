'use client';
import styles from '@/styles/products/SizeGuideModal.module.css';

interface Props {
  onClose: () => void;
}

const SizeGuideModal = ({ onClose }: Props) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Bảng hướng dẫn chọn size</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Size</th>
              <th>Chiều cao (cm)</th>
              <th>Cân nặng (kg)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>S</td>
              <td>155 – 165</td>
              <td>45 – 55</td>
            </tr>
            <tr>
              <td>M</td>
              <td>165 – 170</td>
              <td>55 – 65</td>
            </tr>
            <tr>
              <td>L</td>
              <td>170 – 175</td>
              <td>65 – 75</td>
            </tr>
            <tr>
              <td>XL</td>
              <td>175 – 180</td>
              <td>75 – 85</td>
            </tr>
          </tbody>
        </table>

        <button className={styles.closeBtn} onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default SizeGuideModal;
