"use client"
import React,{ useState,useRef,useMemo,useEffect,forwardRef } from 'react'

const Coursesabout=forwardRef((props,ref)=> {
    const [visibleItems, setVisibleItems] = useState([]);
    const [remainingCount, setRemainingCount] = useState(0);
    const containerRef = useRef(null);
    
    const items = [
      "Drawing courses", "Mural painting courses", "Craft courses", "Cake Baking courses", 
      "Drawing courses", "Mural painting courses", "Craft courses", "Cake Baking courses",
      "Drawing courses", "Mural painting courses", "Craft courses", "Cake Baking courses",
    ];
    
    const memoizedItems = useMemo(() => {
      return items.map(item => item);
    }, [items]);
   
    const calculateVisibleItems = () => {
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
    
          if (cumulativeWidth > containerWidth * 1.7) {
            break;
          }
    
          itemsInFirstTwoLines.push(i);
        }
    
        const itemsToShow = itemsInFirstTwoLines.length;
        const newVisibleItems = memoizedItems.length > itemsToShow 
          ? memoizedItems.slice(0, itemsToShow - 1) 
          : memoizedItems;
        
        const newRemainingCount = memoizedItems.length > itemsToShow 
          ? memoizedItems.length - itemsToShow + 1 
          : 0;
    
        if (newVisibleItems.length !== visibleItems.length || newRemainingCount !== remainingCount) {
          setVisibleItems(newVisibleItems);
          setRemainingCount(newRemainingCount);
        }
      };
    
      useEffect(() => {
        calculateVisibleItems(); // Run initially
    
        const handleResize = () => {
          calculateVisibleItems(); // Recalculate on window resize
        };
    
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [memoizedItems, remainingCount, visibleItems.length]);



  return (
    <div ref={ref} className=' relative w-screen h-screen mt-32 pt-20'>
      
      <div className='absolute right-0 top-1/2 translate-y-[-50%] w-6/12 h-[70%] rounded-l-full bg-no-repeat bg-cover bg-center ' style={{backgroundImage:`url('./courseabout.png')`}}>

      </div>
    <div className='relative flex flex-col w-[55%] pl-28 h-full gap-7 justify-center' ref={containerRef}>
      <div className='font-poppins'>
        <p className='text-5xl font-medium text-course_blue font-italiana'>About Us</p>
        <p className='w-8/12 pt-5 text-lg'>Immerse yourself in the art of mural painting, drawing, crafting, cake baking adn so on with EFTA&apos;s captivating courses. Offering both one-on-one instruction and batch classes, our expert artists provide personalized guidance in well-equipped studios. Explore your creativity on flexible schedules, and earn certificates of completion. Whether you&apos;re a beginner or experienced, EFTA&apos;s courses will help you unlock your artistic potential.</p>
        </div>
      <div className=' bottom-12 text-3xl font-medium font-italiana text-course_blue'><p>We Offer:</p>
      <div className='flex flex-wrap gap-3 font-poppins pt-2' >
            {visibleItems.map((item, index) => (
                <div key={index} className='py-2 h-11 bg-white bg-clip-border  text-course_blue font-normal text-[20px] flex items-center  gap-3 ' >
                    <div>
                    {item} </div>
                    <p>/</p>
                </div>
            ))}
            {remainingCount > 0 && (
                <div className='py-2 h-[46px] bg-white bg-clip-border  text-course_blue font-normal text-[20px] flex items-center'>
                    +{remainingCount} more
                </div>
            )}
        </div>
      </div>
    </div>
    </div>
  )
})

export default Coursesabout