import React from 'react'

function Morefromefta() {
  return (
    <div className='px-36 w-screen h-auto  flex flex-col gap-20 '>
        <div className='w-full flex justify-center font-poppins text-4xl font-semibold text-nav_blue'>
                More form EFTA
        </div>
        <div className='flex gap-8'>
            <div className='relative w-2/5 h-[400px] '>
                <img src="./party.png" alt="" srcset="" />
                <img src="./drink.png" alt="" srcset="" className='absolute top-1/2 left-1/2 transform -translate-x-1/2' />
            </div>
            <div className='flex flex-col gap-6'>
                <div className='text-nav_blue text-5xl font-semibold'>EFTA</div>
                <div className='text-[87px] text-nav_blue font-bold leading-[50px]'>EVENTS</div>
                <div className='text-lg  font-medium font-poppins '>Create your Brand showing materials like <br />
                T-shirt, ID cards, Cap, Notepad.... and a lot <br />
                more with best price with EFTA. <br />
                Show your Brand everywhere.</div>
                <p className='text-xl text-nav_blue font-poppins font-semibold '> Know more</p>
            </div>
        </div>
        <div className='flex w-full  '>
        <div className='flex flex-col gap-6 items-end w-4/5 h-[400px] justify-center'>
                <div className='text-nav_blue text-5xl font-semibold'>EFTA</div>
                <div className='text-[87px] text-nav_blue font-bold leading-[50px]'>COURSES</div>
                <div className='text-lg  font-medium font-poppins text-right '>Create your Brand showing materials like <br />
                T-shirt, ID cards, Cap, Notepad.... and a lot <br />
                more with best price with EFTA. <br />
                Show your Brand everywhere.</div>
                <p className='text-xl text-nav_blue font-poppins font-semibold '> Know more</p>
            </div>
            <div className='flex justify-end w-2/5'>
                <img src="./clock.png" alt="" />
            </div>
        </div>
    </div>
  )
}

export default Morefromefta