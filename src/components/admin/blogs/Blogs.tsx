"use client";
import { useState, useEffect } from "react";
import { 
  MdAdd, 
  MdRefresh, 
  MdSearch,
  MdEdit,
  MdDelete,
  MdArticle,
  MdCheckCircle,
  MdImage,
  MdPerson,
} from "react-icons/md";
import { blogApi } from '@/lib/api';
import PageContainer from "../PageContainer";
import Button from "../Button";
import Card from '@/components/admin/Card';
import BlogModal from '@/components/admin/blogs/edit/BlogModal';
import styles from '@/styles/admin/Blogs.module.css';
import toast from 'react-hot-toast';
import { Blog } from "@/types";

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getAll();
      const blogsData = response.data?.blogs || [];
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (blogId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    
    try {
      await blogApi.delete(blogId);
      toast.success('Xóa bài viết thành công');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || 'Không thể xóa bài viết';
      toast.error(errorMessage);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedBlog(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBlog(null);
  };

  const handleModalSuccess = () => {
    fetchBlogs();
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBlogs = blogs.length;
  const activeBlogs = blogs.filter(b => b.status === 'active').length;
  const blogsWithImage = blogs.filter(b => b.image_blogs).length;

  return (
    <PageContainer
      title="Quản lý bài viết"
      description="Danh sách tất cả bài viết trong hệ thống"
      action={
        <>
          <Button
            variant="secondary"
            size="md"
            icon={<MdRefresh />}
            onClick={fetchBlogs}
          >
            Làm mới
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<MdAdd />}
            onClick={handleOpenCreateModal}
          >
            Thêm bài viết
          </Button>
        </>
      }
    >
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#ff634715', color: '#ff6347' }}>
              <MdArticle />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Tổng bài viết</div>
              <div className={styles.statValue}>{totalBlogs}</div>
            </div>
          </div>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#48bb7815', color: '#48bb78' }}>
              <MdCheckCircle />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Đang hoạt động</div>
              <div className={styles.statValue}>{activeBlogs}</div>
            </div>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statIcon} style={{ background: '#4299e115', color: '#4299e1' }}>
              <MdImage />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>Có hình ảnh</div>
              <div className={styles.statValue}>{blogsWithImage}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className={styles.filterCard}>
        <div className={styles.filterContainer}>
          <div className={styles.searchBox}>
            <MdSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, nội dung..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Đang tải dữ liệu...</p>
          </div>
        </Card>
      ) : filteredBlogs.length === 0 ? (
        <Card>
          <div className={styles.emptyState}>
            <MdArticle className={styles.emptyIcon} />
            <p>Không tìm thấy bài viết nào</p>
          </div>
        </Card>
      ) : (
        <div className={styles.blogsGrid}>
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className={styles.blogCard}>
              <div className={styles.blogCardContent}>
                {blog.image_blogs && (
                  <div className={styles.blogImageContainer}>
                    <img 
                      src={blog.image_blogs} 
                      alt={blog.title}
                      className={styles.blogImage}
                    />
                  </div>
                )}
                <div className={styles.blogInfo}>
                  <div className={styles.blogTitle}>
                    {blog.title ? 
                    (blog.title.length > 20 ? 
                      `${blog.title.substring(0, 20)}...` : 
                      blog.title
                    ) : 
                    'Chưa có tiêu đề'
                    
                    }</div>
                  <div 
                    className={styles.blogContent}
                    dangerouslySetInnerHTML={{
                      __html: blog.content 
                        ? (blog.content.length > 150 
                            ? `${blog.content.substring(0, 150)}...` 
                            : blog.content)
                        : 'Chưa có nội dung'
                    }}
                  />
                  <div className={styles.blogMeta}>
                    <span className={`${styles.blogStatus} ${styles[blog.status]}`}>
                      {blog.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                    {blog.author && (
                      <span className={styles.blogAuthor}>
                        <MdPerson />
                        {blog.author.fullname || blog.author.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.blogFooter}>
                <div className={styles.blogDate}>
                  {/* {blog.created_at && (
                    <>
                      <MdCalendarToday />
                      <span>{new Date(blog.created_at).toLocaleDateString('vi-VN')}</span>
                    </>
                  )} */}
                </div>
                <div className={styles.blogActions}>
                  <button 
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleOpenEditModal(blog)}
                    title="Chỉnh sửa"
                  >
                    <MdEdit />
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteBlog(blog.id)}
                    title="Xóa"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <BlogModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        blog={selectedBlog}
        onSuccess={handleModalSuccess}
      />
    </PageContainer>
  );
};

export default Blogs;
