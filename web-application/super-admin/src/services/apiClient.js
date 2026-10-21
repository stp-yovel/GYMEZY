import axios from 'axios';
import { getApiBaseUrl, IS_DEBUG_MODE } from '../config/envConfig';
import { getCookie, deleteCookie } from '../utils/cookieUtils';

/**
 * Standardized Axios API Client instance with credentials and dynamic environment resolution
 */
export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Automatically pass secure HTTP-only cookies
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor: Dynamic BaseURL resolution, JWT token transmission, and debug logging
 */
apiClient.interceptors.request.use(
  (config) => {
    // Dynamically update baseURL if environment or endpoint changes
    config.baseURL = getApiBaseUrl();

    // Attach Bearer token from cookie if available
    const token = getCookie('authToken') || getCookie('token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (IS_DEBUG_MODE) {
      const fullUrl = `${config.baseURL.replace(/\/+$/, '')}/${(config.url || '').replace(/^\/+/, '')}`;
      console.log(`[API REQUEST ${config.method?.toUpperCase()}] ${fullUrl}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    if (IS_DEBUG_MODE) {
      console.error('[API REQUEST ERROR]:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Unified error formatting, 401 session expiry handling, and debug logging
 */
apiClient.interceptors.response.use(
  (response) => {
    if (IS_DEBUG_MODE) {
      console.log(`[API RESPONSE ${response.status}] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    const statusCode = error.response?.status;

    if (IS_DEBUG_MODE) {
      console.error(
        `[API RESPONSE ERROR ${statusCode || 'NETWORK'}]:`,
        error.response?.data || error.message
      );
    }

    // Auto-clean expired credentials on 401 Unauthorized for non-login endpoints
    if (statusCode === 401 && !error.config?.url?.includes('/auth/login')) {
      deleteCookie('authToken');
    }

    // Standardize error message presentation
    const responseData = error.response?.data;
    const formattedError = new Error(
      responseData?.message ||
      responseData?.error ||
      error.message ||
      'An unexpected network error occurred.'
    );

    formattedError.statusCode = statusCode || 500;
    formattedError.data = responseData;
    formattedError.response = error.response;
    formattedError.isAxiosError = true;

    return Promise.reject(formattedError);
  }
);

export default apiClient;
