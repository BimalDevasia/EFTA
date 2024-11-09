import React from 'react'
import Cardcomponent from './Cardcomponent'
const item=[{title:"Business Events",desc:"Turn your dream wedding into reality with our dedicated event planning services! From stunning venues to personalized details, we ensure every moment of your special day is flawlessly executed. Whether it’s a grand celebration or an intimate ceremony, we handle everything with care, so you can focus on celebrating love and creating unforgettable memories.",image1:"/pic1.png",image2:"/pic2.png",image3:"/pic10.png"},
    {title:"College Events",desc:"Bring the rhythm to life with our expertly curated music events! Whether it’s a concert, festival, or intimate live performance, we specialize in creating electrifying atmospheres that captivate audiences. From stage design to sound perfection, we handle every detail to ensure a seamless, unforgettable experience where music takes center stage.",image1:"/pic7.png",image2:"/pic8.png",image3:"/pic9.png"},
    
]
function Corporatemulticard() {
  return (
    <Cardcomponent item={item} title="Corporate Events" reverse/>
  )
}

export default Corporatemulticard