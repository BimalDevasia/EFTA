import Breadcrumb from "@/components/Breadcrumb";
import NormalCardCarousal from "@/components/NormalCardCarousal";
import ProductDetails from "@/components/ProductDetails";
import Wrapper from "@/components/Wrapper";
import { SpecialText } from "@/components/typography";
import Link from "next/link";
import React from "react";

const links = [
  {
    name: "Gifts",
    href: "/gifts",
  },
  {
    name: "Valentines Day",
    href: "/gifts/valentines-day",
  },
];


const ProductPage = () => {
  return (
    <>
      <Wrapper className="pt-32 pb-[100px] space-y-[100px]">
        <div className="space-y-[30px]">
          <Breadcrumb links={links} />
          <ProductDetails />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <h2 className="pl-6">
              <SpecialText>Similar Products</SpecialText>
            </h2>
            <Link href="/">
              <SpecialText className="text-[24px]">View All</SpecialText>
            </Link>
          </div>
          <NormalCardCarousal />
        </div>
      </Wrapper>
    </>
  );
};

export default ProductPage;
