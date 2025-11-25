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
export const userApi = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get('/auth/users', { params });
    return response; // apiClient đã trả về response.data rồi
  },
  
  getById: async (id: number) => {
    const response = await apiClient.get(`/auth/users/${id}`);
    return response;
  },
  
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/auth/users', data);
    return response;
  },
  
  update: async (id: number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/auth/users/${id}`, data);
    return response;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/auth/users/${id}`);
    return response;
  },
};




export const productApi = {
  getAll: (params?: Record<string, unknown>) => {
    return apiClient.get('/products', { params });
  },
  
  getById: (id: number) => {
    return apiClient.get(`/products/${id}`);
  },
  
  create: (data: FormData) => {
    return apiClient.post('/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  update: (id: number, data: FormData) => {
    return apiClient.put(`/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/products/${id}`);
  },
};

// ====================================
// CATEGORY API
// ====================================
export const categoryApi = {
  getAll: (params?: Record<string, unknown>) => {
    return apiClient.get('/categories', { params });
  },
  
  getById: (id: number) => {
    return apiClient.get(`/categories/${id}`);
  },

  create: (data: FormData) => {
    return apiClient.post('/categories', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  update: (id: number, data: FormData) => {
    return apiClient.put(`/categories/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/categories/${id}`);
  },
};

// ====================================
// BRAND API
// ====================================
export const brandApi = {
  getAll: (params?: Record<string, unknown>) => {
    return apiClient.get('/brands', { params });
  },
  
  getById: (id: number) => {
    return apiClient.get(`/brands/${id}`);
  },

  create: (data: FormData) => {
    return apiClient.post('/brands', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  update: (id: number, data: FormData) => {
    return apiClient.put(`/brands/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/brands/${id}`);
  },
};

// ====================================
// BLOG API
// ====================================
export const blogApi = {
  getAll: (params?: Record<string, unknown>) => {
    return apiClient.get('/blogs', { params });
  },
  
  getById: (id: number) => {
    return apiClient.get(`/blogs/${id}`);
  },

  create: (data: FormData) => {
    return apiClient.post('/blogs', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  update: (id: number, data: FormData) => {
    return apiClient.put(`/blogs/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/blogs/${id}`);
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
