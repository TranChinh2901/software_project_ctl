import Link from 'next/link'
import React from 'react'

export default function AdminNotFound() {
  return (
    <div style={{padding: 40, textAlign: 'center'}}>
      <h1 style={{fontSize: 48, margin: '0 0 12px'}}>404</h1>
      <p style={{fontSize: 18, margin: '0 0 16px'}}>Trang admin không tìm thấy.</p>
      <Link href="/admin" style={{color: '#ff6347'}}>Quay về dashboard</Link>
    </div>
  )
}
