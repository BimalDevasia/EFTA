"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { optimizeCloudinaryImage } from "@/lib/imageUtils";

function NormalCardCarousal({ excludeId = null, category = null, limit = 20 }) {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        let queryParams = `?limit=${limit}`;
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
        
        setGifts(filteredGifts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching gifts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [excludeId, category, limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !gifts.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        {error ? `Error: ${error}` : 'No gifts available at the moment'}
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="py-6">
        {gifts.map((gift) => {
          return (
            <CarouselItem
              key={gift._id}
              className="md:basis-1/2  lg:basis-[28%] pl-6 last-of-type:pr-6 first-of-type:pl-10"
            >
              <CarousalCard
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
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="lg:left-0 left-5 -translate-x-1/2" disappear />
      <CarouselNext className="lg:right-0 right-5  translate-x-1/2" disappear />
    </Carousel>
  );
}

const CarousalCard = ({
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

export default NormalCardCarousal;