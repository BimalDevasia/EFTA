import React from 'react'
import Image from 'next/image'
import './homeFront.css'
function offers() {

  const offers=[
    {title:"Luxury Gift Hampers",discount:"20",src:"/gift.png"},
  ]
  return (
    <div className='lg:px-36 px-10 w-full h-screen overflow-hidden flex flex-col gap-8 items-center'>
      <div>
        <div className='text-4xl font-semibold font-poppins text-[#8300FF] pb-10 '>Grab some Offers</div>
        <div className='grid lg:grid-rows-[repeat(2,170px)] grid-rows-[repeat(4,115px)] grid-cols-[repeat(2,155px)] lg:grid-cols-[repeat(5,232px)] gap-5'>
            <div className='relative row-span-2 lg:col-span-3 col-span-2 bg-[#F85556] rounded-[8px] flex overflow-hidden'> 
              <div className=' w-1/2 pl-11 flex flex-col h-full justify-center gap-3'>

              <div className=' absolute lg:right-[-40px] lg:bottom-[-100px] right-[-50px] bottom-0 rounded-full bg-[#FF6C6D] lg:w-[400px] lg:h-[400px] w-[220px] h-[220px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FF6C6D] lg:w-[400px] lg:h-[400px] h-[220px] w-[220px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FF8687] lg:w-[350px] lg:h-[350px] h-[180px] w-[180px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FFA3A4] lg:w-[300px] lg:h-[300px] h-[140px] w-[140px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FFBDBD] lg:w-[250px] lg:h-[250px] h-[100px] w-[100px] flex justify-center items-center'></div>
              </div>
              </div>
              </div>
             
              </div>
              
                <div className='flex flex-col flex-start'>
                  <p className='lg:text-4xl text-base text-white font-bold font-poppins'>
                    EFTA
                  </p>
                  <p className='lg:text-8xl text-[43px] leading-[30px] font-caveat font-bold text-white ml-[-20px] lg:leading-[70px]'>CAKES</p>

                </div>
                <div className='text-white '>
                  <p className='lg:text-2xl text-xs font-medium font-poppins'>LOVE AT FIRST BITE</p>
                  <p className='lg:text-[16px]  text-[8px] font-medium font-poppins'>Taste the Best Homemade cakes from EFTA CAKES. Celebrate the best Moments with some sweetness. </p>
                </div>
                <button className='bg-white shadow-white-button py-4 px-12 rounded-[100px] text-primary_color font-semibold text-[20px] w-52 font-poppins'>Order Now</button>

              </div>
              <Image 
                src="/cake.png" 
                alt="EFTA cake" 
                width={160} 
                height={192} 
                className='z-10 lg:pl-5 lg:w-auto lg:h-auto w-40 h-48 lg:relative absolute right-[-15px] bottom-7'
              />
            </div>
            <div className='relative col-span-2 bg-[#EC5601] rounded-[8px] overflow-hidden '>

              {offers.map((offer,index)=>(
                <div key={index} className=' w-1/2 h-full justify-center items-center flex flex-col gap-3'>

              <div className=' absolute right-[-80px]  rounded-full bg-[#FF6C6D] w-[350px] h-[350px] flex justify-center items-center z-0'>
              <div className=' rounded-full bg-[#FF6C6D] w-[350px] h-[350px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FF8687] w-[300px] h-[300px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FFA3A4] w-[250px] h-[250px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FFBDBD] w-[200px] h-[200px] flex justify-center items-center'></div>
              </div>
              </div>
              </div>
             
              </div>

                  <div className='text-2xl font-bold font-poppins text-white pl-8 z-10'>{offer.title}</div>
                  <div className='text-5xl font-bold text-white font-poppins z-10'> <span className='text_stroke text-transparent text-5xl font-poppins font-bold'>{offer.discount}%</span> off</div>
                  <Image 
                    src={offer.src} 
                    alt={offer.title} 
                    width={200} 
                    height={170} 
                    className='absolute right-0 max-h-full' 
                  />
                </div>
               ))}
              
              </div>
            <div className=' relative bg-[#FF01FF] rounded-[8px] overflow-hidden flex'>
            <div className=' absolute right-[-40px] bottom-[-60px] rounded-full bg-[#FF6C6D] w-[200px] h-[200px] flex justify-center items-center z-0'>
              <div className=' rounded-full bg-[#FF6C6D] w-[200px] h-[200px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FF8687] w-[180px] h-[180px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FFA3A4] w-[160px] h-[160px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FFBDBD] w-[140px] h-[140px] flex justify-center items-center'></div>
              </div>
              </div>
              </div>
             
              </div>
              <div className='w-1/2 flex flex-col justify-end p-4 h-full'>
                <p className='z-10 text-white text-2xl font-poppins font-bold'>Wall <br /> Hangings</p>
              </div>
              <Image 
                src="/hanging.png" 
                alt="Wall hanging decoration"  
                width={120} 
                height={140} 
                className='absolute right-1 w-[120px] h-[140px] z-10'
              />
            </div>
            <div className='relative bg-[#7A61FF] rounded-[8px] overflow-hidden p-4 z-0 '>

            <div className='text-2xl font-bold text-white font-poppins '>
              <p className='z-10'> Chocolate  <br />Treat</p>
            </div>
            <div className=' absolute right-[-30px] bottom-[-40px] rounded-full bg-[#8871FF] w-[180px] h-[180px] flex justify-center items-center -z-30'>
              <div className=' rounded-full bg-[#8871FF] w-[180px] h-[180px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#9683FF] w-[160px] h-[160px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#A493FF] w-[140px] h-[140px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#BDB1FF] w-[120px] h-[120px] flex justify-center items-center'></div>
              </div>
              </div>
              </div>
             
              </div>
            <Image 
              src="/chocolate.png" 
              alt="Chocolate treat" 
              width={100} 
              height={100} 
              className='absolute right-0 top-5' 
            />
            </div>

        </div>
        </div>
    </div>
  )
}

export default offers