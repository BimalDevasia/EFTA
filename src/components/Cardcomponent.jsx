import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from "@/lib/utils";
const Cardcomponent=({ className,item ,title,reverse })=> {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev - 1 + 3) % 3);
    }, 1500);

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
      alignment === "first" ? "md:left-2 left-4" : "md:right-2 right-4",   // Position 1 - original desktop positioning
      alignment === "first" ? "md:left-8 left-10" : "md:right-8 right-10", // Position 2 - original desktop positioning
      alignment === "first" ? "md:left-16 left-24" : "md:right-16 right-24" // Position 3 - original desktop positioning
    ];
    
    const adjustedIndex = (imageIndex - currentIndex + 3) % 3;
    return offsets[adjustedIndex];
  };
  return (    
    <div className={cn("w-full h-auto px-10 md:px-8  flex flex-col items-center ",className)}>

        <div className='md:max-w-[1255px]'>
       {title&&
        <div className='w-full text-3xl font-semibold text-[#1F76BD] font-poppins pb-5  flex justify-center'>
        {title}
         </div>
       }
        {item.map((items,index)=>{
            let alignment = index % 2 === 0 ? "second" : "first";
            if(reverse){alignment = index % 2 === 0 ? "first" : "second";}
            return(
            <div key={index} className= {cn("max-w-full  max-h-screen flex md:flex-row flex-col justify-center   ",alignment==="first"?"md:flex-row-reverse":"md:flex-row")}>


               <div className={cn("md:w-2/3 w-full flex md:px-6 relative z-10",alignment==="first"?"justify-end ":"")}>    {/* outer design */}
               <div className=" md:w-[75%] md:h-screen w-full   flex flex-col  justify-center bg-white relative z-10">
                <p className='font-italiana font-normal w-full text-center' 
                   style={{fontSize: 'clamp(32px, 32px + (63 - 32) * ((100vw - 768px) / (1024 - 768)), 63px)'}}>
                  {items.title}
                </p>
                <p className="font-normal font-poppins text-center px-8"
                   style={{
                     fontSize: 'clamp(12px, 12px + (20 - 12) * ((100vw - 768px) / (1024 - 768)), 20px)',
                     padding: 'clamp(20px, 20px + (48 - 20) * ((100vw - 768px) / (1024 - 768)), 48px) 0'
                   }}>
                  {items.desc}
                </p>
                </div>
               </div>

               
                 <div className='relative md:w-1/3 md:h-screen h-[400px] w-full z-20 md:flex md:items-center flex justify-center' >
                   <div className='relative md:w-full w-[400px] md:h-full' >
                    <Image 
                      src={items.image1} 
                      alt={`${items.title} image 1`} 
                      width={512} 
                      height={351} 
                      className={cn(
                        "absolute rounded-3xl transition-all duration-1000 ease-in-out",
                        getImagePosition(0, currentImageIndex).position,
                        getImagePosition(0, currentImageIndex).zIndex,
                        getImageOffset(0, currentImageIndex, alignment)
                      )}
                      style={{
                        width: 'clamp(255.87px, 255.87px + (400 - 255.87) * ((100vw - 768px) / (1024 - 768)), 400px)',
                        height: 'clamp(175.6px, 175.6px + (275 - 175.6) * ((100vw - 768px) / (1024 - 768)), 275px)'
                      }}
                      loading="lazy"
                      sizes="(max-width: 768px) 256px, 400px"
                    />
                    <Image 
                      src={items.image2} 
                      alt={`${items.title} image 2`} 
                      width={512} 
                      height={351} 
                      className={cn(
                        "absolute rounded-3xl transition-all duration-1000 ease-in-out",
                        getImagePosition(1, currentImageIndex).position,
                        getImagePosition(1, currentImageIndex).zIndex,
                        getImageOffset(1, currentImageIndex, alignment)
                      )}
                      style={{
                        width: 'clamp(255.87px, 255.87px + (400 - 255.87) * ((100vw - 768px) / (1024 - 768)), 400px)',
                        height: 'clamp(175.6px, 175.6px + (275 - 175.6) * ((100vw - 768px) / (1024 - 768)), 275px)'
                      }}
                      loading="lazy" 
                      sizes="(max-width: 768px) 256px, 400px"
                    />
                    <Image 
                      src={items.image3} 
                      alt={`${items.title} image 3`} 
                      width={512} 
                      height={351} 
                      className={cn(
                        "absolute rounded-3xl transition-all duration-1000 ease-in-out",
                        getImagePosition(2, currentImageIndex).position,
                        getImagePosition(2, currentImageIndex).zIndex,
                        getImageOffset(2, currentImageIndex, alignment)
                      )}
                      style={{
                        width: 'clamp(255.87px, 255.87px + (400 - 255.87) * ((100vw - 768px) / (1024 - 768)), 400px)',
                        height: 'clamp(175.6px, 175.6px + (275 - 175.6) * ((100vw - 768px) / (1024 - 768)), 275px)'
                      }}
                      loading="lazy"
                      sizes="(max-width: 768px) 256px, 400px"
                    />
                   </div>
                </div>  
               

            </div>
        )})}
        </div>
    </div>
  )
}

export default Cardcomponent