'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import { blogApi } from '@/lib/api';
import { Blog } from '@/types/blog';
import { MdCalendarToday, MdPerson, MdArrowBack } from 'react-icons/md';
import styles from '../../../styles/blogs/BlogPages.module.css';
import toast from 'react-hot-toast';

const BlogPages = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getAll();
      const blogsData = response.data?.blogs || response.data || [];
      const activeBlogsList = Array.isArray(blogsData) 
        ? blogsData.filter((blog: Blog) => blog.status === 'active')
        : [];
      
      setBlogs(activeBlogsList);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Không thể tải danh sách tin tức');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  const handleBackToList = () => {
    setSelectedBlog(null);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tin tức' }]} />
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Đang tải tin tức...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Tin tức' }]} />
      
      <div className={styles.pageHeader}>
        <h1>Tin tức & Xu hướng</h1>
        <p>Cập nhật những tin tức mới nhất về sản phẩm và xu hướng thời trang</p>
      </div>

      <div className={styles.blogLayout}>
        <div className={styles.leftSide}>
          {selectedBlog ? (
            <div className={styles.blogDetail}>
              <button onClick={handleBackToList} className={styles.backButton}>
                <MdArrowBack /> Quay lại danh sách
              </button>
              
              <div className={styles.detailHeader}>
                <h1 className={styles.detailTitle}>{selectedBlog.title}</h1>
                <div className={styles.detailMeta}>
                  <span className={styles.metaItem}>
                    <MdPerson />
                    {selectedBlog.author?.fullname || 'Admin'}
                  </span>
                  <span className={styles.metaItem}>
                    <MdCalendarToday />
                    {formatDate(selectedBlog.created_at)}
                  </span>
                </div>
              </div>

              <div className={styles.detailImage}>
                <img
                  src={selectedBlog.image_blogs || '/placeholder-blog.jpg'}
                  alt={selectedBlog.title}
                />
              </div>

              <div 
                className={styles.detailContent}
                dangerouslySetInnerHTML={{ __html: selectedBlog.content || '' }}
              />
            </div>
          ) : (
            <div className={styles.blogListWrapper}>
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div 
                    key={blog.id} 
                    className={styles.blogListItem}
                    onClick={() => handleBlogClick(blog)}
                  >
                    <div className={styles.listItemImage}>
                      <img
                        src={blog.image_blogs || '/placeholder-blog.jpg'}
                        alt={blog.title}
                      />
                    </div>
                    <div className={styles.listItemContent}>
                      <h3 className={styles.listItemTitle}>{blog.title}</h3>
                      <div className={styles.listItemMeta}>
                        <span className={styles.metaItem}>
                          <MdPerson />
                          {blog.author?.fullname || 'Admin'}
                        </span>
                        <span className={styles.metaItem}>
                          <MdCalendarToday />
                          {formatDate(blog.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>Không có tin tức nào.</p>
                </div>
              )}
            </div>
          )}
        </div>
        <aside className={styles.rightSide}>
          <div className={styles.sidebarWidget}>
            <h3 className={styles.widgetTitle}>Bài viết khác</h3>
            <div className={styles.sidebarList}>
              {blogs.slice(0, 6).map((blog) => (
                <div
                  key={blog.id}
                  className={styles.sidebarItem}
                  onClick={() => handleBlogClick(blog)}
                >
                  <div className={styles.sidebarItemImage}>
                    <img
                      src={blog.image_blogs || '/placeholder-blog.jpg'}
                      alt={blog.title}
                    />
                  </div>
                  <h4 className={styles.sidebarItemTitle}>{blog.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPages;
