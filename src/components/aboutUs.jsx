"use client"
import React from 'react'
import { useState, useRef,useEffect,useMemo } from 'react';
import "./homeFront.css"

const memoizedItems=["Custom Orders", "Bulk Orders", "Corporate Orders", "Frames", "Key Chains", "Portraits","Bulk Orders", "Corporate Orders", "Frames", "Key Chains", "Portraits"]

function AboutUs() {
  const [visibleItems, setVisibleItems] = useState([]);
    const [remainingCount, setRemainingCount] = useState(0);
    const containerRef = useRef(null);






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
  }, [memoizedItems]);



  return (
    <div className=' relative w-screen h-screen '>
       <div className='absolute top-[-10%] flex justify-around w-full font-italiana text-9xl'>
        <div>EVENTS</div>
        <div>COURSES</div>
        <div>GIFTS</div>
      </div>
      <div className='absolute right-0 top-1/2 translate-y-[-50%] w-6/12 h-[70%] rounded-l-full bg-no-repeat bg-cover bg-center ' style={{backgroundImage:`url('./about.png')`}}>

      </div>
    <div className='relative flex flex-col  w-3/5  justify-center pl-28 h-full' ref={containerRef}>
      <div className='font-poppins'>
        <p className='text-5xl font-medium text-primary_color'>About Us</p>
        <p className='w-8/12 pt-5 text-xl'>We would love to be known as a happiness-quotient booster service company! Yes, although it’s too broad a term to rein in to this particular usage, we’d still tend to believe that what we do will only help boost happiness and all the other associated sweetness of emotions wherever we’re playing a part in!</p>
        </div>
      <div className='absolute bottom-12 text-3xl font-medium text-primary_color'><p>We Offer:</p>
      <div className='flex flex-wrap gap-3 font-poppins pt-5' >
            {visibleItems.map((item, index) => (
                <div key={index} className='px-9 py-2 h-11 bg-white bg-clip-border rounded-[100px] text-primary_color border-primary_color border-dashed border-2 font-semibold text-[20px] flex items-center ' >
                    {item}
                </div>
            ))}
            {remainingCount > 0 && (
                <div className='px-9 py-2 h-[46px] bg-white bg-clip-border rounded-[100px] text-primary_color border-primary_color border-dashed border-2 font-semibold text-[20px] flex items-center'>
                    +{remainingCount} more
                </div>
            )}
        </div>
      </div>
    </div>
    </div>
  )
}

export default AboutUs