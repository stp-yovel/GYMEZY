import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gymService } from './gymService';

const LOCATION_STORAGE_KEY = '@gymezy_user_saved_location';
const PERMISSION_STORAGE_KEY = '@gymezy_location_permission_status';

export { DEFAULT_FALLBACK_ZONES as POPULAR_CITIES } from './gymService';


/**
 * Calculates straight line distance in km between two GPS coordinates using Haversine formula
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.5;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
};

/**
 * Resolves coordinates for a given gym based on its location string
 */
export const getGymCoordinates = (gym) => {
  if (gym?.latitude && gym?.longitude) {
    return { latitude: Number(gym.latitude), longitude: Number(gym.longitude) };
  }
  if (gym?.address?.coordinates?.coordinates && Array.isArray(gym.address.coordinates.coordinates)) {
    return {
      latitude: Number(gym.address.coordinates.coordinates[1]),
      longitude: Number(gym.address.coordinates.coordinates[0]),
    };
  }
  // Fallback coordinate in Chennai central
  return { latitude: 13.0827, longitude: 80.2707 };
};

export const DEFAULT_LOCATION = {
  latitude: 13.085,
  longitude: 80.2101,
  name: 'Anna Nagar, Chennai',
  city: 'Chennai',
  isGps: false,
};

export const CHENNAI_LOCATIONS = [
  { name: 'Anna Nagar, Chennai', area: 'Anna Nagar', city: 'Chennai', lat: 13.085, lon: 80.2101, isPopular: true },
  { name: 'T. Nagar, Chennai', area: 'T. Nagar', city: 'Chennai', lat: 13.0418, lon: 80.2341, isPopular: true },
  { name: 'Adyar, Chennai', area: 'Adyar', city: 'Chennai', lat: 13.0012, lon: 80.2565, isPopular: true },
  { name: 'Velachery, Chennai', area: 'Velachery', city: 'Chennai', lat: 12.9815, lon: 80.218, isPopular: true },
  { name: 'Nungambakkam, Chennai', area: 'Nungambakkam', city: 'Chennai', lat: 13.0569, lon: 80.2425, isPopular: true },
  { name: 'Porur, Chennai', area: 'Porur', city: 'Chennai', lat: 13.0382, lon: 80.1585, isPopular: true },
  { name: 'Besant Nagar, Chennai', area: 'Besant Nagar', city: 'Chennai', lat: 12.9996, lon: 80.2678, isPopular: true },
  { name: 'Guindy, Chennai', area: 'Guindy', city: 'Chennai', lat: 13.0067, lon: 80.203, isPopular: true },
  { name: 'OMR (Old Mahabalipuram Rd), Chennai', area: 'OMR', city: 'Chennai', lat: 12.9698, lon: 80.2376, isPopular: true },
  { name: 'Mylapore, Chennai', area: 'Mylapore', city: 'Chennai', lat: 13.0368, lon: 80.2676, isPopular: true },
  { name: 'Alwarpet, Chennai', area: 'Alwarpet', city: 'Chennai', lat: 13.0336, lon: 80.2507, isPopular: true },
  { name: 'Kilpauk, Chennai', area: 'Kilpauk', city: 'Chennai', lat: 13.0784, lon: 80.2417, isPopular: true },
  { name: 'Vadapalani, Chennai', area: 'Vadapalani', city: 'Chennai', lat: 13.05, lon: 80.212, isPopular: true },
  { name: 'Ashok Nagar, Chennai', area: 'Ashok Nagar', city: 'Chennai', lat: 13.0373, lon: 80.2123, isPopular: false },
  { name: 'Kodambakkam, Chennai', area: 'Kodambakkam', city: 'Chennai', lat: 13.0519, lon: 80.2227, isPopular: false },
  { name: 'Mogappair, Chennai', area: 'Mogappair', city: 'Chennai', lat: 13.0837, lon: 80.1748, isPopular: false },
  { name: 'Perambur, Chennai', area: 'Perambur', city: 'Chennai', lat: 13.109, lon: 80.232, isPopular: false },
  { name: 'Royapettah, Chennai', area: 'Royapettah', city: 'Chennai', lat: 13.0526, lon: 80.2612, isPopular: false },
  { name: 'Egmore, Chennai', area: 'Egmore', city: 'Chennai', lat: 13.0827, lon: 80.26, isPopular: false },
  { name: 'Thiruvanmiyur, Chennai', area: 'Thiruvanmiyur', city: 'Chennai', lat: 12.983, lon: 80.2594, isPopular: true },
  { name: 'Sholinganallur, Chennai', area: 'Sholinganallur', city: 'Chennai', lat: 12.901, lon: 80.2279, isPopular: true },
  { name: 'Tambaram, Chennai', area: 'Tambaram', city: 'Chennai', lat: 12.9249, lon: 80.1, isPopular: false },
  { name: 'Chromepet, Chennai', area: 'Chromepet', city: 'Chennai', lat: 12.9516, lon: 80.1462, isPopular: false },
  { name: 'Pallavaram, Chennai', area: 'Pallavaram', city: 'Chennai', lat: 12.9675, lon: 80.1491, isPopular: false },
  { name: 'Medavakkam, Chennai', area: 'Medavakkam', city: 'Chennai', lat: 12.9171, lon: 80.1923, isPopular: false },
  { name: 'Madipakkam, Chennai', area: 'Madipakkam', city: 'Chennai', lat: 12.9647, lon: 80.1961, isPopular: false },
  { name: 'Mangadu, Chennai', area: 'Mangadu', city: 'Chennai', lat: 13.0483, lon: 80.1167, isPopular: false },
  { name: 'Poonamallee, Chennai', area: 'Poonamallee', city: 'Chennai', lat: 13.0494, lon: 80.0931, isPopular: false },
  { name: 'Ambattur, Chennai', area: 'Ambattur', city: 'Chennai', lat: 13.1143, lon: 80.1548, isPopular: false },
  { name: 'Avadi, Chennai', area: 'Avadi', city: 'Chennai', lat: 13.1147, lon: 80.1018, isPopular: false },
  { name: 'KK Nagar, Chennai', area: 'KK Nagar', city: 'Chennai', lat: 13.041, lon: 80.1994, isPopular: false },
  { name: 'Saidapet, Chennai', area: 'Saidapet', city: 'Chennai', lat: 13.0213, lon: 80.2231, isPopular: false },
  { name: 'Perungudi, Chennai', area: 'Perungudi', city: 'Chennai', lat: 12.9654, lon: 80.2461, isPopular: false },
  { name: 'Navalur, Chennai', area: 'Navalur', city: 'Chennai', lat: 12.8468, lon: 80.2269, isPopular: false },
  { name: 'Siruseri, Chennai', area: 'Siruseri', city: 'Chennai', lat: 12.8288, lon: 80.2241, isPopular: false },
  { name: 'Koyambedu, Chennai', area: 'Koyambedu', city: 'Chennai', lat: 13.0694, lon: 80.1948, isPopular: false },
  { name: 'Chetpet, Chennai', area: 'Chetpet', city: 'Chennai', lat: 13.0715, lon: 80.2415, isPopular: false },
  { name: 'Triplicane, Chennai', area: 'Triplicane', city: 'Chennai', lat: 13.0587, lon: 80.2757, isPopular: false },
  { name: 'Shenoy Nagar, Chennai', area: 'Shenoy Nagar', city: 'Chennai', lat: 13.0768, lon: 80.2238, isPopular: false },
  { name: 'Arumbakkam, Chennai', area: 'Arumbakkam', city: 'Chennai', lat: 13.0682, lon: 80.2078, isPopular: false },
  { name: 'Virugambakkam, Chennai', area: 'Virugambakkam', city: 'Chennai', lat: 13.0489, lon: 80.1917, isPopular: false },
  { name: 'Valasaravakkam, Chennai', area: 'Valasaravakkam', city: 'Chennai', lat: 13.0402, lon: 80.1764, isPopular: false },
  { name: 'Ramapuram, Chennai', area: 'Ramapuram', city: 'Chennai', lat: 13.0306, lon: 80.1784, isPopular: false },
  { name: 'Manapakkam, Chennai', area: 'Manapakkam', city: 'Chennai', lat: 13.0163, lon: 80.1735, isPopular: false },
  { name: 'Iyyappanthangal, Chennai', area: 'Iyyappanthangal', city: 'Chennai', lat: 13.0398, lon: 80.1388, isPopular: false },
  { name: 'Kattupakkam, Chennai', area: 'Kattupakkam', city: 'Chennai', lat: 13.0471, lon: 80.1256, isPopular: false },
  { name: 'Kundrathur, Chennai', area: 'Kundrathur', city: 'Chennai', lat: 12.9977, lon: 80.0972, isPopular: false },
  { name: 'Thoraipakkam, Chennai', area: 'Thoraipakkam', city: 'Chennai', lat: 12.943, lon: 80.237, isPopular: false },
  { name: 'Semmancheri, Chennai', area: 'Semmancheri', city: 'Chennai', lat: 12.8687, lon: 80.2227, isPopular: false },
  { name: 'Kolathur, Chennai', area: 'Kolathur', city: 'Chennai', lat: 13.1235, lon: 80.2098, isPopular: false },
  { name: 'Villivakkam, Chennai', area: 'Villivakkam', city: 'Chennai', lat: 13.1075, lon: 80.2064, isPopular: false },
  { name: 'Korattur, Chennai', area: 'Korattur', city: 'Chennai', lat: 13.1118, lon: 80.1769, isPopular: false },
  { name: 'Padi, Chennai', area: 'Padi', city: 'Chennai', lat: 13.0963, lon: 80.1873, isPopular: false },
  { name: 'ECR (East Coast Road), Chennai', area: 'ECR', city: 'Chennai', lat: 12.915, lon: 80.25, isPopular: true },
  { name: 'Neelankarai, Chennai', area: 'Neelankarai', city: 'Chennai', lat: 12.9482, lon: 80.2589, isPopular: false },
  { name: 'Injambakkam, Chennai', area: 'Injambakkam', city: 'Chennai', lat: 12.9234, lon: 80.2536, isPopular: false },
  { name: 'Kotturpuram, Chennai', area: 'Kotturpuram', city: 'Chennai', lat: 13.0223, lon: 80.2415, isPopular: false },
  { name: 'RA Puram, Chennai', area: 'RA Puram', city: 'Chennai', lat: 13.0282, lon: 80.2562, isPopular: false },
  { name: 'Mandaveli, Chennai', area: 'Mandaveli', city: 'Chennai', lat: 13.0279, lon: 80.2646, isPopular: false },
  { name: 'Gopalapuram, Chennai', area: 'Gopalapuram', city: 'Chennai', lat: 13.0515, lon: 80.2533, isPopular: false },
  { name: 'Teynampet, Chennai', area: 'Teynampet', city: 'Chennai', lat: 13.0405, lon: 80.2478, isPopular: false },
  { name: 'Nandanam, Chennai', area: 'Nandanam', city: 'Chennai', lat: 13.0312, lon: 80.2398, isPopular: false },
  { name: 'Perumbakkam, Chennai', area: 'Perumbakkam', city: 'Chennai', lat: 12.8988, lon: 80.1876, isPopular: false },
  { name: 'Sithalapakkam, Chennai', area: 'Sithalapakkam', city: 'Chennai', lat: 12.8845, lon: 80.1822, isPopular: false },
  { name: 'Selaiyur, Chennai', area: 'Selaiyur', city: 'Chennai', lat: 12.9189, lon: 80.1415, isPopular: false },
  { name: 'Urapakkam, Chennai', area: 'Urapakkam', city: 'Chennai', lat: 12.8674, lon: 80.0763, isPopular: false },
  { name: 'Guduvanchery, Chennai', area: 'Guduvanchery', city: 'Chennai', lat: 12.8441, lon: 80.0631, isPopular: false },
  { name: 'Kelambakkam, Chennai', area: 'Kelambakkam', city: 'Chennai', lat: 12.7842, lon: 80.2223, isPopular: false },
  { name: 'Padur, Chennai', area: 'Padur', city: 'Chennai', lat: 12.8123, lon: 80.2276, isPopular: false },
];

// In-memory cache for dynamic geocoding queries
const dynamicLocationCache = new Map();

/**
 * Fast synchronous fallback query
 */
export const searchChennaiLocations = (query) => {
  const trimmed = query?.trim();
  if (!trimmed) {
    return CHENNAI_LOCATIONS.filter((l) => l.isPopular);
  }
  const q = trimmed.toLowerCase();
  return CHENNAI_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(q) ||
      loc.area.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q)
  );
};

const formatPhotonFeature = (f, seen) => {
  const p = f?.properties || {};
  const name = p.name;
  const lat = f?.geometry?.coordinates?.[1];
  const lon = f?.geometry?.coordinates?.[0];

  if (!name || lat === undefined || lon === undefined) return null;

  const isWithinChennai = lat >= 12.5 && lat <= 13.6 && lon >= 79.8 && lon <= 80.5;
  const isTamilNadu = p.state?.toLowerCase()?.includes('tamil') || isWithinChennai;
  if (!isTamilNadu && !isWithinChennai) return null;

  const cityName = p.city || p.district || p.county || 'Chennai';
  const localityName = p.street || p.locality || p.district || '';
  const displayName = localityName && localityName !== name ? `${name}, ${localityName}` : `${name}, ${cityName}`;

  const lowerDisplay = displayName.toLowerCase();
  const lowerName = name.toLowerCase();
  if (seen.has(lowerDisplay) || seen.has(lowerName)) return null;

  seen.add(lowerDisplay);
  seen.add(lowerName);

  return {
    name: displayName,
    area: name,
    city: cityName,
    state: p.state || 'Tamil Nadu',
    postcode: p.postcode || '',
    lat: Number(lat),
    lon: Number(lon),
    isPopular: false,
  };
};

/**
 * Live Dynamic Geocoding Autocomplete across Chennai with OpenStreetMap / Photon API
 * Covers every single street, landmark, colony, corner, and suburb with exact GPS coords
 */
export const searchChennaiLocationsDynamic = async (query) => {
  const trimmed = query?.trim();
  if (!trimmed || trimmed.length < 2) {
    return CHENNAI_LOCATIONS.filter((l) => l.isPopular);
  }

  const q = trimmed.toLowerCase();
  const cached = dynamicLocationCache.get(q);
  if (cached) return cached;

  const localMatches = CHENNAI_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(q) ||
      loc.area.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q)
  );

  try {
    const searchUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&lat=13.0827&lon=80.2707&limit=15`;
    const response = await fetch(searchUrl, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return localMatches;

    const json = await response.json();
    const seen = new Set(localMatches.map((m) => m.name.toLowerCase()));
    const dynamicResults = [...localMatches];

    for (const f of json.features || []) {
      const parsed = formatPhotonFeature(f, seen);
      if (parsed) {
        dynamicResults.push(parsed);
      }
    }

    dynamicLocationCache.set(q, dynamicResults);
    return dynamicResults;
  } catch (err) {
    console.warn('[LOCATION] Dynamic search error:', err.message);
    return localMatches;
  }
};

class LocationService {
  constructor() {
    this.currentLocation = { ...DEFAULT_LOCATION };
    this.hasInitialized = false;
  }

  /**
   * Get last saved location from memory or local storage.
   * If empty, fallback to Anna Nagar.
   */
  async getLastSavedLocation() {
    if (this.hasInitialized && this.currentLocation?.latitude && this.currentLocation?.longitude) {
      return this.currentLocation;
    }

    try {
      const stored = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.latitude && parsed?.longitude) {
          this.currentLocation = parsed;
          this.hasInitialized = true;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[LOCATION] Error reading saved location:', err.message);
    }

    this.currentLocation = { ...DEFAULT_LOCATION };
    this.hasInitialized = true;
    return this.currentLocation;
  }

  /**
   * Save a location to memory and AsyncStorage
   */
  async saveLocation(locationData) {
    if (!locationData) return;
    this.currentLocation = { ...locationData };
    this.hasInitialized = true;
    try {
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));
    } catch (err) {
      console.warn('[LOCATION] Error storing location:', err.message);
    }
  }

  /**
   * Fetch popular cities and zone chips dynamically from Backend API
   */
  async getPopularZones() {
    return await gymService.fetchPopularZones();
  }

  /**
   * Request Foreground Location Permissions from the user
   */
  async requestPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      await AsyncStorage.setItem(PERMISSION_STORAGE_KEY, status);
      return status === 'granted';
    } catch (err) {
      console.warn('[LOCATION] Permission request error:', err.message);
      return false;
    }
  }

  /**
   * Check current location permission status
   */
  async getPermissionStatus() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status;
    } catch {
      return 'undetermined';
    }
  }

  /**
   * Trigger Android Native GPS turning on prompt & fetch high-accuracy location.
   * If user cancels or GPS is unavailable, fallbacks to last saved location or Anna Nagar.
   */
  async requestLocationWithNativeGps() {
    try {
      // 1. Check if location services (GPS) are enabled on the device
      const isServicesEnabled = await Location.hasServicesEnabledAsync();
      if (!isServicesEnabled) {
        try {
          // Triggers Android native "To continue, turn on device location" dialog
          await Location.enableNetworkProviderAsync();
        } catch (gpsPromptErr) {
          console.warn('[LOCATION] User cancelled native GPS enable dialog:', gpsPromptErr.message);
          const fallbackLoc = await this.getLastSavedLocation();
          return {
            success: false,
            location: fallbackLoc,
            message: 'GPS is turned off. Using saved location.',
          };
        }
      }

      // 2. Request Foreground Location Permission
      const isGranted = await this.requestPermission();
      if (!isGranted) {
        const fallbackLoc = await this.getLastSavedLocation();
        return {
          success: false,
          location: fallbackLoc,
          message: 'Location permission was denied. Using saved location.',
        };
      }

      // 3. Obtain current GPS position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // 4. Reverse geocode to readable neighbourhood & city
      let locationName = 'Current Location';
      let cityName = 'Chennai';

      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          // Prioritize recognizable local neighborhood/area
          const primaryArea = place.district || place.name || place.subregion || place.street || '';
          const cityOrState = place.city || 'Chennai';

          if (primaryArea && primaryArea.toLowerCase() !== 'chennai') {
            locationName = `${primaryArea}, Chennai`;
          } else if (place.subregion && place.subregion.toLowerCase() !== 'chennai') {
            locationName = `${place.subregion}, Chennai`;
          } else {
            locationName = cityOrState || 'Chennai';
          }
        }
      } catch (geoErr) {
        console.warn('[LOCATION] Reverse geocode note:', geoErr.message);
      }

      const locationData = {
        latitude,
        longitude,
        name: locationName,
        city: cityName,
        isGps: true,
      };

      await this.saveLocation(locationData);

      return {
        success: true,
        location: locationData,
      };
    } catch (error) {
      console.warn('[LOCATION] Native GPS location error:', error.message);
      const fallbackLoc = await this.getLastSavedLocation();
      return {
        success: false,
        location: fallbackLoc,
        message: error.message || 'Unable to retrieve GPS location.',
      };
    }
  }

  /**
   * Get Current Device Location via GPS (wrapper for requestLocationWithNativeGps)
   */
  async getCurrentLocation() {
    return await this.requestLocationWithNativeGps();
  }

  /**
   * Set location manually from city picker
   */
  async setManualLocation(selectedCity) {
    const locationData = {
      latitude: selectedCity.lat,
      longitude: selectedCity.lon,
      name: selectedCity.name,
      city: selectedCity.city,
      isGps: false,
    };

    await this.saveLocation(locationData);
    return locationData;
  }

  /**
   * Recalculates distances for all gyms relative to current location
   * and sorts gyms ascending by distance
   */
  computeNearestGyms(gymsList, userCoords = null) {
    const lat = userCoords?.latitude || this.currentLocation.latitude;
    const lon = userCoords?.longitude || this.currentLocation.longitude;

    const gymsWithDistances = gymsList.map((gym) => {
      const gymCoords = getGymCoordinates(gym);
      const calculatedDistance = calculateDistanceKm(
        lat,
        lon,
        gymCoords.latitude,
        gymCoords.longitude
      );

      return {
        ...gym,
        distance: calculatedDistance,
        coords: gymCoords,
      };
    });

    return gymsWithDistances.sort((a, b) => a.distance - b.distance);
  }
}

export const locationService = new LocationService();
export default locationService;
