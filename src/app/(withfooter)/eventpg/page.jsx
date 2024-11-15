"use client"
import EventAbout from '@/components/EventAbout'
import Eventdetails from '@/components/Eventdetails'
import EventMain from '@/components/EventMain'
import Eventmulticard from '@/components/Eventmulticard'
import React,{ useRef } from 'react'

function page() {

  const eventRef = useRef(null);

  const scrollToAboutUs = () => {
    if (eventRef.current) {
      eventRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
   <>
   <EventMain click={scrollToAboutUs}/>
   <EventAbout ref={eventRef}/>
   <Eventdetails/>
  <Eventmulticard/>
   </>
  )
}

export default page