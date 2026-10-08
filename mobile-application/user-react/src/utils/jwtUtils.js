/* global globalThis, TextDecoder */

/**
 * Base64 alphabet table for decoding
 */
const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Converts a byte array to a UTF-8 string
 * @param {number[]} bytes
 * @returns {string}
 */
const decodeBytesToUtf8 = (bytes) => {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
  }

  let str = '';
  let i = 0;
  while (i < bytes.length) {
    const b1 = bytes[i];
    i += 1;
    if (b1 < 128) {
      str += String.fromCodePoint(b1);
    } else if (b1 > 191 && b1 < 224) {
      const b2 = bytes[i];
      i += 1;
      str += String.fromCodePoint(((b1 % 32) * 64) + (b2 % 64));
    } else if (b1 > 223 && b1 < 240) {
      const b2 = bytes[i];
      const b3 = bytes[i + 1];
      i += 2;
      str += String.fromCodePoint(((b1 % 16) * 4096) + ((b2 % 64) * 64) + (b3 % 64));
    } else {
      const b2 = bytes[i];
      const b3 = bytes[i + 1];
      const b4 = bytes[i + 2];
      i += 3;
      const cp = (((b1 % 8) * 262144) + ((b2 % 64) * 4096) + ((b3 % 64) * 64) + (b4 % 64)) - 65536;
      str += String.fromCodePoint(
        Math.floor(cp / 1024) + 55296,
        (cp % 1024) + 56320
      );
    }
  }
  return str;
};

/**
 * Decodes a 4-character base64 block into 1-3 byte numbers
 * @param {string} chunk
 * @returns {number[]}
 */
const decodeChunkToBytes = (chunk) => {
  const b0 = BASE64_ALPHABET.indexOf(chunk.charAt(0));
  const b1 = chunk.length > 1 ? BASE64_ALPHABET.indexOf(chunk.charAt(1)) : 0;
  const b2 = chunk.length > 2 ? BASE64_ALPHABET.indexOf(chunk.charAt(2)) : -1;
  const b3 = chunk.length > 3 ? BASE64_ALPHABET.indexOf(chunk.charAt(3)) : -1;

  if (b0 === -1 || b1 === -1) {
    return [];
  }

  const num = (b0 * 262144) + (b1 * 4096) + (b2 >= 0 ? b2 * 64 : 0) + (b3 >= 0 ? b3 : 0);
  const result = [Math.floor(num / 65536) % 256];
  if (b2 >= 0) {
    result.push(Math.floor(num / 256) % 256);
  }
  if (b3 >= 0) {
    result.push(num % 256);
  }
  return result;
};

/**
 * Attempts to decode via runtime native atob if present
 * @param {string} input
 * @returns {string|null}
 */
const decodeWithNativeAtob = (input) => {
  const globalAtob = typeof globalThis !== 'undefined' ? globalThis.atob : null;
  if (typeof globalAtob !== 'function') {
    return null;
  }
  try {
    const binary = globalAtob(input);
    const byteList = [];
    for (let j = 0; j < binary.length; j += 1) {
      byteList.push(binary.codePointAt(j));
    }
    return decodeBytesToUtf8(byteList);
  } catch {
    return null;
  }
};

/**
 * Universal base64 decoder compatible with Hermes and JavaScriptCore engines
 * Correctly handles UTF-8 multibyte characters without bitwise operators
 * @param {string} input - Base64 encoded string
 * @returns {string} Decoded UTF-8 string
 */
export const decodeBase64 = (input) => {
  if (!input || typeof input !== 'string') return '';

  const clean = input.split('=')[0];
  if (clean.length % 4 === 1) {
    throw new Error('Invalid base64 string length');
  }

  const nativeResult = decodeWithNativeAtob(input);
  if (nativeResult !== null) {
    return nativeResult;
  }

  const bytes = [];
  for (let i = 0; i < clean.length; i += 4) {
    const chunkBytes = decodeChunkToBytes(clean.slice(i, i + 4));
    for (const byte of chunkBytes) {
      bytes.push(byte);
    }
  }

  return decodeBytesToUtf8(bytes);
};

/**
 * Parses the payload from a standard JWT token string
 * @param {string} token - JWT token in header.payload.signature format
 * @returns {Object|null} Decoded payload object or null if invalid
 */
export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    const parts = cleanToken.split('.');
    if (parts.length !== 3) return null;

    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    const decodedStr = decodeBase64(base64);
    if (!decodedStr) return null;

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

  // If token has no exp claim, consider valid
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
  if (!payload?.exp) return 0;

  const expiresAtMs = payload.exp * 1000;
  const remainingMs = expiresAtMs - Date.now();
  return Math.max(0, remainingMs);
};
