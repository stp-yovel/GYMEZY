import { apiService } from './apiService';

// Fallback preset zones if backend is temporarily unreachable
export const DEFAULT_FALLBACK_ZONES = [
  { name: 'Anna Nagar, Chennai', area: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', lat: 13.085, lon: 80.2101, gymCount: 1, isPopular: true },
  { name: 'T. Nagar, Chennai', area: 'T. Nagar', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0418, lon: 80.2341, gymCount: 1, isPopular: true },
  { name: 'Adyar, Chennai', area: 'Adyar', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0012, lon: 80.2565, gymCount: 1, isPopular: true },
  { name: 'Velachery, Chennai', area: 'Velachery', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9815, lon: 80.218, gymCount: 1, isPopular: true },
  { name: 'Nungambakkam, Chennai', area: 'Nungambakkam', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0569, lon: 80.2425, gymCount: 1, isPopular: true },
  { name: 'Porur, Chennai', area: 'Porur', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0382, lon: 80.1585, gymCount: 1, isPopular: true },
  { name: 'OMR, Chennai', area: 'OMR', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9698, lon: 80.2376, gymCount: 1, isPopular: true },
  { name: 'Besant Nagar, Chennai', area: 'Besant Nagar', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9996, lon: 80.2678, gymCount: 1, isPopular: true },
  { name: 'Guindy, Chennai', area: 'Guindy', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0067, lon: 80.203, gymCount: 1, isPopular: true },
];

class GymService {
  /**
   * Fetch Popular City & Zone Chips directly from Backend
   */
  async fetchPopularZones() {
    try {
      const response = await apiService.executeFetch('/gyms/zones', {
        method: 'GET',
        headers: apiService.getHeaders(),
      }, 3500);

      const json = await response.json();
      if (response.ok && json.success && Array.isArray(json.data?.zones)) {
        return json.data.zones;
      }
      return DEFAULT_FALLBACK_ZONES;
    } catch (err) {
      console.warn('[GYM SERVICE] fetchPopularZones using fallback:', err.message);
      return DEFAULT_FALLBACK_ZONES;
    }
  }

  /**
   * Fetch Gyms from Backend with Geospatial Proximity, Category, and Advanced Filters
   * Processed entirely on the Backend MongoDB database
   */
  async fetchGyms({
    lat,
    lng,
    city,
    area,
    category,
    type,
    facility,
    workout,
    search,
    sortBy = 'nearest',
    page = 1,
    limit = 50,
  } = {}) {
    const params = new URLSearchParams();

    if (lat !== undefined && lat !== null) params.append('lat', String(lat));
    if (lng !== undefined && lng !== null) params.append('lng', String(lng));
    if (city && city !== 'All') params.append('city', city);
    if (area && area !== 'All') params.append('area', area);
    if (category && category !== 'All') params.append('category', category);
    if (type && type !== 'All Gyms') params.append('type', type);
    if (facility && facility !== 'All Facilities') params.append('facility', facility);
    if (workout && workout !== 'All') params.append('workout', workout);
    if (search && search.trim().length > 0) params.append('search', search.trim());
    if (sortBy) params.append('sortBy', sortBy);
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));

    const queryString = params.toString() ? `?${params.toString()}` : '';

    try {
      const response = await apiService.executeFetch(`/gyms${queryString}`, {
        method: 'GET',
        headers: apiService.getHeaders(),
      }, 10000);

      const json = await response.json();
      if (response.ok && json.success && Array.isArray(json.data?.gyms)) {
        return {
          gyms: json.data.gyms,
          pagination: json.data.pagination || { total: json.data.gyms.length, page: 1, pages: 1 },
          isBackend: true,
        };
      }
      throw new Error(json.message || 'Failed to fetch gyms from server');
    } catch (err) {
      console.warn('[GYM SERVICE] fetchGyms error:', err.message);
      return {
        gyms: [],
        pagination: { total: 0, page: 1, pages: 1 },
        isBackend: true,
      };
    }
  }

  /**
   * Fetch Single Gym Profile & Details from Backend
   */
  async fetchGymById(gymId) {
    if (!gymId) return null;
    try {
      const response = await apiService.executeFetch(`/gyms/${gymId}`, {
        method: 'GET',
        headers: apiService.getHeaders(),
      });
      const json = await response.json();
      if (response.ok && json.success) {
        return json.data;
      }
      return null;
    } catch (err) {
      console.warn('[GYM SERVICE] fetchGymById error:', err.message);
      return null;
    }
  }
}

export const gymService = new GymService();
export default gymService;
