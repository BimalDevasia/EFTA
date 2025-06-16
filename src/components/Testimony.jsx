"use client"
import { useState,useEffect,useCallback } from "react";
import Image from 'next/image';

const Carousel = () => {
  const contents = [
    { id: 0, name: "John Doe",desc:"As a busy executive, I'm always looking for corporate gift options that are thoughtful, unique, and align with our company's brand. EFTA has been an invaluable partner, helping me source the perfect gifts that impress my clients and strengthen our business relationships. ",link:"/testimony.png" },
    { id: 1, name: "John Doe",desc:"As a busy executive, I'm always looking for corporate gift options that are thoughtful, unique, and align with our company's brand. EFTA has been an invaluable partner, helping me source the perfect gifts that impress my clients and strengthen our business relationships. ",link:"/testimony.png"  },
    { id: 2, name: "John Doe",desc:"As a busy executive, I'm always looking for corporate gift options that are thoughtful, unique, and align with our company's brand. EFTA has been an invaluable partner, helping me source the perfect gifts that impress my clients and strengthen our business relationships. ",link:"/testimony.png"  },
  ];

  const [activeIndex, setActiveIndex] = useState(1); // Start with the center div
  const [isHovered,setIshovered]=useState(false);

  const nextIndex = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % contents.length);
  }, [contents.length]);

  useEffect(() => {
    if(!isHovered){
    const interval = setInterval(nextIndex, 3000); 
    return () => clearInterval(interval);
    }
  }, [isHovered, nextIndex]);




  // Handles dot click and loops through items
  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  // Handles the next movement in the loop
  

  return (
    <div className="flex flex-col items-center mt-10 overflow-hidden py-16">
      <div className="text-shadow-custom-light shadow-text-shadow bg-custom-gradient bg-clip-text text-transparent font-poppins lg:text-8xl text-3xl font-semibold">
        Customer Voice
      </div>
      <div className="relative lg:w-[780px] lg:h-[550px]  w-[380px] h-[250px] flex justify-center items-center"
      onMouseEnter={()=>setIshovered(true)}
      onMouseLeave={()=>setIshovered(false)}
      >
        {contents.map((item, index) => {
          const position =
            (index - activeIndex + contents.length) % contents.length; // Calculate position in the loop

          return (
            <div
            
              key={item.id}
              className={`absolute flex flex-col px-5 justify-center w-full h-full transition-transform duration-700 ease-in-out rounded-lg text-white font-poppins  ${
                position === 0
                  ? "z-20 scale-100  opacity-100"
                  : position === 1
                  ? "z-10 scale-90  translate-x-full opacity-50"
                  : "z-10 scale-90  -translate-x-full opacity-50"
              }`}
            >
              <div className="text-black lg:text-2xl text-lg py-3 flex justify-between">
                <div className="flex gap-5 items-center">
                  <Image 
                    src={item.link} 
                    alt={item.name} 
                    width={70} 
                    height={70} 
                    className="rounded-full lg:h-[70px] lg:w-[70px] h-[20px] w-[20px] object-cover object-center"
                  />
                  {item.name}
                </div>
                <div className="font-instrumentsans lg:text-[190px] text-[50px] rotate-180 max-h-[0px] text-primary_color ">
                  {/*for comma*/}
                  “
                </div>
                </div>

              <div className="font-normal relative text-[#5B5B5B] lg:text-3xl text-sm py-5">{item.desc}
              <div className="absolute inset-0 border-solid  border-primary_color border-t-[4px] h-0 rounded-full w-1/5 "></div>
              </div>  
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-4">
        
        <div className="flex gap-4">
          {contents.map((_, index) => (
            <button
              key={index}
              className={`lg:w-4 lg:h-4 w-2 h-2 rounded-full transition-colors duration-300 ${
                index === activeIndex ? "bg-primary_color" : "bg-gray-400"
              }`}
              onClick={() => handleDotClick(index)}
            ></button>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Carousel;
