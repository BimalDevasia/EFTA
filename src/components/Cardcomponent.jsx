import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from "@/lib/utils";
const Cardcomponent=({ className,item ,title,reverse })=> {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Animation loop effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev - 1 + 3) % 3);
    }, 1500); // Change every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  const getImagePosition = (imageIndex, currentIndex) => {
    const positions = [
      { position: "bottom-24", zIndex: "z-30" }, // Position 1 (bottom)
      { position: "bottom-32", zIndex: "z-40" }, // Position 2 (middle)  
      { position: "bottom-40", zIndex: "z-50" }  // Position 3 (top)
    ];
    
    const adjustedIndex = (imageIndex - currentIndex + 3) % 3;
    return positions[adjustedIndex];
  };

  const getImageOffset = (imageIndex, currentIndex, alignment) => {
    const offsets = [
      alignment === "first" ? "lg:left-2 left-4" : "lg:right-2 right-4",   // Position 1
      alignment === "first" ? "lg:left-8 left-10" : "lg:right-8 right-10", // Position 2
      alignment === "first" ? "lg:left-16 left-24" : "lg:right-16 right-24" // Position 3
    ];
    
    const adjustedIndex = (imageIndex - currentIndex + 3) % 3;
    return offsets[adjustedIndex];
  };
  return (    
    <div className={cn("w-full h-auto px-10 lg:px-8  flex flex-col items-center ",className)}>

        <div className='lg:max-w-[1255px]'>
       {title&&
        <div className='w-full text-3xl font-semibold text-[#1F76BD] font-poppins pb-5  flex justify-center'>
        {title}
         </div>
       }
        {item.map((items,index)=>{
            let alignment = index % 2 === 0 ? "second" : "first";
            if(reverse){alignment = index % 2 === 0 ? "first" : "second";}
            return(
            <div key={index} className= {cn("max-w-full  max-h-screen flex lg:flex-row flex-col justify-center   ",alignment==="first"?"lg:flex-row-reverse":"lg:flex-row")}>


               <div className={cn("lg:w-2/3 w-full flex lg:px-6 relative z-10",alignment==="first"?"justify-end ":"")}>    {/* outer design */}
               <div className=" lg:w-[75%] lg:h-screen w-full   flex flex-col  justify-center bg-white relative z-10">
                <p className='lg:text-[63px] text-[32px] font-italiana font-normal w-full text-center '>{items.title}</p>
                <p className="lg:py-12 py-5 lg:text-xl text-xs font-normal font-poppins text-center px-8">
                  {items.desc}
                </p>
                </div>
               </div>

               
                 <div className='relative lg:w-1/3 lg:h-screen h-[400px] w-full z-20' >
                    <Image 
                      src={items.image1} 
                      alt={`${items.title} image 1`} 
                      width={512} 
                      height={351} 
                      className={cn(
                        "absolute lg:w-[400px] lg:h-[275px] w-[255.87px] h-[175.6px] rounded-3xl transition-all duration-1000 ease-in-out",
                        getImagePosition(0, currentImageIndex).position,
                        getImagePosition(0, currentImageIndex).zIndex,
                        getImageOffset(0, currentImageIndex, alignment)
                      )}
                      loading="lazy"
                      sizes="(max-width: 768px) 256px, 400px"
                    />
                    <Image 
                      src={items.image2} 
                      alt={`${items.title} image 2`} 
                      width={512} 
                      height={351} 
                      className={cn(
                        "absolute lg:w-[400px] lg:h-[275px] w-[255.87px] h-[175.6px] rounded-3xl transition-all duration-1000 ease-in-out",
                        getImagePosition(1, currentImageIndex).position,
                        getImagePosition(1, currentImageIndex).zIndex,
                        getImageOffset(1, currentImageIndex, alignment)
                      )}
                      loading="lazy" 
                      sizes="(max-width: 768px) 256px, 400px"
                    />
                    <Image 
                      src={items.image3} 
                      alt={`${items.title} image 3`} 
                      width={512} 
                      height={351} 
                      className={cn(
                        "absolute lg:w-[400px] lg:h-[275px] w-[255.87px] h-[175.6px] rounded-3xl transition-all duration-1000 ease-in-out",
                        getImagePosition(2, currentImageIndex).position,
                        getImagePosition(2, currentImageIndex).zIndex,
                        getImageOffset(2, currentImageIndex, alignment)
                      )}
                      loading="lazy"
                      sizes="(max-width: 768px) 256px, 400px"
                    />
                </div>  
               

            </div>
        )})}
        </div>
    </div>
  )
}

export default Cardcomponent