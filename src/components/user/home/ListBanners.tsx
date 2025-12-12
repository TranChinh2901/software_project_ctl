'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { bannerApi } from '@/lib/api';
import { Banner } from '@/types/banner';
import styles from '../../../styles/homepage/ListBanners.module.css';
import toast from 'react-hot-toast';

const ListBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerApi.getAll();
      const bannersData = response.data?.banners || response.data || [];
      
      const activeBanners = Array.isArray(bannersData)
        ? bannersData
            .filter((banner: Banner) => banner.status === 'active')
            .sort((a: Banner, b: Banner) => a.display_order - b.display_order)
        : [];
      
      setBanners(activeBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Không thể tải banner');
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className={styles.bannerSection}>
      <div className={styles.sliderContainer}>
        <div className={styles.sliderWrapper}>
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`${styles.slide} ${
                index === currentSlide ? styles.active : ''
              }`}
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className={styles.bannerImage}
              />
              <div className={styles.bannerContent}>
                <div className={styles.bannerText}>
                  {banner.subtitle && (
                    <p className={styles.subtitle}>{banner.subtitle}</p>
                  )}
                  <h1 className={styles.title}>{banner.title}</h1>
                  {banner.description && (
                    <p className={styles.description}>{banner.description}</p>
                  )}
                  {banner.button_text && banner.button_link && (
                    <Link
                      href={banner.button_link}
                      className={styles.bannerButton}
                    >
                      {banner.button_text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={`${styles.navButton} ${styles.prevButton}`}
              aria-label="Previous slide"
            >
              ‹
            </button>
            <button
              onClick={goToNext}
              className={`${styles.navButton} ${styles.nextButton}`}
              aria-label="Next slide"
            >
              ›
            </button>
          </>
        )}

        {banners.length > 1 && (
          <div className={styles.dotsContainer}>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`${styles.dot} ${
                  index === currentSlide ? styles.activeDot : ''
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ListBanners;
