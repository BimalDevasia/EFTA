"use client";

import Breadcrumb from "@/components/Breadcrumb";
import QuantityCounter from "@/components/QuantityCounter";
import { SpecialText } from "@/components/typography";
import Wrapper from "@/components/Wrapper";
import { cn } from "@/lib/utils";
import { useCart } from "@/stores/useCart";
import { WhatsAppService, BUSINESS_PHONE } from "@/lib/whatsapp";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Link from "next/link";

const links = [
  {
    name: "Gifts",
    href: "/gifts",
  },
  {
    name: "Cart",
    href: "/cart",
  },
];
const CartPage = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const { items, totalItems } = useCart();

  if (totalItems === 0 && !showCheckout) {
    return (
      <Wrapper className="pt-32 pb-[100px] px-8 lg:px-8">
        <div className="text-center space-y-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Your Cart is Empty</h1>
          <p className="text-gray-600">Add some beautiful gifts to your cart!</p>
          <a
            href="/gifts"
            className="inline-block bg-primary_color text-white px-6 lg:px-8 py-3 rounded-full font-semibold hover:bg-primary_color/90 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="pt-32 pb-[100px] px-8 lg:px-8">
      {showCheckout ? <Checkout setShowCheckout={setShowCheckout} /> : <CartDetails setShowCheckout={setShowCheckout} />}
    </Wrapper>
  );
};

function CartDetails({ setShowCheckout }) {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  const handlePlaceOrder = () => {
    setShowCheckout(true);
  };

  return (
    <div>
      <Breadcrumb links={links} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_365px] gap-6 lg:gap-8">
        <div className="space-y-6 lg:space-y-9">
          <div className="px-4 lg:px-8 shadow-cart-summary">
            <div className="py-6 lg:py-9">
              <div className="space-y-6 lg:space-y-9">
                {items.map((item, index) => (
                  <CartItem 
                    key={`${item.id}-${index}`} 
                    item={item} 
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>
            <hr />
            <div className="px-4 py-6 lg:py-8 w-full">
              <button 
                onClick={handlePlaceOrder}
                className="bg-[#FB641B] text-white text-[16px] lg:text-[18px] font-semibold py-3 lg:py-4 px-6 lg:px-8 rounded-[100vmin] ml-auto block hover:bg-[#e55a1a] transition-colors w-full lg:w-auto"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, onUpdateQuantity, onRemove }) {
  // Ensure count is always a valid number between 1-100
  const [count, setCount] = useState(() => {
    const initialQuantity = parseInt(item.quantity) || 1;
    return Math.max(1, Math.min(100, initialQuantity));
  });
  const { id, name, description, price, originalPrice, image, customization, offerPercentage } = item;

  // Sync local count with item quantity when it changes
  React.useEffect(() => {
    const newQuantity = parseInt(item.quantity) || 1;
    const validQuantity = Math.max(1, Math.min(100, newQuantity));
    setCount(validQuantity);
  }, [item.quantity]);

  const handleQuantityChange = (newCount) => {
    // Ensure newCount is a valid number and within range
    const parsedCount = parseInt(newCount) || 1;
    const validCount = Math.max(1, Math.min(100, parsedCount));
    setCount(validCount);
    onUpdateQuantity(id, validCount, customization);
  };

  const handleRemove = () => {
    onRemove(id, customization);
    toast.success(`${name} removed from cart`);
  };

  const discountPercentage = offerPercentage > 0 ? Math.round(offerPercentage) : null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 lg:gap-8">
      <Link href={`/gifts/${id}`} className="flex-shrink-0">
        <Image
          className="w-full sm:w-[135px] h-[200px] sm:h-[131px] object-cover rounded-[5px] cursor-pointer hover:opacity-80 transition-opacity"
          src={image || "/product-image.png"}
          alt={name}
          width={135}
          height={131}
        />
      </Link>
      <div className="flex flex-col sm:flex-row sm:justify-between flex-1 gap-4">
        <div className="flex-1">
          <div className="">
            <Link href={`/gifts/${id}`}>
              <h3 className="mb-3 text-[16px] lg:text-[18px] font-semibold cursor-pointer hover:text-blue-600 transition-colors line-clamp-2">{name}</h3>
            </Link>
            {customization && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Customization:</p>
                <p className="text-sm text-blue-600 break-words">{JSON.stringify(customization)}</p>
              </div>
            )}
          </div>
          <div className="mb-4 flex gap-2 lg:gap-3 items-center flex-wrap">
            <p className="">
              <SpecialText className="font-inter text-[18px] lg:text-[20px] font-semibold text-black tracking-[-0.4px]">
                ₹{parseFloat(price).toFixed(0)}
              </SpecialText>
            </p>
            {originalPrice && originalPrice > price && (
              <>
                <p>
                  <SpecialText className="font-inter text-[14px] lg:text-[16px] font-normal text-[#828282] tracking-[-0.3px] line-through">
                    ₹{parseFloat(originalPrice).toFixed(0)}
                  </SpecialText>
                </p>
                {discountPercentage && (
                  <p>
                    <SpecialText className="font-inter text-[12px] lg:text-[14px] font-medium text-[#009D08] tracking-[-0.2px]">
                      {discountPercentage}% off
                    </SpecialText>
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <QuantityCounter count={count} setCount={handleQuantityChange} />
            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 font-medium text-[14px] transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
        <div>
          <p className="text-[#CACACA] text-[14px] font-medium">
            Delivery in 5-7 days
          </p>
        </div>
      </div>
    </div>
  );
}

function CartSummary() {
  const { items, totalItems, totalPrice } = useCart();
  
  // Safe calculations with fallbacks
  const safeTotal = totalPrice || 0;
  const safeTotalItems = totalItems || 0;
  const deliveryCharge = safeTotal > 500 ? 0 : 50;
  const finalTotal = safeTotal + deliveryCharge;

  return (
    <div className="px-4 lg:px-5 py-6 lg:py-9 shadow-cart-summary">
      <h3 className="text-[12px] lg:text-[14px] text-[#828282] font-semibold mb-3.5 uppercase tracking-wider">
        PRICE SUMMARY
      </h3>
      <hr />
      <div className="space-y-3.5 py-6 lg:py-[30px] px-1">
        <div className="flex justify-between items-center">
          <p className="text-[14px] lg:text-[15px] text-gray-700">Price ({safeTotalItems} items)</p>
          <p className="text-[14px] lg:text-[15px] font-medium">₹{safeTotal.toFixed(0)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[14px] lg:text-[15px] text-gray-700">Delivery Charges</p>
          <p className={`text-[14px] lg:text-[15px] font-medium ${safeTotal > 500 ? "text-green-600" : ""}`}>
            {safeTotal > 500 ? "FREE" : `₹${deliveryCharge.toFixed(0)}`}
          </p>
        </div>
        {safeTotal > 500 && (
          <div className="text-[12px] lg:text-[13px] text-green-600 font-medium">
            🎉 You saved ₹50 on delivery!
          </div>
        )}
      </div>
      <hr />
      <div className="flex justify-between items-center mt-4 lg:mt-5 font-semibold text-[16px] lg:text-[18px]">
        <p>Total Amount</p>
        <p>₹{finalTotal.toFixed(0)}</p>
      </div>
    </div>
  );
}

function Checkout({ setShowCheckout }) {
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getCartSummary, clearCart } = useCart();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for pincode to allow only numbers
    if (name === 'pincode') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setCustomerDetails(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setCustomerDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const { name, phone, address, pincode } = customerDetails;
    if (!name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return false;
    }
    if (!pincode.trim() || !/^\d{6}$/.test(pincode.trim())) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Get cart summary
      const cartSummary = getCartSummary();
      
      // Generate order number
      const orderNumber = `#ORD${Date.now()}`;
      
      // Save order to database first
      try {
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerDetails,
            cartSummary,
            orderNumber
          })
        });

        const orderData = await orderResponse.json();
        
        if (!orderData.success) {
          throw new Error(orderData.error || 'Failed to save order');
        }
        
        console.log('Order saved successfully:', orderData.orderNumber);
        toast.success("Order saved successfully!");
        
      } catch (orderError) {
        console.error('Error saving order:', orderError);
        toast.error("Failed to save order to database. Please try again.");
        return; // Don't proceed to WhatsApp if order save failed
      }
      
      // Format WhatsApp message
      const message = WhatsAppService.formatCartMessage(cartSummary, {
        ...customerDetails,
        orderNumber
      });
      
      // Generate WhatsApp link that opens in app
      const whatsappLink = WhatsAppService.generateWhatsAppLink(BUSINESS_PHONE, message);
      
      // Open WhatsApp directly - this will open in app if available, web otherwise
      window.open(whatsappLink, '_blank');
      
      // Show success message
      toast.success("Redirecting to WhatsApp...", {
        duration: 3000
      });
      
      // Clear cart after successful order
      setTimeout(() => {
        clearCart();
        setShowCheckout(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to generate WhatsApp link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6 lg:mb-8">
        <button
          onClick={() => setShowCheckout(false)}
          className="mr-3 lg:mr-4 text-gray-600 hover:text-gray-800 transition-colors text-[12px] lg:text-[14px]"
        >
          ← Back to Cart
        </button>
        <h1 className="text-[24px] lg:text-[28px] font-semibold text-[#8300FF]">
          Customer Details
        </h1>
      </div>
      
      <p className="w-full max-w-[500px] text-[12px] lg:text-[14px] text-[#666] mb-6 lg:mb-8 leading-relaxed">
        Please provide your details below. Your order will be sent via WhatsApp for confirmation.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6 mb-8 lg:mb-10">
        <Input 
          label="Full Name *" 
          name="name"
          value={customerDetails.name}
          onChange={handleInputChange}
          required
        />
        <Input 
          label="Email (Optional)" 
          name="email"
          type="email"
          value={customerDetails.email}
          onChange={handleInputChange}
        />
        <Input 
          label="Phone Number *" 
          name="phone"
          type="tel"
          value={customerDetails.phone}
          onChange={handleInputChange}
          required
        />
        <TextArea
          label="Delivery Address *"
          name="address"
          value={customerDetails.address}
          onChange={handleInputChange}
          required
          rows={3}
        />
        <Input 
          label="Pincode *" 
          name="pincode"
          type="text"
          value={customerDetails.pincode}
          onChange={handleInputChange}
          required
          maxLength={6}
          inputMode="numeric"
          placeholder="Enter 6-digit pincode"
        />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center max-w-[490px] w-full pt-4 lg:pt-6 gap-4 lg:gap-0">
          <p className="text-[10px] lg:text-[12px] text-[#828282] max-w-[280px] leading-relaxed">
            *By clicking continue, your order details will be sent via WhatsApp for confirmation and payment.
          </p>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-[#8300FF] text-white text-[14px] lg:text-[16px] font-semibold py-2.5 lg:py-3 px-5 lg:px-6 rounded-[100vmin] hover:bg-[#7300e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto"
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 lg:p-4 mt-6 lg:mt-8">
        <h3 className="font-semibold text-green-800 mb-2 text-[14px] lg:text-[16px]">📱 What happens next?</h3>
        <ul className="text-[12px] lg:text-sm text-green-700 space-y-1">
          <li>• Your order will be sent via WhatsApp</li>
          <li>• Our team will confirm your order details</li>
          <li>• Payment options will be shared</li>
          <li>• Expected delivery: 5-7 business days</li>
        </ul>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-[12px] lg:text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        className={cn(
          "bg-[#D9D9D933] border-[#DBDBDB] border rounded-sm px-[15px] lg:px-[19px] py-[18px] lg:py-[22px] max-w-[490px] w-full focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent transition-all text-[14px] lg:text-[16px]"
        )}
        placeholder={label}
        {...props}
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="block text-[12px] lg:text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        className={cn(
          "bg-[#D9D9D933] border-[#DBDBDB] border rounded-sm px-[15px] lg:px-[19px] py-[18px] lg:py-[22px] max-w-[490px] w-full focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent transition-all resize-vertical text-[14px] lg:text-[16px]"
        )}
        placeholder={label}
        {...props}
      />
    </div>
  );
}

export default CartPage;
