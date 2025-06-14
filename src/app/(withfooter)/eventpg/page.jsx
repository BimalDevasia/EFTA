"use client"
import EventAbout from '@/components/EventAbout'
import Eventdetails from '@/components/Eventdetails'
import DynamicBanner from '@/components/DynamicBanner'
import Eventmulticard from '@/components/Eventmulticard'
import React,{ useRef } from 'react'

function Page() {

  const eventRef = useRef(null);

  const scrollToAboutUs = () => {
    if (eventRef.current) {
      eventRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
   <>
   <DynamicBanner 
     pageType="events"
     onClick={scrollToAboutUs}
     defaultImage="./eventmain.png"
     defaultTitle="Style"
     defaultSubtitle="Celebrate In"
   />
   <EventAbout ref={eventRef}/>
   <Eventdetails/>
  <Eventmulticard/>
   </>
  )
}

export default Page