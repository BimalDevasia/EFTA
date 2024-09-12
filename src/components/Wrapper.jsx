import { cn } from "@/lib/utils";
import React from "react";

const Wrapper = ({ className, children }) => {
  return (
    <div className={cn("w-full max-w-[1255px] mx-auto", className)}>
      {children}
    </div>
  );
};

export default Wrapper;
