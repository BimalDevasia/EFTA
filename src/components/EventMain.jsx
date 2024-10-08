import React from 'react'
import './homeFront'
function EventMain() {
  return (
    <div>
        <div className='h-screen w-screen mb-[100px] items-center flex '>
        <img src="./eventmain.png" alt="" className='absolute object-cover w-screen object-center' />
        <div className='z-10 px-24 flex flex-col gap-14'>
          <div className='flex flex-col gap-6'>
          <p className='text-4xl font-poppins font-semibold text-white'>Celebrate In</p>
          <p className='font-satisfy text-9xl font-normal text-white'>Style</p>
          </div>
          <button className='w-max bg-[#7C2EF9] shadow-button_shadow py-4 px-12 rounded-[100px] text-white font-semibold text-[20px]'>Shop Now</button>

        </div>
    </div>
    </div>
  )
}

export default EventMain