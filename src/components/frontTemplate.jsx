
import { cn } from "@/lib/utils";
import React from "react";

function frontTemplate() {
  const item = [
    {
      desc: "EFTA offers a wide range of gift options to suit every occasion and preference. From our signature line of unique, non-customized products crafted by our talented artisan community, to our custom gift services that allow you to personalize items with your own designs and messages, there's something for everyone.  Each EFTA gift comes with the guarantee of quality craftsmanship and the stories behind the makers who poured their passion into creating it.",
      link: "./template1.png",
    },
    {
      desc: "EFTA also provides comprehensive event management services for businesses of all sizes. From sourcing the perfect corporate gifts that align with your brand to planning and executing unforgettable company parties, conferences, and team-building activities, our event experts are equipped to handle every detail. We understand the importance of making a lasting impression, which is why we work closely with you to bring your vision to life while ensuring a seamless, stress-free experience for you and your guests.",
      link: "./template2.png",
    },
    {
      desc: "Fueling the creative spirit is at the heart of what we do at EFTA. We offer a diverse range of educational classes and workshops led by our talented artisan instructors. Whether you're an aspiring painter, budding ceramicist, or simply looking to explore a new hobby, our courses provide a nurturing environment for individuals of all skill levels to unlock their inner artist. From beginner-friendly introductions to advanced techniques, our curriculum is designed to inspire, educate, and empower the next generation of makers.",
      link: "./template3.png",
    },
  ];

  return (
    <div className="w-screen lg:flex-none flex flex-col gap-16  ">
      {item.map((item, index) => {
        const alignment = index % 2 === 0 ? "second" : "first";
        return (
          <div
            key={index}
            className={cn(
              "flex",
              alignment === "first" ? "lg:flex-row-reverse flex-col lg:gap-0 gap-5 " : "lg:flex-row flex-col lg:gap-0 gap-5"
            )}
          >
            <div className=" lg:w-1/2 lg:h-screen w-screen   lg:px-28 px-10 flex items-center ">
              <div className="relative">
                <div className={cn("absolute top-0 h-1 bg-primary_color w-1/3 border-solid rounded-full border-primary_color",alignment === "second" ?"left-0":"right-0")}></div>
                <p className="py-12 lg:text-xl text-xs font-normal font-poppins">
                  {item.desc}
                </p>
              </div>
            </div>

            <div className="lg:flex-none flex justify-center lg:w-1/2  lg:h-screen">
            <div
              className={cn(
                "lg:w-full  w-[90%] lg:h-screen h-[380px]  bg-center bg-cover bg-no-repeat",
                alignment === "first" ? "lg:rounded-r-[50px]" : "lg;rounded-l-[50px]"
              )}
              style={{ backgroundImage: `url(${item.link})` }}
            ></div>
            </div>
           
          </div>
        );
      })}
    </div>
  );
}

export default frontTemplate