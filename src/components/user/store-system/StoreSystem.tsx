'use client';

import { useState } from 'react';
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import styles from '../../../styles/store-system/StoreSystem.module.css';
import { MdStore, MdPeople, MdAccessTime, MdLocationOn, MdPhone, MdMap } from 'react-icons/md';

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  hotline: string;
  mapUrl: string;
  lat: number;
  lng: number;
}
const stores: Store[] = [
  {
    id: 1,
    name: 'ND Theme Huế',
    address: 'Đội 2, thôn Thanh Cần, Xã Đan Điền, Thừa Thiên Huế',
    city: 'Thừa Thiên Huế',
    phone: '1900 6750',
    hotline: '1900 6750',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Đội+2+thôn+Thanh+Cần+Xã+Đan+Điền+Thừa+Thiên+Huế',
    lat: 16.4637,
    lng: 107.5909
  },
  {
    id: 2,
    name: 'ND Theme Đà Nẵng',
    address: 'Kiệt 18/06/02b Phạm Nhữ Tăng, Quận Thanh Khê, Đà Nẵng',
    city: 'Đà Nẵng',
    phone: '1900 6750',
    hotline: '1900 6750',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kiệt+18%2F06%2F02b+Phạm+Nhữ+Tăng+Thanh+Khê+Đà+Nẵng',
    lat: 16.0544,
    lng: 108.2022
  },
  {
    id: 3,
    name: 'ND Theme Hà Nội',
    address: '238 Hoàng Quốc Việt, Hà Nội',
    city: 'Hà Nội',
    phone: '1900 6750',
    hotline: '1900 6750',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=238+Hoàng+Quốc+Việt+Hà+Nội',
    lat: 21.0478,
    lng: 105.7953
  },
  {
    id: 4,
    name: 'ND Theme Hồ Chí Minh',
    address: 'Lầu 5, Toà Lữ Gia, 70 Lữ Gia, Quận 11, TP HCM',
    city: 'TP Hồ Chí Minh',
    phone: '1900 6750',
    hotline: '1900 6750',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=70+Lữ+Gia+Quận+11+TP+HCM',
    lat: 10.7626,
    lng: 106.6490
  }
];


const StoreSystem = () => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<Store>(stores[0]);

  const cities = ['all', ...Array.from(new Set(stores.map(store => store.city)))];

  const filteredStores = selectedCity === 'all' 
    ? stores 
    : stores.filter(store => store.city === selectedCity);

  const handleViewMap = (store: Store) => {
    setSelectedStore(store);
  };

  return (
    <div className={styles.container}>
      <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Hệ thống cửa hàng' }]} />
      
      <div className={styles.headerSection}>
        <div className={styles.headerCard}>
          <MdStore className={styles.headerIcon} />
          <div>
            <h3>Hệ thống 8 cửa hàng</h3>
            <p>Trên toàn quốc</p>
          </div>
        </div>
        <div className={styles.headerCard}>
          <MdPeople className={styles.headerIcon} />
          <div>
            <h3>Hơn 100 nhân viên</h3>
            <p>Để phục vụ quý khách</p>
          </div>
        </div>
        <div className={styles.headerCard}>
          <MdAccessTime className={styles.headerIcon} />
          <div>
            <h3>Mở cửa 8-22h</h3>
            <p>cả CN & Lễ tết</p>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <div className={styles.filterSection}>
            <label htmlFor="city-select">Chọn tỉnh thành</label>
            <select 
              id="city-select"
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className={styles.citySelect}
            >
              <option value="all">Chọn quận/huyện</option>
              {cities.slice(1).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className={styles.storeList}>
            {filteredStores.map((store) => (
              <div 
                key={store.id} 
                className={`${styles.storeCard} ${selectedStore.id === store.id ? styles.activeStore : ''}`}
                onClick={() => handleViewMap(store)}
              >
                <h3>{store.name}</h3>
                <div className={styles.storeInfo}>
                  <MdLocationOn className={styles.infoIcon} />
                  <span><strong>Địa chỉ:</strong> {store.address}</span>
                </div>
                <div className={styles.storeInfo}>
                  <MdPhone className={styles.infoIcon} />
                  <span><strong>Hotline:</strong> {store.hotline}</span>
                </div>
                <button 
                  className={styles.viewMapBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(store.mapUrl, '_blank');
                  }}
                >
                  <MdMap /> Xem bản đồ lớn hơn
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.mapSection}>
          <div className={styles.mapContainer}>
            <iframe
              key={selectedStore.id}
              src={`https://www.google.com/maps?q=${selectedStore.lat},${selectedStore.lng}&hl=vi&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${selectedStore.name}`}
            />
          </div>
          <div className={styles.mapInfo}>
            <h3>{selectedStore.name}</h3>
            <p>{selectedStore.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSystem;
