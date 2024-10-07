import React from 'react'
import BrandItem from '@/components/brandItem'
import Offers from '@/components/offers'
import Portrait from '@/components/portrait'
import Morefromefta from '@/components/morefromefta'
import NormalCardCarousal from '@/components/NormalCardCarousal'
import GiftMain from '@/components/GiftMain'
function page() {
  return (
    <>
    <GiftMain/>
    <NormalCardCarousal/>
    <BrandItem/>
    <Offers/>
    <NormalCardCarousal/>
    <Portrait/>
    <Morefromefta/>
    </>

  )
}

export default page