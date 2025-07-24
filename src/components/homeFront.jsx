import React from 'react'
import "./homeFront.css"
import Link from 'next/link'
import Image from 'next/image'

function HomeFront() {
  return (
    <div className='relative flex flex-col justify-center items-center min-h-screen w-full font-poppins gap-14 overflow-hidden '>
      <div className='absolute lg:top-24 lg:left-24 top-24 left-5 z-0'>
        <Image src="/love.svg" alt="love" width={120} height={120} className='max-w-full h-auto' />
      </div>
      <div className='absolute lg:top-32 lg:right-32 bottom-24 right-5 z-0'>
        <Image src="/gift.svg" alt="gift" width={120} height={120} className='max-w-full h-auto' />
      </div>
      <div className='w-full h-max  text-shadow-custom-light shadow-text-shadow flex flex-col lg:justify-normal lg:items-center justify-center items-center bg-custom-gradient z-10 bg-clip-text text-transparent font-poppins font-semibold text-center [text-shadow:_4px_4px_10px_rgb(0_0_0_/_0.06)] text-[clamp(2rem,8vw,7.875rem)] leading-[clamp(2.375rem,9.5vw,9.6875rem)]'>
        <div>Creating Bonds</div>
        <div>Gifting Happiness</div>
      </div>
      <div className='flex gap-14'>
        <Link href="/gifts"> <button className='bg-primary_color shadow-button_shadow lg:py-4 py-2 lg:px-12 px-6 rounded-[100px] text-white font-semibold lg:text-[20px] text-[14px]'>Shop Now</button> </Link>
        <button className='bg-white bg-clip-border lg:py-4 py-2 lg:px-12 px-6 rounded-[100px] text-primary_color border-primary_color border-dashed border-2 font-semibold lg:text-[20px] text-[14px]'>Know More</button>
      </div>
     
    </div>
  )
}

export default HomeFront
