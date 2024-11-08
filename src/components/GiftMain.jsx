import React from 'react'

function GiftMain() {
  return (
    <div className='h-screen w-screen lg:mb-[200px] mb-10 items-center flex'>
        <img src="./giftmain.png" alt="" className='absolute object-cover w-screen lg:h-auto h-screen object-center' />
        <div className='z-10 lg:px-24 px-10 flex flex-col gap-14'>
          <div className='flex flex-col gap-6'>
          <p className='lg:text-4xl text-sm font-poppins font-semibold text-white'>Surprise your</p>
          <p className='font-satisfy lg:text-9xl text-6xl font-normal text-white'>Valentine</p>
          </div>
          <button className='w-max bg-primary_color shadow-button_shadow lg:py-4 lg:px-12 py-3 px-8 rounded-[100px] text-white font-semibold text-sm lg:text-[20px]'>Shop Now</button>

        </div>
    </div>
  )
}

export default GiftMain