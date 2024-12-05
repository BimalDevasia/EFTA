import React from "react";
import Wrapper from "./Wrapper";
import Logo from "./svgs/Logo";
import Link from "next/link";
import Image from "next/image";
import { SpecialText } from "./typography";

const Footer = () => {
  return (
    <footer>
      <hr className="border-[#6E6E6E]" />
      <Wrapper className="flex lg:flex-row flex-col lg:gap-0 gap-16 justify-between pt-[104px] pb-[92px] lg:px-0 px-10">
        <div className="self-stretch flex flex-col justify-between lg:gap-0 gap-10">
          <Logo  />
          <p>
            <SpecialText className="text-[#1F76BD] lg:text-[30px] text-lg font-extrabold  " >
              All kinds of Gifts, Cakes & Events
            </SpecialText>
          </p>
        </div>
        <div className="space-y-[30px]">
          <p>
            <SpecialText className="text-black lg:text-[24px] text-base ">
              Follow Us
            </SpecialText>
          </p>
          <div className="flex gap-12">
            <Link href="/">
              <Image src="/insta.svg" alt="instagram" width={60} height={60} />
            </Link>
            <Link href="/">
              <Image
                src="/youtube.svg"
                alt="instagram"
                width={60}
                height={60}
              />
            </Link>
          </div>
          <ul className="space-y-1.5">
            <li>
              <Link href="/">
                <SpecialText className="text-[#1F76BD] lg:text-[20px] text-sm ">
                  @efta_artworld
                </SpecialText>
              </Link>
            </li>
            <li>
              <Link href="/">
                <SpecialText className="text-[#1F76BD] lg:text-[20px] text-sm">
                  @efta_artworld
                </SpecialText>
              </Link>
            </li>
            <li>
              <Link href="/">
                <SpecialText className="text-[#1F76BD] lg:text-[20px] text-sm">
                  @efta_artworld
                </SpecialText>
              </Link>
            </li>
          </ul>
        </div>
      </Wrapper>
      <hr className="border-[#6E6E6E]" />
      <div className="py-9 flex items-center justify-center">
        <p className="text-[#1F76BD] font-inter lg:text-[24px] text-xs font-semibold">
          <Link href="/">EFTA &copy;</Link> &nbsp;|&nbsp;{" "}
          <Link href="/">Privacy</Link> &nbsp;| &nbsp;
          <Link href="/">Legal</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
