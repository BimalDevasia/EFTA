import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import Settings from '@/lib/models/settings';
import { verifyAdmin } from '@/lib/auth-helpers';
import { clearWhatsAppNumbersCache } from '@/lib/dynamicWhatsApp';

// GET - Fetch settings (optionally by category)
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const key = searchParams.get('key');

    let settings;
    
    if (key) {
      // Get single setting by key
      const setting = await Settings.findOne({ key });
      if (!setting) {
        return NextResponse.json(
          { error: 'Setting not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ setting });
    } else if (category) {
      // Get settings by category
      settings = await Settings.getByCategory(category);
    } else {
      // Get all settings
      settings = await Settings.find().sort({ category: 1, key: 1 });
    }

    return NextResponse.json({ 
      settings,
      total: settings.length 
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST - Create or update a setting (Admin only)
export async function POST(request) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const data = await request.json();
    const { key, value, description, category } = data;

    // Validate required fields
    if (!key || !value) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // Validate key format (alphanumeric, underscores, and hyphens only)
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
      return NextResponse.json(
        { error: 'Key must contain only letters, numbers, underscores, and hyphens' },
        { status: 400 }
      );
    }

    // Set the setting
    const setting = await Settings.setValue(
      key, 
      value, 
      description || '', 
      category || 'general'
    );

    // Clear WhatsApp cache if WhatsApp-related settings were updated
    if (category === 'whatsapp' || category === 'contact' || 
        key === 'business_whatsapp_number' || key === 'customer_support_phone') {
      clearWhatsAppNumbersCache();
    }

    return NextResponse.json({
      message: 'Setting saved successfully',
      setting
    });

  } catch (error) {
    return NextResponse.json(
      { error: `Failed to save setting: ${error.message}` },
      { status: 500 }
    );
  }
}

// PUT - Update multiple settings (Admin only)
export async function PUT(request) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const data = await request.json();
    const { settings } = data;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'Settings must be an array' },
        { status: 400 }
      );
    }

    const updatedSettings = [];

    for (const settingData of settings) {
      const { key, value, description, category } = settingData;
      
      if (!key || !value) {
        continue; // Skip invalid entries
      }

      try {
        const setting = await Settings.setValue(
          key, 
          value, 
          description || '', 
          category || 'general'
        );
        updatedSettings.push(setting);
      } catch (error) {
        // Continue with other settings even if one fails
        continue;
      }
    }

    // Clear WhatsApp cache if any WhatsApp-related settings were updated
    const hasWhatsAppUpdates = updatedSettings.some(setting => 
      setting.category === 'whatsapp' || setting.category === 'contact' ||
      setting.key === 'business_whatsapp_number' || setting.key === 'customer_support_phone'
    );
    
    if (hasWhatsAppUpdates) {
      clearWhatsAppNumbersCache();
    }

    return NextResponse.json({
      message: `${updatedSettings.length} settings updated successfully`,
      settings: updatedSettings
    });

  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update settings: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE - Delete a setting (Admin only)
export async function DELETE(request) {
  try {
    // Verify admin authentication
    const adminUser = await verifyAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Setting key is required' },
        { status: 400 }
      );
    }

    const setting = await Settings.findOneAndDelete({ key });
    
    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Setting deleted successfully',
      setting
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete setting' },
      { status: 500 }
    );
  }
}
