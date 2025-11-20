'use client'
import styles from '../../../styles/contact/contact.module.css'
import Breadcrumb from "../../breadcrumb/breadcrumb"
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa'

export default function ContactPage() {

    return (
        <div className={styles.contactContainer}>
             <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Liên hệ' }]} />
           <div className={styles.contactHeader}>
             <h1>Thông tin liên hệ</h1>
            <p>Chúng tôi vinh hạnh vì đã có cơ hội đồng hành với hơn 10.000 khách hàng trên khắp thế giới.</p>
           </div>
           
           <div className={styles.infoGrid}>
                <div className={styles.infoBox}>
                    <div className={styles.iconWrapper}>
                        <FaMapMarkerAlt />
                    </div>
                    <h3>Địa chỉ</h3>
                    <p>18 Phạm Nhữ Tăng</p>
                </div>
                <div className={styles.infoBox}>
                    <div className={styles.iconWrapper}>
                        <FaEnvelope />
                    </div>
                    <h3>Email</h3>
                    <p>support@tvc.vn</p>
                </div>
                <div className={styles.infoBox}>
                    <div className={styles.iconWrapper}>
                        <FaPhoneAlt />
                    </div>
                    <h3>Hotline</h3>
                    <p>0763723475</p>
                </div>
           </div>

           <div className={styles.contentSection}>
                <div className={styles.mapColumn}>
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.XXXXXX!2d108.1882731!3d16.0646894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219005b1da607%3A0x9092a3e383656014!2s18+Ph%E1%BA%A1m+Nh%E1%BB%AF+T%C4%83ng%2C+Thanh+Kh%C3%AA+%C4%90%C3%B4ng%2C+Thanh+Kh%C3%AA%2C+%C4%90%C3%A0+N%E1%BA%B5ng+50042%2C+Vi%E1%BB%87t+Nam!5e0!3m2!1svi!2s!4vXXXXXX" 
                        width="100%" 
                        height="450" 
                        style={{border:0}} 
                        allowFullScreen={true} 
                        loading="lazy"
                        title="Google Map"
                    ></iframe>
                </div>
                <div className={styles.formColumn}>
                    <form className={styles.contactForm}>
                        <div className={styles.formGroup}>
                            <input type="text" placeholder="Họ và tên" className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <input type="email" placeholder="Email" className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <input type="tel" placeholder="Điện thoại" className={styles.input} />
                        </div>
                        <div className={styles.formGroup}>
                            <textarea placeholder="Nội dung" rows={5} className={styles.textarea}></textarea>
                        </div>
                        <button type="submit" className={styles.submitBtn}>Gửi thông tin</button>
                    </form>
                </div>
           </div>
        </div>
    )
}