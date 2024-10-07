"use client";
import React, { Fragment, useState } from "react";
import { SpecialText } from "./typography";
import CartIcon from "./svgs/CartIcon";
import ShareIcon from "./svgs/ShareIcon";

const specifications = [
  {
    name: "Package",
    spec: "1",
  },
  {
    name: "Number of Contents in Package",
    spec: "Pack of 1",
  },
];

const ProductDetails = () => {
  const [count, setCount] = useState(0);
  return (
    <div className="grid grid-cols-[450px_auto] gap-[58px]">
      <div className="h-[575px] rounded-[20px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover"
          src="/product-image.png"
          alt="product image"
        />
      </div>
      <div className="font-poppins space-y-8">
        <div className="space-y-4">
          <h1 className="text-black text-[24px] font-medium leading-[98%]">
            Coffee Mug
          </h1>
          <p>
            <SpecialText className="font-normal text-base text-[#828282]">
              Photo Printed Mug
            </SpecialText>
          </p>
        </div>
        <div className="flex gap-6 items-end">
          <p className="">
            <SpecialText className="font-inter text-[30px] font-medium text-black tracking-[-0.6px]">
              ₹179
            </SpecialText>
          </p>
          <p>
            <SpecialText className="font-inter text-[20px] font-normal text-[#828282] tracking-[-0.4px] line-through">
              ₹500
            </SpecialText>
          </p>
          <p>
            <SpecialText className="font-inter text-[20px] font-normal text-[#009D08] tracking-[-0.4px] line-through">
              64% off
            </SpecialText>
          </p>
        </div>
        <p>
          <SpecialText className="text-[#828282] text-base font-normal">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged.
          </SpecialText>
        </p>
        <div className="flex gap-4">
          <button className="inline-flex justify-center items-center bg-[#FB641B] rounded-[100px] text-white py-1.5 px-6 gap-2">
            <SpecialText className="text-white text-[20px]">
              Shop Now
            </SpecialText>
            <CartIcon />
          </button>
          <button className="rounded-full bg-[#00C63B] w-[38px] h-[38px] flex items-center justify-center">
            <ShareIcon className="-translate-x-[1px]" />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            disabled={count === 0}
            onClick={() => setCount((prev) => prev - 1)}
            className="w-[28px] h-[28px] border border-black disabled:border-[#DBDBDB] rounded-full font-inter text-[14px] font-medium text-black disabled:text-[#DBDBDB]"
          >
            -
          </button>
          <p className="h-[28px] w-[48px] flex items-center justify-center border border-[#DBDBDB]">
            {count}
          </p>
          <button
            onClick={() => setCount((prev) => prev + 1)}
            className="w-[28px] h-[28px] border border-black disabled:border-[#DBDBDB] rounded-full font-inter text-[14px] font-medium text-black disabled:text-[#DBDBDB]"
          >
            +
          </button>
        </div>
        <div className="space-y-6">
          <h2>
            <SpecialText className="text-black text-[20px]">
              Specification
            </SpecialText>
          </h2>
          <div className="grid grid-cols-[144px_auto] gap-x-[43px] gap-y-[19px]">
            {specifications.map((s) => (
              <Fragment key={s.name}>
                <p>
                  <SpecialText className="text-[#828282] text-[14px] font-medium [line-height:98%]">
                    {s.name}
                  </SpecialText>
                </p>
                <p>
                  <SpecialText className="text-black text-[14px] font-medium">
                    {s.spec}
                  </SpecialText>
                </p>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
