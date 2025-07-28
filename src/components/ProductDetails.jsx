"use client";
import React, { Fragment, useState } from "react";
import { SpecialText } from "./typography";
import ShareIcon from "./svgs/ShareIcon";
import CartIcon from "./svgs/CartIcon";
import QuantityCounter from "./QuantityCounter";
import { optimizeCloudinaryImage } from "@/lib/imageUtils";
import { useCart } from "@/stores/useCart";
import { toast } from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProductDetails = ({ product }) => {
  const [count, setCount] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customization, setCustomization] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
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
    ? optimizeCloudinaryImage(product.images[currentImageIndex].url, { width: 600, height: 600, crop: 'fit' })
    : "/product-image.png";

  const finalPrice = product.offerPrice || 
    (product.offerPercentage > 0 ? 
      Math.round(product.productMRP * (100 - product.offerPercentage) / 100) : 
      product.productMRP);

  // Get customization label
  const getCustomizationLabel = (type) => {
    switch (type) {
      case 'customisable':
        return { label: 'CUSTOMIZABLE', color: 'bg-[#C13FC8]' };
      case 'heavyCustomisable':
        return { label: 'HIGHLY CUSTOMIZABLE', color: 'bg-[#FF6B35]' };
      default:
        return null;
    }
  };

  const customLabel = getCustomizationLabel(product.productType);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Side - Product Images */}
      <div className="space-y-4">
        {/* Main Product Image */}
        <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-gray-50 border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-contain p-4"
            src={currentImage}
            alt={product.productName}
            onError={(e) => {
              e.target.src = "/product-image.png";
            }}
          />
        </div>
        
        {/* Image Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'border-orange-500 shadow-md' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optimizeCloudinaryImage(image.url, { width: 80, height: 80, crop: 'fit' })}
                  alt={`${product.productName} ${index + 1}`}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.target.src = "/product-image.png";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Right Side - Product Details */}
      <div className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <h1 className="text-black text-2xl lg:text-3xl font-bold leading-tight">
            {product.productName}
          </h1>
          {/* Product Tag */}
          <p className="text-gray-600 text-base">
            {product.giftType ? 
              `${product.giftType === 'personalisedGift' ? 'Personalised Gift' : 'Corporate Gift'}` : 
              'Personalised Gift'
            }
          </p>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-black text-2xl lg:text-3xl font-bold">
            ₹{finalPrice}
          </span>
          {product.offerPercentage > 0 && (
            <>
              <span className="text-gray-500 text-lg line-through">
                ₹{product.productMRP}
              </span>
              <span className="text-green-600 text-base font-semibold bg-green-50 px-2 py-1 rounded">
                {Math.round(product.offerPercentage)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Product Description */}
        <div className="text-gray-700 text-base leading-relaxed">
          <p>{product.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 items-center">
          <button 
            onClick={handleAddToCart}
            className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-3 rounded-full text-base font-semibold transition-colors flex items-center gap-2"
          >
            <div className="bg-white rounded-full p-1 flex items-center justify-center">
              <CartIcon color="#FF5722" className="w-5 h-5" />
            </div>
            Shop Now
          </button>
          <button className="bg-[#4CAF50] hover:bg-[#45A049] text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors">
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Badge */}
        {customLabel && (
          <div className="inline-block">
            <span className={`text-white text-xs font-bold px-3 py-2 ${customLabel.color} rounded-full`}>
              {customLabel.label}
            </span>
          </div>
        )}

        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-3 flex-wrap">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedColor === color.hex
                      ? 'border-black scale-110 shadow-md' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ 
                    backgroundColor: color.hex
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Product Details Section */}
        <div className="space-y-6">
          <h3 className="text-black text-xl font-bold">Product Details</h3>
          
          {/* All Details with Show More/Less */}
          <div className="relative">
            <div className={`space-y-6 transition-all duration-300 ${
              showMoreDetails ? 'max-h-none' : 'max-h-32 overflow-hidden'
            }`}>
              {/* Product Description */}
              <div className="text-gray-700 text-sm leading-relaxed">
                <p>
                  {product.productDetails || product.description || 
                   "Adorable panda design: this panda lamp features a charming panda-shaped design, making it an adorable and delightful addition to any space, captivating the hearts of both girls and boys. Touch activation and innovative touch-sensitive controls, allowing for a magical and interactive experience, easily turn the lamp on or off with a simple touch, making it user-friendly for children."}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-black text-lg font-semibold">Specifications</h4>
                  <div className="space-y-3">
                    {product.specifications.map((spec, specIndex) => (
                      <div key={specIndex}>
                        {spec.heading && (
                          <h5 className="text-black font-medium text-sm mb-2">{spec.heading}</h5>
                        )}
                        {spec.details && spec.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex justify-between py-1">
                            <span className="text-gray-600 text-sm">{detail.key}</span>
                            <span className="text-black font-medium text-sm">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-black text-lg font-semibold">Specifications</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600 text-sm">Brand</span>
                      <span className="text-black font-medium text-sm">Arcade toys</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600 text-sm">Material</span>
                      <span className="text-black font-medium text-sm">Silicon</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600 text-sm">Control Type</span>
                      <span className="text-black font-medium text-sm">Touch</span>
                    </div>
                  </div>
                </div>
              )}

              {/* What's Inside Box */}
              {product.whatsInside && product.whatsInside.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-black text-lg font-semibold">Inside Box</h4>
                  <div className="space-y-2">
                    {product.whatsInside.map((item, index) => (
                      <div key={index} className="flex justify-between py-1">
                        <span className="text-gray-600 text-sm">{item}</span>
                        <span className="text-black font-medium text-sm">1</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-black text-lg font-semibold">Inside Box</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600 text-sm">Lamp</span>
                      <span className="text-black font-medium text-sm">1</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Fade Effect */}
            {!showMoreDetails && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-0"></div>
            )}
            
            <button
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="relative z-10 mt-3 text-black hover:text-gray-700 text-sm font-semibold transition-colors flex items-center gap-1 underline hover:bg-gray-50 px-2 py-1 rounded"
            >
              {showMoreDetails ? (
                <>
                  Show less
                  <ChevronUp className="w-4 h-4 text-black" />
                </>
              ) : (
                <>
                  Show more
                  <ChevronDown className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Customization Options */}
        {product.productType !== 'non-customisable' && product.customization && (
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-black text-lg font-semibold">
              Customization Options
            </h3>
            {product.customization.customTextHeading && (
              <p className="text-gray-600 text-sm">
                <strong>Custom Text:</strong> {product.customization.customTextHeading}
              </p>
            )}
            {product.customization.numberOfCustomImages > 0 && (
              <p className="text-gray-600 text-sm">
                <strong>Custom Images:</strong> Upload up to {product.customization.numberOfCustomImages} image{product.customization.numberOfCustomImages > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
