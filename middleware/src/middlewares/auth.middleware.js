import { verifyToken } from '../utils/jwtHelper.js';
import { ApiError } from '../utils/apiError.js';
import { COOKIE_NAME } from '../utils/cookieHelper.js';
import User from '../models/user.model.js';

/**
 * Global Authentication Middleware
 * Strictly validates JWT on incoming API calls via HTTP-only cookie or Authorization header.
 * Verifies token validity, expiration, and active user status in database.
 */
export const authenticate = async (req, _res, next) => {
  try {
    // 1. Extract token from HTTP-only cookie, Authorization header, or custom auth headers
    let token = req.cookies?.[COOKIE_NAME] || req.cookies?.authToken || req.cookies?.token;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization.trim();
      if (/^bearer\s+/i.test(authHeader)) {
        token = authHeader.replace(/^bearer\s+/i, '').trim();
      } else {
        token = authHeader;
      }
    }

    if (!token && req.headers['x-access-token']) {
      token = String(req.headers['x-access-token']).trim();
    }

    if (!token && req.headers['x-auth-token']) {
      token = String(req.headers['x-auth-token']).trim();
    }

    if (!token) {
      throw ApiError.unauthorized('Access denied. Authentication token missing. Please sign in.');
    }

    // 2. Verify signature & expiration
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      throw ApiError.unauthorized('Invalid or expired authentication token. Please sign in again.');
    }

    // 3. Verify user exists and is active in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw ApiError.unauthorized('User account no longer exists.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account is inactive or disabled. Please contact GYMEZY support.');
    }

    // 4. Attach verified user context to request
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      gymId: user.gymId ? user.gymId.toString() : null,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Session expired. Please sign in again.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid authentication token signature.'));
    }
    next(error);
  }
};

export default authenticate;
