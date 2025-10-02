import React from 'react'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'

const page = () => {
  return (
    <div style={{maxWidth: 1200, margin: '0 auto'}}>
      <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Products' }]} />
      <h1>Danh sách sản phẩm</h1>
      <p>Hello product pages page</p>
    </div>
  )
}

export default page
