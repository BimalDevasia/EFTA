import React from 'react'
import Image from 'next/image'

function community() {
  return (
    <div className='min-h-screen w-screen py-20 flex items-center justify-center'>
        
        <div className='flex flex-col gap-5 items-center px-10 lg:px-8 w-full'>
           <div className='relative w-full h-max flex flex-col font-poppins font-semibold text-center text-[clamp(1.5rem,6vw,7.875rem)] leading-[clamp(1.8rem,7vw,9.6875rem)] py-8 md:py-12'>
            {/* Meet Our text with vectors in same line */}
            <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-12">
              <Image src="/person.png" className='w-[clamp(50px,8vw,100px)] h-[clamp(55px,8.5vw,115px)] z-20' alt="person" width={120} height={131} />
              <div className="text-purple-600" style={{
                background: 'linear-gradient(249.81deg, #8300FF -9.71%, #FB718B 61.86%, #FA6D47 105.74%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                <div className="whitespace-nowrap">Meet Our</div>
              </div>
              <Image src="/person.png" className='w-[clamp(50px,8vw,100px)] h-[clamp(55px,8.5vw,115px)] transform scale-x-[-1] z-20' alt="person" width={120} height={131} />
            </div>
            
            {/* Creative Community text */}
            <div className="text-purple-600" style={{
              background: 'linear-gradient(249.81deg, #8300FF -9.71%, #FB718B 61.86%, #FA6D47 105.74%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              <div className="whitespace-nowrap">Creative Community</div>
            </div>
            </div> 
           <div className='text-sm md:text-lg lg:text-2xl font-poppins font-normal text-center w-[90%] md:w-3/4 text-primary_color mt-4 md:mt-6'>
           Behind every custom gift at EFTA is a vibrant community of artists, designers, and makers - including students, professionals, and individuals with disabilities - who bring your ideas to life. Our diverse team shares a deep passion for creativity and craftsmanship, celebrating the unique stories and perspectives of artisans from all walks of life. Whether you're looking for a one-of-a-kind piece or a personalized gift, you can trust that it was created with care, attention to detail, and a genuine love for the art of making. Each EFTA purchase supports the livelihoods of our incredible artisan community and fuels their continued growth and success.
           </div>
        </div>
        </div>
  )
}

export default community