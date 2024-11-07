
import { cn } from "@/lib/utils";
import React from "react";

function frontTemplate() {
  const item = [
    {
      desc: "We would love to be known as a happiness-quotient booster service company! Yes, although it’s too broad a term to rein in to this particular usage, we’d still tend to believe that what we do will only help boost happiness and all the other associated sweetness of emotions wherever we’re playing a part in!",
      link: "./template1.png",
    },
    {
      desc: "We would love to be known as a happiness-quotient booster service company! Yes, although it’s too broad a term to rein in to this particular usage, we’d still tend to believe that what we do will only help boost happiness and all the other associated sweetness of emotions wherever we’re playing a part in!",
      link: "./template2.png",
    },
    {
      desc: "We would love to be known as a happiness-quotient booster service company! Yes, although it’s too broad a term to rein in to this particular usage, we’d still tend to believe that what we do will only help boost happiness and all the other associated sweetness of emotions wherever we’re playing a part in!",
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