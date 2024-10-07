"use client";

import Breadcrumb from "@/components/Breadcrumb";
import QuantityCounter from "@/components/QuantityCounter";
import { SpecialText } from "@/components/typography";
import Wrapper from "@/components/Wrapper";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

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
const cartItems = [
  {
    image: "/product-image.png",
    name: "Coffee Mug",
    description: "Photo Printed Mug",
    price: 179,
    originalPrice: 500,
    discount: 64,
  },
  {
    image: "/product-image.png",
    name: "Coffee Mug",
    description: "Photo Printed Mug",
    price: 179,
    originalPrice: 500,
    discount: 64,
  },
  {
    image: "/product-image.png",
    name: "Coffee Mug",
    description: "Photo Printed Mug",
    price: 179,
    originalPrice: 500,
    discount: 64,
  },
];

const CartPage = () => {
  const [showCheckout, setShowCheckout] = useState(true);
  return (
    <Wrapper className="pt-32 pb-[100px]">
      {showCheckout ? <Checkout /> : <CartDetails />}
    </Wrapper>
  );
};

function CartDetails() {
  const address = "1234 Main St, Anytown, USA";
  return (
    <div>
      <Breadcrumb links={links} />
      <div className="grid grid-cols-[auto_365px] gap-8">
        <div className="space-y-9">
          <div className="flex justify-between items-center px-6 py-5 shadow-cart-summary">
            <div>
              Deliver to : <span className="font-medium">{address}</span>
            </div>
            <div>
              <button className="text-[#8300FF] text-[16px] font-medium">
                Edit
              </button>
            </div>
          </div>
          <div className="px-8 shadow-cart-summary">
            <div className=" py-9">
              <div className="space-y-9">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
            <hr />
            <div className="px-4 py-8 w-full">
              <button className="bg-[#FB641B] text-white text-[20px] font-semibold py-5 px-10 rounded-[100vmin] ml-auto block">
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

function CartItem({ item }) {
  const [count, setCount] = useState(1);
  const { image, name, description, price, originalPrice, discount } = item;
  return (
    <div className="flex gap-8">
      <div>
        <img
          className="w-[135px] h-[131px] object-cover rounded-[5px]"
          src={image}
          alt={name}
        />
      </div>
      <div className="flex justify-between flex-1">
        <div>
          <div className="">
            <h3 className="mb-4 text-[26px] font-medium">{name}</h3>
            <p className="mb-6 text-[#828282] text-[16px]">{description}</p>
          </div>
          <div className="mb-5 flex gap-[14px] items-end">
            <p className="">
              <SpecialText className="font-inter text-[30px] font-medium text-black tracking-[-0.6px]">
                ₹{price}
              </SpecialText>
            </p>
            <p>
              <SpecialText className="font-inter text-[20px] font-normal text-[#828282] tracking-[-0.4px] line-through">
                ₹{originalPrice}
              </SpecialText>
            </p>
            <p>
              <SpecialText className="font-inter text-[20px] font-normal text-[#009D08] tracking-[-0.4px] line-through">
                {discount}% off
              </SpecialText>
            </p>
          </div>
          <QuantityCounter count={count} setCount={setCount} />
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
  return (
    <div className="px-5 py-9 shadow-cart-summary">
      <h3 className="text-[16px] text-[#828282] font-medium mb-3.5">
        PRICE SUMMARY
      </h3>
      <hr />
      <div className="space-y-3.5 py-[30px] px-1">
        <div classN26pxame="flex justify-between items-center">
          <p>Price (3 items)</p>
          <p>₹1,500</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Discount</p>
          <p>₹100</p>
        </div>
        <div className="flex justify-between items-center">
          <p>Delivery Charges</p>
          <p>₹100</p>
        </div>
      </div>
      <hr />
      <div className="flex justify-between items-center mt-5">
        <p>Total</p>
        <p>₹1,700</p>
      </div>
    </div>
  );
}

function Checkout() {
  return (
    <div>
      <h1 className="text-[36px] font-semibold text-[#8300FF] mb-10">
        Customer Details
      </h1>
      <p className="w-full max-w-[275px] text-[10px] text-[#8300FF] mb-5">
        Please provide your name, email, and phone number to proceed to secure
        payment.
      </p>
      <form className="space-y-5 mb-10">
        <Input label="Name" />
        <Input label="Email" />
        <Input label="Phone Number" />
      </form>
      <div className="flex justify-between max-w-[490px] w-full">
        <p className="text-[10px] text-[#828282] max-w-[225px]">
          *By clicking continue you will be redirected to the payment gateway.
        </p>
        <button className="bg-[#8300FF] text-white text-[20px] font-semibold py-2.5 px-8 rounded-[100vmin]">
          Continue
        </button>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="hidden">{label}</label>
      <input
        className={cn(
          "bg-[#D9D9D933] border-[#DBDBDB] border rounded-sm px-[19px] py-[22px] max-w-[490px] w-full"
        )}
        placeholder={label ?? props.placeholder ?? undefined}
        {...props}
      />
    </div>
  );
}

export default CartPage;
