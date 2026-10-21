const SENSITIVE_KEYS = new Set(['_id', '__v', 'password', 'passwordHash', 'salt']);

/**
 * Sanitizes and serializes a MongoDB document or object:
 * - Strips internal database fields (_id, __v, password, passwordHash, salt)
 * - Converts _id to standard clean id (or sequential integer index if explicitly provided)
 * - Recursively normalizes subdocuments and arrays
 *
 * @param {Object} item - Data item or Mongoose document to transform
 * @param {number|null} index - Optional sequential row index identifier (e.g. 1, 2, 3)
 * @returns {Object} Cleanly serialized and sanitized object
 */
export const sanitizeDocument = (item, index = null) => {
  if (!item || typeof item !== 'object') {
    return item;
  }

  // Handle Mongoose documents if passed
  const plainObj = typeof item.toObject === 'function' ? item.toObject() : { ...item };

  const sanitized = {};

  // Assign clean id: partnerId / explicit id takes priority, otherwise convert Mongo _id
  if (plainObj.partnerId) {
    sanitized.id = plainObj.partnerId;
    sanitized.partnerId = plainObj.partnerId;
  } else if (plainObj.id !== undefined) {
    sanitized.id = plainObj.id;
  } else if (plainObj._id) {
    sanitized.id = plainObj._id.toString();
  } else if (index !== null && index !== undefined) {
    sanitized.id = index;
  }

  if (plainObj._id) {
    sanitized.mongoId = plainObj._id.toString();
  }
  if (index !== null && index !== undefined) {
    sanitized.rowIndex = index;
  }

  for (const [key, value] of Object.entries(plainObj)) {
    if (SENSITIVE_KEYS.has(key) || key === 'id') {
      continue;
    }

    if (value && typeof value === 'object') {
      if (value instanceof Date || value instanceof RegExp) {
        sanitized[key] = value;
      } else if (value._bsontype === 'ObjectID' || value.constructor?.name === 'ObjectId') {
        // Strip or convert Mongo ObjectIds based on key
        if (key.endsWith('Id') || key.endsWith('ID')) {
          sanitized[key] = value.toString();
        }
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((elem, elemIdx) =>
          typeof elem === 'object' && elem !== null ? sanitizeDocument(elem, elemIdx + 1) : elem
        );
      } else {
        sanitized[key] = sanitizeDocument(value);
      }
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Transforms a list of records by masking _id and assigning sequential integer row indices (1, 2, 3...).
 *
 * @param {Array} list - Array of records
 * @param {number} startIndex - Starting offset for row index numbering (default 1)
 * @returns {Array} List of sanitized records with sequential integer IDs
 */
export const transformListWithIndex = (list = [], startIndex = 1) => {
  if (!Array.isArray(list)) {
    return [];
  }
  return list.map((item, idx) => sanitizeDocument(item, startIndex + idx));
};
