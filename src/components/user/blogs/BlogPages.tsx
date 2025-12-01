'use client'
import Breadcrumb from '@/components/breadcrumb/breadcrumb'

const BlogPages = () => {
  return (
    <div className=''>
       <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tin tức' }]} />
    </div>
  )
}

export default BlogPages
