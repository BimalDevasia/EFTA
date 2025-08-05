"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { optimizeCloudinaryImage } from "@/lib/imageUtils";
import { CarouselSkeletonLoader } from "@/components/ui/product-skeleton";

function SimilarProducts({ excludeId = null, category = null, limit = 20 }) {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        
        // If excludeId is provided, use the similar products API for better matching
        if (excludeId) {
          const response = await fetch(`/api/products/similar?productId=${excludeId}&limit=${limit}`);
          if (!response.ok) {
            console.error('Similar products API failed, falling back to regular API');
            // Fallback to regular API if similar products fails
            const fallbackResponse = await fetch(`/api/products?limit=${limit}`);
            if (!fallbackResponse.ok) throw new Error('Failed to fetch products');
            const fallbackData = await fallbackResponse.json();
            
            // Filter out the current product
            const filteredGifts = fallbackData.products.filter(gift => String(gift._id) !== String(excludeId));
            setGifts(filteredGifts);
          } else {
            const data = await response.json();
            setGifts(data.products || []);
          }
        } else {
          // Build query parameters for regular product fetching
          let queryParams = `?limit=${limit}`;
          if (category === 'gift' || category === 'personalisedGift') {
            queryParams += `&giftType=personalisedGift&featured=true`;
          } else if (category === 'corporateGift') {
            queryParams += `&giftType=corporateGift&featured=true`;
          } else if (category) {
            queryParams += `&category=${encodeURIComponent(category)}`;
          }
          
          const response = await fetch(`/api/products${queryParams}`);
          if (!response.ok) throw new Error('Failed to fetch products');
          const data = await response.json();
          
          setGifts(data.products || []);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [excludeId, category, limit]);

  if (loading) {
    return (
      <div className="w-full">
        {/* Mobile Loading - Vertical Stack */}
        <div className="block md:hidden space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="w-full h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        
        {/* Desktop Loading - Carousel */}
        <div className="hidden md:block">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselSkeletonLoader count={4} />
          </Carousel>
        </div>
      </div>
    );
  }

  if (error || !gifts.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        {error ? `Error: ${error}` : 'No similar products available at the moment'}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Layout - Vertical Stack */}
      <div className="block md:hidden space-y-4 px-2">
        {gifts.map((gift) => {
          const actualPrice = gift.offerPrice || 
            (gift.offerPercentage > 0 ? 
              Math.round(gift.productMRP * (100 - gift.offerPercentage) / 100) : 
              gift.productMRP);
          
          return (
            <SimilarProductCardMobile
              key={gift._id}
              id={gift._id}
              name={gift.productName}
              desc={gift.description}
              price={actualPrice}
              originalPrice={gift.offerPercentage > 0 ? gift.productMRP : null}
              offerPercentage={gift.offerPercentage}
              productType={gift.productType}
              image={gift.images && gift.images.length > 0 ? 
                optimizeCloudinaryImage(gift.images[0].url, { width: 150, height: 150, crop: 'fill' }) : 
                null}
              imageAlt={gift.images && gift.images.length > 0 ? gift.images[0].alt || gift.productName : gift.productName}
            />
          );
        })}
      </div>

      {/* Desktop Layout - Carousel */}
      <div className="hidden md:block">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="py-6">
            {gifts.map((gift) => {
              const actualPrice = gift.offerPrice || 
                (gift.offerPercentage > 0 ? 
                  Math.round(gift.productMRP * (100 - gift.offerPercentage) / 100) : 
                  gift.productMRP);
              
              return (
                <CarouselItem
                  key={gift._id}
                  className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-6 last-of-type:pr-6 first-of-type:pl-10"
                >
                  <SimilarProductCard
                    id={gift._id}
                    name={gift.productName}
                    desc={gift.description}
                    price={actualPrice}
                    originalPrice={gift.offerPercentage > 0 ? gift.productMRP : null}
                    offerPercentage={gift.offerPercentage}
                    productType={gift.productType}
                    image={gift.images && gift.images.length > 0 ? 
                      optimizeCloudinaryImage(gift.images[0].url, { width: 400, height: 360, crop: 'fill' }) : 
                      null}
                    imageAlt={gift.images && gift.images.length > 0 ? gift.images[0].alt || gift.productName : gift.productName}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="lg:left-0 left-5 -translate-x-1/2" disappear />
          <CarouselNext className="lg:right-0 right-5 translate-x-1/2" disappear />
        </Carousel>
      </div>
    </div>
  );
}

// Mobile Card Component - Horizontal Layout
const SimilarProductCardMobile = ({
  id,
  name,
  desc,
  price,
  originalPrice,
  offerPercentage,
  productType,
  image,
  imageAlt,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const customLabel = getCustomizationLabel(productType);

  return (
    <Link
      href={`/product/${id}-${createSlug(name)}`}
      className="block w-full"
    >
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Image Container - Fixed width on mobile */}
            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              {/* Badges */}
              <div className="absolute top-1 left-1 z-10 flex flex-col gap-1">
                {customLabel && (
                  <span className={`text-white text-[8px] font-extrabold font-poppins px-1.5 py-0.5 ${customLabel.color} rounded-sm`}>
                    {customLabel.label}
                  </span>
                )}
                {offerPercentage > 0 && (
                  <span className="text-white text-[8px] font-extrabold font-poppins px-1 py-0.5 bg-red-500 rounded-sm">
                    {offerPercentage}% OFF
                  </span>
                )}
              </div>
              
              {imageLoading && !imageError && (
                <div className="absolute inset-0 bg-gray-100">
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
                </div>
              )}
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image || "/carousal-image.png"}
                alt={imageAlt || name}
                className="w-full h-full object-cover"
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

            {/* Content Container */}
            <div className="flex-1 min-w-0 font-poppins">
              {/* Product Title */}
              <h3 className="text-sm font-semibold leading-tight line-clamp-2 mb-1">
                {name}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {truncateText(desc, 80)}
              </p>

              {/* Price Container */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-gray-800">
                    ₹{price}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{originalPrice}
                    </span>
                  )}
                  {offerPercentage > 0 && (
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">
                      {offerPercentage}% OFF
                    </span>
                  )}
                </div>
                {originalPrice && originalPrice > price && (
                  <div className="text-xs text-green-600 font-medium">
                    Save ₹{originalPrice - price}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Desktop Card Component - Same as NormalCardCarousal
const SimilarProductCard = ({
  id,
  name,
  desc,
  price,
  originalPrice,
  offerPercentage,
  productType,
  image,
  imageAlt,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const customLabel = getCustomizationLabel(productType);

  return (
    <Link
      href={`/product/${id}-${createSlug(name)}`}
      className="block shadow-carousal-card rounded-[20px] border-none h-full hover:shadow-lg transition-shadow duration-300"
    >
      <Card className="border-none shadow-none h-full">
        <CardContent className="p-4 space-y-3 relative h-full flex flex-col">
          {/* Image Container */}
          <div className="relative w-full h-[290px] rounded-[10.5px] overflow-hidden">
            {/* Badges Container */}
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-500 font-medium">Loading...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image || "/carousal-image.png"}
              alt={imageAlt || name}
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

          {/* Content Container */}
          <div className="font-poppins space-y-2 flex-grow flex flex-col">
            {/* Product Title */}
            <h3 className="text-[18px] font-semibold tracking-[1px] leading-[1.2] line-clamp-2">
              {name}
            </h3>

            {/* Description */}
            <p className="text-[13px] tracking-[0.5px] leading-[1.3] text-[#5A5A5A] line-clamp-2 flex-grow">
              {truncateText(desc, 60)}
            </p>

            {/* Price Container */}
            <div className="space-y-2 mt-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[16px] font-bold text-[#2D3748] tracking-[0.5px]">
                  ₹{price}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-[13px] text-[#9CA3AF] line-through tracking-[0.5px]">
                    ₹{originalPrice}
                  </span>
                )}
                {offerPercentage > 0 && (
                  <span className="text-[11px] text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md">
                    {offerPercentage}% OFF
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
};

export default SimilarProducts;
