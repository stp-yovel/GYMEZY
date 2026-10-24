import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import User from '../models/user.model.js';
import { sendPushNotification } from '../services/firebase.service.js';

/**
 * POST /api/v1/notifications/device-token
 * Register a device FCM token for push notifications
 */
export const registerDeviceToken = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { token } = req.body;

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    throw ApiError.badRequest('A valid FCM device token is required.');
  }

  const cleanToken = token.trim();

  // Atomically add token to user's registered tokens (no duplicates)
  await User.findByIdAndUpdate(userId, {
    $addToSet: { fcmTokens: cleanToken },
  });

  return res.status(200).json(
    ApiResponse.success(
      { registeredToken: cleanToken },
      'Device token registered successfully for push notifications.'
    )
  );
});

/**
 * DELETE /api/v1/notifications/device-token
 * Remove an FCM device token on logout or permission revocation
 */
export const removeDeviceToken = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const token = req.body?.token || req.query?.token;

  if (!token) {
    throw ApiError.badRequest('FCM token is required to unregister.');
  }

  await User.findByIdAndUpdate(userId, {
    $pull: { fcmTokens: String(token).trim() },
  });

  return res.status(200).json(
    ApiResponse.success(
      null,
      'Device token unregistered successfully.'
    )
  );
});

/**
 * POST /api/v1/notifications/test
 * Send a test push notification to the authenticated user's devices
 */
export const sendTestNotification = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { title = 'GYMEZY Notification', body = 'This is a test notification from GYMEZY.' } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found.');
  }

  if (!user.fcmTokens || user.fcmTokens.length === 0) {
    return res.status(200).json(
      ApiResponse.success(
        { sent: false, count: 0 },
        'No registered device tokens found for this user. Please register a device token first.'
      )
    );
  }

  const result = await sendPushNotification(user.fcmTokens, {
    title,
    body,
    data: {
      type: 'TEST_NOTIFICATION',
      timestamp: new Date().toISOString(),
    },
  });

  return res.status(200).json(
    ApiResponse.success(
      result,
      `Push notification dispatched to ${result.successCount} active device(s).`
    )
  );
});
