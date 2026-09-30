import { ApiError } from '../utils/apiError.js';

/**
 * Role-based authorization middleware
 * @param  {...string} allowedRoles - List of permitted roles (e.g. 'admin', 'gym_owner', 'customer')
 */
export const authorizeRoles = (...allowedRoles) => {
  const allowedSet = new Set(allowedRoles);

  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated.'));
    }

    if (!allowedSet.has(req.user.role)) {
      return next(
        ApiError.forbidden(`Access denied. Role '${req.user.role}' is not authorized for this resource.`)
      );
    }

    next();
  };
};
