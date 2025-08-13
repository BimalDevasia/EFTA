// Environment configuration for EFTA application
// This file centralizes environment variable management

import { FALLBACK_CONSTANTS } from './constants';

export const config = {
  // Database Configuration
  mongodb: {
    uri: process.env.MONGODB_URI,
  },

  // Cloudinary Configuration
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // Authentication Configuration
  auth: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET,
  },

  // WhatsApp Configuration (Legacy - now using database settings)
  // These fallbacks are only used if database fetch fails
  whatsapp: {
    businessNumber: process.env.BUSINESS_WHATSAPP_NUMBER || FALLBACK_CONSTANTS.BUSINESS_PHONE_FALLBACK,
    supportNumber: process.env.CUSTOMER_SUPPORT_PHONE || FALLBACK_CONSTANTS.SUPPORT_PHONE_FALLBACK,
  },

  // Application Configuration
  app: {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
  },
};

// Validation function to check required environment variables
export function validateConfig() {
  const errors = [];

  // Check required variables
  if (!config.mongodb.uri) {
    errors.push('MONGODB_URI is required');
  }

  if (!config.auth.jwtSecret) {
    errors.push('JWT_SECRET is required');
  }

  // Warn about missing optional variables
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    console.warn('⚠️  Cloudinary configuration is incomplete. Image uploads may not work.');
  }

  // WhatsApp numbers are now managed through the database via admin panel
  // No need to warn about missing environment variables

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`);
  }

  return true;
}

// Helper function to get WhatsApp numbers
export const getWhatsAppConfig = () => ({
  businessNumber: config.whatsapp.businessNumber,
  supportNumber: config.whatsapp.supportNumber,
  isBusinessNumberFromEnv: !!process.env.BUSINESS_WHATSAPP_NUMBER,
  isSupportNumberFromEnv: !!process.env.CUSTOMER_SUPPORT_PHONE,
});

export default config;
