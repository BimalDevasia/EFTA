"use client"
import React,{ useState,useRef,useMemo,useEffect,forwardRef,useCallback } from 'react'

const Coursesabout=forwardRef((props,ref)=> {
    const [visibleItems, setVisibleItems] = useState([]);
    const [remainingCount, setRemainingCount] = useState(0);
    const containerRef = useRef(null);
    
    const memoizedItems = useMemo(() => {
      return [
        "Drawing courses", "Mural painting courses", "Craft courses", "Cake Baking courses", 
        "Drawing courses", "Mural painting courses", "Craft courses", "Cake Baking courses",
        "Drawing courses", "Mural painting courses", "Craft courses", "Cake Baking courses",
      ];
    }, []);
   
    const calculateVisibleItems = useCallback(() => {
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
    
          if (window.innerWidth >=1024 && cumulativeWidth > containerWidth * 1.5) {
            break;
          }
          else if(cumulativeWidth > containerWidth * 2.5){
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
      }, [memoizedItems, visibleItems.length, remainingCount]);
    
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
      }, [calculateVisibleItems]);



  return (
    <div ref={ref} className=' relative w-screen h-screen mt-32 pt-20 lg:mb-auto mb-[100px]'>
      
      
    <div className='relative flex flex-col lg:w-3/5 w-screen lg:mt-0  lg:justify-center lg:pl-28 px-10 lg:h-full h-max' ref={containerRef}>
      <div className='font-poppins'>
        <p className='lg:text-5xl  text-3xl font-medium text-course_blue font-italiana'>About Us</p>
        <p className='lg:w-8/12 pt-5 lg:text-xl text-xs'>Immerse yourself in the art of mural painting, drawing, crafting, cake baking adn so on with EFTA&apos;s captivating courses. Offering both one-on-one instruction and batch classes, our expert artists provide personalized guidance in well-equipped studios. Explore your creativity on flexible schedules, and earn certificates of completion. Whether you&apos;re a beginner or experienced, EFTA&apos;s courses will help you unlock your artistic potential.</p>
        </div>
      <div className=' bottom-12 lg:text-3xl lg:mt-0 mt-5 text-base font-medium font-italiana text-course_blue'><p>We Offer:</p>
      <div className='flex flex-wrap gap-3 font-poppins pt-2' >
            {visibleItems.map((item, index) => (
                <div key={index} className='lg:px-9 lg:py-2 lg:h-11  py-1 lg:text-[20px] text-xs bg-clip-border  text-course_blue font-normal  flex items-center  gap-3 ' >
                    <div>
                    {item} </div>
                    <p>/</p>
                </div>
            ))}
            {remainingCount > 0 && (
                <div className='lg:px-9 lg:py-2 lg:h-11 px-2 py-1  bg-clip-border  text-course_blue font-normal lg:text-[20px] text-xs flex items-center'>
                    +{remainingCount} more
                </div>
            )}
        </div>
      </div>
    </div>
    <div className='absolute right-0  lg:top-1/2 lg:mt-0 mt-56 translate-y-[-50%] lg:w-6/12 lg:h-[70%] h-[295px] w-[90%] rounded-l-full bg-no-repeat bg-cover bg-center ' style={{backgroundImage:`url('./courseabout.png')`}}>

      </div>
    </div>
  )
})
Coursesabout.displayName="Coursesabout"
export default Coursesabout