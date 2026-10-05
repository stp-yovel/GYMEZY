/**
 * Safely extracts a valid image URI string from various MongoDB / backend formats:
 * - String URL / base64: "https://..." or "data:image/..."
 * - fileAttachmentSchema: { fileData: "...", fileName: "...", url: "..." }
 * - Array of images: ["https://...", { fileData: "..." }]
 * Returns a valid string URI or null so that fallbacks render safely without RCTImageView type errors.
 */
export const getSafeImageUri = (media) => {
  if (!media) return null;

  if (typeof media === 'string') {
    const trimmed = media.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (Array.isArray(media) && media.length > 0) {
    return getSafeImageUri(media[0]);
  }

  if (typeof media === 'object') {
    if (typeof media.fileData === 'string' && media.fileData.trim().length > 0) {
      return media.fileData.trim();
    }
    if (typeof media.url === 'string' && media.url.trim().length > 0) {
      return media.url.trim();
    }
    if (typeof media.uri === 'string' && media.uri.trim().length > 0) {
      return media.uri.trim();
    }
  }

  return null;
};

/**
 * Safely extracts gym logo or cover photo URI
 */
export const getGymLogoUri = (gym) => {
  if (!gym) return null;
  return (
    getSafeImageUri(gym.logo) ||
    getSafeImageUri(gym.coverPhoto) ||
    getSafeImageUri(gym.image) ||
    getSafeImageUri(gym.images) ||
    getSafeImageUri(gym.galleryPhotos) ||
    null
  );
};
