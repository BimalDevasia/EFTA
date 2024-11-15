"use client"
import React, { useRef } from 'react';
import GiftMain from '@/components/GiftMain';
import EventCard from '@/components/EventCard';
import FeaturedGiftSection from '@/components/home/FeaturedGiftSection';
import BrandItem from '@/components/brandItem';
import Offers from '@/components/offers';
import Portrait from '@/components/portrait';
import Morefromefta from '@/components/morefromefta';

function Page() {
  

  const eventRef = useRef(null);
  const ScrollToAboutUs = () => {
    if (eventRef.current) {
      eventRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <GiftMain click={ScrollToAboutUs} />
      <EventCard ref={eventRef} />
      <FeaturedGiftSection />
      <BrandItem />
      <Offers />
      <FeaturedGiftSection />
      <Portrait />
      <Morefromefta />
    </>
  );
}

export default Page;
