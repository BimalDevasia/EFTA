'use client'
import React,{ useState, useEffect ,forwardRef} from 'react'
import { motion } from 'framer-motion';

const Corperategift=forwardRef((props,ref)=> {

  const [currentIndex, setCurrentIndex] = useState(0);

 
  const items = [
    {id:"t-shirt",path:"/t-shirt.png"},
    {id:"Id cards",path:"/ID-cards.png"},
    // {id:"template",path:"/template1.png"}
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
  <>
    

  <div ref={ref} className='px-10 lg:px-8 w-full  h-auto flex justify-center  flex-col items-center overflow-hidden  lg:py-32 py-12'>
  <div className='flex justify-between w-full items-center pb-6 text-[#1F76BD]'>
        <p className='font-poppins font-semibold text-3xl'>Corporate  Gifts</p>
        <p className='font-poppins font-semibold text-sm lg:text-base'>View All</p>
    </div>
      <div className='lg:w-full w-full max-w-[1255px] bg-[#FFBDCB59] lg:h-[450px] h-auto rounded-2xl flex lg:flex-row flex-col lg:gap-4 gap-10 justify-center py-9 px-10 lg:px-8'>
        <div className='lg:w-2/5 w-full  h-full rounded-[8px]  px-2 flex flex-col justify-around lg:gap-0 gap-10'>
        <div className='lg:text-4xl text-2xl font-poppins break-normal font-light'>
          CREATE YOUR <span className='lg:text-6xl text-3xl font-caveat break-words font-bold'>BRAND ITEMS </span> FROM EFTA
          </div>
          <div className='font-poppins font-medium lg:text-base text-xs'>
          Create your Brand showing materials like <br />
        T-shirt, ID cards, Cap, Notepad.... and a lot <br />
          more with best price with EFTA. <br />
          Show your Brand everywhere.
          </div>
          <button className='bg-primary_color shadow-button_shadow lg:py-4 px-6  py-2 lg:px-12 rounded-[100px] text-white font-semibold text-sm lg:text-base lg:w-52 w-28'>View All</button>
        </div>

        <div className='lg:w-[60%] w-full lg:h-full h-[200px] flex gap-4 '>
        <div  className='relative overflow-hidden  lg:w-2/3 w-1/2  h-full rounded-[8px] shadow-carossel_shadow '>
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
        <div  className='relative overflow-hidden  lg:w-2/3 w-1/2  h-full rounded-[8px] shadow-carossel_shadow'>
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
    </div>
  </>
    
  )
})
Corperategift.displayName='Corperategift'
export default Corperategift