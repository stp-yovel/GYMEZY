import { ENV } from '../config/env.js';

export const COOKIE_NAME = 'authToken';

/**
 * Standard cookie configuration options
 */
export const getCookieOptions = () => ({
  httpOnly: true,
  secure: ENV.IS_PRODUCTION,
  sameSite: ENV.IS_PRODUCTION ? 'none' : 'lax',
  maxAge: ENV.COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  path: '/',
});

/**
 * Sets the HTTP-only JWT auth cookie on the response
 * @param {import('express').Response} res - Express response object
 * @param {string} token - Signed JWT token
 */
export const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, getCookieOptions());
};

/**
 * Clears the HTTP-only JWT auth cookie
 * @param {import('express').Response} res - Express response object
 */
export const clearAuthCookie = (res) => {
  res.cookie(COOKIE_NAME, '', {
    ...getCookieOptions(),
    maxAge: 0,
  });
};
