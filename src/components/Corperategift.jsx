'use client'
import React,{ useState, useEffect ,forwardRef} from 'react'
import { motion } from 'framer-motion';

const Corperategift=forwardRef((props,ref)=> {

  const [currentIndex, setCurrentIndex] = useState(0);

 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const items = [
    {id:"t-shirt",path:"/t-shirt.png"},
    {id:"Id cards",path:"/ID-cards.png"},
    // {id:"template",path:"/template1.png"}
  ]

  return (
  <>
    

  <div ref={ref} className='px-36 w-screen h-screen flex flex-col justify-center items-center overflow-hidden mt-10'>
  <div className='flex justify-between w-full items-center pb-6 text-gift_blue'>
        <p className='font-poppins font-semibold text-3xl'>Corporate  Gifts</p>
        <p className='font-poppins font-semibold text-base'>View All</p>
    </div>
      <div className='w-full bg-[#FFBDCB59] h-[450px] rounded-2xl flex gap-4 justify-center py-9'>
        <div className='w-2/5  h-full rounded-[8px]  px-2 flex flex-col justify-around'>
        <div className='text-4xl font-poppins break-normal font-light'>
          CREATE YOUR <span className='text-6xl font-caveat break-words font-bold'>BRAND ITEMS </span> FROM EFTA
          </div>
          <div className='font-poppins font-medium'>
          Create your Brand showing materials like <br />
        T-shirt, ID cards, Cap, Notepad.... and a lot <br />
          more with best price with EFTA. <br />
          Show your Brand everywhere.
          </div>
          <button className='bg-primary_color shadow-button_shadow py-4 px-12 rounded-[100px] text-white font-semibold text-[20px] w-52'>View All</button>
        </div>
        <div  className='relative overflow-hidden  w-1/4  h-full rounded-[8px] shadow-carossel_shadow '>
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
          exit={{ opacity: 1, x: 0}}
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
  </>
    
  )
})
Corperategift.displayName='Corperategift'
export default Corperategift