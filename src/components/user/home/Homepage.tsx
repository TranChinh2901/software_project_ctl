'use client';

import { useState, useEffect } from 'react';
import ListBanners from './ListBanners';
import Features from './Features';
import ListBrand from './ListBrand';
// import ListVoucher from './ListVoucher';
import ListProducts from './ListProducts';
import { brandApi, voucherApi, productApi } from '@/lib/api';
import { Brand } from '@/types/brand';
import { Voucher } from '@/types/voucher';
import { Product } from '@/types/product';
import styles from '../../../styles/homepage/Homepage.module.css';
// import ListBlog from './ListBlog';
import ListVoucher from './ListVoucher';

const Homepages = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  // const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await brandApi.getAll();
        setBrands(response.data?.data || response.data || []);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoadingBrands(false);
      }
    };

    // const fetchVouchers = async () => {
    //   try {
    //     const response = await voucherApi.getAll();
    //     setVouchers(response.data?.data || response.data || []);
    //   } catch (error) {
    //     console.error('Error fetching vouchers:', error);
    //   } finally {
    //     setLoadingVouchers(false);
    //   }
    // };

    const fetchProducts = async () => {
      try {
        const response = await productApi.getAll({ limit: 20 });
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productsResponse = (response as any)?.data;
        const productsData = productsResponse?.products || productsResponse || response;
        
        const finalProducts = Array.isArray(productsData) ? productsData : [];
        setProducts(finalProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchBrands();
    // fetchVouchers();
    fetchProducts();
  }, []);

  return (
    <div className={styles.homepage}>
      <ListBanners />
      <Features />
       <ListVoucher />
      <ListBrand brands={brands} loading={loadingBrands} />
      {/* <ListVoucher vouchers={vouchers} loading={loadingVouchers} /> */}
     
      <ListProducts products={products} loading={loadingProducts} />
      {/* <ListBlog /> */}
    </div>
  );
};

export default Homepages;
