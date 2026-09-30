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
  return jwt.verify(token, ENV.JWT_SECRET);
};
