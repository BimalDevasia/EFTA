import Link from "next/link";
import RightArrow from "./svgs/RightArrow";
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
                <span
                  className={cn(
                    "text-xl font-semibold font-poppins text-[#0000005C]",
                    index === links.length - 1 && "text-[#1F76BD]"
                  )}
                >
                  {link.name}
                </span>
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
