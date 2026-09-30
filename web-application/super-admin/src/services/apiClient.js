import { getApiBaseUrl, IS_DEBUG_MODE } from '../config/envConfig';
import { getCookie } from '../utils/cookieUtils';

/**
 * Standardized API Client using Fetch API with credential support and auto BaseURL resolution
 */
class ApiClient {
  constructor() {
    this.baseUrl = getApiBaseUrl();
  }

  /**
   * Helper to build fully qualified endpoint URL
   */
  buildUrl(endpoint) {
    const base = getApiBaseUrl().replace(/\/+$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }

  /**
   * Builds request headers with cookies, Bearer fallback, and Content-Type
   */
  buildHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };

    // Attach Bearer token if present in client cookies as fallback
    const clientToken = getCookie('authToken');
    if (clientToken && !headers.Authorization) {
      headers.Authorization = `Bearer ${clientToken}`;
    }

    return headers;
  }

  /**
   * Internal request dispatcher
   */
  async request(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    const config = {
      ...options,
      headers: this.buildHeaders(options.headers),
      credentials: 'include', // Ensures HTTP-only auth cookies are passed
    };

    if (IS_DEBUG_MODE) {
      console.log(`📡 [API ${config.method || 'GET'}] ${url}`);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `Request failed with status code ${response.status}`;

        const apiError = new Error(errorMessage);
        apiError.statusCode = response.status;
        apiError.data = data;
        apiError.errors = data?.errors || [];

        if (IS_DEBUG_MODE) {
          console.error(`❌ [API ERROR ${response.status}] ${url}:`, errorMessage, data);
        }

        throw apiError;
      }

      return data;
    } catch (error) {
      if (IS_DEBUG_MODE && !error.statusCode) {
        console.error(`❌ [NETWORK ERROR] ${url}:`, error.message);
      }
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
