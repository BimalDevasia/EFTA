import React from 'react'
import Image from 'next/image'

function community() {
  return (
    <div className=' h-screen w-screen pt-20'>
        
        <div className='flex flex-col gap-5 items-center'>
           <div className=' relative w-full h-max text-shadow-custom-light shadow-text-shadow flex flex-col bg-custom-gradient z-10 bg-clip-text text-transparent font-poppins font-semibold text-center [text-shadow:_4px_4px_10px_rgb(0_0_0_/_0.06)] text-[clamp(1.5rem,6vw,7.875rem)] leading-[clamp(1.8rem,7vw,9.6875rem)]'>
           <Image src="/person.png" className='absolute left-[28%] top-[-20%] sm:top-[-20%] sm:left-[28%] md:top-[-20%] md:left-[28%] lg:top-[-20%] lg:left-[28%]   w-[clamp(60px,8vw,120px)] h-[clamp(65px,8.7vw,131px)]' alt="person" width={120} height={131} />
           <Image src="/person.png" className='absolute right-[28%] top-[-20%] sm:top-[-20%] sm:right-[28%]  md:top-[-20%] md:right-[28%]  lg:top-[-20%] lg:right-[28%]  w-[clamp(60px,8vw,120px)] h-[clamp(65px,8.7vw,131px)] transform scale-x-[-1]' alt="person" width={120} height={131} />
            <div className="whitespace-nowrap">Meet Our</div>
            <div className="whitespace-nowrap">Creative Community</div>
            </div> 
           <div className='text-sm md:text-lg lg:text-2xl font-poppins font-normal text-center w-[90%] md:w-3/4 text-primary_color px-4'>
           Behind every custom gift at EFTA is a vibrant community of artists, designers, and makers - including students, professionals, and individuals with disabilities - who bring your ideas to life. Our diverse team shares a deep passion for creativity and craftsmanship, celebrating the unique stories and perspectives of artisans from all walks of life. Whether you're looking for a one-of-a-kind piece or a personalized gift, you can trust that it was created with care, attention to detail, and a genuine love for the art of making. Each EFTA purchase supports the livelihoods of our incredible artisan community and fuels their continued growth and success.
           </div>
        </div>
        </div>
  )
}

export default community