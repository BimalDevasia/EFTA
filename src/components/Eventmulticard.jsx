import React from 'react'
import Cardcomponent from '@/components/Cardcomponent'
function Eventmulticard() {
    const item=[{title:"Birthday Celebration",desc:"Make every birthday unforgettable with our expert event planning! From intimate gatherings to grand celebrations, we specialize in creating personalized and memorable experiences tailored to your unique vision. Let us handle every detail, ensuring a stress-free and joyful day filled with laughter, love, and lasting memories.",image1:"/pic1.png",image2:"/pic2.png",image3:"/pic3.png"},
        {title:"Marriage Celebration",desc:"Turn your dream wedding into reality with our dedicated event planning services! From stunning venues to personalized details, we ensure every moment of your special day is flawlessly executed. Whether it’s a grand celebration or an intimate ceremony, we handle everything with care, so you can focus on celebrating love and creating unforgettable memories.",image1:"/pic4.png",image2:"/pic5.png",image3:"/pic6.png"},
        {title:"Music Events",desc:"Bring the rhythm to life with our expertly curated music events! Whether it’s a concert, festival, or intimate live performance, we specialize in creating electrifying atmospheres that captivate audiences. From stage design to sound perfection, we handle every detail to ensure a seamless, unforgettable experience where music takes center stage.",image1:"/pic7.png",image2:"/pic8.png",image3:"/pic9.png"},
    ]
  return (
    <Cardcomponent item={item} className="mt-52" />
  )
}

export default Eventmulticard



