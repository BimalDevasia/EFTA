import React from 'react'
import Image from 'next/image'

function Eventdetails() {
  return (
    <div className='flex justify-center w-full lg:h-screen lg:mb-0 mb-[350px] lg:mt-20 overflow-hidden'>
    <div className=' lg:px-24 px-8 h-auto flex gap-6 justify-center lg:flex-row flex-col-reverse '>
        <div className='lg:w-[620px] w-full relative flex justify-center'>
        <Image 
          src="/marriage1.png" 
          alt="Marriage celebration 1" 
          width={300} 
          height={389} 
          className='absolute left-0 lg:top-10 lg:w-[300px] lg:h-[389px] w-[156.72px] h-[194.97px]'
          loading="lazy"
          sizes="(max-width: 768px) 157px, 300px"
        />
        <Image 
          src="/marriage2.png" 
          alt="Marriage celebration 2" 
          width={280} 
          height={443} 
          className='absolute right-0 lg:bottom-10 lg:top-auto top-20 lg:w-[280px] lg:h-[443px] w-[147.81px] h-[221.71px]'
          loading="lazy"
          sizes="(max-width: 768px) 148px, 280px"
        />
        </div>
        <div className='lg:w-[500px] w-full flex-col flex justify-center lg:h-full gap-5'> 
            <p className='font-italiana lg:text-6xl text-[32px] w-full flex justify-center'>EXCLUSIVE EVENTS</p>
            <p className='font-poppins font-light lg:text-xl text-[12px] text-center'>Celebrate life&apos;s special milestones with our exclusive events, tailored for unforgettable moments like Bride-to-Be celebrations, Haldi ceremonies, and more. We specialize in crafting elegant, personalized experiences that honor tradition while adding a modern, luxurious touch. From intimate gatherings to lavish affairs, we ensure every detail is handled with care, creating magical memories for you and your loved ones in a truly exclusive setting</p>
        </div>
    </div>
    </div>


    

  )
}

export default Eventdetails