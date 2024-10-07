"use client"
import React from 'react'

function AdminGift() {

const resize=(textarea)=>{

    textarea.style.height = 'auto';  // Reset the height to auto
    textarea.style.height = textarea.scrollHeight + 'px';  // Set it to the scroll height

}

  return (
    <div className='flex w-screen h-auto '>
        <div className='w-40 px-5 flex flex-col gap-5 border-r-2  border-solid '>
            <img src="./product-image.png" alt=""  className='w-32 h-32 object-cover bg-no-repeat'/>
            <p className='font-poppins font-medium '>Coffee Mug</p>
        </div>
        <div className='flex-1 px-5 flex flex-col gap-[26px]'>
            <div className='flex justify-between items-center'>
                <p className='  text-nav_blue text-4xl font-poppins font-bold '>Gifts Details</p>
                <div className='flex gap-3'>
                    <button className='w-44 h-12 px-3 border-[#8300FF] border-2 font-poppins font-bold text-[#8300FF] text-xl'> Cancel</button>
                    <button className='w-44 h-12 px-3  bg-[#8300FF] font-poppins font-bold text-white text-xl  '> Save</button>
                </div>

            </div>

            <div>
                <div className='flex flex-col gap-2'>
                    <p className='font-poppins text-base font-light'>Product Name</p>
                    <textarea name="Product_Name" id="" rows={1} 
                    className='resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-xl font-medium font-poppins overflow-hidden'
                    onInput={(e)=>resize(e.target)}
                    ></textarea>
                </div>
            </div>
            <div>
                <div className='flex flex-col gap-2'>
                    <p className='font-poppins text-base font-light'>Description</p>
                    <textarea name="description" id="" rows={1} 
                    className='resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-normal font-poppins overflow-hidden'
                    onInput={(e)=>resize(e.target)}
                    ></textarea>
                </div>
            </div>

            <div>
                <div className='flex flex-col gap-2'>
                    <p className='font-poppins text-base font-light'>Product Details</p>
                    <textarea name="Product_Details" id="" rows={1} 
                    className='resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-medium  font-poppins overflow-hidden'
                    onInput={(e)=>resize(e.target)}
                    ></textarea>
                </div>
            </div>
                
            <div>
                <div className='flex flex-col gap-2'>
                    <p className='font-poppins text-base font-light'>Product Details</p>
                    <textarea name="Product_Category" id="" rows={1} 
                    className='resize-none border-[#0000004D] border-2 w-full border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-5 py-3 text-base font-medium  font-poppins overflow-hidden'
                    onInput={(e)=>resize(e.target)}
                    ></textarea>
                </div>
            </div>

            <div className='flex gap-7 items-center'>
                <div>
                <p className='font-poppins text-base font-light'>Product MRP</p>
                <textarea name="Product_MRP" id="" rows={1} 
                    className='resize-none border-[#0000004D] border-2 w-28 border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-2 py-3 text-base font-medium  font-poppins overflow-hidden'
                    onInput={(e)=>resize(e.target)}
                    ></textarea>
                </div>
                <div>
                <p className='font-poppins text-base font-light'>Offer Percentage</p>
                <textarea name="Offer_Percentage" id="" rows={1} 
                    className='resize-none border-[#0000004D] border-2 w-40 border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-2 py-3 text-base font-medium  font-poppins overflow-hidden'
                    onInput={(e)=>resize(e.target)}
                    ></textarea>
                </div>

                <p className='text-2xl font-poppins font-light'>OR</p>
                
                <div>
                <p className='font-poppins text-base font-light'>Offer Prize</p>
                <textarea name="Offer_Prize" id="" rows={1} 
                    className='resize-none border-[#0000004D] border-2 w-28 border-solid rounded-[8px] min-h-10 h-auto focus:outline-none px-2 py-3 text-base font-medium  font-poppins overflow-hidden'
                    onInput={(e)=>resize(e.target)}
                    ></textarea>
                </div>

                {/*  need image upload*/}


                

            </div>

        </div>
    </div>
  )
}

export default AdminGift