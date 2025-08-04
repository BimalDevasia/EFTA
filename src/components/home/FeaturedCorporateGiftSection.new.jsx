import React, { useState, useEffect } from "react";
import NormalCardCarousal from "../NormalCardCarousal";
import { SpecialText } from "../typography";
import Link from "next/link";
import Wrapper from "../Wrapper";

const FeaturedCorporateGiftSection = () => {
  const [hasFeaturedGifts, setHasFeaturedGifts] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start with false to avoid hydration mismatch

  // Check if there are any featured corporate gifts
  useEffect(() => {
    // Set loading to true only after initial client render to avoid hydration mismatch
    const timer = setTimeout(() => {
      setIsLoading(true);
      
      const checkFeaturedGifts = async () => {
        try {
          console.log('Checking for featured corporate gifts...');
          const response = await fetch('/api/products?giftType=corporateGift&featured=true&visible=true&limit=1');
          const data = await response.json();
          console.log('API Response:', data);
          
          const hasGifts = data.products && data.products.length > 0;
          setHasFeaturedGifts(hasGifts);
          
          if (!hasGifts) {
            console.log('No featured corporate gifts found, showing section anyway');
            // Force display even if no gifts found for now
            setHasFeaturedGifts(true);
          }
        } catch (error) {
          console.error('Error checking for featured corporate gifts:', error);
          // Force display even on error
          setHasFeaturedGifts(true);
        } finally {
          setIsLoading(false);
        }
      };

      checkFeaturedGifts();
    }, 0);
    
    return () => clearTimeout(timer);
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
          <Link href="/products?giftType=corporateGift&featured=true&visible=true&hideCategoryFilter=true&title=Featured%20Corporate%20Gifts">
            <SpecialText className="text-sm lg:text-base">View All</SpecialText>
          </Link>
        </div>
        {/* Directly use 'corporateGift' as the giftType parameter */}
        <NormalCardCarousal category="corporateGift" />
      </Wrapper>
    </section>
  );
};

export default FeaturedCorporateGiftSection;
