"use client"
import { color } from 'framer-motion'
import React,{useState,useEffect,useMemo} from 'react'
import Image from 'next/image'

const EventCard = React.forwardRef((props, ref) => {
    const Items = useMemo(() => [
        {title:"Valentines day",link:"/valentine.png",color:"#FB7D76"},
        {title:"Christmas",link:"/christmas.png",color:"#F06995"},
        {title:"Haloween",link:"/halloween.png",color:"#DB53AA"},
        {title:"Haloween",link:"/halloween.png",color:"#DB53AA"},
        {title:"Haloween",link:"/halloween.png",color:"#DB53AA"}
    ], []);
    
    const [isMobile,setIsmobile]=useState()
    useEffect(()=>{
        if(window.innerWidth>=1024){
            setIsmobile(Items.length);
        }
        else{
            setIsmobile(4);
        }
    },[Items.length])

  return (
    <div ref={ref} className='lg:pl-24 w-screen overflow-hidden flex lg:gap-5  gap-2 px-10 lg:flex-nowrap flex-wrap '>
        {
            Items.slice(0,isMobile).map((item,index)=>(
                <div key={index} 
                className={`flex justify-between lg:px-10 px-5 lg:h-24 lg:min-w-[370px]  lg:w-auto w-[145px]  h-[50px]   items-center rounded-2xl lg:text-2xl text-xs text-white font-poppins font-semibold`}
                style={{backgroundColor:`${item.color}`}}>
                    <div className='w-1/3'>
                    {item.title}
                    </div>
                    <Image 
                        src={item.link} 
                        alt={item.title} 
                        width={20} 
                        height={19} 
                        className='lg:w-auto lg:h-auto w-[20px] h-[19px]'
                    />
                </div>
            ))
        }
    </div>
  )
})
EventCard.displayName='EventCard'

export default EventCard