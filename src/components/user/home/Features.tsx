'use client';

import { MdLocalShipping, MdCardGiftcard, MdAutorenew, MdSupportAgent } from 'react-icons/md';
import styles from '../../../styles/homepage/Features.module.css';

const Features = () => {
  const features = [
    {
      icon: <MdLocalShipping />,
      title: 'Giao hàng toàn quốc',
      description: 'Thanh toán (COD) khi nhận hàng',
    },
    {
      icon: <MdCardGiftcard />,
      title: 'Miễn phí giao hàng',
      description: 'Theo chính sách',
    },
    {
      icon: <MdAutorenew />,
      title: 'Đổi trả trong 7 ngày',
      description: 'Kể từ ngày mua hàng',
    },
    {
      icon: <MdSupportAgent />,
      title: 'Hỗ trợ 24/7',
      description: 'Theo chính sách',
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresContainer}>
        {features.map((feature, index) => (
          <div key={index} className={styles.featureItem}>
            <div className={styles.iconWrapper}>
              {feature.icon}
            </div>
            <div className={styles.featureContent}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
