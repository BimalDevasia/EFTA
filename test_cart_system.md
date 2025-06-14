# Cart System Testing Guide

## Overview
This document outlines the testing procedure for the comprehensive cart system implemented in EFTA Gifts application.

## Features to Test

### 1. Cart State Management
- **Add items to cart**: Test adding products with and without customization
- **Update quantities**: Test increasing/decreasing item quantities
- **Remove items**: Test removing individual items from cart
- **Clear cart**: Test clearing entire cart
- **Persistent storage**: Test cart persistence across browser sessions

### 2. Product Details Integration
- **Add to Cart button**: Test adding products from product detail pages
- **Quantity selection**: Test quantity counter functionality
- **Customization support**: Test adding customizable products
- **Toast notifications**: Test success/error messages

### 3. Cart Page Functionality
- **Empty cart state**: Test display when cart is empty
- **Cart items display**: Test proper rendering of cart items
- **Price calculations**: Test subtotal, delivery charges, and final total
- **Quantity management**: Test inline quantity updates
- **Item removal**: Test removing items from cart page

### 4. Checkout Process
- **Customer form**: Test form validation and input handling
- **Order placement**: Test WhatsApp integration and order submission
- **Form validation**: Test required field validation
- **Error handling**: Test error scenarios

### 5. WhatsApp Integration
- **Message formatting**: Test order message structure
- **Phone number formatting**: Test proper WhatsApp URL generation
- **Order details**: Test inclusion of all necessary order information

## Manual Testing Steps

### Step 1: Test Adding Items to Cart
1. Navigate to product details page
2. Select quantity and customization options (if available)
3. Click "Add to Cart"
4. Verify toast notification appears
5. Check navbar cart count updates

### Step 2: Test Cart Page
1. Navigate to `/cart`
2. Verify items display correctly
3. Test quantity updates
4. Test item removal
5. Verify price calculations are accurate

### Step 3: Test Checkout Process
1. Click "Place Order" on cart page
2. Fill in customer details form
3. Test form validation with invalid data
4. Submit form with valid data
5. Verify WhatsApp integration opens correctly

### Step 4: Test Cart Persistence
1. Add items to cart
2. Refresh browser
3. Verify cart items persist
4. Close and reopen browser
5. Verify cart items still exist

## Expected Behavior

### Cart State
- Items should persist across sessions
- Quantities should update correctly
- Prices should calculate accurately
- Cart count should update in real-time

### WhatsApp Integration
- Should format messages properly
- Should include all order details
- Should open WhatsApp Web with pre-filled message
- Should handle phone number formatting correctly

### Error Handling
- Should validate form inputs
- Should show appropriate error messages
- Should handle network errors gracefully
- Should prevent duplicate submissions

## Configuration Notes

### Business Settings
- Business phone number: +919876543210 (configured in `/src/lib/whatsapp.js`)
- Delivery charges: Free above ₹500, ₹50 below ₹500
- Expected delivery: 5-7 business days

### Technical Details
- State management: Zustand with persistence
- Notifications: React Hot Toast
- Form validation: Built-in HTML5 + custom validation
- Storage: LocalStorage via Zustand persist middleware

## Files Modified/Created

### Core Files
- `/src/stores/useCart.js` - Cart state management
- `/src/lib/whatsapp.js` - WhatsApp integration service
- `/src/app/(withfooter)/cart/page.jsx` - Cart page implementation

### Enhanced Components
- `/src/components/ProductDetails.jsx` - Added cart functionality
- `/src/components/Navbar.jsx` - Added cart count indicator

### API Routes
- `/src/app/api/orders/route.js` - Optional order storage endpoint

## Known Issues & Limitations

1. **WhatsApp Integration**: Uses WhatsApp Web instead of official API
2. **Phone Number**: Currently uses placeholder business number
3. **Order Storage**: Optional database storage not fully implemented
4. **Mobile Responsiveness**: May need additional testing on mobile devices

## Next Steps

1. Test the system thoroughly using the steps above
2. Update business phone number in production
3. Implement proper order management system
4. Add order history for customers
5. Consider implementing WhatsApp Business API for better integration

## Success Criteria

The cart system is considered successfully implemented when:
- ✅ Users can add products to cart without authentication
- ✅ Cart state persists across browser sessions
- ✅ Checkout process collects customer details
- ✅ Orders are sent via WhatsApp with proper formatting
- ✅ All price calculations are accurate
- ✅ Error handling works correctly
- ✅ Mobile responsiveness is maintained
