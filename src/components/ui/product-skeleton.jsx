import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const ProductSkeleton = () => {
  return (
    <Card className="border-none shadow-none h-full">
      <CardContent className="p-4 space-y-3 relative h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full h-[290px] rounded-[10.5px] overflow-hidden">
          {/* Badges Container - skeleton */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="animate-pulse bg-gray-200 h-6 w-20 rounded-[7px]"></div>
            <div className="animate-pulse bg-gray-200 h-5 w-16 rounded-[5px]"></div>
          </div>
          
          {/* Image skeleton with gradient animation */}
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-[10.5px]"></div>
        </div>

        {/* Content Container */}
        <div className="space-y-3 flex-1 flex flex-col">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-1">
            <div className="animate-pulse bg-gray-200 h-3 w-full rounded"></div>
            <div className="animate-pulse bg-gray-200 h-3 w-4/5 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-3 w-2/3 rounded"></div>
          </div>

          {/* Price Container - positioned at bottom */}
          <div className="space-y-2 mt-auto">
            {/* Price skeleton */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="animate-pulse bg-gray-200 h-5 w-16 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-14 rounded"></div>
            </div>
            <div className="animate-pulse bg-gray-200 h-3 w-24 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CarouselSkeletonLoader = ({ count = 4 }) => {
  return (
    <div className="flex gap-6 overflow-hidden py-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 min-w-[250px] max-w-[300px] pl-6 last-of-type:pr-6 first-of-type:pl-10">
          <ProductSkeleton />
        </div>
      ))}
    </div>
  );
};

const ProductDetailSkeleton = () => {
  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative w-full aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg"></div>
          
          {/* Thumbnail Images */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-16 h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-1/2 rounded"></div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
            </div>
            <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="animate-pulse bg-gray-200 h-5 w-20 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-5/6 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-4/5 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
          </div>

          {/* Color Options */}
          <div className="space-y-3">
            <div className="animate-pulse bg-gray-200 h-5 w-20 rounded"></div>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-full"
                ></div>
              ))}
            </div>
          </div>

          {/* Customization */}
          <div className="space-y-3">
            <div className="animate-pulse bg-gray-200 h-5 w-24 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-gray-200 h-5 w-16 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-10 w-24 rounded"></div>
            </div>
            <div className="animate-pulse bg-gray-200 h-12 w-full rounded"></div>
          </div>

          {/* Additional Details */}
          <div className="space-y-3">
            <div className="animate-pulse bg-gray-200 h-5 w-32 rounded"></div>
            <div className="space-y-1">
              <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-4/5 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductListSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

export { ProductSkeleton, CarouselSkeletonLoader, ProductDetailSkeleton, ProductListSkeleton };
