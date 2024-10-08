import React from 'react'

function Eventdetails() {
  return (
    <div className='flex justify-center w-screen h-screen py-20'>
    <div className=' px-24 h-screen flex gap-6 justify-center '>
        <div className='w-[620px] relative justify-center'>
        <img src="./marriage1.png" alt="" className='absolute left-0 top-10 w-[300px] h-[389px]'/>
        <img src="./marriage2.png" alt="" className='absolute right-0 bottom-10 w-[280px] h-[443px]' />
        </div>
        <div className='w-[500px] flex-col flex justify-center h-full gap-5'> 
            <p className='font-italiana text-6xl w-full'>EXCLUSIVE EVENTS</p>
            <p className='font-poppins font-light text-xl text-center'>Celebrate life's special milestones with our exclusive events, tailored for unforgettable moments like Bride-to-Be celebrations, Haldi ceremonies, and more. We specialize in crafting elegant, personalized experiences that honor tradition while adding a modern, luxurious touch. From intimate gatherings to lavish affairs, we ensure every detail is handled with care, creating magical memories for you and your loved ones in a truly exclusive setting</p>
        </div>
    </div>
    </div>
  )
}

export default Eventdetails