import sharp from 'sharp';

/**
 * Checks if a string is a base64 data URI or raw base64 string
 */
export const isBase64String = (str) => {
  if (typeof str !== 'string') return false;
  return (
    str.startsWith('data:') ||
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str.substring(0, 100))
  );
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
 * Generates formatted file name: {gymname}_{filename}
 * Example: "Titanium Fitness Club", "pan" -> "titanium_fitness_club_pan"
 *
 * @param {string} gymName - Name of the gym
 * @param {string} fileKey - Document/image descriptor (e.g. "pan", "gst_certificate", "cover", "trade_license")
 * @param {string} [extension] - Optional file extension (e.g. "pdf", "webp")
 * @returns {string} Formatted file name
 */
export const formatMediaFileName = (gymName = 'gym', fileKey = 'file', extension = '') => {
  const sanitizedGym = (gymName || 'gym')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const sanitizedKey = (fileKey || 'file')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const ext = extension ? (extension.startsWith('.') ? extension : `.${extension}`) : '';
  return `${sanitizedGym}_${sanitizedKey}${ext}`;
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
    const quality = options.quality || 78;

    const compressedBuffer = await sharp(buffer)
      .rotate()
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
 * Formats, compresses, and structures a document or image file with the {gymname}_{filename} format
 *
 * @param {string} gymName - Name of the gym
 * @param {string} fileKey - File category/name (e.g. "pan", "gst_certificate", "cover", "gallery_1")
 * @param {string|Object} base64Input - Raw Base64 string or existing file object
 * @returns {Promise<Object|null>} Structured file object with { fileName, fileData, mimeType, fileSizeKb, uploadedAt }
 */
export const formatAndCompressFile = async (gymName, fileKey, base64Input) => {
  if (!base64Input) return null;

  let rawData = typeof base64Input === 'object' && base64Input.fileData ? base64Input.fileData : base64Input;
  if (typeof rawData !== 'string' || !rawData.trim()) return null;

  const isPdf = isPdfData(rawData);
  const ext = isPdf ? 'pdf' : 'webp';
  const mimeType = isPdf ? 'application/pdf' : 'image/webp';

  const compressedData = isPdf
    ? compressPdfBase64(rawData)
    : await compressImageBase64(rawData, { maxWidth: 1600, maxHeight: 1600, quality: 78 });

  const fileName = formatMediaFileName(gymName, fileKey, ext);

  // Approximate file size in KB
  const sizeInBytes = Math.round((compressedData.length * 3) / 4);
  const fileSizeKb = +(sizeInBytes / 1024).toFixed(2);

  return {
    fileName,
    fileData: compressedData,
    mimeType,
    fileSizeKb,
    uploadedAt: new Date(),
  };
};

/**
 * Recursively compresses all image and PDF fields inside an object/array payload
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
  formatMediaFileName,
  formatAndCompressFile,
  compressMediaRecursively,
  isBase64String,
  isPdfData,
  isImageData,
};
