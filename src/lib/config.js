// Environment configuration for EFTA application
// This file centralizes environment variable management

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

  // WhatsApp Configuration
  whatsapp: {
    businessNumber: process.env.BUSINESS_WHATSAPP_NUMBER || '+919847213659',
    supportNumber: process.env.CUSTOMER_SUPPORT_PHONE || '+919876543210',
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

  if (!process.env.BUSINESS_WHATSAPP_NUMBER) {
    console.warn('⚠️  BUSINESS_WHATSAPP_NUMBER not set. Using fallback number.');
  }

  if (!process.env.CUSTOMER_SUPPORT_PHONE) {
    console.warn('⚠️  CUSTOMER_SUPPORT_PHONE not set. Using fallback number.');
  }

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
