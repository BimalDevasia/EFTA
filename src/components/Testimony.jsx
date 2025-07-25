"use client"
import { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import { generatePersonIcon } from '@/utils/personIcon';

const Carousel = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIshovered] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch testimonies from API
  useEffect(() => {
    const fetchTestimonies = async () => {
      try {
        const response = await fetch('/api/public/testimonies?limit=6&random=true');
        const data = await response.json();
        
        if (response.ok && data.testimonies?.length > 0) {
          setTestimonies(data.testimonies);
          setActiveIndex(0);
        } else {
          // No testimonies available - don't show dummy data
          setTestimonies([]);
        }
      } catch (error) {
        console.error('Error fetching testimonies:', error);
        // Don't show dummy data on error - hide the section
        setTestimonies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonies();
  }, []);

  const nextIndex = useCallback(() => {
    if (testimonies.length > 0) {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonies.length);
    }
  }, [testimonies.length]);

  useEffect(() => {
    if (!isHovered && testimonies.length > 1) {
      const interval = setInterval(nextIndex, 3000); 
      return () => clearInterval(interval);
    }
  }, [isHovered, nextIndex, testimonies.length]);

  // Handles dot click and loops through items
  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center mt-10 overflow-hidden py-16">
        <div className="text-shadow-custom-light shadow-text-shadow bg-custom-gradient bg-clip-text text-transparent font-poppins lg:text-8xl text-3xl font-semibold">
          Customer Voice
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary_color"></div>
        </div>
      </div>
    );
  }

  // Don't render if no testimonies
  if (testimonies.length === 0) {
    return null;
  }
  

  return (
    <div className="flex flex-col items-center mt-10 overflow-hidden py-16">
      <div className="text-shadow-custom-light shadow-text-shadow bg-custom-gradient bg-clip-text text-transparent font-poppins lg:text-8xl text-3xl font-semibold">
        Customer Voice
      </div>
      <div className="relative lg:w-[780px] lg:h-[550px]  w-[380px] h-[250px] flex justify-center items-center"
      onMouseEnter={()=>setIshovered(true)}
      onMouseLeave={()=>setIshovered(false)}
      >
        {testimonies.map((testimony, index) => {
          const position =
            (index - activeIndex + testimonies.length) % testimonies.length; // Calculate position in the loop

          return (
            <div
            
              key={testimony._id}
              className={`absolute flex flex-col px-5 justify-center w-full h-full transition-transform duration-700 ease-in-out rounded-lg text-white font-poppins  ${
                position === 0
                  ? "z-20 scale-100  opacity-100"
                  : position === 1
                  ? "z-10 scale-90  translate-x-full opacity-50"
                  : "z-10 scale-90  -translate-x-full opacity-50"
              }`}
            >
              <div className="text-black lg:text-2xl text-lg py-3 flex justify-between">
                <div className="flex gap-5 items-center">
                  {testimony.customerImage ? (
                    <Image 
                      src={testimony.customerImage} 
                      alt={testimony.customerName} 
                      width={70} 
                      height={70} 
                      className="rounded-full lg:h-[70px] lg:w-[70px] h-[20px] w-[20px] object-cover object-center"
                    />
                  ) : (
                    <div className="lg:w-[70px] lg:h-[70px] w-[20px] h-[20px]">
                      {generatePersonIcon(testimony.customerName, 'lg:w-[70px] lg:h-[70px] w-[20px] h-[20px]')}
                    </div>
                  )}
                  {testimony.customerName}
                </div>
                <div className="font-instrumentsans lg:text-[190px] text-[50px] rotate-180 max-h-[0px] text-primary_color ">
                  {/*for comma*/}
                  “
                </div>
                </div>

              <div className="font-normal relative text-[#5B5B5B] lg:text-3xl text-sm py-5">{testimony.message}
              <div className="absolute inset-0 border-solid  border-primary_color border-t-[4px] h-0 rounded-full w-1/5 "></div>
              </div>  
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-4">
        
        <div className="flex gap-4">
          {testimonies.map((_, index) => (
            <button
              key={index}
              className={`lg:w-4 lg:h-4 w-2 h-2 rounded-full transition-colors duration-300 ${
                index === activeIndex ? "bg-primary_color" : "bg-gray-400"
              }`}
              onClick={() => handleDotClick(index)}
            ></button>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Carousel;
