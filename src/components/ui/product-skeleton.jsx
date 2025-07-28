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

export { ProductSkeleton, CarouselSkeletonLoader };
