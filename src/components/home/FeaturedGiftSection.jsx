import React from "react";
import NormalCardCarousal from "../NormalCardCarousal";
import { SpecialText } from "../typography";
import Link from "next/link";
import Wrapper from "../Wrapper";

const FeaturedGiftSection = () => {
  return (
    <section className="py-10">
      <Wrapper>
        <div className="flex justify-between items-center px-10 lg:px-8">
          <h2 className="lg:pl-6">
            <SpecialText className="text-3xl">Featured Gifts</SpecialText>
          </h2>
          <Link href="/products?giftType=personalisedGift&featured=true&hideCategoryFilter=true&title=Featured%20Gifts">
            <SpecialText className="text-sm lg:text-base">View All</SpecialText>
          </Link>
        </div>
        <NormalCardCarousal category="gift" />
      </Wrapper>
    </section>
  );
};

export default FeaturedGiftSection;
