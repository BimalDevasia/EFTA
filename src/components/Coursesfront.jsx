import React from 'react'
import "./homeFront.css"
function Coursesfront() {
  return (
    <div className='max-h-screen  h-screen w-screen  items-center flex'>
        <img src="./coursesfront.png" alt="" className='absolute object-cover w-screen object-center' />
        <div className='z-10 px-24 flex flex-col gap-14'>
          <div className='flex flex-col gap-6'>
          <p className='text-4xl font-poppins font-semibold text-white'>Unlock</p>
          <p className='font-satisfy text-9xl font-normal text-white'>Creativity</p>
          </div>
          <button className='w-max bg-gift_blue shadow-button_shadow py-4 px-12 rounded-[100px] text-white font-semibold text-[20px]'>Shop Now</button>

        </div>
    </div>
  )
}

export default Coursesfront