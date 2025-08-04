import React, { useState, useEffect } from "react";
import NormalCardCarousal from "../NormalCardCarousal";
import { SpecialText } from "../typography";
import Link from "next/link";
import Wrapper from "../Wrapper";

const FeaturedCorporateGiftSection = () => {
  const [hasFeaturedGifts, setHasFeaturedGifts] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start with false to avoid hydration mismatch
  const [debug, setDebug] = useState(null);

  // Check if there are any featured corporate gifts
  useEffect(() => {
    // Set loading to true only after initial client render to avoid hydration mismatch
    const timer = setTimeout(() => {
      setIsLoading(true);
      
      const checkFeaturedGifts = async () => {
        try {
          const response = await fetch('/api/products?giftType=corporateGift&featured=true&limit=1');
          const data = await response.json();
          setHasFeaturedGifts(data.products && data.products.length > 0);
          setDebug({
            success: data.success,
            count: data.products ? data.products.length : 0,
            sample: data.products && data.products.length > 0 ? 
              {name: data.products[0].productName, id: data.products[0]._id} : null
          });
        } catch (error) {
          console.error('Error checking for featured corporate gifts:', error);
          setHasFeaturedGifts(false);
        } finally {
          setIsLoading(false);
        }
      };

      checkFeaturedGifts();
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-10">
      <Wrapper>
        <div className="flex justify-between items-center px-10 lg:px-8">
          <h2 className="lg:pl-6">
            <SpecialText className="text-3xl">
              Featured Corporate Gifts
              {/* Move loading indicator to a separate element to avoid hydration issues */}
              <span className="text-sm ml-2 text-gray-500 font-normal">
                {!isLoading && debug && !hasFeaturedGifts && '(No gifts found)'}
              </span>
            </SpecialText>
          </h2>
          <Link href="/products?giftType=corporateGift&featured=true&hideCategoryFilter=true&title=Featured%20Corporate%20Gifts">
            <SpecialText className="text-sm lg:text-base">View All</SpecialText>
          </Link>
        </div>
        <NormalCardCarousal category="corporateGift" />
      </Wrapper>
    </section>
  );
};

export default FeaturedCorporateGiftSection;
