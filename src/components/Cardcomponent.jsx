import React from 'react'
import { cn } from "@/lib/utils";
const Cardcomponent=({ className,item ,title,reverse })=> {
  return (    
    <div className={cn("w-screen h-auto lg:px-24  flex flex-col items-center ",className)}>

        <div className='lg:max-w-[1255px]'>
       {title&&
        <div className='w-screen text-4xl font-semibold text-gift_blue font-poppins pb-20'>
        {title}
         </div>
       }
        {item.map((items,index)=>{
            let alignment = index % 2 === 0 ? "second" : "first";
            if(reverse){alignment = index % 2 === 0 ? "first" : "second";}
            return(
            <div key={index} className= {cn("max-w-screen  max-h-screen flex lg:flex-row flex-col justify-center ",alignment==="first"?"lg:flex-row-reverse":"lg:flex-row")}>


               <div className={cn("lg:w-2/3 w-screen border-2 border-solid flex lg:px-6",alignment==="first"?"justify-end ":"")}>    {/* outer design */}
               <div className=" lg:w-[75%] lg:h-screen w-screen   flex flex-col  justify-center  ">
                <p className='text-[63px] font-italiana font-normal w-full text-center '>{items.title}</p>
                <p className="py-12 lg:text-xl text-xs font-normal font-poppins text-center px-8">
                  {items.desc}
                </p>
                </div>
               </div>

               
                 <div className='relative lg:w-1/3 h-screen lg:px-auto lg:max-w-max max-w-full lg:overflow-auto overflow-hidden' >
                    <img src={items.image1} alt="" className={cn("absolute lg:w-[512px] lg:h-[351px] w-[255.87px] h-[175.6px] rounded-3xl bottom-24",alignment==="first"?"lg:left-0 left-4":"lg:right-0 right-4")}/>
                    <img src={items.image2} alt="" className={cn("absolute lg:w-[512px] lg:h-[351px] w-[255.87px] h-[175.6px] rounded-3xl bottom-32",alignment==="first"?"left-10":"right-10")} />
                    <img src={items.image3} alt="" className={cn("absolute lg:w-[512px] lg:h-[351px] w-[255.87px] h-[175.6px] rounded-3xl bottom-40",alignment==="first"?"lg:left-20 left-24":"lg:right-20 right-24")} />
                </div>  
               

            </div>
        )})}
        </div>
    </div>
  )
}

export default Cardcomponent