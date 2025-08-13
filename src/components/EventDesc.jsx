import React, { useState } from 'react'
import { cn } from "@/lib/utils";

function EventDesc() {
    const [check,setCheck]=useState(0);
    const items=[]
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