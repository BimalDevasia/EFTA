import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Morefromefta() {
  return (
    <div className='w-full h-auto flex flex-col gap-20'>
      <div className='w-full max-w-[1255px] mx-auto px-10 lg:px-8'>
        <div className='w-full flex justify-center font-poppins text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1F76BD]'>
                More form EFTA
        </div>
        <div className='flex lg:gap-8 '>
            <div className='relative lg:w-2/5 w-full h-[250px] sm:h-[300px] lg:h-[400px]'>
                <Image 
                  src="/party.png" 
                  alt="Party decoration" 
                  width={280} 
                  height={330} 
                  className='absolute top-0 left-0 z-10 w-[180px] h-[220px] sm:w-[220px] sm:h-[260px] lg:w-[280px] lg:h-[330px]'
                />
                <Image 
                  src="/drink.png" 
                  alt="Party drinks" 
                  width={280} 
                  height={330} 
                  className='absolute top-[80px] left-[120px] sm:top-[100px] sm:left-[140px] lg:top-[120px] lg:left-[180px] z-0 w-[180px] h-[220px] sm:w-[220px] sm:h-[260px] lg:w-[280px] lg:h-[330px]' 
                />
            </div>
            <div className='flex flex-col lg:gap-6 gap-1 lg:justify-normal justify-center'>
                <div className='text-[#1F76BD] text-xl sm:text-2xl lg:text-3xl font-semibold '>EFTA</div>
                <div className='text-xl sm:text-2xl lg:text-3xl text-[#1F76BD] font-bold leading-6'>EVENTS</div>
                <div className='text-sm sm:text-base lg:text-lg font-semibold font-poppins text-[#1F76BD] mb-2'>Discover. Connect. Celebrate.</div>
                <div className='text-xs sm:text-sm lg:text-base font-medium font-poppins '>Join our exclusive events designed to foster creativity, <br />
                learning, and community. From musical showcases to <br />
                insightful discussions, EFTA Events bring together <br />
                artists, educators, and enthusiasts in vibrant and <br />
                meaningful experiences.</div>
                <Link href='/eventpg' className='text-xs sm:text-sm lg:text-base text-[#1F76BD] font-poppins font-semibold cursor-pointer'> Know more</Link>
            </div>
        </div>
        <div className='flex w-full lg:gap-0 gap-4 mb-10 '>
        <div className='flex flex-col lg:gap-6 items-end w-3/5 lg:h-[400px] justify-center'>
                <div className='text-[#1F76BD] text-xl sm:text-2xl lg:text-3xl font-semibold'>EFTA</div>
                <div className='text-xl sm:text-2xl lg:text-3xl text-[#1F76BD] font-bold leading-6'>COURSES</div>
                <div className='text-sm sm:text-base lg:text-lg font-semibold font-poppins text-[#1F76BD] mb-2 text-right'>Learn from the Best. Grow with Passion.</div>
                <div className='text-xs sm:text-sm lg:text-base font-medium font-poppins text-right '>Explore our range of expertly curated courses in music, <br />
                arts, and beyond. Led by seasoned mentors and designed <br />
                for learners at all levels, our courses blend theory with <br />
                hands-on practice. Whether you're starting out or refining <br />
                your craft, EFTA Courses will help you thrive creatively <br />
                and professionally.</div>
                <Link href='/courses' className='text-xs sm:text-sm lg:text-base text-[#1F76BD] font-poppins font-semibold cursor-pointer'> Know more</Link>
            </div>
            <div className='flex justify-end w-2/5'>
                <Image 
                  src="/clock.png" 
                  alt="Course timing clock" 
                  width={130} 
                  height={155} 
                  className='lg:w-auto w-[130.85px] lg:h-auto h-[155.49px]'
                />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Morefromefta