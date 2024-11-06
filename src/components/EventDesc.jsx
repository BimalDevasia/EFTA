import React, { useState } from 'react'
import { cn } from "@/lib/utils";

function EventDesc() {
    const [check,setCheck]=useState(0);
    const items=[{title:"Birthday Celebration",desc:"Make every birthday unforgettable with our expert event planning! From intimate gatherings to grand celebrations, we specialize in creating personalized and memorable experiences tailored to your unique vision. Let us handle every detail, ensuring a stress-free and joyful day filled with laughter, love, and lasting memories.",link1:"./birthday1.png",link2:"./birthday2.png",link3:"./birthday3.png"},
        {title:"Marriage Celebration",desc:"Turn your dream wedding into reality with our dedicated event planning services! From stunning venues to personalized details, we ensure every moment of your special day is flawlessly executed. Whether it’s a grand celebration or an intimate ceremony, we handle everything with care, so you can focus on celebrating love and creating unforgettable memories.",link1:"./marr1.png",link2:"./marr2.png",link3:"./marr3.png"},
        {title:"Music Events",desc:"Bring the rhythm to life with our expertly curated music events! Whether it’s a concert, festival, or intimate live performance, we specialize in creating electrifying atmospheres that captivate audiences. From stage design to sound perfection, we handle every detail to ensure a seamless, unforgettable experience where music takes center stage",link1:"./music1.png",link2:"./music2.png",link3:"./music3.png"}
    ]
  return (
            <>
                {items.map((item,index)=>{
                    const alignment = index % 2 === 0 ? "second" : "first";
                    return(
                        <div
                        key={index}
                        className={cn(
                          "flex",
                          alignment === "first" ? "flex-row-reverse" : "flex-row")}
                        >
                            
                            <div className='h-screen w-screen'>

                            </div>


                        </div>
                    )
                })}            
            </>
)
}

export default EventDesc