"use client"
import React,{useRef} from 'react'
import DynamicBanner from '@/components/DynamicBanner'
import Coursesabout from '@/components/Coursesabout'
function Page() {

  const couRef = useRef(null);
  const ScrollToAboutUs = () => {
    if (couRef.current) {
      couRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <>
    <DynamicBanner 
      pageType="courses"
      onClick={ScrollToAboutUs}
      defaultImage="/coursesfront.png"
      defaultTitle="Creativity"
      defaultSubtitle="Unlock"
    />
    <Coursesabout ref={couRef}/>
    </>
  )
}

export default Page