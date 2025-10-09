// Common validation functions
export const validators = {
  required: (value: unknown) => 
    !value || (typeof value === 'string' && !value.trim()) ? 'Trường này là bắt buộc' : undefined,

  email: (value: string) => {
    if (!value) return 'Email là bắt buộc';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Email không hợp lệ' : undefined;
  },

  password: (value: string) => {
    if (!value) return 'Mật khẩu là bắt buộc';
    if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    return undefined;
  },

  phone: (value?: string) => {
    if (!value) return undefined; // Optional field
    const phoneRegex = /^[0-9]{10,11}$/;
    return !phoneRegex.test(value) ? 'Số điện thoại không hợp lệ' : undefined;
  },

  fullname: (value: string) => {
    if (!value?.trim()) return 'Họ tên là bắt buộc';
    if (value.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
    return undefined;
  },

  dateOfBirth: (value: Date | string) => {
    if (!value) return 'Ngày sinh là bắt buộc';
    const date = new Date(value);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    if (age < 13) return 'Tuổi phải từ 13 trở lên';
    if (age > 120) return 'Tuổi không hợp lệ';
    return undefined;
  },

  gender: (value: string) => {
    if (!value) return 'Giới tính là bắt buộc';
    return undefined;
  }
};

// Form-specific validation rules
export const loginValidationRules = {
  email: validators.email,
  password: validators.required
} as const;

export const registerValidationRules = {
  fullname: validators.fullname,
  email: validators.email,
  password: validators.password,
  phone_number: validators.phone,
  gender: validators.gender,
  date_of_birth: validators.dateOfBirth
} as const;
