import mongoose from 'mongoose';
import { ApiError } from '../utils/apiError.js';
import { verifyToken } from '../utils/jwtHelper.js';
import { COOKIE_NAME } from '../utils/cookieHelper.js';
import User from '../models/user.model.js';

/**
 * Helper to extract auth token from request
 */
const extractAuthToken = (req) => {
  // IMPORTANT: Check Authorization header FIRST, before cookies.
  // Both Super Admin and Gym Owner portals share the same cookie domain (localhost),
  // so the authToken cookie may belong to a different user/role.
  // The Authorization header from localStorage is portal-specific and takes priority.
  let token = null;

  if (req.headers?.authorization) {
    const authHeader = req.headers.authorization.trim();
    if (/^bearer\s+/i.test(authHeader)) {
      token = authHeader.replace(/^bearer\s+/i, '').trim();
    } else {
      token = authHeader;
    }
  }

  if (!token && req.headers?.['x-access-token']) {
    token = String(req.headers['x-access-token']).trim();
  }

  if (!token && req.headers?.['x-auth-token']) {
    token = String(req.headers['x-auth-token']).trim();
  }

  // Fall back to cookies only if no header token was provided
  if (!token) {
    token = req.cookies?.[COOKIE_NAME] || req.cookies?.authToken || req.cookies?.token;
  }

  return token || null;
};

/**
 * Global Authentication Middleware
 * Strictly validates JWT on incoming API calls via HTTP-only cookie or Authorization header.
 */
export const authenticate = async (req, _res, next) => {
  try {
    const token = extractAuthToken(req);

    if (!token) {
      throw ApiError.unauthorized('Access denied. Authentication token missing. Please sign in.');
    }

    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      throw ApiError.unauthorized('Invalid or expired authentication token. Please sign in again.');
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      throw ApiError.unauthorized('Invalid user ID in token.');
    }

    const user = await User.findById(decoded.userId).lean().maxTimeMS(5000);
    if (!user) {
      throw ApiError.unauthorized('User account no longer exists.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account is inactive or disabled. Please contact GYMEZY support.');
    }

    req.user = {
      _id: user._id.toString(),
      id: user._id.toString(),
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

/**
 * Optional Authentication Middleware
 * Attaches user context if valid JWT is present, but allows guest/public access without error.
 */
export const optionalAuthenticate = async (req, _res, next) => {
  try {
    const token = extractAuthToken(req);

    if (token) {
      const decoded = verifyToken(token);
      if (decoded?.userId && mongoose.Types.ObjectId.isValid(decoded.userId)) {
        const user = await User.findById(decoded.userId).lean().maxTimeMS(3000);
        if (user?.isActive) {
          req.user = {
            _id: user._id.toString(),
            id: user._id.toString(),
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            gymId: user.gymId ? user.gymId.toString() : null,
          };
        }
      }
    }
  } catch (_err) {
    // Silently continue for optional authentication
  }
  return next();
};

export default authenticate;


