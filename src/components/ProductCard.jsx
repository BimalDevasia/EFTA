import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";

const ProductCard = ({ 
  id,
  image = "https://placehold.co/299x289", 
  title = "Coffee Mug", 
  subtitle = "Photo Printed Mug", 
  price = "249", 
  originalPrice = "349",
  offerPercentage = 0,
  productType = "customisable"
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Helper function to get customization label
  const getCustomizationLabel = (type) => {
    switch (type) {
      case 'customisable':
        return { label: 'CUSTOM', color: 'bg-[#C13FC8]' };
      case 'heavyCustomisable':
        return { label: 'FULLY CUSTOM', color: 'bg-[#FF6B35]' };
      default:
        return null;
    }
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Helper function to create URL-friendly slug
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  const customLabel = getCustomizationLabel(productType);

  // If id is provided, wrap with Link, otherwise return plain card
  if (id) {
    return (
      <Link
        href={`/product/${id}-${createSlug(title)}`}
        className="block shadow-carousal-card rounded-[20px] border-none h-full hover:shadow-lg transition-shadow duration-300"
      >
        <Card className="border-none shadow-none h-full">
          <CardContent className="p-4 space-y-3 relative h-full flex flex-col">
            {/* Image Container */}
            <div className="relative w-full h-[290px] rounded-[10.5px] overflow-hidden">
              {/* Badges Container - positioned relative to image */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {customLabel && (
                  <span className={`text-white text-[10px] font-extrabold tracking-[0.5px] font-poppins px-3 py-[6px] ${customLabel.color} w-fit rounded-[7px]`}>
                    {customLabel.label}
                  </span>
                )}
                {offerPercentage > 0 && (
                  <span className="text-white text-[10px] font-extrabold tracking-[0.5px] font-poppins px-2 py-1 bg-red-500 w-fit rounded-[5px]">
                    {offerPercentage}% OFF
                  </span>
                )}
              </div>
              
              {imageLoading && !imageError && (
                <div className="absolute inset-0 bg-gray-100 rounded-[10.5px]">
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-[10.5px]"></div>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image || "/carousal-image.png"}
                alt={title}
                className="w-full h-[290px] object-cover object-center rounded-[10.5px] !m-0 hover:scale-105 transition-transform duration-300"
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  setImageLoading(false);
                  setImageError(true);
                  if (image && image.includes('cloudinary.com') && image.includes('/w_')) {
                    const originalUrl = image.replace(/\/w_\d+,h_\d+,c_\w+,q_\w+,f_\w+/, '');
                    e.target.src = originalUrl;
                  } else {
                    e.target.src = "/carousal-image.png";
                  }
                }}
                style={{ display: imageLoading ? 'none' : 'block' }}
              />
            </div>

            {/* Content Container - Flex grow to fill remaining space */}
            <div className="font-poppins space-y-2 flex-grow flex flex-col">
              {/* Product Title */}
              <h3 className="text-[18px] font-semibold tracking-[1px] leading-[1.2] line-clamp-2">
                {title}
              </h3>

              {/* Description */}
              <p className="text-[13px] tracking-[0.5px] leading-[1.3] text-[#5A5A5A] line-clamp-2 flex-grow">
                {truncateText(subtitle, 60)}
              </p>

              {/* Price Container */}
              <div className="space-y-2 mt-auto">
                {/* Price */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[16px] font-bold text-[#2D3748] tracking-[0.5px]">
                    ₹{price}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-[13px] text-[#9CA3AF] line-through tracking-[0.5px]">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
                {originalPrice && originalPrice > price && (
                  <div className="text-[10px] text-green-600 font-medium">
                    You save ₹{originalPrice - price}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Fallback for cards without ID
  return (
    <Card className="border-none shadow-none h-full">
      <CardContent className="p-4 space-y-3 relative h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full h-[290px] rounded-[10.5px] overflow-hidden">
          {/* Badges Container - positioned relative to image */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {customLabel && (
              <span className={`text-white text-[10px] font-extrabold tracking-[0.5px] font-poppins px-3 py-[6px] ${customLabel.color} w-fit rounded-[7px]`}>
                {customLabel.label}
              </span>
            )}
          </div>
          
          <img
            src={image || "/carousal-image.png"}
            alt={title}
            className="w-full h-[290px] object-cover object-center rounded-[10.5px] !m-0 hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content Container - Flex grow to fill remaining space */}
        <div className="font-poppins space-y-2 flex-grow flex flex-col">
          {/* Product Title */}
          <h3 className="text-[18px] font-semibold tracking-[1px] leading-[1.2] line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-[13px] tracking-[0.5px] leading-[1.3] text-[#5A5A5A] line-clamp-2 flex-grow">
            {truncateText(subtitle, 60)}
          </p>

          {/* Price Container */}
          <div className="space-y-2 mt-auto">
            {/* Price */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[16px] font-bold text-[#2D3748] tracking-[0.5px]">
                ₹{price}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[13px] text-[#9CA3AF] line-through tracking-[0.5px]">
                  ₹{originalPrice}
                </span>
              )}
            </div>
            {originalPrice && originalPrice > price && (
              <div className="text-[10px] text-green-600 font-medium">
                You save ₹{originalPrice - price}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
