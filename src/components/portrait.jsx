'use client'
import React,{ useState, useEffect } from 'react'
import { motion } from 'framer-motion';

function Portrait() {

  const [currentIndex, setCurrentIndex] = useState(0);

 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const items = [
    {id:"portrait1",path:"/portrait1.png"},
    {id:"portrait2",path:"/portrait2.png"},
    // {id:"template",path:"/template1.png"}
  ]

  return (
    <div className='px-36 w-screen h-screen flex justify-center items-center overflow-hidden '>
      <div className='w-full bg-[#BFF2FF] h-[450px] rounded-2xl flex gap-4 justify-center py-9'>
        <div className='w-2/5  h-full rounded-[8px]  px-2 flex flex-col justify-around'>
        <div className='text-4xl font-poppins break-normal font-light'>
          CREATE YOUR <span className='text-5xl font-caveat break-words font-bold'>PORTRAIT CARICULTURE </span> FROM EFTA
          </div>
          <div className='font-poppins font-medium'>
            <p className='font-semibold text-xl' >And more Customized Gifts</p>
            Create your customized gifts and drawing and a <br />
            lot more other items with EFTA. <br />
            Have some beautiful moments. <br />
          
          </div>
          <button className='bg-[#1FB9E0] shadow-button_shadow py-4 px-12 rounded-[100px] text-white font-semibold text-[20px] w-52'>View All</button>
        </div>
        <div  className='relative overflow-hidden  w-1/4  h-full rounded-[8px] shadow-carossel_shadow  '>
        {
          items.map((item,index)=>(
            <motion.img 
            key={index} 
            src={item.path} 
            alt={item.id} 
            className='absolute object-cover h-full w-full'
            initial={{ opacity:0, x: 100 }}
            animate={{
            opacity: index === currentIndex ? 1 : 0,
            x: index === currentIndex ? 0 : 100,
          }}
          
          transition={{ duration: 1 }} />
            
          ))
        }
        </div>
        <div  className='relative overflow-hidden  w-1/4  h-full rounded-[8px] shadow-carossel_shadow '>
        {
          items.map((item,index)=>(
            <motion.img 
            key={index} 
            src={item.path} 
            alt={item.id} 
            className='absolute object-cover h-full w-full'
            initial={{ opacity: 0, x: 100 }}
            animate={{
            opacity: index === currentIndex ? 1 : 0,
            x: index === currentIndex ? 0 : 100,
          }}
          transition={{ duration: 1,delay:1 }} />
            
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default Portrait