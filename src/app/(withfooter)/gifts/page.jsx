"use client"
import React,{ useRef } from 'react'
import BrandItem from '@/components/brandItem'
import Offers from '@/components/offers'
import Portrait from '@/components/portrait'
import Morefromefta from '@/components/morefromefta'
import NormalCardCarousal from '@/components/NormalCardCarousal'
import GiftMain from '@/components/GiftMain'
import FeaturedGiftSection from '@/components/home/FeaturedGiftSection'
import EventCard from '@/components/EventCard'

function page() {
  const eventRef = useRef(null);

  const scrollToAboutUs = () => {
    if (eventRef.current) {
      eventRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    <GiftMain click={scrollToAboutUs}/>
    <EventCard ref={eventRef} />
    <FeaturedGiftSection/>
    <BrandItem/>
    <Offers/>
    <FeaturedGiftSection/>
    <Portrait/>
    <Morefromefta/>
    </>

  )
}

export default page