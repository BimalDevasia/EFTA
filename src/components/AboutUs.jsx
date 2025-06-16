"use client"
import React from 'react'
import { useState, useRef,useEffect,useMemo,useCallback } from 'react';
import "./homeFront.css"
import gsap from 'gsap';
import { wrap } from "@motionone/utils";




function AboutUs() {
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

  const animation = useCallback(() => {
      if (xPercentRef.current <= -100) {
        xPercentRef.current = 0;
      }
      if (xPercentRef.current > 0) {
        xPercentRef.current = -100;
      }
  
      gsap.set(item1.current, { xPercent: xPercentRef.current });
      gsap.set(item2.current, { xPercent: xPercentRef.current });
 
      xPercentRef.current += 0.15 * directionRef.current;
    
      requestAnimationFrame(animation);
  }, []);

  useEffect(() => {
    if(window.innerWidth>=1024){
      requestAnimationFrame(animation);
    }
  }, [animation]);




  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    let cumulativeWidth = 0;
    let itemsInFirstTwoLines = [];

    for (let i = 0; i < memoizedItems.length; i++) {
      const tempDiv = document.createElement('div');
      tempDiv.style.display = 'inline-block';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.position = 'absolute';
      tempDiv.textContent = memoizedItems[i];
      document.body.appendChild(tempDiv);
      const buttonWidth = tempDiv.offsetWidth + 96;
      document.body.removeChild(tempDiv);

      if (cumulativeWidth + buttonWidth > containerWidth && itemsInFirstTwoLines.length === 0) {
        cumulativeWidth = 0;
        itemsInFirstTwoLines.push(i);
      }

      cumulativeWidth += buttonWidth;

      if (cumulativeWidth > containerWidth * 1.4) {
        break;
      }

      itemsInFirstTwoLines.push(i);
    }

    const itemsToShow = itemsInFirstTwoLines.length;
    const newVisibleItems = memoizedItems.length > itemsToShow ? memoizedItems.slice(0, itemsToShow - 1) : memoizedItems;
    const newRemainingCount = memoizedItems.length > itemsToShow ? memoizedItems.length - itemsToShow + 1 : 0;

    
    if (
      newVisibleItems.length !== visibleItems.length ||
      newRemainingCount !== remainingCount
    ) {
      setVisibleItems(newVisibleItems);
      setRemainingCount(newRemainingCount);
    }
  }, [memoizedItems,remainingCount, visibleItems.length]);



  return (
    <div className=' relative w-full h-screen'>
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
     
    <div className='relative flex flex-col   lg:w-3/5 w-full lg:mt-0  lg:justify-center lg:pl-28 px-10 lg:h-full h-max z-20' ref={containerRef}>
      <div className='font-poppins'>
        <p className='lg:text-5xl  text-3xl font-medium text-primary_color'>About Us</p>
        <p className='lg:w-8/12 pt-5 lg:text-xl text-xs  '>We would love to be known as a happiness-quotient booster service company! Yes, although it’s too broad a term to rein in to this particular usage, we’d still tend to believe that what we do will only help boost happiness and all the other associated sweetness of emotions wherever we’re playing a part in!</p>
        </div>
      <div className='lg:absolute bottom-12 lg:text-3xl lg:mt-0 mt-5 text-base font-medium text-primary_color'><p>We Offer:</p>
      <div className='flex flex-wrap gap-3 font-poppins pt-5' >
            {visibleItems.map((item, index) => (
                <div key={index} className='lg:px-9 lg:py-2 lg:h-11 px-4 py-1 bg-white bg-clip-border rounded-[100px] text-primary_color border-primary_color border-dashed border-2 font-semibold lg:text-[20px] text-xs flex items-center ' >
                    {item}
                </div>
            ))}
            {remainingCount > 0 && (
                <div className='lg:px-9 lg:py-2 lg:h-11 px-4 py-1 bg-white bg-clip-border rounded-[100px] text-primary_color border-primary_color border-dashed border-2 font-semibold lg:text-[20px] text-xs flex items-center'>
                    +{remainingCount} more
                </div>
            )}
        </div>
      </div>
    </div>
    <div className='absolute  right-0 lg:top-1/2 lg:mt-0 mt-56 translate-y-[-50%] lg:w-6/12 lg:h-[70%] h-[295px] w-[90%] rounded-l-full bg-no-repeat bg-cover bg-center z-10' style={{backgroundImage:`url('./about.png')`}}>

</div>

    
    </div>
  )
}

export default AboutUs