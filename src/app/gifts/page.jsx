import React from 'react'
import BrandItem from '@/components/brandItem'
import Offers from '@/components/offers'
import Portrait from '@/components/portrait'
import Morefromefta from '@/components/morefromefta'
import NormalCardCarousal from '@/components/NormalCardCarousal'
import GiftMain from '@/components/GiftMain'
import FeaturedGiftSection from '@/components/home/FeaturedGiftSection'
function page() {
  return (
    <>
    <GiftMain/>
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