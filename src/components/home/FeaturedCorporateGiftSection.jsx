import React from "react";
import NormalCardCarousal from "../NormalCardCarousal";
import { SpecialText } from "../typography";
import Link from "next/link";
import Wrapper from "../Wrapper";

const FeaturedCorporateGiftSection = () => {
  return (
    <section className="py-10">
      <Wrapper>
        <div className="flex justify-between items-center px-10 lg:px-8">
          <h2 className="lg:pl-6">
            <SpecialText className="text-3xl">Featured Corporate Gifts</SpecialText>
          </h2>
          <Link href="/products?category=corporate-gifts">
            <SpecialText className="text-sm lg:text-base">View All</SpecialText>
          </Link>
        </div>
        <NormalCardCarousal category="corporate-gifts" />
      </Wrapper>
    </section>
  );
};

export default FeaturedCorporateGiftSection;
