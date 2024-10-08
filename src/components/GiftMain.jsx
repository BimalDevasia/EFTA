import React from 'react'

function GiftMain() {
  return (
    <div className='h-screen w-screen mb-[200px] items-center flex'>
        <img src="./giftmain.png" alt="" className='absolute object-cover w-screen object-center' />
        <div className='z-10 px-24 flex flex-col gap-14'>
          <div className='flex flex-col gap-6'>
          <p className='text-4xl font-poppins font-semibold text-white'>Surprise your</p>
          <p className='font-satisfy text-9xl font-normal text-white'>Valentine</p>
          </div>
          <button className='w-max bg-primary_color shadow-button_shadow py-4 px-12 rounded-[100px] text-white font-semibold text-[20px]'>Shop Now</button>

        </div>
    </div>
  )
}

export default GiftMain