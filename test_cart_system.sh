#!/bin/bash

# EFTA Cart System Testing Script
# This script helps verify the cart system is working correctly

echo "🛒 EFTA Cart System Testing Script"
echo "=================================="
echo ""

# Check if the development server is running
echo "📊 Checking development server status..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Development server is running on http://localhost:3001"
else
    echo "❌ Development server is not running!"
    echo "💡 Please run: npm run dev"
    exit 1
fi

echo ""
echo "🔍 Testing key components..."

# Check if cart store file exists
if [ -f "src/stores/useCart.js" ]; then
    echo "✅ Cart store found: src/stores/useCart.js"
else
    echo "❌ Cart store missing!"
fi

# Check if WhatsApp service exists
if [ -f "src/lib/whatsapp.js" ]; then
    echo "✅ WhatsApp service found: src/lib/whatsapp.js"
else
    echo "❌ WhatsApp service missing!"
fi

# Check if cart page exists
if [ -f "src/app/(withfooter)/cart/page.jsx" ]; then
    echo "✅ Cart page found: src/app/(withfooter)/cart/page.jsx"
else
    echo "❌ Cart page missing!"
fi

# Check if required dependencies are installed
echo ""
echo "📦 Checking dependencies..."

if grep -q "zustand" package.json; then
    echo "✅ Zustand state management installed"
else
    echo "❌ Zustand missing - run: npm install zustand"
fi

if grep -q "react-hot-toast" package.json; then
    echo "✅ React Hot Toast installed"
else
    echo "❌ React Hot Toast missing - run: npm install react-hot-toast"
fi

echo ""
echo "🧪 Manual Testing Checklist:"
echo "==========================="
echo ""
echo "1. 🛍️  Product Addition Test:"
echo "   • Navigate to any product page"
echo "   • Add product to cart"
echo "   • Check navbar cart count updates"
echo "   • Verify toast notification appears"
echo ""
echo "2. 🛒 Cart Page Test:"
echo "   • Navigate to /cart"
echo "   • Verify items display correctly"
echo "   • Test quantity updates"
echo "   • Test item removal"
echo "   • Check price calculations"
echo ""
echo "3. 📝 Checkout Test:"
echo "   • Click 'Place Order'"
echo "   • Fill customer details form"
echo "   • Test form validation"
echo "   • Submit order"
echo "   • Verify WhatsApp integration"
echo ""
echo "4. 💾 Persistence Test:"
echo "   • Add items to cart"
echo "   • Refresh browser"
echo "   • Check cart items persist"
echo ""
echo "🌐 Access the application at: http://localhost:3001"
echo ""
echo "📱 WhatsApp Test Message Preview:"
echo "================================"

# Generate a sample WhatsApp message
cat << 'EOF'
🛍️ *NEW ORDER FROM EFTA GIFTS*

👤 *Customer Details:*
Name: Test Customer
Phone: +91-1234567890
Email: test@example.com
Address: 123 Test Street, Test City

🛒 *Order Details:*
Order ID: #ORD1733920800000
Date: 11/6/2025

📦 *Items Ordered:*
1. Sample Gift Item
   Quantity: 2
   Price: ₹500 each
   Total: ₹1000

💰 *Order Summary:*
Subtotal (2 items): ₹1000
Delivery Charges: ₹0
*Total Amount: ₹1000*

⏰ Expected Delivery: 5-7 business days
📞 For any queries, call: +91-9876543210
EOF

echo ""
echo "✅ Testing complete! Follow the manual testing steps above."
echo "📞 Business WhatsApp: +91-9876543210"
echo ""
echo "🐛 If you find any issues, check the browser console for errors."
echo "📋 For detailed testing guide, see: test_cart_system.md"
