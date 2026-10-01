import { Platform } from 'react-native';

const BACKEND_PORT = 5001;
const LOCAL_WIFI_IP = '192.168.0.100';

const getInitialBaseUrl = () => {
  // If running on native Android/iOS, prioritize local LAN Wi-Fi IP
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return `http://${LOCAL_WIFI_IP}:${BACKEND_PORT}/api/v1`;
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:${BACKEND_PORT}/api/v1`;
    }
  }
  return `http://${LOCAL_WIFI_IP}:${BACKEND_PORT}/api/v1`;
};

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError' || error.message?.toLowerCase().includes('aborted')) {
      throw new Error(
        `Server connection timed out (${Math.round(timeoutMs / 1000)}s) at ${url}. Please check your network connection.`
      );
    }
    if (
      error.message?.toLowerCase().includes('network request failed') ||
      error.message?.toLowerCase().includes('failed to fetch') ||
      error.message?.toLowerCase().includes('err_failed')
    ) {
      throw new Error(
        `Unable to reach backend server at ${url.split('/api/v1')[0]}. Ensure the server is running on port ${BACKEND_PORT}.`
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

class ApiService {
  constructor() {
    this.baseUrl = getInitialBaseUrl();
    this.token = null;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setAuthToken(token) {
    this.token = token;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  async executeFetch(endpoint, options = {}, timeoutMs = 8000) {
    // Generate candidate URLs in priority order
    const candidateBases = [
      this.baseUrl,
      `http://${LOCAL_WIFI_IP}:${BACKEND_PORT}/api/v1`,
      `http://localhost:${BACKEND_PORT}/api/v1`,
      `http://10.0.2.2:${BACKEND_PORT}/api/v1`,
      `http://127.0.0.1:${BACKEND_PORT}/api/v1`,
    ];

    // Filter unique candidates preserving order
    const uniqueBases = Array.from(new Set(candidateBases.filter(Boolean)));

    let lastError = null;
    for (let i = 0; i < uniqueBases.length; i++) {
      const currentBase = uniqueBases[i];
      const targetUrl = `${currentBase}${endpoint}`;
      try {
        const response = await fetchWithTimeout(targetUrl, options, i === 0 ? timeoutMs : 4000);
        this.baseUrl = currentBase; // Lock in the working base URL for subsequent calls
        return response;
      } catch (err) {
        lastError = err;
        // Continue fallback attempts
      }
    }

    throw lastError || new Error(`Unable to connect to backend server on port ${BACKEND_PORT}.`);
  }

  async login({ identifier, password }) {
    const cleanIdentifier = (identifier || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanIdentifier || !cleanPassword) {
      throw new Error('Email or phone number and password are required.');
    }

    const response = await this.executeFetch('/auth/login', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        identifier: cleanIdentifier,
        password: cleanPassword,
        portal: 'gym-owner',
        expectedRole: 'GYM_OWNER',
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage =
        result.message ||
        (result.errors && result.errors[0]?.msg) ||
        'Authentication failed. Please verify your credentials.';
      throw new Error(errorMessage);
    }

    const data = result.data || {};
    if (data.token) {
      this.setAuthToken(data.token);
    }

    return {
      user: {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        gymId: data.gymId,
      },
      gym: data.gym || null,
      token: data.token || null,
      message: result.message,
    };
  }

  async logout() {
    try {
      await this.executeFetch('/auth/logout', {
        method: 'POST',
        headers: this.getHeaders(),
      }, 4000);
    } catch {
      // Ignore network errors during logout
    } finally {
      this.token = null;
    }
  }

  async getCurrentUser() {
    const response = await this.executeFetch('/auth/me', {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to fetch current user session.');
    }
    return result.data;
  }
}

export const apiService = new ApiService();
export default apiService;
