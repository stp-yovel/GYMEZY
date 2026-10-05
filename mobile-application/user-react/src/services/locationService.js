import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { gymService, DEFAULT_FALLBACK_ZONES } from './gymService';

const LOCATION_STORAGE_KEY = '@gymezy_user_saved_location';
const PERMISSION_STORAGE_KEY = '@gymezy_location_permission_status';

export const POPULAR_CITIES = DEFAULT_FALLBACK_ZONES;


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

class LocationService {
  constructor() {
    this.currentLocation = {
      latitude: 13.085,
      longitude: 80.2101,
      name: 'Anna Nagar, Chennai',
      city: 'Chennai',
      isGps: false,
    };
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
   * Get Current Device Location via GPS with reverse geocoding
   */
  async getCurrentLocation() {
    try {
      const isGranted = await this.requestPermission();
      if (!isGranted) {
        return {
          success: false,
          location: this.currentLocation,
          message: 'Location permission was denied. Using default location.',
        };
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get human-friendly neighborhood & city
      let locationName = 'Current Location';
      let cityName = 'Chennai';

      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          const area = place.district || place.subregion || place.name || place.street || '';
          const city = place.city || place.region || '';
          cityName = city || 'Chennai';

          if (area && city) {
            locationName = `${area}, ${city}`;
          } else if (city) {
            locationName = city;
          } else if (area) {
            locationName = area;
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

      this.currentLocation = locationData;
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));

      return {
        success: true,
        location: locationData,
      };
    } catch (error) {
      console.warn('[LOCATION] Location fetch error:', error.message);
      return {
        success: false,
        location: this.currentLocation,
        message: error.message || 'Unable to retrieve current location.',
      };
    }
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

    this.currentLocation = locationData;
    await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData));
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
