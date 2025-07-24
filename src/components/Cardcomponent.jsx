import React from 'react'
import Image from 'next/image'
import { cn } from "@/lib/utils";
const Cardcomponent=({ className,item ,title,reverse })=> {
  return (    
    <div className={cn("w-full h-auto lg:px-24  flex flex-col items-center ",className)}>

        <div className='lg:max-w-[1255px]'>
       {title&&
        <div className='w-full text-4xl font-semibold text-gift_blue font-poppins pb-5  flex justify-center'>
        {title}
         </div>
       }
        {item.map((items,index)=>{
            let alignment = index % 2 === 0 ? "second" : "first";
            if(reverse){alignment = index % 2 === 0 ? "first" : "second";}
            return(
            <div key={index} className= {cn("max-w-full  max-h-screen flex lg:flex-row flex-col justify-center   ",alignment==="first"?"lg:flex-row-reverse":"lg:flex-row")}>


               <div className={cn("lg:w-2/3 w-full border-2 border-solid flex lg:px-6",alignment==="first"?"justify-end ":"")}>    {/* outer design */}
               <div className=" lg:w-[75%] lg:h-screen w-full   flex flex-col  justify-center  ">
                <p className='lg:text-[63px] text-[32px] font-italiana font-normal w-full text-center '>{items.title}</p>
                <p className="lg:py-12 py-5 lg:text-xl text-xs font-normal font-poppins text-center px-8">
                  {items.desc}
                </p>
                </div>
               </div>

               
                 <div className='relative lg:w-1/3 lg:h-screen h-[400px] w-full overflow-hidden' >
                    <Image 
                      src={items.image1} 
                      alt={`${items.title} image 1`} 
                      width={512} 
                      height={351} 
                      className={cn("absolute lg:w-[512px] lg:h-[351px] w-[255.87px] h-[175.6px] rounded-3xl bottom-24",alignment==="first"?"lg:left-0 left-4":"lg:right-0 right-4")}
                      loading="lazy"
                      sizes="(max-width: 768px) 256px, 512px"
                    />
                    <Image 
                      src={items.image2} 
                      alt={`${items.title} image 2`} 
                      width={512} 
                      height={351} 
                      className={cn("absolute lg:w-[512px] lg:h-[351px] w-[255.87px] h-[175.6px] rounded-3xl bottom-32",alignment==="first"?"left-10":"right-10")}
                      loading="lazy" 
                      sizes="(max-width: 768px) 256px, 512px"
                    />
                    <Image 
                      src={items.image3} 
                      alt={`${items.title} image 3`} 
                      width={512} 
                      height={351} 
                      className={cn("absolute lg:w-[512px] lg:h-[351px] w-[255.87px] h-[175.6px] rounded-3xl bottom-40",alignment==="first"?"lg:left-20 left-24":"lg:right-20 right-24")}
                      loading="lazy"
                      sizes="(max-width: 768px) 256px, 512px"
                    />
                </div>  
               

            </div>
        )})}
        </div>
    </div>
  )
}

export default Cardcomponent