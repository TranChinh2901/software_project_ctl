import apiClient from './apiClient';
import { LoginDto, RegisterDto, AuthResponse, RegisterResponse, UpdateProfileDto } from '@/types/auth';

// ====================================
// AUTH API
// ====================================
export const authApi = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: RegisterDto): Promise<RegisterResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    return apiClient.post('/auth/logout');
  },
  
  getProfile: () => {
    return apiClient.get('/auth/profile');
  },

   updateProfile: async (data: UpdateProfileDto) => {
    const response = await apiClient.put('/auth/profile', data);
    return response;
  },
  
  refreshToken: (refreshToken: string) => {
    return apiClient.post('/auth/refresh-token', { refreshToken });
  },
};

// ====================================
// USER API
// ====================================
// export const userApi = {
//   updateProfile: async (data: UpdateProfileDto) => {
//     const response = await apiClient.put('/auth/profile', data);
//     return response;
//   },
  
//   changePassword: async (data: { currentPassword: string; newPassword: string }) => {
//     const response = await apiClient.put('/auth/change-password', data);
//     return response;
//   },
  
//   uploadAvatar: async (file: File) => {
//     const formData = new FormData();
//     formData.append('avatar', file);
//     const response = await apiClient.post('/auth/upload-avatar', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     return response;
//   },
// };



export const productApi = {
  getAll: (params?: Record<string, unknown>) => {
    return apiClient.get('/products', { params });
  },
  
  getById: (id: number) => {
    return apiClient.get(`/products/${id}`);
  },
  
  create: (data: Record<string, unknown>) => {
    return apiClient.post('/products', data);
  },
  
  update: (id: number, data: Record<string, unknown>) => {
    return apiClient.put(`/products/${id}`, data);
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/products/${id}`);
  },
};


// ====================================
// ORDER API (Placeholder - tạo sau)
// ====================================
export const orderApi = {
  getAll: () => {
    return apiClient.get('/orders');
  },
  
  getById: (id: number) => {
    return apiClient.get(`/orders/${id}`);
  },
  
  create: (data: Record<string, unknown>) => {
    return apiClient.post('/orders', data);
  },
};
