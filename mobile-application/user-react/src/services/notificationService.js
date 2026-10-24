import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './apiService';

const FCM_TOKEN_STORAGE_KEY = 'gymezy_fcm_token';

/**
 * Mobile Push Notification Service
 * Manages device registration with GYMEZY backend
 */
class NotificationService {
  /**
   * Register device token with GYMEZY backend
   * @param {string} token - FCM device token
   */
  async registerDeviceToken(token) {
    if (!token) return;

    try {
      const storedToken = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
      if (storedToken === token) {
        return; // Already registered
      }

      await apiService.post('/notifications/device-token', { token });
      await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
      console.log('✅ FCM token registered with backend successfully.');
    } catch (err) {
      console.warn('⚠️ Failed to register FCM token with backend:', err.message);
    }
  }

  /**
   * Unregister device token from GYMEZY backend on logout
   */
  async unregisterDeviceToken() {
    try {
      const token = await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
      if (token) {
        await apiService.delete(`/notifications/device-token?token=${encodeURIComponent(token)}`);
        await AsyncStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
        console.log('✅ FCM token unregistered from backend.');
      }
    } catch (err) {
      console.warn('⚠️ Failed to unregister FCM token:', err.message);
    }
  }

  /**
   * Handle incoming push notification payload
   * @param {{ notification: { title: string, body: string }, data?: Record<string, string> }} remoteMessage
   */
  handleNotificationMessage(remoteMessage) {
    if (!remoteMessage) return;

    const { notification, data } = remoteMessage;
    console.log('🔔 Received Push Notification:', notification?.title, notification?.body, data);
  }
}

export const notificationService = new NotificationService();
export default notificationService;
