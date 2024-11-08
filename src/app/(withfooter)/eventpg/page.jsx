import EventAbout from '@/components/EventAbout'
import Eventdetails from '@/components/Eventdetails'
import EventMain from '@/components/EventMain'
import Eventmulticard from '@/components/Eventmulticard'
import React from 'react'

function page() {
  return (
   <>
   <EventMain/>
   <EventAbout/>
   <Eventdetails/>
  <Eventmulticard/>
   </>
  )
}

export default page