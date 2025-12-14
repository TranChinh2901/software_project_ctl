'use client';
import { useEffect, useState } from 'react';
import style from '../../../styles/homepage/ListBlog.module.css'
import { Blog } from '@/types';
const ListBlog = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

    }, []);
    const fetchBlogs = async () => {
        
    }
  return (
    <div className={style.listBlogContainer}>
        <h2>List Blog Component</h2>

    </div>
  )
}

export default ListBlog
