"use client"
import React,{ useRef} from 'react'
import Coperatefront from '@/components/Corporatefront'
import Corperategift from '@/components/Corperategift'
import Corporatemulticard from '@/components/Corporatemulticard'
function Page() {
  const copRef = useRef(null);
  const ScrollToAboutUs = () => {
    if (copRef.current) {
      copRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <>
    <Coperatefront click={ScrollToAboutUs}/>
    <Corperategift ref={copRef}/>
    <Corporatemulticard/>
    </>
  )
}

export default Page