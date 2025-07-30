import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Morefromefta() {
  return (
    <div className='px-10 lg:px-8 w-full h-auto  flex flex-col gap-20 '>
        <div className='w-full flex justify-center font-poppins text-3xl font-semibold text-[#1F76BD]'>
                More form EFTA
        </div>
        <div className='flex lg:gap-8 '>
            <div className='relative lg:w-2/5 w-full  lg:h-[400px] '>
                <Image 
                  src="/party.png" 
                  alt="Party decoration" 
                  width={115} 
                  height={136} 
                  className='lg:w-auto lg:h-auto w-[115px] h-[136px]'
                />
                <Image 
                  src="/drink.png" 
                  alt="Party drinks" 
                  width={115} 
                  height={136} 
                  className='absolute top-1/2 left-1/2 transform -translate-x-1/2 lg:w-auto lg:h-auto w-[115px] h-[136px]' 
                />
            </div>
            <div className='flex flex-col lg:gap-6 gap-1 lg:justify-normal justify-center'>
                <div className='text-[#1F76BD] text-3xl font-semibold '>EFTA</div>
                <div className='text-3xl text-[#1F76BD] font-bold leading-6'>EVENTS</div>
                <div className='text-base font-medium font-poppins '>Create your Brand showing materials like <br />
                T-shirt, ID cards, Cap, Notepad.... and a lot <br />
                more with best price with EFTA. <br />
                Show your Brand everywhere.</div>
                <Link href='/eventpg' className='text-base text-[#1F76BD] font-poppins font-semibold cursor-pointer'> Know more</Link>
            </div>
        </div>
        <div className='flex w-full lg:gap-0 gap-4 mb-10 '>
        <div className='flex flex-col lg:gap-6 items-end w-3/5 lg:h-[400px] justify-center'>
                <div className='text-[#1F76BD] text-3xl font-semibold'>EFTA</div>
                <div className='text-3xl text-[#1F76BD] font-bold leading-6'>COURSES</div>
                <div className='text-base font-medium font-poppins text-right '>Create your Brand showing materials like <br />
                T-shirt, ID cards, Cap, Notepad.... and a lot <br />
                more with best price with EFTA. <br />
                Show your Brand everywhere.</div>
                <Link href='/courses' className='text-base text-[#1F76BD] font-poppins font-semibold cursor-pointer'> Know more</Link>
            </div>
            <div className='flex justify-end w-2/5'>
                <Image 
                  src="/clock.png" 
                  alt="Course timing clock" 
                  width={130} 
                  height={155} 
                  className='lg:w-auto w-[130.85px] lg:h-auto h-[155.49px]'
                />
            </div>
        </div>
    </div>
  )
}

export default Morefromefta