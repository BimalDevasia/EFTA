import React from 'react';

const EventCardSkeleton = ({ className = "" }) => {
  return (
    <div className={`w-full px-10 md:px-8 ${className}`}>
      <div className="md:max-w-[1255px] mx-auto space-y-12">
        {/* Generate 3 skeleton cards */}
        {[1, 2, 3].map((index) => (
          <div key={index} className="animate-pulse">
            {/* Main container for each event card */}
            <div className={`flex flex-col md:flex-row items-center gap-8 ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}>
              
              {/* Text section */}
              <div className="flex-1 space-y-6 py-8">
                {/* Title skeleton */}
                <div className="h-8 md:h-12 bg-gray-300 rounded-lg w-3/4 mx-auto"></div>
                
                {/* Description skeleton */}
                <div className="space-y-3 px-4 md:px-8">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
              
              {/* Images section */}
              <div className="flex-1 relative h-64 md:h-80">
                {/* Stack of image placeholders */}
                <div className={`absolute inset-0 flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}>
                  <div className="relative w-48 md:w-64 h-48 md:h-64">
                    {/* Image placeholders stacked */}
                    <div className="absolute top-0 left-0 w-full h-32 md:h-40 bg-gray-200 rounded-xl transform rotate-1"></div>
                    <div className="absolute top-4 left-4 w-full h-32 md:h-40 bg-gray-300 rounded-xl transform -rotate-1"></div>
                    <div className="absolute top-8 left-2 w-full h-32 md:h-40 bg-gray-400 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCardSkeleton;
