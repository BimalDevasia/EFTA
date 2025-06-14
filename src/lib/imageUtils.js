/**
 * Utility functions for handling Cloudinary images
 */

/**
 * Transform a Cloudinary URL to add optimization parameters
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized Cloudinary URL
 */
export const optimizeCloudinaryImage = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return original URL if not a Cloudinary image
  }

  const {
    width = 400,
    height = 300,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  // Find the upload part in the URL
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const beforeUpload = url.substring(0, uploadIndex + 8);
  const afterUpload = url.substring(uploadIndex + 8);

  // Build transformation string
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ].join(',');

  return `${beforeUpload}${transformations}/${afterUpload}`;
};

/**
 * Get multiple sizes of an image for responsive design
 * @param {string} url - Original Cloudinary URL
 * @returns {Object} - Object with different image sizes
 */
export const getResponsiveImageSizes = (url) => {
  if (!url) return {};

  return {
    thumbnail: optimizeCloudinaryImage(url, { width: 150, height: 150, crop: 'thumb' }),
    small: optimizeCloudinaryImage(url, { width: 300, height: 225 }),
    medium: optimizeCloudinaryImage(url, { width: 600, height: 450 }),
    large: optimizeCloudinaryImage(url, { width: 1200, height: 900 }),
    original: url,
  };
};

/**
 * Generate a placeholder image URL for loading states
 * @param {number} width - Width of placeholder
 * @param {number} height - Height of placeholder
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (width = 400, height = 300) => {
  return `https://via.placeholder.com/${width}x${height}/f0f0f0/cccccc?text=Loading...`;
};
