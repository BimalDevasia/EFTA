"use client"
import React,{ useRef} from 'react'
import DynamicBanner from '@/components/DynamicBanner'
import Corperategift from '@/components/Corperategift'
import FeaturedCorporateGiftSection from '@/components/home/FeaturedCorporateGiftSection'
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
    <DynamicBanner 
      pageType="corporate"
      onClick={ScrollToAboutUs}
      defaultImage="/corporatefront.png"
      defaultTitle="Company"
      defaultSubtitle="Brand your"
    />
    <Corperategift ref={copRef}/>
    <FeaturedCorporateGiftSection />
    <Corporatemulticard/>
    </>
  )
}

export default Page
