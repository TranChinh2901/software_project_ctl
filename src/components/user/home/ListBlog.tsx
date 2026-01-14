// "use client";
// import { useEffect, useState } from "react";
// import styles from "../../../styles/homepage/ListBlog.module.css";
// import { Blog } from "@/types";
// import { blogApi } from "@/lib/api";
// import toast from "react-hot-toast";
// import Breadcrumb from "@/components/breadcrumb/breadcrumb";
// const ListBlog = () => {
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchBlogs();
//   }, []);
//   const fetchBlogs = async () => {
//     try {
//       setLoading(true);
//       const response = await blogApi.getAll();
//       const blogsData = response.data?.blogs || response.data || [];
//       const activeBlogsList = Array.isArray(blogsData)
//         ? blogsData.filter((blog: Blog) => blog.status === "active")
//         : [];
//       setBlogs(activeBlogsList);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       toast.error("Không thể tải danh sách tin tức");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleBlogClick = () => {
//     window.location.href = '/blogs';  
//   }
//    if (loading) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.loadingState}>
//           <div className={styles.spinner} />
//           <p>Đang tải tin tức...</p>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className={styles.listBlogContainer}>
//       <h2>List Blog Component</h2>
//       <div className={styles.listBlogs}>
//         {blogs.map((blog) => (
//              <div
//                   key={blog.id}
//                   className={styles.sidebarItem}
//                   onClick={() => handleBlogClick()}
//                 >
//                   <div className={styles.sidebarItemImage}>
//                     <img
//                       src={blog.image_blogs || '/placeholder-blog.jpg'}
//                       alt={blog.title}
//                     />
//                   </div>
//                   <h4 className={styles.sidebarItemTitle}>{blog.title}</h4>
//                 </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ListBlog;
