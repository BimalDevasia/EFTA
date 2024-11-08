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

function NormalCardCarousal() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        // Fetch all gifts with a reasonable limit
        const response = await fetch('/api/gift?limit=10');
        if (!response.ok) throw new Error('Failed to fetch gifts');
        const data = await response.json();
        setGifts(data.gifts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching gifts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, []);

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
        No gifts available at the moment
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
        {gifts.map((gift) => (
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
              image={gift.images[0]}
              isCustom={gift.productType !== 'non-customisable'}
            />
          </CarouselItem>
        ))}
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
}) => {
  return (
    <Link
      href={`/product/${id}`}
      className="block shadow-carousal-card rounded-[20px] border-none h-full"
    >
      <Card className="border-none shadow-none">
        <CardContent className="p-4 space-y-[11px] relative">
          {isCustom && (
            <p className="text-white text-[10px] font-extrabold tracking-[0.5px] font-poppins px-3 py-[11px] bg-[#C13FC8] w-fit rounded-[7px] absolute top-7 left-6">
              CUSTOM
            </p>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image || "/carousal-image.png"}
            alt={name}
            className="w-full h-[290px] object-cover rounded-[10.5px] !m-0"
          />
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