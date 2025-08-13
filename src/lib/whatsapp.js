// WhatsApp Business API integration utilities
import { getWhatsAppNumbers, getBusinessWhatsAppNumber, getCustomerSupportPhone } from './dynamicWhatsApp';
import { FALLBACK_CONSTANTS } from './constants';

export class WhatsAppService {
  // Format cart items for WhatsApp message
  static async formatCartMessage(cartSummary, customerDetails) {
    const { items, totalItems, totalPrice, deliveryCharge, finalTotal } = cartSummary;
    const { supportNumber } = await getWhatsAppNumbers();
    
    let message = `🛍️ *NEW ORDER FROM EFTA GIFTS*\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${customerDetails.name}\n`;
    message += `Phone: ${customerDetails.phone}\n`;
    message += `Email: ${customerDetails.email}\n`;
    message += `Address: ${customerDetails.address}\n`;
    message += `Pincode: ${customerDetails.pincode}\n\n`;
    
    message += `🛒 *Order Details:*\n`;
    message += `Order ID: #ORD${Date.now()}\n`;
    message += `Date: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    
    message += `📦 *Items Ordered:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: Rs ${parseFloat(item.price).toFixed(2)} each\n`;
      message += `   Total: Rs ${parseFloat(item.total).toFixed(2)}\n`;
      
      if (item.customization) {
        message += `   🎨 Customization: ${JSON.stringify(item.customization)}\n`;
      }
      message += `\n`;
    });
    
    message += `💰 *Order Summary:*\n`;
    message += `Subtotal (${totalItems} items): Rs ${parseFloat(totalPrice).toFixed(2)}\n`;
    message += `Delivery Charges: Rs ${parseFloat(deliveryCharge).toFixed(2)}\n`;
    message += `*Total Amount: Rs ${parseFloat(finalTotal).toFixed(2)}*\n\n`;
    
    message += `⏰ Expected Delivery: 5-7 business days\n`;
    message += `📞 For any queries, call: ${supportNumber}`;
    
    return message;
  }

  // LEGACY: Send message via WhatsApp Web (opens in browser) - DEPRECATED
  // This method opens WhatsApp Web which may not be preferred by users
  static sendToWhatsApp(phoneNumber, message) {
    // Remove +91 country code if present and format number
    const cleanNumber = phoneNumber.replace(/^\+91/, '').replace(/\D/g, '');
    const formattedNumber = `91${cleanNumber}`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp Web URL
    const whatsappURL = `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${encodedMessage}`;
    
    // Open in new tab
    window.open(whatsappURL, '_blank');
  }

  // RECOMMENDED: Generate direct WhatsApp link that opens in WhatsApp app
  // This method creates a wa.me link that automatically opens in WhatsApp app when available
  // Usage: const link = WhatsAppService.generateWhatsAppLink(phone, message);
  // Then create <a href={link}>Send Hello</a> or programmatically open the link
  static generateWhatsAppLink(phoneNumber, message) {
    // Remove +91 country code if present and format number
    const cleanNumber = phoneNumber.replace(/^\+91/, '').replace(/\D/g, '');
    const formattedNumber = `91${cleanNumber}`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp official wa.me link that opens in app when available, web otherwise
    return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
  }

  // Alternative: Send via WhatsApp API (if you have WhatsApp Business API)
  static async sendViaAPI(phoneNumber, message) {
    // This would require WhatsApp Business API setup
    // For now, we'll use the web.whatsapp.com method
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send WhatsApp message');
      }

      return await response.json();
    } catch (error) {
      console.error('WhatsApp API Error:', error);
      // Fallback to web WhatsApp
      this.sendToWhatsApp(phoneNumber, message);
    }
  }

  // Generate order confirmation message for customer
  static async formatCustomerConfirmation(cartSummary, customerDetails, orderNumber) {
    const { supportNumber } = await getWhatsAppNumbers();
    
    let message = `🎉 *Order Confirmed - EFTA Gifts*\n\n`;
    message += `Hi ${customerDetails.name}!\n\n`;
    message += `Thank you for your order. Here are the details:\n\n`;
    message += `📋 Order #: ${orderNumber}\n`;
    message += `📅 Date: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    
    message += `📦 *Items:*\n`;
    cartSummary.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (Qty: ${item.quantity}) - Rs ${item.total}\n`;
    });
    
    message += `\n💰 *Total: Rs ${cartSummary.finalTotal}*\n\n`;
    message += `📍 Delivery Address: ${customerDetails.address}\n`;
    message += `⏰ Expected Delivery: 5-7 business days\n\n`;
    message += `We'll keep you updated on your order status!\n`;
    message += `For support: ${supportNumber}`;
    
    return message;
  }
}

// Dynamic phone numbers from database with caching
export const getBusinessPhone = getBusinessWhatsAppNumber;
export const getSupportPhone = getCustomerSupportPhone;

// Legacy constants (kept for backward compatibility - will be deprecated)
// TODO: Remove these and update all usages to use the async functions above
export const BUSINESS_PHONE = FALLBACK_CONSTANTS.BUSINESS_PHONE_FALLBACK; // Fallback only
export const CUSTOMER_SUPPORT_PHONE = FALLBACK_CONSTANTS.SUPPORT_PHONE_FALLBACK; // Fallback only
