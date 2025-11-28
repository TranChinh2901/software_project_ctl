/**
 * Utility function to safely extract data from API response
 * Handles different response structures from backend
 */

interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

/**
 * Extract data from API response
 * Backend may return: { success, message, data } or directly the data
 * apiClient interceptor already unwraps response.data
 */
export function extractApiData<T>(response: ApiResponse<T> | T): T | null {
  if (!response) {
    return null;
  }

  // If response has a 'data' property, use it
  if (typeof response === 'object' && 'data' in response) {
    return (response as ApiResponse<T>).data || null;
  }

  // Otherwise, response is already the data
  return response as T;
}

/**
 * Extract list data from paginated API response
 */
export function extractListData<T>(
  response: unknown,
  listKey: string
): {
  items: T[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
} {
  const data = extractApiData(response);
  
  if (!data || typeof data !== 'object') {
    return { items: [] };
  }

  const dataObj = data as Record<string, unknown>;
  
  return {
    items: (dataObj[listKey] as T[]) || [],
    total: dataObj.total as number | undefined,
    page: dataObj.page as number | undefined,
    limit: dataObj.limit as number | undefined,
    totalPages: dataObj.totalPages as number | undefined,
  };
}

/**
 * Debug API response structure
 */
export function debugApiResponse(response: unknown, label: string = 'API Response'): void {
  console.group(`🔍 ${label}`);
  console.log('Raw response:', response);
  console.log('Type:', typeof response);
  
  if (response && typeof response === 'object') {
    console.log('Keys:', Object.keys(response));
    console.log('Has data?', 'data' in response);
    
    if ('data' in response) {
      const dataValue = (response as Record<string, unknown>).data;
      console.log('Data type:', typeof dataValue);
      if (dataValue && typeof dataValue === 'object') {
        console.log('Data keys:', Object.keys(dataValue));
      }
    }
  }
  
  console.groupEnd();
}
