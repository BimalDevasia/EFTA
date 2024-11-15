import React from 'react'
import "./homeFront.css"
import { MdKeyboardArrowDown } from "react-icons/md";
function Coursesfront() {
  return (
    <div className='max-h-svh  h-svh w-screen  items-center flex '>
        <img src="./coursesfront.png" alt="" className='absolute object-cover w-screen h-full object-center ' />
        <div className='z-10 px-24 flex flex-col gap-14'>
          <div className='flex flex-col gap-6'>
          <p className='text-4xl font-poppins font-semibold text-white'>Unlock</p>
          <p className='font-satisfy text-9xl font-normal text-white'>Creativity</p>
          </div>
          <button className='w-max bg-gift_blue shadow-button_shadow py-4 px-12 rounded-[100px] text-white font-semibold text-[20px]'>Shop Now</button>
          <p className='absolute bottom-10 text-white font-poppins font-semibold cursor-pointer left-[50%] translate-x-[-50%] flex items-center gap-2'>Scroll down <MdKeyboardArrowDown /> </p>

        </div>
    </div>
  )
}

export default Coursesfront