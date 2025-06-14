"use client";
import React, { Fragment, useState } from "react";
import { SpecialText } from "./typography";
import ShareIcon from "./svgs/ShareIcon";
import QuantityCounter from "./QuantityCounter";
import { optimizeCloudinaryImage } from "@/lib/imageUtils";
import { useCart } from "@/stores/useCart";
import { toast } from "react-hot-toast";

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

const ProductDetails = ({ product }) => {
  const [count, setCount] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customization, setCustomization] = useState(null);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (count < 1) {
      toast.error("Please select at least 1 item");
      return;
    }

    addItem(product, count, customization);
    toast.success(`${product.productName} added to cart!`);
    setCount(1); // Reset quantity after adding
  };

  // If no product data is provided, show loading or placeholder
  if (!product) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[450px_auto] gap-[58px]">
        <div className="h-[400px] lg:h-[575px] rounded-[20px] overflow-hidden bg-gray-200 animate-pulse">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        </div>
        <div className="font-poppins space-y-6">
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = product.images && product.images.length > 0 
    ? optimizeCloudinaryImage(product.images[currentImageIndex].url, { width: 450, height: 575, crop: 'fill' })
    : "/product-image.png";

  const discountPercentage = product.offerPercentage > 0 
    ? `${Math.round(product.offerPercentage)}% off` 
    : null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[450px_auto] gap-[58px]">
      <div className="space-y-4">
        {/* Main Product Image */}
        <div className="h-[400px] lg:h-[575px] rounded-[20px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover"
            src={currentImage}
            alt={product.productName}
            onError={(e) => {
              e.target.src = "/product-image.png";
            }}
          />
        </div>
        
        {/* Image Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optimizeCloudinaryImage(image.url, { width: 64, height: 64, crop: 'fill' })}
                  alt={`${product.productName} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/product-image.png";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="font-poppins space-y-6">
        <div className="space-y-3">
          <h1 className="text-black text-xl font-medium leading-tight">
            {product.productName}
          </h1>
          <p>
            <SpecialText className="font-normal text-sm text-[#828282]">
              {product.description}
            </SpecialText>
          </p>
          {product.productType !== 'non-customisable' && (
            <div className="inline-block">
              <span className="text-white text-xs font-bold px-2 py-1 bg-[#C13FC8] rounded-md">
                CUSTOMIZABLE
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-4 items-end">
          <p className="">
            <SpecialText className="font-inter text-2xl font-medium text-black tracking-[-0.6px]">
              ₹{product.offerPrice?.toFixed(2) || product.productMRP}
            </SpecialText>
          </p>
          {product.offerPercentage > 0 && (
            <>
              <p>
                <SpecialText className="font-inter text-lg font-normal text-[#828282] tracking-[-0.4px] line-through">
                  ₹{product.productMRP}
                </SpecialText>
              </p>
              <p>
                <SpecialText className="font-inter text-lg font-normal text-[#009D08] tracking-[-0.4px]">
                  {discountPercentage}
                </SpecialText>
              </p>
            </>
          )}
        </div>
        <p>
          <SpecialText className="text-[#828282] text-sm font-normal leading-relaxed">
            {product.productDetails}
          </SpecialText>
        </p>
        <div className="flex gap-3">
          <button 
            onClick={handleAddToCart}
            className="inline-flex justify-center items-center bg-[#FB641B] rounded-full text-white py-2 px-5 gap-2 hover:bg-[#e55a1a] transition-colors"
          >
            <SpecialText className="text-white text-base">
              Add to Cart
            </SpecialText>
          </button>
          <button className="rounded-full bg-[#00C63B] w-10 h-10 flex items-center justify-center hover:bg-[#00b336] transition-colors">
            <ShareIcon className="-translate-x-[1px]" />
          </button>
        </div>
        <QuantityCounter count={count} setCount={setCount} />
        <div className="space-y-4">
          <h2>
            <SpecialText className="text-black text-lg">
              Specification
            </SpecialText>
          </h2>
          <div className="grid grid-cols-[auto_auto] gap-x-6 gap-y-3">
            <p>
              <SpecialText className="text-[#828282] text-sm font-medium">
                Category
              </SpecialText>
            </p>
            <p>
              <SpecialText className="text-black text-sm font-medium">
                {product.productCategory}
              </SpecialText>
            </p>
            <p>
              <SpecialText className="text-[#828282] text-sm font-medium">
                Type
              </SpecialText>
            </p>
            <p>
              <SpecialText className="text-black text-sm font-medium">
                {product.productType === 'non-customisable' ? 'Ready to Ship' : 
                 product.productType === 'customisable' ? 'Customizable' : 'Heavy Customizable'}
              </SpecialText>
            </p>
            {specifications.map((s) => (
              <Fragment key={s.name}>
                <p>
                  <SpecialText className="text-[#828282] text-sm font-medium">
                    {s.name}
                  </SpecialText>
                </p>
                <p>
                  <SpecialText className="text-black text-sm font-medium">
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
