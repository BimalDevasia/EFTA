import { connectDB } from '@/lib/mongoose';
import Settings from '@/lib/models/settings';
import { FALLBACK_CONSTANTS } from '@/lib/constants';

export async function initializeSettings() {
  try {
    await connectDB();
    
    // Check if settings are already initialized
    const existingSettings = await Settings.countDocuments();
    
    if (existingSettings === 0) {
      // Initialize default settings
      await Settings.initializeDefaults();
      return { success: true, message: 'Default settings initialized' };
    }
    
    return { success: true, message: 'Settings already initialized' };
  } catch (error) {
    return { 
      success: false, 
      message: `Failed to initialize settings: ${error.message}` 
    };
  }
}

export async function getWhatsAppSettings() {
  try {
    await connectDB();
    
    const businessNumber = await Settings.getValue('business_whatsapp_number', FALLBACK_CONSTANTS.BUSINESS_PHONE_FALLBACK);
    const supportNumber = await Settings.getValue('customer_support_phone', FALLBACK_CONSTANTS.SUPPORT_PHONE_FALLBACK);
    
    return {
      businessNumber,
      supportNumber
    };
  } catch (error) {
    // Return fallback values if database is not available
    return {
      businessNumber: FALLBACK_CONSTANTS.BUSINESS_PHONE_FALLBACK,
      supportNumber: FALLBACK_CONSTANTS.SUPPORT_PHONE_FALLBACK
    };
  }
}
