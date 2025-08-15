"use client"
import React, { useState, useRef, useEffect, useMemo, useCallback, forwardRef } from 'react';
import Image from 'next/image';




const AboutUs = forwardRef((props, ref) => {
  const [visibleItems, setVisibleItems] = useState([]);
    const [remainingCount, setRemainingCount] = useState(0);
    const containerRef = useRef(null);

    const memoizedItems = useMemo(() => {
      return ["Custom Orders","Bulk Orders","Corporate Orders","Frames","Key Chains","Portraits","Custom Orders","Bulk Orders","Corporate Orders","Frames","Key Chains","Portraits"];
    }, []);
  const item1 = useRef(null);
  const item2 = useRef(null);
  const xPercentRef = useRef(0);
  const directionRef = useRef(-1);

  // Optimized animation using CSS transform instead of GSAP
  const animation = useCallback(() => {
    if (!item1.current || !item2.current) return;
    
    if (xPercentRef.current <= -100) {
      xPercentRef.current = 0;
    }
    if (xPercentRef.current > 0) {
      xPercentRef.current = -100;
    }

    // Use native CSS transforms instead of GSAP for better performance
    item1.current.style.transform = `translateX(${xPercentRef.current}%)`;
    item2.current.style.transform = `translateX(${xPercentRef.current}%)`;

    xPercentRef.current += 0.15 * directionRef.current;
  
    requestAnimationFrame(animation);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      requestAnimationFrame(animation);
    }
  }, [animation]);




  // Optimized services calculation with memoization and reduced DOM operations
  useEffect(() => {
    if (!containerRef.current) return;

    const calculateVisibleItems = () => {
      const containerWidth = containerRef.current.clientWidth;
      const estimatedButtonWidth = 150; // Estimated width per button
      const buttonsPerLine = Math.floor(containerWidth / estimatedButtonWidth);
      const maxItemsToShow = Math.max(buttonsPerLine * 2 - 1, 3); // Show 2 lines minus 1 for "+X more"
      
      if (memoizedItems.length <= maxItemsToShow) {
        setVisibleItems(memoizedItems);
        setRemainingCount(0);
      } else {
        setVisibleItems(memoizedItems.slice(0, maxItemsToShow));
        setRemainingCount(memoizedItems.length - maxItemsToShow);
      }
    };

    calculateVisibleItems();

    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateVisibleItems, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [memoizedItems]);



  return (
    <div ref={ref} className='relative w-full min-h-screen lg:h-auto xl:h-screen'>
       <div className='hidden lg:absolute top-[-10%] lg:flex justify-around w-full font-italiana overflow-hidden lg:text-9xl z-50 pointer-events-none'>
        <div ref={item1} className='flex gap-32 z-50'>
        <div>EVENTS</div>
        <div>COURSES</div>
        <div>GIFTS</div>
        </div>

        <div ref={item2} className=' flex gap-32 z-50'>
        <div className='ml-32 max-w-max'>EVENTS</div>
        <div>COURSES</div>
        <div>GIFTS</div>
        </div>
      
        
      </div>
     
    {/* Main content container with proper responsive layout */}
    <div className='flex flex-col lg:flex-row min-h-screen'>
      {/* Left content section */}
      <div className='relative flex flex-col lg:w-3/5 w-full lg:justify-center lg:pl-20 px-6 sm:px-10 lg:px-8 py-12 lg:py-16 xl:py-20 z-20 order-2 lg:order-1' ref={containerRef}>
        <div className='font-poppins mb-8 lg:mb-12'>
          <p className='lg:text-5xl text-3xl sm:text-4xl font-medium text-primary_color mb-6'>About Us</p>
          <p className='lg:w-10/12 xl:w-8/12 lg:text-xl text-sm sm:text-base leading-relaxed text-gray-700'>
            We would love to be known as a happiness-quotient booster service company! Yes, although it's too broad a term to rein in to this particular usage, we'd still tend to believe that what we do will only help boost happiness and all the other associated sweetness of emotions wherever we're playing a part in!
          </p>
        </div>
        
        {/* Services section */}
        <div className='lg:text-3xl text-lg sm:text-xl font-medium text-primary_color'>
          <p className='mb-6'>We Offer:</p>
          <div className='flex flex-wrap gap-3 font-poppins'>
                {visibleItems.map((item, index) => (
                    <div key={index} className='lg:px-9 lg:py-2 lg:h-11 px-4 py-2 bg-white bg-clip-border rounded-[100px] text-primary_color border-primary_color border-dashed border-2 font-semibold lg:text-[20px] text-xs sm:text-sm flex items-center'>
                        {item}
                    </div>
                ))}
                {remainingCount > 0 && (
                    <div className='lg:px-9 lg:py-2 lg:h-11 px-4 py-2 bg-white bg-clip-border rounded-[100px] text-primary_color border-primary_color border-dashed border-2 font-semibold lg:text-[20px] text-xs sm:text-sm flex items-center'>
                        +{remainingCount} more
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {/* Right image section */}
      <div className='lg:w-2/5 w-full lg:flex lg:items-center lg:justify-center order-1 lg:order-2 relative'>
        <div className='lg:relative lg:w-full lg:h-[70vh] xl:h-[80vh] h-[300px] sm:h-[400px] md:h-[500px] lg:max-w-none max-w-[90%] mx-auto lg:mx-0 rounded-l-full lg:rounded-l-none lg:rounded-r-3xl overflow-hidden'>
          <Image
            src="/about.png"
            alt="About EFTA"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 90vw, 40vw"
          />
        </div>
      </div>
    </div>

    
    </div>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs
