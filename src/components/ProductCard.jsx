import React from 'react';

const ProductCard = ({ 
  image = "https://placehold.co/299x289", 
  title = "Coffee Mug", 
  subtitle = "Photo Printed Mug", 
  price = "249", 
  originalPrice = "349",
  isCustom = true 
}) => {
  return (
    <div className="w-80 h-96 relative bg-white rounded-2xl shadow-[2.9883060455322266px_5.2295355796813965px_33.61844253540039px_-4.48245906829834px_rgba(0,0,0,0.16)] overflow-hidden">
      <div className="w-72 left-[17px] top-[16px] absolute inline-flex flex-col justify-start items-start gap-2.5">
        <div className="self-stretch h-72 relative">
          <img 
            className="w-72 h-72 left-0 top-0 absolute rounded-xl object-cover" 
            src={image} 
            alt={title}
          />
          {isCustom && (
            <div className="w-16 h-6 left-[12px] top-[12px] absolute bg-fuchsia-600 rounded-md flex items-center justify-center">
              <div className="text-white text-xs font-bold font-['Poppins'] tracking-wide">
                CUSTOM
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-1">
          <div className="self-stretch text-black text-lg font-medium font-['Poppins'] tracking-wide">
            {title}
          </div>
          <div className="self-stretch text-zinc-600 text-sm font-normal font-['Poppins'] tracking-wide">
            {subtitle}
          </div>
          <div className="inline-flex justify-start items-center gap-3 mt-1">
            <div className="text-black text-base font-semibold font-['Poppins'] tracking-wide">
              Rs {price}
            </div>
            {originalPrice && (
              <div className="text-zinc-600 text-sm font-normal font-['Poppins'] line-through tracking-wide">
                Rs {originalPrice}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
