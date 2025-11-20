# Admin Layout Documentation

## Tổng quan
Base layout admin với thiết kế hiện đại, tối giản và chuyên nghiệp. Layout được xây dựng hoàn toàn bằng Module CSS.

## Cấu trúc Components

### 1. AdminLayout (Main Layout)
- **File**: `src/app/admin/layout.tsx`
- **Tính năng**:
  - Responsive layout với sidebar có thể thu gọn
  - Header cố định với breadcrumb và search
  - Main content area với scrolling mượt mà

### 2. AdminSidebar
- **File**: `src/components/admin/AdminSidebar.tsx`
- **Tính năng**:
  - Thu gọn/mở rộng với animation mượt
  - Menu đa cấp với sections
  - Active state highlighting
  - Badge notification
  - Tooltip khi thu gọn
  - User info section

### 3. AdminHeader
- **File**: `src/components/admin/AdminHeader.tsx`
- **Tính năng**:
  - Dynamic breadcrumb từ URL
  - Global search bar
  - Notification và message icons
  - User dropdown menu
  - Responsive design

### 4. PageContainer
- **File**: `src/components/admin/PageContainer.tsx`
- **Mục đích**: Wrapper cho nội dung trang
- **Props**:
  - `title`: Tiêu đề trang
  - `description`: Mô tả ngắn
  - `action`: Buttons hoặc actions

### 5. Card
- **File**: `src/components/admin/Card.tsx`
- **Mục đích**: Container cho nội dung
- **Props**:
  - `title`: Tiêu đề card
  - `action`: Action buttons
  - `noPadding`: Remove padding

### 6. Button
- **File**: `src/components/admin/Button.tsx`
- **Variants**:
  - `primary`: Gradient purple button
  - `secondary`: Gray button
  - `danger`: Red button
  - `ghost`: Transparent button
- **Sizes**: `sm`, `md`, `lg`

## Color Palette

### Primary Colors
- Gradient: `#667eea` → `#764ba2`
- Used for: Primary actions, active states

### Neutral Colors
- Background: `#f8f9fa`
- Card background: `#ffffff`
- Border: `#e5e7eb`
- Text primary: `#1f2937`
- Text secondary: `#6b7280`
- Text muted: `#9ca3af`

### Status Colors
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#3b82f6`

## Typography
- Font family: System fonts
- Heading sizes: 1.875rem, 1.5rem, 1.25rem, 1.125rem
- Body sizes: 0.9375rem, 0.875rem, 0.75rem
- Font weights: 400, 500, 600, 700

## Spacing
- Base unit: 0.25rem (4px)
- Common spacing: 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem

## Border Radius
- Small: 6px
- Medium: 8px
- Large: 10px
- XLarge: 12px

## Animation
- Transition duration: 0.2s ease
- Hover effects: translateY(-1px to -4px)
- Box shadows on hover

## Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Usage Example

```tsx
import PageContainer from '@/components/admin/PageContainer';
import Button from '@/components/admin/Button';
import Card from '@/components/admin/Card';

export default function MyAdminPage() {
  return (
    <PageContainer
      title="Quản lý sản phẩm"
      description="Danh sách tất cả sản phẩm"
      action={
        <Button variant="primary">
          ➕ Thêm sản phẩm
        </Button>
      }
    >
      <Card title="Danh sách sản phẩm">
        {/* Your content here */}
      </Card>
    </PageContainer>
  );
}
```

## Customization

### Thay đổi màu chủ đạo
Trong các file CSS module, tìm và thay đổi:
- `#667eea` và `#764ba2` thành màu gradient mới của bạn

### Thay đổi spacing
Điều chỉnh padding/margin trong các file module CSS

### Thêm menu items
Chỉnh sửa `menuSections` array trong `AdminSidebar.tsx`

## Best Practices

1. **Consistency**: Sử dụng components có sẵn thay vì tạo style mới
2. **Spacing**: Sử dụng spacing nhất quán theo design system
3. **Colors**: Chỉ sử dụng màu từ color palette
4. **Icons**: Sử dụng emoji hoặc icon library nhất quán
5. **Responsive**: Luôn test trên mobile, tablet, desktop

## Performance
- Module CSS được tree-shaken tự động
- No runtime CSS-in-JS overhead
- Minimal bundle size
- Fast page loads
