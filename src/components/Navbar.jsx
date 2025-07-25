"use client";
import React, { useState, useEffect, useRef } from "react";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BsFilterLeft } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { motion } from 'framer-motion';
import { useCart } from "@/stores/useCart";

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
};

function Navbar() {
  const [selPage, setSelPage] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileNavRef = useRef(null);
  const closeButtonRef = useRef(null);
  const { totalItems } = useCart();
  
  let items = [
    { id: "Home", path: "/" },
    { id: "Gifts", path: "/gifts" },
    { id: "Corporates", path: "/corporates" },
    { id: "Events", path: "/eventpg" },
    { id: "Courses", path: "/courses" },
  ];

  const pathname = usePathname();
  const pathSegments =
    pathname === "/" ? "/" : pathname.split("/").filter(Boolean);

  useEffect(() => {
    if (pathname === "/") {
      setSelPage("/");
    } else {
      setSelPage("/".concat(pathSegments[0]));
    }
  }, [pathSegments, pathname]);

  // Handle scroll to show/hide navbar background
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMobileNavClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={`hidden lg:fixed lg:flex px-8 w-screen lg:justify-between lg:items-center h-20 z-[9999] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md' 
          : 'bg-transparent'
      }`}>
        <Link href="/" className="z-[10000] ml-4">
          <svg
            className={`w-20 h-16 transition-colors duration-300 ${
              selPage === "/"
                ? isScrolled ? "fill-primary_color" : "fill-primary_color"
                : selPage === "/product"
                ? pathSegments.length === 1
                  ? "fill-black"
                  : "fill-gift_blue"
                : isScrolled ? "fill-nav_blue" : "fill-white"
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
        <div className="lg:flex items-center gap-8 mr-8">
          {items.slice(selPage === "/" ? 0 : 1).map((item, index) => (
            <div
              key={index}
              onClick={() => setSelPage(item.path)}
              className={` relative text-xl ${
                selPage === item.path
                  ? "border-x-2 border-t-2 rounded-t-2xl"
                  : ""
              } ${
                selPage === "/"
                  ? isScrolled ? "border-primary_color" : "border-primary_color"
                  : selPage === "/product"
                  ? pathSegments.length === 1
                    ? "border-black"
                    : "border-gift_blue"
                  : isScrolled ? "border-nav_blue" : "border-white"
              } ${
                selPage === "/"
                  ? isScrolled ? "text-primary_color" : "text-primary_color"
                  : selPage === "/product"
                  ? pathSegments.length === 1
                    ? "text-black"
                    : "text-gift_blue"
                  : isScrolled ? "text-nav_blue" : "text-white"
              } font-semibold font-poppins px-4 py-2`}
            >
              <div></div>
              <Link href={item.path}>{item.id}</Link>
            </div>
          ))}
          <Link href="/cart" className="cursor-pointer relative">
          <PiShoppingCartSimpleFill
            className={`w-7 h-7 transition-colors duration-300 ${
              selPage === "/"
                ? isScrolled ? "text-primary_color" : "text-primary_color"
                : selPage === "/product"
                ? pathSegments.length === 1
                  ? "text-black"
                  : "text-gift_blue"
                : isScrolled ? "text-nav_blue" : "text-white"
            }  ${selPage === "/" ? "hidden" : ""} `}
          />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
          </Link>
        </div>
      </div>

      {/* this is for responsive         */}

      <div className="relative lg:hidden">
       <div className={`w-screen h-12 flex items-center px-10 justify-between pt-2 transition-all duration-300 ${
         isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
       }`}>
       <Link href="/">
          <svg
            className={`w-16 h-12 transition-colors duration-300 ${
              selPage === "/"
                ? isScrolled ? "fill-primary_color" : "fill-primary_color"
                : selPage === "/product"
                ? pathSegments.length === 1
                  ? "fill-black"
                  : "fill-gift_blue"
                : isScrolled ? "fill-primary_color" : "fill-primary_color"
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
        
        <BsFilterLeft
          className={`w-10 h-10 ${isOpen ? "opacity-0" : "opacity-100"} transition-all duration-300 ${
            isScrolled ? "text-primary_color" : "text-primary_color"
          } cursor-pointer`}
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(true);
            }
          }}
        />
       </div>

        {/* Backdrop overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            onClick={handleMobileNavClose}
            aria-hidden="true"
          />
        )}

        {/* Mobile sidebar */}
        <motion.div
          ref={mobileNavRef}
          className="sidebar w-screen h-screen absolute top-0 bg-white z-[9999]"
          initial="hidden"
          animate={isOpen ? "visible" : "hidden"}
          variants={sidebarVariants}
          transition={{ type: 'tween', duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
        >
         
          <div className="px-10 flex flex-col gap-16">
             <div className="w-full flex justify-between items-center">
            <Link href="/" aria-label="EFTA Home">
              <svg
                className={`w-16 h-12 fill-primary_color `}
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

           <RxCross2 
             ref={closeButtonRef}
             className={`w-10 h-10 ${isOpen ? "opacity-100" : "opacity-0"} transition-all duration-300 text-primary_color cursor-pointer`}  
             onClick={handleMobileNavClose}
             aria-label="Close navigation menu"
             role="button"
             tabIndex={0}
             onKeyDown={(e) => {
               if (e.key === 'Enter' || e.key === ' ') {
                 e.preventDefault();
                 handleMobileNavClose();
               }
             }}
           />

          </div>

                <div className={`flex ${isOpen ? "opacity-100 max-w-screen" : "opacity-0 max-w-0"} flex-col transition-all duration-300`}>
                {items.map((item, index) => (
                  <Link 
                    href={item.path} 
                    key={index} 
                    onClick={handleMobileNavClose}
                    className="focus:outline-none focus:ring-2 focus:ring-primary_color focus:ring-offset-2 rounded"
                  >
                    <div className="font-poppins transition-all duration-300 font-semibold border-b-2 py-3 text-primary_color hover:bg-gray-50">
                      {item.id}
                    </div>
                  </Link>
                ))}
                <Link 
                  href="/cart" 
                  onClick={handleMobileNavClose}
                  className="focus:outline-none focus:ring-2 focus:ring-primary_color focus:ring-offset-2 rounded relative"
                >
                  <div className={`font-poppins ${isOpen ? "opacity-100" : "opacity-0"} transition-all duration-300 font-semibold border-b-2 py-3 text-primary_color hover:bg-gray-50 flex items-center justify-between`}>
                    <span>Cart</span>
                    {totalItems > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
                  </div>
                </Link>

                </div>



          </div>
         
          
          
          
        </motion.div>
      </div>
    </>
  );
}

export default Navbar;
