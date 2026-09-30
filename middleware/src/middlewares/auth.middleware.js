import { verifyToken } from '../utils/jwtHelper.js';
import { ApiError } from '../utils/apiError.js';
import { COOKIE_NAME } from '../utils/cookieHelper.js';

/**
 * Middleware to authenticate requests using JWT stored in cookies or Authorization header
 */
export const authenticate = (req, res, next) => {
  try {
    // 1. Read token from HTTP-only cookie first, fallback to Bearer header
    let token = req.cookies?.[COOKIE_NAME] || req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication token missing. Please sign in.');
    }

    // 2. Verify signature & expiration
    const decoded = verifyToken(token);
    if (!decoded) {
      throw ApiError.unauthorized('Invalid or expired authentication token.');
    }

    // 3. Attach authenticated user payload to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Session expired. Please sign in again.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token signature.'));
    }
    next(error);
  }
};
