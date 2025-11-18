// ====================================
// API RESPONSE WRAPPERS
// ====================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// ====================================
// FORM STATE TYPES
// ====================================

export interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

// ====================================
// QUERY PARAMS TYPES
// ====================================

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}
