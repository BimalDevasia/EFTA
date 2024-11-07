import React from 'react'

function community() {
  return (
    <div className=' h-screen w-screen pt-20'>
        
        <div className='flex flex-col gap-5 items-center'>
           <div className=' relative w-full h-max text-shadow-custom-light shadow-text-shadow flex flex-col bg-custom-gradient z-10 bg-clip-text text-transparent font-poppins lg:leading-[131px] leading-[32px] text-3xl font-semibold lg:text-9xl text-center'>
           <img src="./person.png" className='absolute left-72 top-[-12%] lg:w-auto lg:h-auto h-[43px] w-[40px]' alt="" />
           <img src="./person.png" className='absolute right-72 top-[-12%] lg:w-auto lg:h-auto h-[43px] w-[40px] transform scale-x-[-1]' alt="" />
            <div>Meet Our</div>
            <div>Creative Community</div>
            </div> 
           <div className='lg:text-2xl text-lg font-poppins font-normal text-center w-3/4 text-primary_color'>
           Behind every custom gift at EDTA is a vibrant community of artisans, designers, and makers who bring your ideas to life. Our team is a diverse group of talented individuals who share a passion for creativity and craftsmanship.
           </div>
        </div>
        </div>
  )
}

export default community