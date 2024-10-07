import Link from "next/link";
import RightArrow from "./svgs/RightArrow";
import { SpecialText } from "./typography";

const Breadcrumb = () => {
  return (
    <nav className="p-4">
      <ul className="flex space-x-2 items-center">
        <li className="">
          <Link href="/gifts">
            <SpecialText className="text-[20px] text-[#0000005C]">
              Gifts
            </SpecialText>
          </Link>
        </li>
        <li className="text-gray-600 h-fit">
          <RightArrow />
        </li>
        <li className="">
          <Link href="/gifts/valentines-day">
            <SpecialText className="text-[20px] text-[#0000005C]">
              Valentines Day
            </SpecialText>
          </Link>
        </li>
        <li className="text-gray-600 h-fit">
          <RightArrow />
        </li>
        <li className="">
          <SpecialText className="text-[20px]">Coffee Mug</SpecialText>
        </li>
      </ul>
    </nav>
  );
};

export default Breadcrumb;
