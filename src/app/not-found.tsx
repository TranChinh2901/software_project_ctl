import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div style={{padding: 40, textAlign: 'center'}}>
      <h1 style={{fontSize: 50, margin: '0 0 12px'}}>404</h1>
      <p style={{fontSize: 18, margin: '0 0 16px'}}>Trang bạn tìm không tồn tại.</p>
      <Link href="/" style={{color: '#ff6347'}}>Quay về trang chủ</Link>
    </div>
  )
}
