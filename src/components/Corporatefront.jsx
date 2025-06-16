import React from 'react'
import Image from 'next/image'
import { MdKeyboardArrowDown } from "react-icons/md";
import "./homeFront.css"
function Coperatefront({click}) {
  return (
    <div className='relative h-svh w-screen lg:mb-5 mb-10 items-center flex '>
        <Image 
          src="/coperatefront.png" 
          alt="Corporate front background" 
          fill
          className='object-cover object-center' 
          priority
        />
        <div className='z-10 lg:px-24 px-10 flex flex-col gap-14'>
          <div className='flex flex-col gap-6'>
          <p className='lg:text-4xl text-sm font-poppins font-semibold text-white'>Brand your</p>
          <p className='font-satisfy lg:text-9xl text-6xl font-normal text-white'>Company</p>
          </div>
          <button className='w-max bg-gift_blue shadow-button_shadow lg:py-4 lg:px-12 py-3 px-8 rounded-[100px] text-white font-semibold text-sm lg:text-[20px]'>Shop Now</button>
          <p onClick={click} className='absolute bottom-10 text-white font-poppins font-semibold cursor-pointer left-[50%] translate-x-[-50%] flex items-center gap-2'>Scroll down <MdKeyboardArrowDown /> </p>

        </div>
    </div>
  )
}

export default Coperatefront