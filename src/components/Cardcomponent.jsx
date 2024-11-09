import React from 'react'
import { cn } from "@/lib/utils";
const Cardcomponent=({ className,item ,title,reverse })=> {
  return (    
    <div className={cn("w-screen h-auto lg:px-24",className)}>
       {title&&
        <div className='w-screen text-4xl font-semibold text-gift_blue font-poppins pb-20'>
        {title}
         </div>
       }
        {item.map((items,index)=>{
            let alignment = index % 2 === 0 ? "second" : "first";
            if(reverse){alignment = index % 2 === 0 ? "first" : "second";}
            return(
            <div key={index} className= {cn("max-w-screen  max-h-screen flex ",alignment==="first"?"flex-row-reverse":"flex-row")}>


               <div className={cn("lg:w-2/3 border-2 border-solid flex lg:px-6",alignment==="first"?"justify-end ":"")}>    {/* outer design */}
               <div className=" lg:w-[75%] lg:h-screen w-screen   flex flex-col  justify-center  ">
                <p className='text-[63px] font-italiana font-normal w-full text-center '>{items.title}</p>
                <p className="py-12 lg:text-xl text-xs font-normal font-poppins text-center">
                  {items.desc}
                </p>
                </div>
               </div>

               
                 <div className='relative w-1/3 h-screen ' >
                    <img src={items.image1} alt="" className={cn("absolute w-[512px] h-[351px] rounded-3xl bottom-24",alignment==="first"?"left-0":"right-0")}/>
                    <img src={items.image2} alt="" className={cn("absolute w-[512px] h-[351px] rounded-3xl bottom-32",alignment==="first"?"left-10":"right-10")} />
                    <img src={items.image3} alt="" className={cn("absolute w-[512px] h-[351px] rounded-3xl bottom-40 right-20",alignment==="first"?"left-20":"right-20")} />
                </div>  
               

            </div>
        )})}
    </div>
  )
}

export default Cardcomponent