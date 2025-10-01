import React from 'react'
import '../globals.css'

export const metadata = {
  title: 'Admin - ND Style'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{background: '#111', color: '#fff', padding: '12px 16px'}}> 
          <strong>Admin Panel</strong>
        </div>

        <main style={{padding: '0px'}}>
          {children}
        </main>
      </body>
    </html>
  )
}
