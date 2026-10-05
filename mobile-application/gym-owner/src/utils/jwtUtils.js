/**
 * Base64 alphabet table for decoding
 */
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * Universal base64 decoder compatible with Hermes and JavaScriptCore engines
 * @param {string} input - Base64 encoded string
 * @returns {string} Decoded UTF-8 string
 */
export const decodeBase64 = (input) => {
  if (!input || typeof input !== 'string') return '';
  const str = input.replace(/=+$/, '');
  let output = '';

  if (str.length % 4 === 1) {
    throw new Error('Invalid base64 string length');
  }

  for (
    let bc = 0, bs = 0, buffer, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = BASE64_CHARS.indexOf(buffer);
  }

  return output;
};

/**
 * Parses the payload from a standard JWT token string
 * @param {string} token - JWT token in header.payload.signature format
 * @returns {Object|null} Decoded payload object or null if invalid
 */
export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const decodedStr =
      typeof atob === 'function' ? atob(base64) : decodeBase64(base64);

    return JSON.parse(decodedStr);
  } catch (error) {
    console.warn('[JWT UTILS] Unable to parse JWT payload:', error.message);
    return null;
  }
};

/**
 * Checks if a JWT token is expired or close to expiring
 * @param {string} token - JWT token string
 * @param {number} [bufferSeconds=10] - Safety margin in seconds
 * @returns {boolean} True if expired or invalid, False if currently valid
 */
export const isJwtExpired = (token, bufferSeconds = 10) => {
  if (!token || typeof token !== 'string') return true;

  const payload = parseJwt(token);
  if (!payload) return true;

  if (!payload.exp || typeof payload.exp !== 'number') return false;

  const currentUnixSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= currentUnixSeconds + bufferSeconds;
};

/**
 * Calculates remaining milliseconds until JWT token expires
 * @param {string} token - JWT token string
 * @returns {number} Milliseconds remaining (or 0 if already expired/invalid)
 */
export const getJwtRemainingMs = (token) => {
  if (!token) return 0;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return 0;

  const expiresAtMs = payload.exp * 1000;
  const remainingMs = expiresAtMs - Date.now();
  return Math.max(0, remainingMs);
};
