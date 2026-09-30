import sharp from 'sharp';

/**
 * Checks if a string is a base64 data URI or raw base64 string
 */
export const isBase64String = (str) => {
  if (typeof str !== 'string') return false;
  return str.startsWith('data:') || /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str.substring(0, 100));
};

/**
 * Checks if data URI or string represents a PDF
 */
export const isPdfData = (str) => {
  if (typeof str !== 'string') return false;
  return str.startsWith('data:application/pdf') || str.includes('JVBERi0'); // '%PDF-' in Base64
};

/**
 * Checks if data URI or string represents an image
 */
export const isImageData = (str) => {
  if (typeof str !== 'string') return false;
  return str.startsWith('data:image/') || (!isPdfData(str) && isBase64String(str));
};

/**
 * Extracts clean Buffer from base64 string or Data URI
 */
const extractBufferFromBase64 = (base64Str) => {
  if (Buffer.isBuffer(base64Str)) return base64Str;
  if (typeof base64Str !== 'string') return null;

  const commaIdx = base64Str.indexOf(',');
  const cleanBase64 = commaIdx !== -1 ? base64Str.slice(commaIdx + 1) : base64Str;
  return Buffer.from(cleanBase64, 'base64');
};

/**
 * Compresses an image to ultra-efficient WebP while preserving sharp visual readability
 * @param {string|Buffer} input - Base64 data URI or Buffer
 * @param {Object} options - Compression options
 * @returns {Promise<string>} Compressed Base64 Data URL (data:image/webp;base64,...)
 */
export const compressImageBase64 = async (input, options = {}) => {
  try {
    if (!input) return input;

    // If input is an HTTP/HTTPS URL and not base64, keep it as is
    if (typeof input === 'string' && (input.startsWith('http://') || input.startsWith('https://'))) {
      return input;
    }

    const buffer = extractBufferFromBase64(input);
    if (!buffer || buffer.length === 0) return input;

    const maxWidth = options.maxWidth || 1600;
    const maxHeight = options.maxHeight || 1600;
    const quality = options.quality || 78; // 78 gives pristine visual quality at ~10-15% of original JPEG/PNG size

    const compressedBuffer = await sharp(buffer)
      .rotate() // Auto-rotate according to EXIF orientation
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality,
        effort: 4,
        smartSubsample: true,
      })
      .toBuffer();

    return `data:image/webp;base64,${compressedBuffer.toString('base64')}`;
  } catch (err) {
    // If sharp fails (e.g. unsupported format), return original input safely
    console.warn('Image compression warning, storing original:', err.message);
    return input;
  }
};

/**
 * Optimizes and normalizes a PDF Base64 string for storage
 * @param {string|Buffer} input - Base64 data URI or Buffer
 * @returns {string} Standardized PDF Data URI (data:application/pdf;base64,...)
 */
export const compressPdfBase64 = (input) => {
  try {
    if (!input) return input;

    if (typeof input === 'string' && (input.startsWith('http://') || input.startsWith('https://'))) {
      return input;
    }

    const buffer = extractBufferFromBase64(input);
    if (!buffer || buffer.length === 0) return input;

    return `data:application/pdf;base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.warn('PDF normalization warning:', err.message);
    return input;
  }
};

/**
 * Recursively compresses all image and PDF fields inside an object/array payload
 * @param {*} data - Request payload containing media
 * @returns {Promise<*>} Processed payload with compressed base64 media
 */
export const compressMediaRecursively = async (data) => {
  if (!data) return data;

  if (typeof data === 'string') {
    if (isPdfData(data)) {
      return compressPdfBase64(data);
    }
    if (isImageData(data) && data.length > 500) {
      return compressImageBase64(data);
    }
    return data;
  }

  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => compressMediaRecursively(item)));
  }

  if (typeof data === 'object') {
    const result = {};
    const entries = Object.entries(data);

    await Promise.all(
      entries.map(async ([key, value]) => {
        result[key] = await compressMediaRecursively(value);
      })
    );
    return result;
  }

  return data;
};

export default {
  compressImageBase64,
  compressPdfBase64,
  compressMediaRecursively,
  isBase64String,
  isPdfData,
  isImageData,
};
