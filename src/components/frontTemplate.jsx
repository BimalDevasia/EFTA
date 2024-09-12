
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
    <div className="w-screen">
      {item.map((item, index) => {
        const alignment = index % 2 === 0 ? "second" : "first";
        return (
          <div
            key={index}
            className={cn(
              "flex",
              alignment === "first" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className=" w-1/2 h-screen px-28 flex items-center ">
              <div className="relative">
                <div className="absolute top-0 h-1 bg-primary_color w-1/3 border-solid rounded-full border-primary_color"></div>
                <p className="py-12 text-xl font-normal font-poppins">
                  {item.desc}
                </p>
              </div>
            </div>
            <div
              className={cn(
                "w-1/2 h-screen bg-center bg-cover bg-no-repeat",
                alignment === "first" ? "rounded-r-[50px]" : "rounded-l-[50px]"
              )}
              style={{ backgroundImage: `url(${item.link})` }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}

export default frontTemplate