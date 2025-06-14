// WhatsApp Business API integration utilities
import { config } from './config';

export class WhatsAppService {
  // Format cart items for WhatsApp message
  static formatCartMessage(cartSummary, customerDetails) {
    const { items, totalItems, totalPrice, deliveryCharge, finalTotal } = cartSummary;
    
    let message = `🛍️ *NEW ORDER FROM EFTA GIFTS*\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${customerDetails.name}\n`;
    message += `Phone: ${customerDetails.phone}\n`;
    message += `Email: ${customerDetails.email}\n`;
    message += `Address: ${customerDetails.address}\n\n`;
    
    message += `🛒 *Order Details:*\n`;
    message += `Order ID: #ORD${Date.now()}\n`;
    message += `Date: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    
    message += `📦 *Items Ordered:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₹${item.price} each\n`;
      message += `   Total: ₹${item.total}\n`;
      
      if (item.customization) {
        message += `   🎨 Customization: ${JSON.stringify(item.customization)}\n`;
      }
      message += `\n`;
    });
    
    message += `💰 *Order Summary:*\n`;
    message += `Subtotal (${totalItems} items): ₹${totalPrice}\n`;
    message += `Delivery Charges: ₹${deliveryCharge}\n`;
    message += `*Total Amount: ₹${finalTotal}*\n\n`;
    
    message += `⏰ Expected Delivery: 5-7 business days\n`;
    message += `📞 For any queries, call: ${config.whatsapp.supportNumber}`;
    
    return message;
  }

  // Send message via WhatsApp Web (opens in browser)
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
  static formatCustomerConfirmation(cartSummary, customerDetails, orderNumber) {
    let message = `🎉 *Order Confirmed - EFTA Gifts*\n\n`;
    message += `Hi ${customerDetails.name}!\n\n`;
    message += `Thank you for your order. Here are the details:\n\n`;
    message += `📋 Order #: ${orderNumber}\n`;
    message += `📅 Date: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    
    message += `📦 *Items:*\n`;
    cartSummary.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (Qty: ${item.quantity}) - ₹${item.total}\n`;
    });
    
    message += `\n💰 *Total: ₹${cartSummary.finalTotal}*\n\n`;
    message += `📍 Delivery Address: ${customerDetails.address}\n`;
    message += `⏰ Expected Delivery: 5-7 business days\n\n`;
    message += `We'll keep you updated on your order status!\n`;
    message += `For support: ${config.whatsapp.supportNumber}`;
    
    return message;
  }
}

// Phone numbers from environment variables with fallbacks
export const BUSINESS_PHONE = config.whatsapp.businessNumber;
export const CUSTOMER_SUPPORT_PHONE = config.whatsapp.supportNumber;
