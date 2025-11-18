import React from 'react'
import styles from '../../styles/footer/footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footerRoot}>
      <div className={styles.container}>
        <div className={styles.brandBox}>
          <div className={styles.brandLogo}>
            ND Style
            </div>
          <div className={styles.social} aria-hidden>
            <span>🎵</span>
            <span>📸</span>
            <span>📘</span>
            <span>▶️</span>
            <span>🐦</span>
          </div>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <h4>CÔNG TY ABC</h4>
            <div className={styles.smallText}>
              Số ĐKKD 0123456789 cấp ngày 28/09/2025 tại Sở Kế hoạch Đầu tư TP. Đà Nẵng
              <br />
              <strong>Địa chỉ:</strong> K18 Phạm Nhữ Tăng, Đà Nẵng
              <br />
              <strong>Email:</strong> tranchinht32901@gmail.com
              <br />
              <strong>Hotline:</strong> 1900 6750
            </div>
          </div>

          <div className={styles.col}>
            <h4>VỀ CHÚNG TÔI</h4>
            <div className={styles.smallText}>
              Giới thiệu<br />
              Liên hệ<br />
              Tin tức<br />
              Hệ thống cửa hàng<br />
              Sản phẩm
            </div>
          </div>

          <div className={styles.col}>
            <h4>DỊCH VỤ KHÁCH HÀNG</h4>
            <div className={styles.smallText}>
              Kiểm tra đơn hàng<br />
              Chính sách vận chuyển<br />
              Chính sách đổi trả<br />
              Bảo mật khách hàng<br />
              Đăng ký tài khoản
            </div>
          </div>
        </div>
      </div>

      <div className={styles.dashedSeparator} />
      <div className={styles.container}>
        <div className={styles.copyright}>© Đồ án công nghệ phần mềm | Caelstratos</div>
      </div>
    </footer>
  )
}