"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MdKeyboardArrowDown } from "react-icons/md";
import Link from 'next/link';

function DynamicBanner({ pageType, onClick, defaultImage = null, defaultTitle = "", defaultSubtitle = "" }) {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/banner?pageType=${pageType}`);
        
        if (response.ok) {
          const data = await response.json();
          setBanner(data.banners);
        } else {
          console.log(`No banner found for ${pageType}, using default`);
          setBanner(null);
        }
      } catch (err) {
        console.error(`Error fetching banner for ${pageType}:`, err);
        setError(err.message);
        setBanner(null);
      } finally {
        setLoading(false);
      }
    };

    if (pageType) {
      fetchBanner();
    }
  }, [pageType]);

  const displayImage = banner?.image?.url || defaultImage;
  const displayTitle = banner?.title || defaultTitle;
  const displaySubtitle = banner?.subtitle || defaultSubtitle;
  const buttonText = banner?.buttonText || (pageType === 'courses' || pageType === 'events' ? "Enquiry" : "Shop Now");
  const description = banner?.description;
  const buttonColor = banner?.buttonColor || (pageType === 'gifts' ? '#8300FF' : '#4338CA'); // Default colors for fallback

  // Handle WhatsApp enquiry for courses and events
  const handleEnquiry = async (pageType) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      // Dynamic import of WhatsApp service to avoid SSR issues
      const { WhatsAppService, BUSINESS_PHONE } = await import('@/lib/whatsapp');
      
      let message = '';
      
      if (pageType === 'courses') {
        message = `🎨 *Enquiry about Courses - EFTA*\n\nHi! I'm interested in learning more about your courses and training programs. Could you please provide me with details about:\n\n• Available courses\n• Course schedules\n• Fees and registration process\n• Certification details\n\nThank you!`;
      } else if (pageType === 'events') {
        message = `🎉 *Event Planning Enquiry - EFTA*\n\nHi! I'm interested in your event planning services. Could you please provide me with details about:\n\n• Available event packages\n• Pricing and customization options\n• Venue arrangements\n• Catering and decoration services\n\nThank you!`;
      }
      
      const whatsappLink = WhatsAppService.generateWhatsAppLink(BUSINESS_PHONE, message);
      window.open(whatsappLink, '_blank');
    } catch (error) {
      console.error('Error loading WhatsApp service:', error);
    }
  };

  // Determine the link destination based on page type
  const getLinkDestination = () => {
    if (pageType === 'gifts') {
      return '/products?giftType=personalisedGift';
    } else if (pageType === 'corporate') {
      return '/products?giftType=corporateGift';
    } else {
      return '/gifts';
    }
  };

  // If no pageType is provided, use defaults immediately
  if (!pageType) {
    return (
      <div className='h-screen w-full lg:mb-5 mb-10 items-center flex relative overflow-hidden'>
        {defaultImage && (
          <Image 
            src={defaultImage} 
            alt={defaultTitle || "Banner"}
            className='absolute object-cover w-full lg:h-full h-screen object-center' 
            fill
            priority
            sizes="100vw"
            quality={85}
          />
        )}
        
        <div className='z-10 px-10 lg:px-8 flex flex-col gap-14 w-full'>
          <div className='flex flex-col gap-6'>
            {defaultSubtitle && (
              <p className='lg:text-4xl text-sm font-poppins font-semibold text-white'>
                {defaultSubtitle}
              </p>
            )}
            {defaultTitle && (
              <p className='font-satisfy lg:text-9xl text-6xl font-normal text-white'>
                {defaultTitle}
              </p>
            )}
          </div>
          
          <Link href="/products?giftType=personalisedGift">
            <button 
              className='w-max shadow-button_shadow lg:py-4 lg:px-12 py-3 px-8 rounded-[100px] text-white font-semibold text-sm lg:text-[20px]'
              style={{ backgroundColor: '#8300FF' }}
            >
              Shop Now
            </button>
          </Link>
          
          {onClick && (
            <p 
              onClick={onClick} 
              className='absolute bottom-10 text-white font-poppins font-semibold cursor-pointer left-[50%] translate-x-[-50%] flex items-center gap-2'
            >
              Scroll down <MdKeyboardArrowDown />
            </p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className='h-screen w-full lg:mb-5 mb-10 items-center flex relative overflow-hidden'>
      {displayImage && (
        <Image 
          src={displayImage} 
          alt={displayTitle || `${pageType} banner`}
          className='absolute object-cover w-full lg:h-full h-screen object-center' 
          fill
          priority
          sizes="100vw"
          quality={85}
        />
      )}
      
      <div className='z-10 px-10 lg:px-8 flex flex-col gap-14  w-full'>
        <div className='flex flex-col gap-6'>
          {displaySubtitle && (
            <p className='lg:text-4xl text-sm font-poppins font-semibold text-white'>
              {displaySubtitle}
            </p>
          )}
          {displayTitle && (
            <p className='font-satisfy lg:text-9xl text-6xl font-normal text-white'>
              {displayTitle}
            </p>
          )}
          {description && (
            <p className='lg:text-lg text-xs font-poppins text-white max-w-2xl'>
              {description}
            </p>
          )}
        </div>
        
        {(pageType === 'courses' || pageType === 'events') ? (
          <button 
            onClick={() => handleEnquiry(pageType)}
            className="w-max shadow-button_shadow lg:py-4 lg:px-12 py-3 px-8 rounded-[100px] text-white font-semibold text-sm lg:text-[20px]"
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </button>
        ) : (
          <Link href={getLinkDestination()}>
            <button 
              className="w-max shadow-button_shadow lg:py-4 lg:px-12 py-3 px-8 rounded-[100px] text-white font-semibold text-sm lg:text-[20px]"
              style={{ backgroundColor: buttonColor }}
            >
              {buttonText}
            </button>
          </Link>
        )}
        
        {onClick && (
          <p 
            onClick={onClick} 
            className='absolute bottom-10 text-white font-poppins font-semibold cursor-pointer left-[50%] translate-x-[-50%] flex items-center gap-2'
          >
            Scroll down <MdKeyboardArrowDown />
          </p>
        )}
      </div>
    </div>
  );
}

export default DynamicBanner;
