"use client";

import Breadcrumb from "@/components/Breadcrumb";
import QuantityCounter from "@/components/QuantityCounter";
import { SpecialText } from "@/components/typography";
import Wrapper from "@/components/Wrapper";
import { cn } from "@/lib/utils";
import { useModal } from "@/stores/useModal";
import { useCart } from "@/stores/useCart";
import { WhatsAppService, BUSINESS_PHONE } from "@/lib/whatsapp";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

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
      <Wrapper className="pt-32 pb-[100px]">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h1>
          <p className="text-gray-600">Add some beautiful gifts to your cart!</p>
          <a
            href="/gifts"
            className="inline-block bg-primary_color text-white px-8 py-3 rounded-full font-semibold hover:bg-primary_color/90 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="pt-32 pb-[100px]">
      {showCheckout ? <Checkout setShowCheckout={setShowCheckout} /> : <CartDetails setShowCheckout={setShowCheckout} />}
    </Wrapper>
  );
};

function CartDetails({ setShowCheckout }) {
  const { openModal } = useModal();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [address, setAddress] = useState("1234 Main St, Anytown, USA");

  const handlePlaceOrder = () => {
    setShowCheckout(true);
  };

  return (
    <div>
      <Breadcrumb links={links} />
      <div className="grid grid-cols-1 lg:grid-cols-[auto_365px] gap-8">
        <div className="space-y-9">
          <div className="flex justify-between items-center px-6 py-5 shadow-cart-summary">
            <div>
              Deliver to : <span className="font-medium">{address}</span>
            </div>
            <div>
              <button
                onClick={() => openModal("address")}
                className="text-[#8300FF] text-[16px] font-medium"
              >
                Edit
              </button>
            </div>
          </div>
          <div className="px-8 shadow-cart-summary">
            <div className=" py-9">
              <div className="space-y-9">
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
            <div className="px-4 py-8 w-full">
              <button 
                onClick={handlePlaceOrder}
                className="bg-[#FB641B] text-white text-[20px] font-semibold py-5 px-10 rounded-[100vmin] ml-auto block hover:bg-[#e55a1a] transition-colors"
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
  const [count, setCount] = useState(item.quantity);
  const { id, name, description, price, originalPrice, image, customization, offerPercentage } = item;

  const handleQuantityChange = (newCount) => {
    setCount(newCount);
    onUpdateQuantity(id, newCount, customization);
  };

  const handleRemove = () => {
    onRemove(id, customization);
    toast.success(`${name} removed from cart`);
  };

  const discountPercentage = offerPercentage > 0 ? Math.round(offerPercentage) : null;

  return (
    <div className="flex gap-8">
      <div>
        <Image
          className="w-[135px] h-[131px] object-cover rounded-[5px]"
          src={image || "/product-image.png"}
          alt={name}
          width={135}
          height={131}
        />
      </div>
      <div className="flex justify-between flex-1">
        <div>
          <div className="">
            <h3 className="mb-4 text-[26px] font-medium">{name}</h3>
            <p className="mb-6 text-[#828282] text-[16px]">{description}</p>
            {customization && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Customization:</p>
                <p className="text-sm text-blue-600">{JSON.stringify(customization)}</p>
              </div>
            )}
          </div>
          <div className="mb-5 flex gap-[14px] items-end">
            <p className="">
              <SpecialText className="font-inter text-[30px] font-medium text-black tracking-[-0.6px]">
                ₹{parseFloat(price).toFixed(2)}
              </SpecialText>
            </p>
            {originalPrice && originalPrice > price && (
              <>
                <p>
                  <SpecialText className="font-inter text-[20px] font-normal text-[#828282] tracking-[-0.4px] line-through">
                    ₹{parseFloat(originalPrice).toFixed(2)}
                  </SpecialText>
                </p>
                {discountPercentage && (
                  <p>
                    <SpecialText className="font-inter text-[20px] font-normal text-[#009D08] tracking-[-0.4px]">
                      {discountPercentage}% off
                    </SpecialText>
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex gap-4 items-center">
            <QuantityCounter count={count} setCount={handleQuantityChange} />
            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
        <div>
          <p className="text-[#CACACA] text-[16px] font-medium">
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
    <div className="px-5 py-9 shadow-cart-summary">
      <h3 className="text-[16px] text-[#828282] font-medium mb-3.5">
        PRICE SUMMARY
      </h3>
      <hr />
      <div className="space-y-3.5 py-[30px] px-1">
        <div className="flex justify-between items-center">
          <p>Price ({safeTotalItems} items)</p>
          <p>₹{safeTotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Delivery Charges</p>
          <p className={safeTotal > 500 ? "text-green-600" : ""}>
            {safeTotal > 500 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}
          </p>
        </div>
        {safeTotal > 500 && (
          <div className="text-sm text-green-600">
            🎉 You saved ₹50 on delivery!
          </div>
        )}
      </div>
      <hr />
      <div className="flex justify-between items-center mt-5 font-semibold text-lg">
        <p>Total</p>
        <p>₹{finalTotal.toFixed(2)}</p>
      </div>
    </div>
  );
}

function Checkout({ setShowCheckout }) {
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getCartSummary, clearCart } = useCart();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { name, phone, address } = customerDetails;
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
      
      // Format WhatsApp message
      const message = WhatsAppService.formatCartMessage(cartSummary, {
        ...customerDetails,
        orderNumber
      });
      
      // Send to WhatsApp
      WhatsAppService.sendToWhatsApp(BUSINESS_PHONE, message);
      
      // Show success message
      toast.success("Order placed successfully! You'll be redirected to WhatsApp.", {
        duration: 4000
      });
      
      // Optional: Clear cart after successful order
      setTimeout(() => {
        clearCart();
        setShowCheckout(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setShowCheckout(false)}
          className="mr-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back to Cart
        </button>
        <h1 className="text-[36px] font-semibold text-[#8300FF]">
          Customer Details
        </h1>
      </div>
      
      <p className="w-full max-w-[500px] text-[14px] text-[#8300FF] mb-8">
        Please provide your details below. Your order will be sent via WhatsApp for confirmation.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6 mb-10">
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
        
        <div className="flex justify-between items-center max-w-[490px] w-full pt-6">
          <p className="text-[12px] text-[#828282] max-w-[280px]">
            *By clicking continue, your order details will be sent via WhatsApp for confirmation and payment.
          </p>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-[#8300FF] text-white text-[20px] font-semibold py-3 px-8 rounded-[100vmin] hover:bg-[#7300e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
        <h3 className="font-semibold text-green-800 mb-2">📱 What happens next?</h3>
        <ul className="text-sm text-green-700 space-y-1">
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        className={cn(
          "bg-[#D9D9D933] border-[#DBDBDB] border rounded-sm px-[19px] py-[22px] max-w-[490px] w-full focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent transition-all"
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        className={cn(
          "bg-[#D9D9D933] border-[#DBDBDB] border rounded-sm px-[19px] py-[22px] max-w-[490px] w-full focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent transition-all resize-vertical"
        )}
        placeholder={label}
        {...props}
      />
    </div>
  );
}

export default CartPage;
