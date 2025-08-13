// Constants for fallback values when database is unavailable
// These should be generic placeholder numbers that don't represent actual business numbers

export const FALLBACK_CONSTANTS = {
  // Generic placeholder phone numbers (not actual business numbers)
  BUSINESS_PHONE_FALLBACK: '+910000000000',
  SUPPORT_PHONE_FALLBACK: '+910000000000',
  
  // Placeholder examples for UI validation messages
  PHONE_FORMAT_EXAMPLE: '+910000000000',
  
  // Default categories
  DEFAULT_WHATSAPP_CATEGORY: 'whatsapp',
  DEFAULT_CONTACT_CATEGORY: 'contact'
};

export const VALIDATION_PATTERNS = {
  // International phone number validation pattern
  INTERNATIONAL_PHONE: /^\+[1-9]\d{1,14}$/,
  
  // India specific phone number pattern
  INDIAN_PHONE: /^\+91[6-9]\d{9}$/
};

export default FALLBACK_CONSTANTS;
