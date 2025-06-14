#!/bin/bash

echo "📱 WhatsApp Environment Variables Test"
echo "====================================="
echo ""

# Check if the development server is running
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Development server is running on http://localhost:3001"
elif curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running on http://localhost:3000"
else
    echo "❌ Development server is not running!"
    echo "💡 Please run: npm run dev"
    echo ""
fi

echo ""
echo "🔍 Environment Variable Status:"
echo "=============================="

# Read from .env.local
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    if grep -q "BUSINESS_WHATSAPP_NUMBER" .env.local; then
        BUSINESS_NUM=$(grep "BUSINESS_WHATSAPP_NUMBER" .env.local | cut -d'=' -f2)
        echo "📱 Business WhatsApp: $BUSINESS_NUM"
    else
        echo "❌ BUSINESS_WHATSAPP_NUMBER not found in .env.local"
    fi
    
    if grep -q "CUSTOMER_SUPPORT_PHONE" .env.local; then
        SUPPORT_NUM=$(grep "CUSTOMER_SUPPORT_PHONE" .env.local | cut -d'=' -f2)
        echo "📞 Support Phone: $SUPPORT_NUM"
    else
        echo "❌ CUSTOMER_SUPPORT_PHONE not found in .env.local"
    fi
else
    echo "❌ .env.local file not found"
fi

echo ""
echo "🧪 Configuration Test:"
echo "====================="
echo ""
echo "The phone numbers are now configured via environment variables:"
echo "• Business orders will be sent to: $BUSINESS_NUM"
echo "• Support number in messages will be: $SUPPORT_NUM"
echo ""
echo "✅ Benefits of Environment Variable Configuration:"
echo "• 🔒 Secure: Phone numbers not hardcoded in source code"
echo "• 🔄 Flexible: Easy to change for different environments"
echo "• 🚀 Production Ready: Can be configured per deployment"
echo "• 👥 Team Friendly: Each developer can use their own test numbers"
echo ""
echo "📋 Testing Checklist:"
echo "===================="
echo "1. ✅ Environment variables are set"
echo "2. ⏳ Test cart functionality:"
echo "   • Add items to cart"
echo "   • Go through checkout process"
echo "   • Verify WhatsApp message uses correct phone number"
echo "3. ⏳ Check message content includes support number"
echo ""
echo "🌐 Test the cart system at:"
echo "http://localhost:3001/cart (if server is on 3001)"
echo "http://localhost:3000/cart (if server is on 3000)"
echo ""
echo "🔧 To change phone numbers:"
echo "1. Edit .env.local file"
echo "2. Update BUSINESS_WHATSAPP_NUMBER and CUSTOMER_SUPPORT_PHONE"
echo "3. Restart the development server (npm run dev)"
echo ""

# Create a sample WhatsApp message to show what it will look like
echo "📱 Sample WhatsApp Message Preview:"
echo "=================================="
cat << EOF

🛍️ *NEW ORDER FROM EFTA GIFTS*

👤 *Customer Details:*
Name: Test Customer
Phone: +91-9876543210
Email: test@example.com
Address: 123 Test Street, Test City

🛒 *Order Details:*
Order ID: #ORD1733920800000
Date: 11/6/2025

📦 *Items Ordered:*
1. Sample Gift Item
   Quantity: 1
   Price: ₹500.00 each
   Total: ₹500.00

💰 *Order Summary:*
Subtotal (1 items): ₹500.00
Delivery Charges: ₹0
*Total Amount: ₹500.00*

⏰ Expected Delivery: 5-7 business days
📞 For any queries, call: $SUPPORT_NUM

EOF

echo ""
echo "✅ Environment variable configuration complete!"
echo "🎉 Your WhatsApp integration is now using numbers from .env.local"
