// Dynamic WhatsApp configuration using database settings
import Settings from '@/lib/models/settings';
import connectDB from '@/lib/mongoose';
import { FALLBACK_CONSTANTS } from '@/lib/constants';

// Cache for phone numbers to avoid frequent database calls
let phoneNumbersCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get WhatsApp phone numbers from database with caching
 * @returns {Promise<{businessNumber: string, supportNumber: string}>}
 */
export async function getWhatsAppNumbers() {
  // Check cache validity
  const now = Date.now();
  if (phoneNumbersCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return phoneNumbersCache;
  }

  try {
    await connectDB();
    
    // Fetch both numbers from database
    const [businessNumber, supportNumber] = await Promise.all([
      Settings.getValue('business_whatsapp_number', FALLBACK_CONSTANTS.BUSINESS_PHONE_FALLBACK),
      Settings.getValue('customer_support_phone', FALLBACK_CONSTANTS.SUPPORT_PHONE_FALLBACK)
    ]);

    // Update cache
    phoneNumbersCache = {
      businessNumber,
      supportNumber
    };
    cacheTimestamp = now;

    return phoneNumbersCache;
  } catch (error) {
    console.warn('Failed to fetch WhatsApp numbers from database, using fallbacks:', error.message);
    
    // Return fallback numbers if database fetch fails
    const fallbackNumbers = {
      businessNumber: FALLBACK_CONSTANTS.BUSINESS_PHONE_FALLBACK,
      supportNumber: FALLBACK_CONSTANTS.SUPPORT_PHONE_FALLBACK
    };
    
    // Cache fallbacks too
    phoneNumbersCache = fallbackNumbers;
    cacheTimestamp = now;
    
    return fallbackNumbers;
  }
}

/**
 * Clear the phone numbers cache (useful when settings are updated)
 */
export function clearWhatsAppNumbersCache() {
  phoneNumbersCache = null;
  cacheTimestamp = null;
}

/**
 * Get business WhatsApp number only
 * @returns {Promise<string>}
 */
export async function getBusinessWhatsAppNumber() {
  const { businessNumber } = await getWhatsAppNumbers();
  return businessNumber;
}

/**
 * Get customer support phone number only
 * @returns {Promise<string>}
 */
export async function getCustomerSupportPhone() {
  const { supportNumber } = await getWhatsAppNumbers();
  return supportNumber;
}

export default {
  getWhatsAppNumbers,
  clearWhatsAppNumbersCache,
  getBusinessWhatsAppNumber,
  getCustomerSupportPhone
};
