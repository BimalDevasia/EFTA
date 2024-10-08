import React from 'react'
import './homeFront.css'
function offers() {

  const offers=[
    {title:"Luxury Gift Hampers",discount:"20",src:"./gift.png"},
  ]
  return (
    <div className='px-36 w-screen h-screen overflow-hidden flex flex-col gap-8 items-center'>
      <div>
        <div className='text-4xl font-semibold font-poppins text-[#8300FF] '>Grab some Offers</div>
        <div className='grid grid-rows-[repeat(2,170px)] grid-cols-[repeat(5,232px)] gap-5'>
            <div className='relative row-span-2 col-span-3 bg-[#F85556] rounded-[8px] flex overflow-hidden'> 
              <div className=' w-1/2 pl-11 flex flex-col h-full justify-center gap-3'>

              <div className=' absolute right-[-40px] bottom-[-100px] rounded-full bg-[#FF6C6D] w-[400px] h-[400px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FF6C6D] w-[400px] h-[400px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FF8687] w-[350px] h-[350px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FFA3A4] w-[300px] h-[300px] flex justify-center items-center'>
              <div className=' rounded-full bg-[#FFBDBD] w-[250px] h-[250px] flex justify-center items-center'></div>
              </div>
              </div>
              </div>
             
              </div>
              
                <div className='flex flex-col flex-start'>
                  <p className='text-4xl text-white font-bold font-poppins'>
                    EFTA
                  </p>
                  <p className='text-8xl font-caveat font-bold text-white ml-[-20px] leading-[70px]'>CAKES</p>

                </div>
                <div className='text-white '>
                  <p className='text-2xl font-medium font-poppins'>LOVE AT FIRST BITE</p>
                  <p className='text-[16px] font-medium font-poppins'>Taste the Best Homemade cakes from EFTA CAKES. Celebrate the best Moments with some sweetness. </p>
                </div>
                <button className='bg-white shadow-white-button py-4 px-12 rounded-[100px] text-primary_color font-semibold text-[20px] w-52 font-poppins'>Order Now</button>

              </div>
              <img src="./cake.png" alt="" srcset="" className='z-10 pl-5'/>
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
                  <img src={offer.src} alt="" className='absolute right-0 max-h-full' />
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
              <img src="./hanging.png" alt=""  className='absolute right-1 w-[120px] h-[140px] z-10'/>
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
            <img src="./chocolate.png" alt="" className='absolute right-0 top-5' />
            </div>

        </div>
        </div>
    </div>
  )
}

export default offers