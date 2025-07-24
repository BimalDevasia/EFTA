"use client"
import React from 'react'
import Image from 'next/image'

const EventAbout = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className='relative w-screen h-screen'>
            <div className='relative flex flex-col lg:w-3/5 w-screen lg:mt-0 lg:justify-center lg:pl-28 px-10 lg:h-full h-max'>
                <div className='font-poppins'>
                    <p className='lg:text-5xl text-3xl font-medium text-[#7C2EF9] font-italiana'>About Us</p>
                    <p className='lg:w-8/12 pt-5 lg:text-xl text-xs'>We would love to be known as a happiness-quotient booster service company!</p>
                </div>
            </div>
            <div className='absolute right-0 lg:top-1/2 lg:mt-0 mt-56 translate-y-[-50%] lg:w-6/12 lg:h-[70%] h-[295px] w-[90%] rounded-l-full'>
                <Image 
                    src="/party2.png" 
                    alt="Party celebration" 
                    fill 
                    className="object-cover rounded-l-full"
                    loading="lazy"
                    sizes="(max-width: 768px) 90vw, 50vw"
                />
            </div>
        </div>
    )
})

EventAbout.displayName = 'EventAbout'
export default EventAbout