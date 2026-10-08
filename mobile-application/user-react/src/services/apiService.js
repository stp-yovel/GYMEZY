import { NativeModules } from 'react-native';

const BACKEND_PORT = 5001;
const LOCAL_WIFI_IP = '192.168.0.103';

const getMetroHost = () => {
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
      if (match?.[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
        return match[1];
      }
    }
  } catch {
    // Ignore error
  }
  return null;
};

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (
      error.name === 'AbortError' ||
      error.message?.toLowerCase().includes('aborted') ||
      error.message?.toLowerCase().includes('canceled') ||
      error.message?.toLowerCase().includes('cancelled')
    ) {
      throw new Error(
        `Server connection timed out (${Math.round(timeoutMs / 1000)}s) at ${url}.`
      );
    }
    if (
      error.message?.toLowerCase().includes('network request failed') ||
      error.message?.toLowerCase().includes('failed to fetch') ||
      error.message?.toLowerCase().includes('err_failed')
    ) {
      throw new Error(
        `Unable to reach GYMEZY backend at ${url.split('/api/v1')[0]}. Ensure server is running on port ${BACKEND_PORT}.`
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

class ApiService {
  constructor() {
    this.baseUrl = `http://localhost:${BACKEND_PORT}/api/v1`;
    this.verifiedBase = null;
    this.token = null;
    this.unauthorizedHandler = null;
  }

  setUnauthorizedHandler(handler) {
    this.unauthorizedHandler = handler;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
    this.verifiedBase = url;
  }

  getBaseUrl() {
    return this.verifiedBase || this.baseUrl;
  }

  setAuthToken(token) {
    this.token = token;
  }

  getAuthToken() {
    return this.token;
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

  async executeFetch(endpoint, options = {}, timeoutMs = 15000) {
    const metroHost = getMetroHost();

    // Priority candidates: Verified base, ADB reverse localhost (USB), Metro host IP, WiFi LAN IP, Android emulator 10.0.2.2
    const candidateBases = [
      this.verifiedBase,
      `http://localhost:${BACKEND_PORT}/api/v1`,
      metroHost ? `http://${metroHost}:${BACKEND_PORT}/api/v1` : null,
      `http://${LOCAL_WIFI_IP}:${BACKEND_PORT}/api/v1`,
      `http://10.0.2.2:${BACKEND_PORT}/api/v1`,
      `http://127.0.0.1:${BACKEND_PORT}/api/v1`,
    ];

    const uniqueBases = Array.from(new Set(candidateBases.filter(Boolean)));
    let lastError = null;

    for (let i = 0; i < uniqueBases.length; i++) {
      const currentBase = uniqueBases[i];
      const targetUrl = `${currentBase}${endpoint}`;
      try {
        const attemptTimeout = this.verifiedBase === currentBase ? timeoutMs : 10000;
        const response = await fetchWithTimeout(
          targetUrl,
          options,
          attemptTimeout
        );

        // Handle 401 Unauthorized globally
        if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
          console.warn('[API SERVICE] 401 Unauthorized received at', endpoint);
          if (typeof this.unauthorizedHandler === 'function') {
            this.unauthorizedHandler('Session expired. Please log in again.');
          }
        }

        this.verifiedBase = currentBase;
        this.baseUrl = currentBase;
        return response;
      } catch (err) {
        lastError = err;
        console.warn(`[API SERVICE] Failed ${targetUrl}:`, err.message);
      }
    }

    throw new Error(
      lastError?.message || `Unable to connect to GYMEZY backend on port ${BACKEND_PORT}. Check Wi-Fi or adb reverse port forwarding.`
    );
  }

  /**
   * User / Customer Login
   */
  async login({ identifier, password }) {
    const cleanIdentifier = (identifier || '').trim();
    const cleanPassword = password || '';

    if (!cleanIdentifier || !cleanPassword) {
      throw new Error('Please provide both email/phone and password.');
    }

    const response = await this.executeFetch('/auth/login', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        identifier: cleanIdentifier,
        password: cleanPassword,
      }),
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Login failed. Please verify your credentials.');
    }

    const payload = json.data || {};
    const authToken = payload.token || null;
    if (authToken) {
      this.setAuthToken(authToken);
    }

    return {
      user: payload,
      token: authToken,
      message: json.message || 'Login successful',
    };
  }

  /**
   * Customer Self Registration
   */
  async register({ fullName, email, phone, password, gender, fitnessGoal }) {
    const response = await this.executeFetch('/auth/register', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        fullName: (fullName || '').trim(),
        email: (email || '').trim().toLowerCase(),
        phone: (phone || '').trim(),
        password,
        gender: gender || 'PREFER_NOT_TO_SAY',
        fitnessGoal: fitnessGoal || 'GENERAL_FITNESS',
      }),
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Registration failed.');
    }

    const payload = json.data || {};
    const authToken = payload.token || null;
    if (authToken) {
      this.setAuthToken(authToken);
    }

    return {
      user: payload,
      token: authToken,
      message: json.message || 'Account created successfully',
    };
  }

  /**
   * Fetch Authenticated User Profile
   */
  async getCurrentUser() {
    const response = await this.executeFetch('/auth/me', {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch user profile.');
    }

    return json.data;
  }

  /**
   * Log Out User
   */
  async logout() {
    try {
      await this.executeFetch('/auth/logout', {
        method: 'POST',
        headers: this.getHeaders(),
      });
    } catch {
      // Clear token regardless of server response
    } finally {
      this.setAuthToken(null);
    }
  }

  /**
   * Check Email Availability
   */
  async checkEmail(email) {
    const response = await this.executeFetch(`/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const json = await response.json();
    return json.data;
  }

  /**
   * Fetch Reviews for a specific Gym
   */
  async getGymReviews(gymId) {
    const response = await this.executeFetch(`/gyms/${gymId}/reviews`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch gym reviews.');
    }
    return json.data;
  }

  /**
   * Fetch Active Approved Trainers for a specific Gym
   */
  async getGymTrainers(gymId) {
    try {
      const response = await this.executeFetch(`/gyms/${gymId}/trainers`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const json = await response.json();
      if (response.ok && json.success && Array.isArray(json.data)) {
        return json.data;
      }
      return [];
    } catch (error) {
      console.warn('[API SERVICE] getGymTrainers error:', error?.message);
      return [];
    }
  }

  /**
   * Fetch Reviews for a specific Trainer
   */
  async getTrainerReviews(gymId, trainerIdentifier) {
    const encoded = encodeURIComponent(trainerIdentifier);
    const response = await this.executeFetch(`/gyms/${gymId}/trainers/${encoded}/reviews`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch trainer reviews.');
    }
    return json.data;
  }

  /**
   * Submit a Member Review for a Gym
   */
  async submitGymReview(gymId, reviewData) {
    const response = await this.executeFetch(`/gyms/${gymId}/reviews`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reviewData),
    });
    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Failed to submit gym review.');
    }
    return json.data;
  }

  /**
   * Submit a Member Review for a Trainer
   */
  async submitTrainerReview(gymId, trainerIdentifier, reviewData) {
    const encoded = encodeURIComponent(trainerIdentifier);
    const response = await this.executeFetch(`/gyms/${gymId}/trainers/${encoded}/reviews`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reviewData),
    });
    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Failed to submit trainer review.');
    }
    return json.data;
  }
  /**
   * Fetch Ratings & Reviews for a specific Gym
   */
  async getGymRatings(gymId) {
    const response = await this.executeFetch(`/gyms/${gymId}/ratings`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch gym ratings.');
    }
    return json.data;
  }

  /**
   * Fetch Ratings for a specific Trainer
   */
  async getTrainerRatings(gymId, trainerIdentifier) {
    const encoded = encodeURIComponent(trainerIdentifier);
    const response = await this.executeFetch(`/gyms/${gymId}/trainers/${encoded}/ratings`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Failed to fetch trainer ratings.');
    }
    return json.data;
  }

  /**
   * Submit a Member Rating for a Gym
   */
  async submitGymRating(gymId, ratingData) {
    const response = await this.executeFetch(`/gyms/${gymId}/ratings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(ratingData),
    });
    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Failed to submit gym rating.');
    }
    return json.data;
  }

  /**
   * Submit a Member Rating for a Trainer
   */
  async submitTrainerRating(gymId, trainerIdentifier, ratingData) {
    const encoded = encodeURIComponent(trainerIdentifier);
    const response = await this.executeFetch(`/gyms/${gymId}/trainers/${encoded}/ratings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(ratingData),
    });
    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message || 'Failed to submit trainer rating.');
    }
    return json.data;
  }
}

export const apiService = new ApiService();
export default apiService;
