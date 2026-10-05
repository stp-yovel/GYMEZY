/**
 * Helper to extract auth token from request
 */
const extractAuthToken = (req) => {
  let token = req.cookies?.[COOKIE_NAME] || req.cookies?.authToken || req.cookies?.token;

  if (!token && req.headers?.authorization) {
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

    const user = await User.findById(decoded.userId);
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
      if (decoded?.userId) {
        const user = await User.findById(decoded.userId);
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
  next();
};

export default authenticate;


