// Script to initialize WhatsApp settings in the database
// This sets placeholder numbers - admin should update through admin panel

const initializeWhatsAppSettings = async () => {
  try {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        settings: [
          {
            key: 'business_whatsapp_number',
            value: '+910000000000', // Placeholder - update through admin panel
            description: 'Primary WhatsApp number for business inquiries',
            category: 'whatsapp'
          },
          {
            key: 'customer_support_phone',
            value: '+910000000000', // Placeholder - update through admin panel
            description: 'Customer support phone number',
            category: 'contact'
          }
        ]
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ WhatsApp settings initialized successfully:', data);
    } else {
      console.error('❌ Failed to initialize settings:', data);
    }
  } catch (error) {
    console.error('❌ Error initializing settings:', error);
  }
};

// Run the initialization
if (typeof window !== 'undefined') {
  console.log('🔧 Initializing WhatsApp settings...');
  initializeWhatsAppSettings();
}
