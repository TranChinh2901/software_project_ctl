import apiClient from './apiClient';
import { LoginDto, RegisterDto, AuthResponse, RegisterResponse, UpdateProfileDto } from '@/types/auth';

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
export const userApi = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get('/auth/users', { params });
    return response; 
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

// =====================================

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

export const bannerApi = {
  getAll: async () => {
    const response = await apiClient.get('/banners');
    return response;
  },
  
  getById: async (id: number) => {
    const response = await apiClient.get(`/banners/${id}`);
    return response;
  },
  
  create: async (data: FormData) => {
    const response = await apiClient.post('/banners', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  
  update: async (id: number, data: FormData) => {
    const response = await apiClient.put(`/banners/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/banners/${id}`);
    return response;
  },
};

// ====================================
export const voucherApi = {
  getAll: async () => {
    const response = await apiClient.get('/vouchers');
    return response;
  },
  
  getById: async (id: number) => {
    const response = await apiClient.get(`/vouchers/${id}`);
    return response;
  },
  
  create: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/vouchers', data);
    return response;
  },
  
  update: async (id: number, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/vouchers/${id}`, data);
    return response;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/vouchers/${id}`);
    return response;
  },
};


// ====================================
export const orderApi = {
  getAll: (params?: Record<string, unknown>) => {
    return apiClient.get('/orders', { params });
  },
  
  getById: (id: number) => {
    return apiClient.get(`/orders/${id}`);
  },
  
  // Lấy đơn hàng của user đang đăng nhập
  getUserOrders: () => {
    return apiClient.get('/orders/user/orders');
  },
  
  create: (data: Record<string, unknown>) => {
    return apiClient.post('/orders', data);
  },
  
  updateStatus: (id: number, data: { status: string; note?: string }) => {
    return apiClient.put(`/orders/${id}/status`, data);
  },
  
  cancel: (id: number, reason: string) => {
    return apiClient.post(`/orders/${id}/cancel`, { cancel_reason: reason });
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/orders/${id}`);
  },
};

// ====================================
export const colorApi = {
  getAll: (params?: Record<string, unknown>) => {
    return apiClient.get('/colors', { params });
  },
  
  getById: (id: number) => {
    return apiClient.get(`/colors/${id}`);
  },
  
  create: (data: Record<string, unknown>) => {
    return apiClient.post('/colors', data);
  },
  
  update: (id: number, data: Record<string, unknown>) => {
    return apiClient.put(`/colors/${id}`, data);
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/colors/${id}`);
  },
};


// ====================================
export const reviewApi = {
  getAll: (params?: Record<string, unknown>) => {
    return apiClient.get('/reviews', { params });
  },
  
  getById: (id: number) => {
    return apiClient.get(`/reviews/${id}`);
  },
  
  create: (data: Record<string, unknown>) => {
    return apiClient.post('/reviews', data);
  },
  
  update: (id: number, data: Record<string, unknown>) => {
    return apiClient.put(`/reviews/${id}`, data);
  },
  
  approve: (id: number) => {
    return apiClient.put(`/reviews/${id}/approve`);
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/reviews/${id}`);
  },
};


// ====================================
export const productGalleryApi = {
  getAll: () => {
    return apiClient.get('/product-gallery');
  },
  
  create: (data: FormData) => {
    return apiClient.post('/product-gallery', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/product-gallery/${id}`);
  },
};


// ====================================
export const productVariantApi = {
  getAll: (params?: Record<string, unknown>) => {
    return apiClient.get('/product-variants', { params });
  },
  
  getById: (id: number) => {
    return apiClient.get(`/product-variants/${id}`);
  },
  
  getByProduct: (productId: number) => {
    return apiClient.get('/product-variants', { params: { product_id: productId } });
  },
  
  create: (data: Record<string, unknown>) => {
    return apiClient.post('/product-variants', data);
  },
  
  update: (id: number, data: Record<string, unknown>) => {
    return apiClient.put(`/product-variants/${id}`, data);
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/product-variants/${id}`);
  },
};

// ====================================
// MOMO PAYMENT API
// ====================================
export interface CreateMomoPaymentRequest {
  order_id: number;
  amount: number;
  orderInfo?: string;
}

export interface MomoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink?: string;
  qrCodeUrl?: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  resultCode: number;
  transId?: string;
  amount?: number;
  extraData?: string;
}

export const momoApi = {
  createPayment: async (data: CreateMomoPaymentRequest): Promise<MomoPaymentResponse> => {
    const response = await apiClient.post('/momo/create-payment', data) as { data: MomoPaymentResponse };
    // Response format: { success: true, message: '...', data: { payUrl, resultCode, ... } }
    return response.data;
  },
  
  checkStatus: async (orderId: string) => {
    const response = await apiClient.get(`/momo/check-status/${orderId}`);
    return response;
  },

  // Verify và cập nhật payment status khi redirect từ MoMo
  verifyPayment: async (data: VerifyPaymentRequest) => {
    const response = await apiClient.post('/momo/verify-payment', data);
    return response;
  },
};
