"use client"
import React, { useRef } from 'react';
import DynamicBanner from '@/components/DynamicBanner';
import EventCard from '@/components/EventCard';
import FeaturedGiftSection from '@/components/home/FeaturedGiftSection';
import ExploreMoreGifts from '@/components/home/ExploreMoreGifts';
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
      <DynamicBanner 
        pageType="gifts"
        onClick={ScrollToAboutUs}
        defaultImage="/giftmain.png"
        defaultTitle="Valentine"
        defaultSubtitle="Surprise your"
      />
      <EventCard ref={eventRef} />
      <FeaturedGiftSection />
      <BrandItem />
      <Offers />
      <ExploreMoreGifts />
      <Portrait />
      <Morefromefta />
    </>
  );
}

export default Page;
