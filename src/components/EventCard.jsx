"use client"
import { color } from 'framer-motion'
import React,{useState,useEffect} from 'react'
const EventCard = React.forwardRef((props, ref) => {
    const Items=[  {title:"Valentines day",link:"./valentine.png",color:"#FB7D76"},{title:"Christmas",link:"./christmas.png",color:"#F06995"},{title:"Haloween",link:"./halloween.png",color:"#DB53AA"},{title:"Haloween",link:"./halloween.png",color:"#DB53AA"},{title:"Haloween",link:"",color:"#DB53AA"} ]
    const [isMobile,setIsmobile]=useState()
    useEffect(()=>{
        if(window.innerWidth>=1024){
            setIsmobile(Items.length);
        }
        else{
            setIsmobile(4);
        }
    },[window.innerWidth])

  return (
    <div ref={ref} className='lg:pl-24 w-screen overflow-hidden flex lg:gap-5  gap-2 px-10 lg:flex-nowrap flex-wrap '>
        {
            Items.slice(0,isMobile).map((item,index)=>(
                <div key={index} 
                className={`flex justify-between lg:px-10 px-5 lg:h-32 lg:min-w-[370px]  lg:w-auto w-[145px]  h-[50px]   items-center rounded-2xl lg:text-4xl text-xs text-white font-poppins font-semibold`}
                style={{backgroundColor:`${item.color}`}}>
                    <div className='w-1/3'>
                    {item.title}
                    </div>
                    <img src={`${item.link}`} alt=""  className='lg:w-auto lg:h-auto w-[20px] h-[19px]'/>
                </div>
            ))
        }
    </div>
  )
})

export default EventCard