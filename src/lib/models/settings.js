import mongoose from 'mongoose';
import { FALLBACK_CONSTANTS } from '@/lib/constants';

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    default: 'general',
    enum: ['general', 'whatsapp', 'contact', 'business', 'ui']
  },
  isEditable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Note: key index is already created by unique: true above
// Only create additional indexes
settingsSchema.index({ category: 1 });

// Static method to get a setting value by key
settingsSchema.statics.getValue = async function(key, fallback = null) {
  try {
    const setting = await this.findOne({ key });
    return setting ? setting.value : fallback;
  } catch (error) {
    return fallback;
  }
};

// Static method to set a setting value
settingsSchema.statics.setValue = async function(key, value, description = '', category = 'general') {
  try {
    const setting = await this.findOneAndUpdate(
      { key },
      { 
        value, 
        description, 
        category,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );
    return setting;
  } catch (error) {
    throw new Error(`Failed to set setting ${key}: ${error.message}`);
  }
};

// Static method to get all settings by category
settingsSchema.statics.getByCategory = async function(category) {
  try {
    return await this.find({ category }).sort({ key: 1 });
  } catch (error) {
    return [];
  }
};

// Static method to initialize default settings
settingsSchema.statics.initializeDefaults = async function() {
  const defaults = [
    {
      key: 'business_whatsapp_number',
      value: FALLBACK_CONSTANTS.BUSINESS_PHONE_FALLBACK,
      description: 'Primary WhatsApp number for business inquiries',
      category: 'whatsapp'
    },
    {
      key: 'customer_support_phone',
      value: FALLBACK_CONSTANTS.SUPPORT_PHONE_FALLBACK,
      description: 'Customer support phone number',
      category: 'contact'
    },
    {
      key: 'business_name',
      value: 'EFTA',
      description: 'Business name',
      category: 'business'
    },
    {
      key: 'business_email',
      value: 'support@efta.com',
      description: 'Business email address',
      category: 'contact'
    }
  ];

  try {
    for (const setting of defaults) {
      await this.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true, new: true }
      );
    }
    return true;
  } catch (error) {
    throw new Error(`Failed to initialize default settings: ${error.message}`);
  }
};

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

export default Settings;
