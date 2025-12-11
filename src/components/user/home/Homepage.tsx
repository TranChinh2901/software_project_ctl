'use client';

import ListBanners from './ListBanners';
import Features from './Features';
import styles from '../../../styles/homepage/Homepage.module.css';

const Homepages = () => {
  return (
    <div className={styles.homepage}>
      {/* Banner Slider Section */}
      <ListBanners />

      {/* Features Section */}
      <Features />

    
    </div>
  );
};

export default Homepages;
