
"use client"

import React from 'react'
import styles from '../../styles/Header/header.module.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import { FaHeart, FaUser, FaShoppingCart, FaSearch, FaRegHeart, FaRegUserCircle } from "react-icons/fa"
import Image from "next/image";
import Link from 'next/link'
import { VscInbox } from 'react-icons/vsc'

export default function Header() {
  return (
    <div className={styles.headerRoot}>
      {/* Header Top */}
      <div className={styles.headerTop}>
        <div className={styles.headerTopContainer}>
          <div className={styles.headerSlider}>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{ delay: 2500, disableOnInteraction: false }}
              navigation
              loop
            >
              <SwiperSlide><h2 className={styles.headerTitle}>ĐỒ MẶC CẢ NHÀ, ÊM ÁI CẢ NGÀY</h2></SwiperSlide>
              <SwiperSlide><h2 className={styles.headerTitle}>CHÀO ĐÓN BỘ SƯU TẬP THU ĐÔNG 2025</h2></SwiperSlide>
              <SwiperSlide><h2 className={styles.headerTitle}>PHÁI ĐẸP ĐỂ YÊU, VẠN DEAL CƯNG CHIỀU</h2></SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>

      {/* ==== HEADER BOTTOM ==== */}
      <div className={styles.headerBottom}>
        <div className={styles.headerBottomContainer}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/">
              <Image
                src="https://bizweb.dktcdn.net/100/534/571/themes/972900/assets/logo.png?1749442635129"
                alt="Logo"
                width={120}
                height={50}
              />
            </Link>
          </div>

          {/* Search */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>
              <FaSearch />
            </button>
          </div>

          {/* Icons */}
          <div className={styles.icons}>
            <div className={styles.iconItem}>
             <FaRegHeart />
              <span>Yêu thích</span>
            </div>
            <div className={styles.iconItem}>
              <FaRegUserCircle />
              <span>Tài khoản</span>
            </div>
            <div className={styles.iconItem}>
            <VscInbox />
              <span>Giỏ hàng</span>
              <span className={styles.cartBadge}>3</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className={styles.navMenu}>
          <ul>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/products">Nữ</Link></li>
            <li><Link href="/nam">Nam</Link></li>
            <li><Link href="/tin-tuc">Tin tức</Link></li>
            <li><Link href="/lien-he">Liên hệ</Link></li>
            <li><Link href="/he-thong">Hệ thống cửa hàng</Link></li>
            <li><Link href="/kiem-tra">Kiểm tra đơn hàng</Link></li>
            <li><Link href="/chi-tiet">Chi tiết sản phẩm</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
