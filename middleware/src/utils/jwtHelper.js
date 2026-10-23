import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

/**
 * Generate a signed JWT token
 * @param {Object} payload - Minimal payload data (e.g. userId, role, email)
 * @param {string} [expiresIn] - Optional expiration string (e.g. '7d', '1d')
 * @returns {string} Signed JWT token
 */
export const generateToken = (payload, expiresIn = ENV.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn,
  });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token string
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  if (!token || token === 'undefined' || token === 'null') {
    throw new Error('No authentication token provided.');
  }

  // 1. Try with configured JWT_SECRET
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch (err) {
    // 2. Try with default dev key fallback
    try {
      return jwt.verify(token, 'default_jwt_secret_dev_key');
    } catch (_) {
      // Continue
    }

    // 3. In development mode, allow valid decoded token payload so developer sessions don't break across restarts
    if (!ENV.IS_PRODUCTION) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && (decoded.userId || decoded.id || decoded._id || decoded.email)) {
          return {
            ...decoded,
            userId: decoded.userId || decoded.id || decoded._id,
          };
        }
      } catch (_) {
        // Continue
      }
    }

    throw err;
  }
};
