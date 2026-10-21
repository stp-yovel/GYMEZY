import { ApiError } from '../utils/apiError.js';
import { ENV } from '../config/env.js';

const GENERIC_PROD_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Normalizes various error types (Mongoose, JWT, Mongo) into a unified ApiError
 */
const normalizeError = (err) => {
  if (err instanceof ApiError) {
    return err;
  }

  // Handle Mongoose CastError (invalid ObjectId / parameter format)
  if (err.name === 'CastError') {
    return ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // Handle Mongoose Validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return ApiError.unprocessable('Validation failed', messages);
  }

  // Handle Mongo Duplicate Key error (11000)
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(', ');
    return ApiError.conflict(`Duplicate value for field(s): ${fields}`);
  }

  // Handle JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    return ApiError.unauthorized('Invalid authentication token signature.');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Authentication token has expired.');
  }

  // Generic internal server error
  return new ApiError(
    err.statusCode || 500,
    err.message || 'Internal Server Error',
    err.errors || [],
    err.stack
  );
};

/**
 * Global centralized error-handling middleware.
 * - Development: Returns exact error details, message, and full stack trace for debugging.
 * - Production: Returns generic user-safe message for 500s ("Something went wrong. Please try again.") and omits stack traces.
 */
export const errorHandler = (err, req, res, _next) => {
  const normalized = normalizeError(err);
  const statusCode = normalized.statusCode || 500;
  const isInternalServerError = statusCode >= 500;

  // Log all internal server errors on the backend
  if (isInternalServerError) {
    console.error(`[SERVER ERROR] [${req.method}] ${req.originalUrl}:`, err);
  }

  if (ENV.IS_PRODUCTION) {
    // Production response: Safe masking for 500s, operational messages for 4xx
    const prodMessage = isInternalServerError
      ? GENERIC_PROD_ERROR_MESSAGE
      : normalized.message;

    const prodPayload = {
      success: false,
      statusCode,
      message: prodMessage,
    };

    if (!isInternalServerError && Array.isArray(normalized.errors) && normalized.errors.length > 0) {
      prodPayload.errors = normalized.errors;
    }

    return res.status(statusCode).json(prodPayload);
  }

  // Development & Local debug response: Full transparent error with stack trace
  const devPayload = {
    success: false,
    statusCode,
    message: normalized.message,
  };

  if (Array.isArray(normalized.errors) && normalized.errors.length > 0) {
    devPayload.errors = normalized.errors;
  }

  if (normalized.stack || err.stack) {
    devPayload.stack = normalized.stack || err.stack;
  }

  return res.status(statusCode).json(devPayload);
};
