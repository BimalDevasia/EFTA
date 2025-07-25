"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { optimizeCloudinaryImage } from "@/lib/imageUtils";
import { SpecialText } from "../typography";
import Wrapper from "../Wrapper";

const ExploreMoreGifts = ({ excludeId = null, category = null }) => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        
        // Fetch more gifts for the grid layout - 4 rows with full coverage
        let queryParams = `?limit=48`; // Increased to ensure 4 complete rows across all screen sizes
        if (category) {
          queryParams += `&category=${encodeURIComponent(category)}`;
        }
        
        const response = await fetch(`/api/gift${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch gifts');
        const data = await response.json();
        
        // Filter out the current product if excludeId is provided
        let filteredGifts = data.gifts;
        if (excludeId) {
          filteredGifts = data.gifts.filter(gift => String(gift._id) !== String(excludeId));
        }
        
        // Ensure we have enough items to fill 4 complete rows
        const minItemsForFourRows = 24; // 4 rows × 6 columns (max)
        
        // If we don't have enough real products, duplicate existing ones or create placeholders
        if (filteredGifts.length < minItemsForFourRows) {
          const dummyProducts = [
            {
              _id: 'dummy_1',
              productName: 'Coffee Mug',
              description: 'Photo Printed Mug',
              offerPrice: 249,
              productMRP: 349,
              offerPercentage: 28,
              productType: 'customisable',
              images: [{ url: '/pic1.png', alt: 'Coffee Mug' }]
            },
            {
              _id: 'dummy_2',
              productName: 'Photo Frame',
              description: 'Personalized Photo Frame',
              offerPrice: 399,
              productMRP: 499,
              offerPercentage: 20,
              productType: 'customisable',
              images: [{ url: '/pic2.png', alt: 'Photo Frame' }]
            },
            {
              _id: 'dummy_3',
              productName: 'T-Shirt',
              description: 'Custom Printed T-Shirt',
              offerPrice: 599,
              productMRP: 799,
              offerPercentage: 25,
              productType: 'customisable',
              images: [{ url: '/t-shirt.png', alt: 'T-Shirt' }]
            },
            {
              _id: 'dummy_4',
              productName: 'Cake',
              description: 'Designer Birthday Cake',
              offerPrice: 899,
              productMRP: 1199,
              offerPercentage: 25,
              productType: 'customisable',
              images: [{ url: '/cake.png', alt: 'Cake' }]
            }
          ];
          
          // Add dummy products and duplicates to reach minimum count
          while (filteredGifts.length < minItemsForFourRows) {
            if (filteredGifts.length === 0) {
              // If no real products, use dummy products
              filteredGifts.push(...dummyProducts.slice(0, Math.min(4, minItemsForFourRows)));
            } else {
              // Duplicate existing products with new IDs
              const originalLength = filteredGifts.length;
              for (let i = 0; i < originalLength && filteredGifts.length < minItemsForFourRows; i++) {
                const duplicatedGift = {
                  ...filteredGifts[i],
                  _id: `${filteredGifts[i]._id}_dup_${filteredGifts.length}`,
                };
                filteredGifts.push(duplicatedGift);
              }
            }
          }
        }
        
        setGifts(filteredGifts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching gifts:', err);
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
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
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
            <SpecialText>Explore more Gifts</SpecialText>
          </h2>
          <Link href="/products/anniversary">
            <SpecialText className="lg:text-[24px] text-xs">View All</SpecialText>
          </Link>
        </div>
        
        {/* Grid layout with 4 complete rows matching featured products style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 lg:px-6">
          {gifts.slice(0, 24).map((gift) => ( // Ensure exactly 24 items for 4 complete rows
            <div key={gift._id} className="w-full max-w-[400px] mx-auto">
              <FeaturedGiftCard
                id={gift._id}
                name={gift.productName}
                price={`₹${gift.offerPrice}`}
                discountedPrice={gift.offerPercentage > 0 ? `₹${gift.productMRP}` : null}
                desc={gift.description}
                image={gift.images && gift.images.length > 0 ? 
                  optimizeCloudinaryImage(gift.images[0].url, { width: 400, height: 290, crop: 'fill' }) : 
                  null}
                imageAlt={gift.images && gift.images.length > 0 ? gift.images[0].alt || gift.productName : gift.productName}
                isCustom={gift.productType !== 'non-customisable'}
              />
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

const FeaturedGiftCard = ({
  id,
  name,
  desc,
  price,
  discountedPrice,
  isCustom,
  image,
  imageAlt,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/product/${id}`}
      className="block shadow-carousal-card rounded-[20px] border-none h-full"
    >
      <Card className="border-none shadow-none">
        <CardContent className="p-4 space-y-[11px] relative">
          {isCustom && (
            <p className="text-white text-[10px] font-extrabold tracking-[0.5px] font-poppins px-3 py-[11px] bg-[#C13FC8] w-fit rounded-[7px] absolute top-7 left-6 z-10">
              CUSTOM
            </p>
          )}
          <div className="relative w-full h-[290px] rounded-[10.5px] overflow-hidden">
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image || "/carousal-image.png"}
              alt={imageAlt || name}
              className="w-full h-[290px] object-cover object-center rounded-[10.5px] !m-0"
              onLoad={() => setImageLoading(false)}
              onError={(e) => {
                setImageLoading(false);
                setImageError(true);
                // First try the original image URL without optimization
                if (image && image.includes('cloudinary.com') && image.includes('/w_')) {
                  const originalUrl = image.replace(/\/w_\d+,h_\d+,c_\w+,q_\w+,f_\w+/, '');
                  e.target.src = originalUrl;
                } else {
                  e.target.src = "/carousal-image.png";
                }
              }}
              style={{ display: imageLoading ? 'none' : 'block' }}
            />
          </div>
          <div className="font-poppins space-y-[3px]">
            <h3 className="text-[22px] font-semibold tracking-[1.121px] leading-[normal]">
              {name}
            </h3>
            <p className="text-[18px] tracking-[0.896px] leading-[normal] text-[#5A5A5A] line-clamp-2">
              {desc}
            </p>
            <p className="text-[18px] tracking-[0.896px] leading-[normal]">
              <span>{price}</span>
              {discountedPrice && (
                <>
                  {" "}
                  <span className="text-[#5A5A5A] line-through">
                    {discountedPrice}
                  </span>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ExploreMoreGifts;
