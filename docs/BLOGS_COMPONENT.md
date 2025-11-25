# Component Blogs - Admin Dashboard

## 📋 Tổng quan

Component `Blogs` là một phần của admin dashboard để quản lý bài viết (blog posts) trong hệ thống. Component này cung cấp đầy đủ chức năng CRUD (Create, Read, Update, Delete) cho bài viết.

## 🎯 Tính năng chính

### 1. **Hiển thị danh sách bài viết**
- Grid layout responsive với card cho mỗi bài viết
- Hiển thị hình ảnh, tiêu đề, nội dung (rút gọn)
- Badge hiển thị trạng thái (Active/Inactive)
- Hover effects với animation mượt mà

### 2. **Thống kê**
- **Tổng bài viết**: Hiển thị tổng số bài viết trong hệ thống
- **Đang hoạt động**: Số bài viết có trạng thái active
- **Có hình ảnh**: Số bài viết có upload hình ảnh

### 3. **Tìm kiếm**
- Tìm kiếm real-time theo tiêu đề hoặc nội dung
- Search box với icon và placeholder rõ ràng

### 4. **Thêm bài viết mới**
- Modal form để tạo bài viết mới
- Upload hình ảnh với preview
- Chọn trạng thái (Active/Inactive)
- Validation form

### 5. **Chỉnh sửa bài viết**
- Modal form tương tự như tạo mới
- Pre-fill dữ liệu hiện tại
- Giữ hình ảnh cũ nếu không upload mới

### 6. **Xóa bài viết**
- Confirmation dialog trước khi xóa
- Toast notification sau khi xóa thành công

### 7. **Làm mới danh sách**
- Button để reload danh sách từ server

## 🏗️ Cấu trúc file

```
src/
├── components/admin/blogs/
│   ├── Blogs.tsx              # Component chính
│   └── edit/
│       └── BlogModal.tsx      # Modal create/edit
├── styles/admin/
│   └── Blogs.module.css       # Styles cho component
├── lib/api/
│   └── index.ts               # API endpoints (blogApi)
└── types/blog/
    └── index.ts               # TypeScript types
```

## 📦 Dependencies

- `react` - Core React
- `react-icons` - Icons (Material Design)
- `react-hot-toast` - Toast notifications
- API client từ `@/lib/api`

## 🔌 API Endpoints

Component sử dụng các endpoint sau:

```typescript
blogApi.getAll()              // GET /blogs - Lấy danh sách
blogApi.getById(id)           // GET /blogs/:id - Lấy chi tiết
blogApi.create(formData)      // POST /blogs - Tạo mới
blogApi.update(id, formData)  // PUT /blogs/:id - Cập nhật
blogApi.delete(id)            // DELETE /blogs/:id - Xóa
```

## 📝 Types

### Blog Interface
```typescript
interface Blog {
  id: number;
  title: string;
  content: string;
  image_blogs?: string;
  author_id?: number;
  status: BlogType;
}
```

### BlogType Enum
```typescript
enum BlogType {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
```

## 🎨 Styling

Component sử dụng CSS Modules với các class chính:

- `.statsGrid` - Grid layout cho thống kê
- `.blogsGrid` - Grid layout cho danh sách blog
- `.blogCard` - Card cho mỗi blog
- `.searchBox` - Search input container
- `.loadingState` - Loading spinner
- `.emptyState` - Empty state khi không có data

## 🔧 Cách sử dụng

```tsx
import Blogs from '@/components/admin/blogs/Blogs';

// Trong page hoặc component cha
export default function BlogsPage() {
  return <Blogs />;
}
```

## 📱 Responsive Design

- **Desktop**: Grid 3 columns cho stats, 3 columns cho blogs
- **Tablet**: Grid 2 columns
- **Mobile**: Grid 1 column (stack layout)

## 🎯 User Flow

1. **Xem danh sách**
   - User vào trang → Component fetch data → Hiển thị danh sách

2. **Tìm kiếm**
   - User nhập từ khóa → Filter real-time → Update danh sách

3. **Thêm mới**
   - Click "Thêm bài viết" → Modal mở → Điền form → Submit → Toast success → Reload danh sách

4. **Chỉnh sửa**
   - Click icon Edit → Modal mở với data → Chỉnh sửa → Submit → Toast success → Reload danh sách

5. **Xóa**
   - Click icon Delete → Confirm dialog → Xác nhận → API delete → Toast success → Reload danh sách

## ⚠️ Error Handling

- Network errors: Toast error message
- Validation errors: Form validation messages
- Delete confirmation: Prevent accidental deletion
- Loading states: Spinner khi fetch data

## 🚀 Future Improvements

- [ ] Pagination cho danh sách lớn
- [ ] Filter theo status
- [ ] Sort theo date, title
- [ ] Bulk actions (delete multiple)
- [ ] Rich text editor cho content
- [ ] Image upload với drag & drop
- [ ] Preview blog trước khi publish
- [ ] SEO metadata fields

## 📄 License

Internal use only - Part of the e-commerce admin dashboard.
