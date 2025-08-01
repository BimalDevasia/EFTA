import React, { useState, useEffect } from "react";
import NormalCardCarousal from "../NormalCardCarousal";
import { SpecialText } from "../typography";
import Link from "next/link";
import Wrapper from "../Wrapper";

const FeaturedCorporateGiftSection = () => {
  const [hasFeaturedGifts, setHasFeaturedGifts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if there are any featured corporate gifts
  useEffect(() => {
    const checkFeaturedGifts = async () => {
      try {
        const response = await fetch('/api/products?giftType=coperateGift&featured=true&visible=true&limit=1');
        const data = await response.json();
        setHasFeaturedGifts(data.products && data.products.length > 0);
      } catch (error) {
        console.error('Error checking for featured corporate gifts:', error);
        setHasFeaturedGifts(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFeaturedGifts();
  }, []);

  // Don't render the section if there are no featured corporate gifts
  if (!isLoading && !hasFeaturedGifts) {
    return null;
  }

  return (
    <section className="py-10">
      <Wrapper>
        <div className="flex justify-between items-center px-10 lg:px-8">
          <h2 className="lg:pl-6">
            <SpecialText className="text-3xl">Featured Corporate Gifts</SpecialText>
          </h2>
          <Link href="/products?giftType=coperateGift&featured=true&visible=true&hideCategoryFilter=true&title=Featured%20Corporate%20Gifts">
            <SpecialText className="text-sm lg:text-base">View All</SpecialText>
          </Link>
        </div>
        {/* Directly use 'coperateGift' as the giftType parameter */}
        <NormalCardCarousal category="coperateGift" />
      </Wrapper>
    </section>
  );
};

export default FeaturedCorporateGiftSection;
