import Link from "next/link";
import RightArrow from "./svgs/RightArrow";
import { SpecialText } from "./typography";
import { Fragment } from "react";
import { cn } from "@/lib/utils";


const Breadcrumb = ({ links}) => {
  return (
    <nav className="p-4">
      <ul className="flex space-x-2 items-center">
        {links.map((link, index) => (
          <Fragment key={index}>
            <li className="">
              <Link href={link.href}>
                <SpecialText
                  className={cn(
                    "text-[20px] text-[#0000005C]",
                    index === links.length - 1 && "text-[#8300FF]"
                  )}
                >
                  {link.name}
                </SpecialText>
              </Link>
            </li>
            {index !== links.length - 1 && (
              <li className="text-gray-600 h-fit">
                <RightArrow />
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
