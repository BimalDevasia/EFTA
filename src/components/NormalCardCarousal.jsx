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
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent className="py-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/2 lg:basis-[28%] pl-6  last-of-type:pr-6 first-of-type:pl-10"
          >
            <CarousalCard
              name="Coffee Mug"
              price="Rs 249"
              discountedPrice="Rs 349"
              desc="Photo Printed Mug"
              isCustom={index === 0}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 -translate-x-1/2" disappear />
      <CarouselNext className="right-0 translate-x-1/2" disappear />
    </Carousel>
  );
}

const CarousalCard = ({ name, desc, price, discountedPrice, isCustom }) => {
  return (
    <Link
      href="/product/djjddfjdj"
      className="block shadow-carousal-card rounded-[20px] border-none h-full"
    >
      <Card className=" border-none shadow-none">
        <CardContent className="p-4 space-y-[11px] relative">
          {isCustom && (
            <p className="text-white text-[10px] font-extrabold tracking-[0.5px] font-poppins px-3 py-[11px] bg-[#C13FC8] w-fit rounded-[7px] absolute top-7 left-6">
              CUSTOM
            </p>
          )}
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/carousal-image.png"
            alt="item picture"
            className="w-full h-[290px] object-cover rounded-[10.5px] !m-0"
          />
          <div className="font-poppins space-y-[3px]">
            <h3 className="text-[22px] font-semibold tracking-[1.121px] leading-[normal]">
              {name}
            </h3>
            <p className="text-[18px]  tracking-[0.896px] leading-[normal] text-[#5A5A5A]">
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
