"use client";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { optimizeCloudinaryImage } from "@/lib/imageUtils";
import { SpecialText } from "../typography";
import Wrapper from "../Wrapper";
import UniversalProductCard from "../UniversalProductCard";
import { ProductSkeleton } from "../ui/product-skeleton";

const ExploreMoreGifts = ({ excludeId = null, category = null }) => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        
        // Build query parameters for real products from database
        let queryParams = `?limit=24`; // Fetch 24 items for 4 complete rows
        if (category) {
          queryParams += `&category=${encodeURIComponent(category)}`;
        } else {
          // Default to personalized gift type for explore more section
          queryParams += `&giftType=personalisedGift`;
        }
        
        // Add visible filter to only show published products
        queryParams += `&visible=true`;
        
        const response = await fetch(`/api/products${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        let filteredGifts = data.products || [];
        
        // Filter out the current product if excludeId is provided
        if (excludeId) {
          filteredGifts = filteredGifts.filter(gift => String(gift._id) !== String(excludeId));
        }
        
        setGifts(filteredGifts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [excludeId, category]);

  if (loading) {
    return (
      <section className="py-10">
        <Wrapper>
          <div className="flex justify-between items-center lg:px-0 px-10 mb-8">
            <h2 className="lg:pl-6">
              <SpecialText className="text-3xl">Explore more Gifts</SpecialText>
            </h2>
            <Link href={category 
              ? `/products?category=${encodeURIComponent(category)}&visible=true&title=${encodeURIComponent(category.charAt(0).toUpperCase() + category.slice(1))}` 
              : `/products?giftType=personalisedGift&visible=true&title=Personalized%20Gifts`}>
              <SpecialText className="text-sm lg:text-base">View All</SpecialText>
            </Link>
          </div>
          
          {/* Grid layout with skeleton cards - same as actual layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 px-6 lg:px-10">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="w-full h-full flex justify-center">
                <ProductSkeleton />
              </div>
            ))}
          </div>
        </Wrapper>
      </section>
    );
  }

  if (error || !gifts.length) {
    return (
      <section className="py-10">
        <Wrapper>
          <div className="text-center text-gray-500 py-8">
            {error ? `Error: ${error}` : 'No gifts available at the moment'}
          </div>
        </Wrapper>
      </section>
    );
  }

  return (
    <section className="py-10">
      <Wrapper>
        <div className="flex justify-between items-center lg:px-0 px-10 mb-8">
          <h2 className="lg:pl-6">
            <SpecialText className="text-3xl">Explore more Gifts</SpecialText>
          </h2>
          <Link href={category 
            ? `/products?category=${encodeURIComponent(category)}&visible=true&title=${encodeURIComponent(category.charAt(0).toUpperCase() + category.slice(1))}` 
            : `/products?giftType=personalisedGift&visible=true&title=Personalized%20Gifts`}>
            <SpecialText className="text-sm lg:text-base">View All</SpecialText>
          </Link>
        </div>
        
        {/* Grid layout with proper spacing to prevent overlaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 px-6 lg:px-10">
          {gifts.map((gift) => {
            // Calculate the actual display price (same logic as featured gifts)
            const actualPrice = gift.offerPrice || 
              (gift.offerPercentage > 0 ? 
                Math.round(gift.productMRP * (100 - gift.offerPercentage) / 100) : 
                gift.productMRP);
            
            return (
              <div key={gift._id} className="w-full h-full flex justify-center">
                <UniversalProductCard
                  id={gift._id}
                  name={gift.productName}
                  desc={gift.description}
                  price={actualPrice}
                  originalPrice={gift.offerPercentage > 0 ? gift.productMRP : null}
                  offerPercentage={gift.offerPercentage || 0}
                  productType={gift.productType}
                  image={gift.images && gift.images.length > 0 ? 
                    optimizeCloudinaryImage(gift.images[0].url, { width: 400, height: 360, crop: 'fill' }) : 
                    null}
                  imageAlt={gift.images && gift.images.length > 0 ? gift.images[0].alt || gift.productName : gift.productName}
                />
              </div>
            );
          })}
        </div>
      </Wrapper>
    </section>
  );
};

// Additional export for FeaturedGiftCard (used in products page)
export const FeaturedGiftCard = ({ 
  id,
  name, 
  price, 
  discountedPrice, 
  desc, 
  image, 
  imageAlt,
  isCustom 
}) => {
  // Helper function to create URL-friendly slug
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Parse price values to calculate savings
  const currentPrice = parseFloat(price.replace(/[^\d.]/g, ''));
  const originalPrice = discountedPrice ? parseFloat(discountedPrice.replace(/[^\d.]/g, '')) : null;
  const savings = originalPrice && originalPrice > currentPrice ? originalPrice - currentPrice : 0;
  const discountPercentage = originalPrice && originalPrice > currentPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;

  return (
    <UniversalProductCard
      id={id}
      name={name}
      desc={desc}
      price={currentPrice}
      originalPrice={originalPrice}
      offerPercentage={discountPercentage}
      productType={isCustom ? 'customisable' : 'non-customisable'}
      image={image ? optimizeCloudinaryImage(image, { width: 400, height: 360, crop: 'fill' }) : null}
      imageAlt={imageAlt}
    />
  );
};

export default ExploreMoreGifts;
