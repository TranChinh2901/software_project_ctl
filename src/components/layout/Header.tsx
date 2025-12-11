
"use client"

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import styles from '../../styles/header/header.module.css'
import { FaSearch, FaRegHeart, FaRegUserCircle } from "react-icons/fa"
import Image from "next/image";
import Link from 'next/link'
import { VscInbox } from 'react-icons/vsc'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { RoleType } from '@/enums'
import toast from 'react-hot-toast'
import SearchDropdown from './SearchDropdown'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const { getCartCount } = useCart()
  const { wishlistCount } = useWishlist()

  const cartCount = getCartCount()

  function handleLogout(e: React.MouseEvent) {
    e.preventDefault()
    logout()
    toast.success("Đăng xuất thành công!")
    router.push('/')
    setMobileMenuOpen(false) 
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  function handleMobileSearch(e: React.FormEvent) {
    e.preventDefault()
    if (mobileSearchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(mobileSearchQuery.trim())}`)
      closeMobileMenu()
      setMobileSearchQuery('')
    }
  }
  return (
    <div className={styles.headerRoot}>
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

      <div className={styles.headerBottom}>
        <div className={styles.headerBottomContainer}>
          <div className={styles.logo}>
            <Link href="/">
              <Image
                src="https://bizweb.dktcdn.net/100/534/571/themes/972900/assets/logo.png?1749442635129"
                alt="Logo"
                width={200}
                height={70}
              />
            </Link>
          </div>
          <div className={styles.desktopSearchWrapper}>
            <SearchDropdown />
          </div>
          <button 
            className={`${styles.mobileMenuBtn} ${mobileMenuOpen ? styles.open : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className={styles.icons}>
            <Link href="/wishlist" className={styles.iconItem}>
              <FaRegHeart className={styles.iconBottom} />
              <span>Yêu thích</span>
              {wishlistCount > 0 && (
                <span className={styles.cartBadge}>{wishlistCount}</span>
              )}
            </Link>
            <div className={styles.accountDropdown}>
              <div className={styles.iconItem}>
                <FaRegUserCircle className={styles.iconBottom} />
                <span>Tài khoản</span>
              </div>
              <div className={styles.dropdownMenu}>
                {isAuthenticated ? (
                  <>
                    {user?.role === RoleType.ADMIN ? (
                      <>
                        <Link href="/admin">Dashboard</Link>
                        <a href="#logout" onClick={handleLogout}>Đăng xuất</a>
                      </>
                    ) : (
                      <>
                        <Link href="/profile">Hồ sơ</Link>
                        <a href="#logout" onClick={handleLogout}>Đăng xuất</a>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link href="/account/login">Đăng nhập</Link>
                    <Link href="/account/register">Đăng ký</Link>
                  </>
                )}
              </div>
            </div>
            <Link href="/cart" className={styles.iconItem}>
              <VscInbox className={styles.iconBottom} />
              <span>Giỏ hàng</span>
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
        <nav className={styles.navMenu}>
          <ul>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/products">Sản phẩm</Link></li>
            <li><Link href="/blogs">Tin tức</Link></li>
            <li><Link href="/contact">Liên hệ</Link></li>
            <li><Link href="/store-system">Hệ thống cửa hàng</Link></li>
            <li><Link href="/profile/orders">Kiểm tra đơn hàng</Link></li>
            <li><Link href="/chi-tiet">Chi tiết sản phẩm</Link></li>
          </ul>
        </nav>
        <div 
          className={`${styles.mobileMenuOverlay} ${mobileMenuOpen ? styles.open : ''}`}
          onClick={closeMobileMenu}
        ></div>
        <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuContent}>
            
            <div className={styles.mobileMenuHeader}>
              <h2>ND Style</h2>
              <p>Thời trang cho mọi phong cách</p>
            </div>
            <div className={styles.mobileAuthSection}>
              {isAuthenticated ? (
                <>
                  {user?.role === RoleType.ADMIN ? (
                    <>
                      <Link href="/admin" className={styles.loginBtn} onClick={closeMobileMenu}>
                        Dashboard
                      </Link>
                      <button className={styles.registerBtn} onClick={handleLogout}>
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/profile" className={styles.loginBtn} onClick={closeMobileMenu}>
                        Hồ sơ
                      </Link>
                      <button className={styles.registerBtn} onClick={handleLogout}>
                        Đăng xuất
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link href="/account/login" className={styles.loginBtn} onClick={closeMobileMenu}>
                    Đăng nhập
                  </Link>
                  <Link href="/account/register" className={styles.registerBtn} onClick={closeMobileMenu}>
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
            <div className={styles.mobileSearchSection}>
              <h3>Tìm kiếm</h3>
              <form onSubmit={handleMobileSearch} className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className={styles.searchInput}
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                />
                <button type="submit" className={styles.searchBtn}>
                  <FaSearch />
                </button>
              </form>
            </div>

            <div className={styles.mobileMenuSection}>
              <h3>Danh mục</h3>
              <ul className={styles.mobileMenuLinks}>
                <li><Link href="/" onClick={closeMobileMenu}>Trang chủ</Link></li>
                <li><Link href="/products" onClick={closeMobileMenu}>Sản phẩm</Link></li>
                <li><Link href="/blogs" onClick={closeMobileMenu}>Tin tức</Link></li>
                <li><Link href="/contact" onClick={closeMobileMenu}>Liên hệ</Link></li>
              </ul>
            </div>

            <div className={styles.mobileMenuSection}>
              <h3>Dịch vụ</h3>
              <ul className={styles.mobileMenuLinks}>
                <li><Link href="/store-system" onClick={closeMobileMenu}>Hệ thống cửa hàng</Link></li>
                <li><Link href="/profile/orders" onClick={closeMobileMenu}>Kiểm tra đơn hàng</Link></li>
                <li>
                  <Link href="/wishlist" onClick={closeMobileMenu} className={styles.iconLink}>
                    <FaRegHeart className={styles.mobileIcon} />
                    Yêu thích
                    {wishlistCount > 0 && (
                      <span className={styles.mobileBadge}>{wishlistCount}</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link href="/cart" onClick={closeMobileMenu} className={styles.iconLink}>
                    <VscInbox className={styles.mobileIcon} />
                    Giỏ hàng
                    {cartCount > 0 && (
                      <span className={styles.mobileBadge}>{cartCount}</span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}