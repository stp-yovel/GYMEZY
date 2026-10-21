/**
 * Client-side cookie utilities
 */

/**
 * Get cookie by name
 * @param {string} name - Name of the cookie
 * @returns {string|null} Cookie value or null
 */
export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
};

/**
 * Set client cookie
 * @param {string} name - Name of cookie
 * @param {string} value - Value of cookie
 * @param {number} days - Expiration in days
 */
export const setCookie = (name, value, days = 7) => {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
};

/**
 * Delete client cookie
 * @param {string} name - Name of cookie to delete
 */
export const deleteCookie = (name) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax`;
};
