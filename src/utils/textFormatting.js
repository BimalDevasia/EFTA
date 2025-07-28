/**
 * Format product text casing for consistent data storage
 * @param {Object} productData - Raw product data from form
 * @returns {Object} - Formatted product data with proper casing
 */
export function formatProductTextCasing(productData) {
  if (!productData || typeof productData !== 'object') {
    return productData;
  }

  const formatted = { ...productData };

  // Format product category to lowercase
  if (formatted.productCategory) {
    formatted.productCategory = formatted.productCategory.toLowerCase().trim();
  }

  // Format product ID to lowercase
  if (formatted.productId) {
    formatted.productId = formatted.productId.toLowerCase().trim();
  }

  // Format product type to lowercase
  if (formatted.type) {
    formatted.type = formatted.type.toLowerCase().trim();
  }

  // Format product name - title case (first letter of each word capitalized)
  if (formatted.productName) {
    formatted.productName = formatted.productName
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Format tags to lowercase
  if (Array.isArray(formatted.tags)) {
    formatted.tags = formatted.tags.map(tag => 
      typeof tag === 'string' ? tag.toLowerCase().trim() : tag
    );
  }

  // Format color names to title case
  if (Array.isArray(formatted.colors)) {
    formatted.colors = formatted.colors.map(color => ({
      ...color,
      name: color.name ? color.name
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ') : color.name
    }));
  }

  // Format specifications headings to title case
  if (Array.isArray(formatted.specifications)) {
    formatted.specifications = formatted.specifications.map(spec => ({
      ...spec,
      heading: spec.heading ? spec.heading
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ') : spec.heading
    }));
  }

  return formatted;
}

/**
 * Format text to title case
 * @param {string} text - Text to format
 * @returns {string} - Title case text
 */
export function toTitleCase(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  return text
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format text to lowercase and trim
 * @param {string} text - Text to format
 * @returns {string} - Lowercase trimmed text
 */
export function toLowerCaseTrimmed(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  return text.toLowerCase().trim();
}