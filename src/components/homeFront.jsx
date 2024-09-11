import React from 'react'
import "./homeFront.css"
function HomeFront() {
  return (
    <div className='relative flex flex-col justify-center items-center h-screen w-screen font-poppins gap-14 overflow-hidden '>
      <div className='absolute top-24 left-24 z-0'><img src="./love.svg" alt="love" className='max-w-full h-auto' /></div>
      <div className='absolute top-32 right-32 z-0'><img src="./gift.svg" alt="gift" className='max-w-full h-auto' /></div>
      <div className='w-full h-max text-shadow-custom-light shadow-text-shadow flex flex-col bg-custom-gradient z-10 bg-clip-text text-transparent font-poppins leading-[155px] font-semibold text-[126px] text-center'>
        <div>Creating Bonds</div>
        <div>Gifting Happiness</div>
      </div>
      <div className='flex gap-14'>
        <button className='bg-primary_color shadow-button_shadow py-4 px-12 rounded-[100px] text-white font-semibold text-[20px]'>Shop Now</button>
        <button className='bg-white bg-clip-border py-4 px-12 rounded-[100px] text-primary_color border-primary_color border-dashed border-2 font-semibold text-[20px]'>Know More</button>
      </div>
     
    </div>
  )
}

export default HomeFront
