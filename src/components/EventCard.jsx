import { color } from 'framer-motion'
import React from 'react'

function EventCard() {
    const Items=[  {title:"Valentines day",link:"",color:""},{title:"Christmas",link:"",color:""},{title:"Haloween",link:"",color:""} ]

  return (
    <div className='pl-24 w-screen overflow-hidden flex gap-5'>
        {
            Items.map((item,index)=>(
                <div key={index}>
                    {item.title}
                </div>
            ))
        }
    </div>
  )
}

export default EventCard