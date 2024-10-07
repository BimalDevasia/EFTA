"use client"
import React,{ useState , useEffect } from 'react'
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
function Navbar() {
  const [selPage, setSelPage] = useState();
  let items = [
    { id: "Home", path: "/" },
    { id: "Gifts", path: "/gifts" },
    { id: "Events", path: "/events" },
    { id: "Courses", path: "/courses" },
  ];

  const pathname = usePathname();
  const pathSegments = pathname === '/' ? '/': pathname.split('/').filter(Boolean);

  useEffect(() => {
    if (pathname === "/") {
      setSelPage("/");
    } else {
      setSelPage("/".concat(pathSegments[0]));
    }
  }, [pathSegments, pathname]);

  console.log(selPage);
  return (
    <div className="fixed flex px-36 w-screen justify-between items-center h-24 z-50 bg-white">
      <Link href="/">
        <svg
          className={`w-24 h-24  ${
            selPage === "/"
              ? "fill-primary_color"
              : selPage === "/gifts"
              ? pathname.length === 1
                ? "fill-white"
                : "fill-gift_blue"
              : ""
          } `}
          viewBox="0 0 121 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M38.3906 5.90625C38.3906 5.90625 36.4429 2.8811 37.125 1.54689C37.7913 0.243501 39.7265 3.61297e-06 40.8515 0C42.3281 -4.74084e-06 44.0773 0.184209 46.125 0.984389C49.6019 2.34312 51.5685 4.03826 53.2265 7.38282C54.5017 9.9552 54.7777 11.7681 54.4921 14.625C54.3834 15.7128 53.9296 17.3672 53.9296 17.3672C53.9296 17.3672 53.6478 13.6585 52.5937 11.6016C51.2122 8.90573 48.7968 6.96095 47.1796 6.11718C45.5624 5.27342 42.4687 4.28906 42.1875 4.92189C41.9062 5.55471 43.4672 7.85153 45.5625 10.4766C47.4418 12.8311 52.7343 18.1406 52.7343 18.1406C52.7343 18.1406 47.4885 14.7747 44.789 12.4453C41.8771 9.93261 38.3906 5.90625 38.3906 5.90625ZM53.5781 19.4062H55.4765V27.4219H53.5781V19.4062ZM57.3046 19.4062H86.9765V27.6328H76.7812V54H66.3749V27.6328H57.3046V19.4062ZM105.539 19.4062H94.9921L80.2265 54H90.9843L93.0937 48.4453C93.0937 48.4453 94.9218 44.789 99.9843 44.789C105.047 44.789 106.945 48.4453 106.945 48.4453L108.844 54H120.094L105.539 19.4062ZM57.164 11.9531C55.9514 14.0765 54.7031 17.5078 54.7031 17.5078C54.7031 17.5078 56.0342 15.4509 57.5859 13.6406C57.7498 13.4494 57.9296 13.2248 58.1221 12.9841C58.921 11.986 59.9402 10.7125 60.9609 10.4062C61.664 10.1953 62.4029 10.2319 62.7187 10.9687C63.1406 11.9531 62.789 13.8516 62.1562 14.625C60.4866 16.6656 57.3046 17.7188 57.3046 17.7188C57.3046 17.7188 62.4553 16.9095 64.4765 14.625C65.7868 13.144 66.1751 12.0135 66.4453 10.0547C66.7265 8.01562 65.7421 5.48437 63.9843 5.27345C62.3841 5.08144 61.7745 5.70515 61.0415 6.45508L61.0414 6.45514L61.0413 6.45526L61.0406 6.45601C60.9687 6.52957 60.8956 6.60435 60.8203 6.67968C59.9765 7.52343 58.6647 9.32523 57.164 11.9531ZM104.037 36.4215C103.123 32.484 98.5522 28.6168 98.5522 28.6168C98.5522 28.6168 98.7197 31.7237 98.4116 33.3981C98.3469 33.7496 98.0082 35.1559 97.0756 36.4215C96.1431 37.6871 95.9506 38.3902 95.81 39.3746C95.6694 40.359 95.8557 41.1348 96.4428 41.9762C97.3002 43.2048 98.4613 43.7484 99.9585 43.8043C103.25 43.9271 104.951 40.359 104.037 36.4215ZM99.844 31.1483C99.844 31.1483 102.211 33.223 102.938 35.0155C103.28 35.8592 103.641 37.1249 103.571 38.1092C103.5 39.0936 102.446 40.7811 101.532 40.7811C100.856 40.7811 101.012 39.9077 101.206 38.8211C101.275 38.4367 101.348 38.0256 101.391 37.617C101.532 36.2811 101.496 36.0702 101.11 34.3827C100.807 33.0605 99.844 31.1483 99.844 31.1483ZM51.6794 19.4061H31.0076V53.9998H41.3435L41.4138 40.6405H55.3357V32.6952H41.4138V27.3514H51.6794V19.4061ZM0 19.4061H28.125V27.492H10.2656V32.7655H26.3277V40.6405H10.2656V45.9139H28.125V53.9998H0V19.4061Z"
          />
        </svg>
      </Link>
      <div className="flex items-center gap-14 ">
        {items.slice(selPage === "/" ? 0 : 1).map((item, index) => (
          <div
            key={index}
            onClick={() => setSelPage(item.path)}
            className={` relative text-2xl ${
              selPage === item.path
                ? "border-x-2 border-t-2  rounded-t-2xl"
                : ""
            } ${
              selPage === "/"
                ? "border-primary_color"
                : selPage === "/gifts"
                ? pathname.length === 1
                  ? "border-white"
                  : "border-gift_blue"
                : ""
            } ${
              selPage === "/"
                ? "text-primary_color"
                : selPage === "/gifts"
                ? pathname.length === 1
                  ? "text-white"
                  : "text-gift_blue"
                : ""
            } font-semibold font-poppins px-5 py-3`}
          >
            <div></div>
            <Link href={item.path}>{item.id}</Link>
          </div>
        ))}
        <PiShoppingCartSimpleFill
          className={`w-8 h-8 ${
            selPage === "/"
              ? "text-primary_color"
              : selPage === "/gifts"
              ? pathname.length === 1
                ? "text-white"
                : "text-gift_blue"
              : ""
          }  ${selPage === "/" ? "hidden" : ""} `}
        />
      </div>
    </div>
  );
}

export default Navbar;