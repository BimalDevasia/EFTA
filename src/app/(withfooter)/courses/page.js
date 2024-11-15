"use client"
import React,{useRef} from 'react'
import Coursesfront from '@/components/Coursesfront'
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
    <Coursesfront click={ScrollToAboutUs}/>
    <Coursesabout ref={couRef}/>
    </>
  )
}

export default Page