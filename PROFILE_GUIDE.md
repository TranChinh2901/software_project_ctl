# 👤 Profile Management - Hướng dẫn sử dụng

## 📋 Tổng quan

Component ProfileForm hoàn chỉnh với đầy đủ chức năng:
- ✅ Xem thông tin tài khoản
- ✅ Chỉnh sửa thông tin cá nhân
- ✅ Đổi mật khẩu
- ✅ Quản lý đơn hàng (placeholder)
- ✅ Quản lý địa chỉ (placeholder)

---

## 🗂️ Cấu trúc files

```
src/
├── components/
│   └── auth/
│       └── profileForm.tsx       # Component chính
├── styles/
│   └── profile/
│       └── Profile.module.css    # Styles
├── lib/
│   └── api/
│       └── index.ts              # userApi functions
├── types/
│   └── auth/
│       └── index.ts              # UpdateProfileDto
└── contexts/
    └── AuthContext.tsx           # updateUser function
```

---

## 🎯 Các tính năng

### 1. **Xem thông tin tài khoản**
- Hiển thị đầy đủ thông tin user
- Trạng thái xác thực (verified/unverified)
- Layout 2 cột responsive

### 2. **Chỉnh sửa thông tin**
- Form validation
- Cập nhật realtime vào AuthContext
- Toast notification
- Loading state

### 3. **Đổi mật khẩu**
- Yêu cầu mật khẩu hiện tại
- Xác nhận mật khẩu mới
- Validation (min 6 ký tự)

### 4. **Sidebar Navigation**
- Sticky sidebar
- Active state highlighting
- 4 tabs: Profile, Orders, Password, Addresses

---

## 🔌 API Integration

### Backend API Endpoints cần có:

```typescript
// Update Profile
PUT /api/v1/users/profile
Body: {
  fullname?: string;
  phone_number?: string;
  address?: string;
  gender?: "male" | "female";
  date_of_birth?: string; // YYYY-MM-DD
}
Response: {
  data: User;
  message: string;
}

// Change Password
PUT /api/v1/users/change-password
Body: {
  currentPassword: string;
  newPassword: string;
}
Response: {
  message: string;
}

// Upload Avatar (optional)
POST /api/v1/users/avatar
Body: FormData with 'avatar' file
Response: {
  data: { avatar: string };
  message: string;
}
```

---

## 💻 Sử dụng Component

### Import và sử dụng:

```tsx
// src/app/(user)/profile/page.tsx
import ProfileForm from '@/components/auth/profileForm';

export default function ProfilePage() {
  return <ProfileForm />;
}
```

### Route cần tạo:

```bash
src/app/(user)/profile/page.tsx
```

---

## 🎨 CSS Classes

Component sử dụng CSS Modules với các classes chính:

```css
.profilePage         // Container chính
.sidebar            // Sidebar navigation
.mainContent        // Content area
.infoField          // View mode field
.formGroup          // Edit mode form group
.primaryButton      // CTA button
.secondaryButton    // Secondary button
```

### Customization:

Chỉnh sửa colors trong `Profile.module.css`:

```css
/* Gradient màu chủ đạo */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Thay đổi thành màu khác */
background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
```

---

## 📱 Responsive Breakpoints

- **Desktop**: > 992px - Full 2 column layout
- **Tablet**: 768px - 992px - Stack sidebar on top
- **Mobile**: < 768px - Full width single column

---

## ✅ Testing Checklist

### 1. View Profile
- [ ] Thông tin hiển thị đúng
- [ ] Status badge hiển thị (verified/unverified)
- [ ] Empty state khi không có data

### 2. Edit Profile
- [ ] Click "Chỉnh sửa" → Form hiển thị
- [ ] Data pre-fill từ user hiện tại
- [ ] Submit → API call thành công
- [ ] Toast notification hiển thị
- [ ] User data update trong context
- [ ] Click "Hủy" → Quay về view mode

### 3. Change Password
- [ ] Click tab "Đổi mật khẩu"
- [ ] Validation: Min 6 ký tự
- [ ] Validation: Confirm password match
- [ ] Submit → API call thành công
- [ ] Toast notification
- [ ] Form reset sau khi thành công
- [ ] Auto redirect về profile tab

### 4. Responsive
- [ ] Desktop layout hoạt động
- [ ] Tablet: Sidebar stack on top
- [ ] Mobile: Single column
- [ ] Form buttons full width on mobile

---

## 🔧 Troubleshooting

### Lỗi: "Cannot find module '@/types/auth'"
```bash
# Kiểm tra file tồn tại
ls src/types/auth/index.ts

# Nếu không có, tạo UpdateProfileDto
```

### Lỗi: "userApi is not exported"
```bash
# Kiểm tra src/lib/api/index.ts
# Đảm bảo có export userApi
```

### Lỗi: "updateUser is not a function"
```bash
# Kiểm tra AuthContext.tsx
# Đảm bảo updateUser được export trong value
```

### Form không submit
```bash
# Kiểm tra browser console
# Kiểm tra network tab xem API call
# Verify backend endpoint hoạt động
```

---

## 🚀 Next Steps

### Tính năng mở rộng:

1. **Upload Avatar**
   - Add file input
   - Preview image
   - Call uploadAvatar API

2. **Order Management**
   - Fetch orders từ backend
   - Display order list
   - Order detail modal

3. **Address Management**
   - CRUD addresses
   - Set default address
   - Address form validation

4. **Form Validation**
   - Integrate Zod schema
   - Real-time validation
   - Error messages

---

## 📞 Support

Nếu gặp vấn đề:
1. Check browser console errors
2. Verify API endpoints working
3. Check AuthContext có user data
4. Verify localStorage có tokens

---

**Last Updated:** 2025-11-18
**Version:** 1.0.0
