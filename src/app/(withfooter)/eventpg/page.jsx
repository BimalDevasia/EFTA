"use client"
import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import DynamicBanner from '@/components/DynamicBanner'

// Lazy load below-the-fold components
const EventAbout = dynamic(() => import('@/components/EventAbout'), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>
})
const Eventdetails = dynamic(() => import('@/components/Eventdetails'), {
  loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>
})
const Eventmulticard = dynamic(() => import('@/components/Eventmulticard'), {
  loading: () => <div className="h-96 flex items-center justify-center">Loading...</div>
})

function Page() {
  const eventRef = useRef(null);

  const scrollToAboutUs = () => {
    if (eventRef.current) {
      eventRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
   <>
     {/* Resource hints for better performance */}
     <link rel="preload" as="image" href="/eventmain.png" />
     <link rel="prefetch" as="image" href="/party2.png" />
     <link rel="prefetch" as="image" href="/marriage1.png" />
     <link rel="prefetch" as="image" href="/marriage2.png" />
     
     <DynamicBanner 
       pageType="events"
       onClick={scrollToAboutUs}
       defaultImage="/eventmain.png"
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