import { color } from 'framer-motion'
import React from 'react'

function EventCard() {
    const Items=[  {title:"Valentines day",link:"./valentine.png",color:"#FB7D76"},{title:"Christmas",link:"./christmas.png",color:"#F06995"},{title:"Haloween",link:"./halloween.png",color:"#DB53AA"},{title:"Haloween",link:"./halloween.png",color:"#DB53AA"},{title:"Haloween",link:"",color:"#DB53AA"} ]

  return (
    <div className='pl-24 w-screen overflow-hidden flex gap-5'>
        {
            Items.map((item,index)=>(
                <div key={index} 
                className={`flex justify-between px-10 bg-[${item.color}] h-32 min-w-[400px] flex justify-center items-center rounded-2xl text-4xl text-white font-poppins font-semibold`}>
                    <div className='w-1/3'>
                    {item.title}
                    </div>
                    <img src={`${item.link}`} alt="" />
                </div>
            ))
        }
    </div>
  )
}

export default EventCard