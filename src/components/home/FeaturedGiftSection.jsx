import React from "react";
import NormalCardCarousal from "../NormalCardCarousal";
import { SpecialText } from "../typography";
import Link from "next/link";
import Wrapper from "../Wrapper";

const FeaturedGiftSection = () => {
  return (
    <section className="py-10">
      <Wrapper>
        <div className="flex justify-between items-center">
          <h2 className="pl-6">
            <SpecialText>Featured Gifts</SpecialText>
          </h2>
          <Link href="/products/anniversary">
            <SpecialText className="text-[24px]">View All</SpecialText>
          </Link>
        </div>
        <NormalCardCarousal />
      </Wrapper>
    </section>
  );
};

export default FeaturedGiftSection;
