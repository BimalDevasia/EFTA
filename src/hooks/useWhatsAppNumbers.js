// React hook to get WhatsApp numbers from database
import { useState, useEffect } from 'react';
import { FALLBACK_CONSTANTS } from '@/lib/constants';

/**
 * Custom hook to fetch WhatsApp numbers from the database
 * @returns {Object} { businessNumber, supportNumber, loading, error }
 */
export function useWhatsAppNumbers() {
  const [numbers, setNumbers] = useState({
    businessNumber: FALLBACK_CONSTANTS.BUSINESS_PHONE_FALLBACK,
    supportNumber: FALLBACK_CONSTANTS.SUPPORT_PHONE_FALLBACK
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/settings?category=whatsapp,contact');
        
        if (!response.ok) {
          throw new Error('Failed to fetch WhatsApp settings');
        }
        
        const data = await response.json();
        
        if (data.success) {
          const settingsMap = {};
          data.settings.forEach(setting => {
            settingsMap[setting.key] = setting.value;
          });
          
          setNumbers({
            businessNumber: settingsMap.business_whatsapp_number || FALLBACK_CONSTANTS.BUSINESS_PHONE_FALLBACK,
            supportNumber: settingsMap.customer_support_phone || FALLBACK_CONSTANTS.SUPPORT_PHONE_FALLBACK
          });
        }
      } catch (err) {
        setError(err.message);
        // Keep fallback numbers on error
      } finally {
        setLoading(false);
      }
    };

    fetchNumbers();
  }, []);

  return { ...numbers, loading, error };
}

/**
 * Hook to get only the business WhatsApp number
 * @returns {Object} { businessNumber, loading, error }
 */
export function useBusinessWhatsAppNumber() {
  const { businessNumber, loading, error } = useWhatsAppNumbers();
  return { businessNumber, loading, error };
}

/**
 * Hook to get only the customer support phone number
 * @returns {Object} { supportNumber, loading, error }
 */
export function useCustomerSupportPhone() {
  const { supportNumber, loading, error } = useWhatsAppNumbers();
  return { supportNumber, loading, error };
}

export default useWhatsAppNumbers;
