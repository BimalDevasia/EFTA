import React from 'react';
import { cn } from "@/lib/utils";

const EventCardSkeleton = ({ index = 0 }) => {
  const alignment = index % 2 === 0 ? "second" : "first";
  
  return (
    <div className={cn(
      "max-w-full max-h-screen flex md:flex-row flex-col justify-center",
      alignment === "first" ? "md:flex-row-reverse" : "md:flex-row"
    )}>
      {/* Text Section */}
      <div className={cn(
        "md:w-2/3 w-full flex md:px-6 relative z-10",
        alignment === "first" ? "justify-end" : ""
      )}>
        <div className="md:w-[75%] md:h-screen w-full flex flex-col justify-center bg-white relative z-10">
          {/* Title Skeleton */}
          <div className="w-full flex justify-center mb-4">
            <div 
              className="bg-gray-200 rounded-lg animate-pulse"
              style={{
                height: 'clamp(40px, 40px + (63 - 40) * ((100vw - 768px) / (1024 - 768)), 63px)',
                width: 'clamp(200px, 50%, 400px)'
              }}
            />
          </div>
          
          {/* Description Skeleton */}
          <div className="px-8 space-y-3">
            {Array.from({ length: 6 }).map((_, lineIndex) => (
              <div 
                key={lineIndex}
                className="bg-gray-200 rounded animate-pulse"
                style={{
                  height: 'clamp(12px, 12px + (20 - 12) * ((100vw - 768px) / (1024 - 768)), 20px)',
                  width: lineIndex === 5 ? '70%' : '100%'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="relative md:w-1/3 md:h-screen h-[400px] w-full z-20 md:flex md:items-center flex justify-center">
        <div className="relative md:w-full w-[400px] md:h-full">
          {/* Image 1 Skeleton */}
          <div 
            className={cn(
              "absolute rounded-3xl bg-gray-200 animate-pulse",
              "bottom-24 z-30",
              alignment === "first" ? "md:left-2 left-4" : "md:right-2 right-4"
            )}
            style={{
              width: 'clamp(255.87px, 255.87px + (400 - 255.87) * ((100vw - 768px) / (1024 - 768)), 400px)',
              height: 'clamp(175.6px, 175.6px + (275 - 175.6) * ((100vw - 768px) / (1024 - 768)), 275px)'
            }}
          />
          
          {/* Image 2 Skeleton */}
          <div 
            className={cn(
              "absolute rounded-3xl bg-gray-300 animate-pulse",
              "bottom-32 z-40",
              alignment === "first" ? "md:left-8 left-10" : "md:right-8 right-10"
            )}
            style={{
              width: 'clamp(255.87px, 255.87px + (400 - 255.87) * ((100vw - 768px) / (1024 - 768)), 400px)',
              height: 'clamp(175.6px, 175.6px + (275 - 175.6) * ((100vw - 768px) / (1024 - 768)), 275px)'
            }}
          />
          
          {/* Image 3 Skeleton */}
          <div 
            className={cn(
              "absolute rounded-3xl bg-gray-400 animate-pulse",
              "bottom-40 z-50",
              alignment === "first" ? "md:left-16 left-24" : "md:right-16 right-24"
            )}
            style={{
              width: 'clamp(255.87px, 255.87px + (400 - 255.87) * ((100vw - 768px) / (1024 - 768)), 400px)',
              height: 'clamp(175.6px, 175.6px + (275 - 175.6) * ((100vw - 768px) / (1024 - 768)), 275px)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

const EventMulticardSkeleton = ({ className, count = 3 }) => {
  return (
    <div className={cn("w-full h-auto px-10 md:px-8 flex flex-col items-center", className)}>
      <div className="md:max-w-[1255px]">
        {Array.from({ length: count }).map((_, index) => (
          <EventCardSkeleton key={index} index={index} />
        ))}
      </div>
    </div>
  );
};

export default EventMulticardSkeleton;
