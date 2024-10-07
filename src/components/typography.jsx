import { cn } from "@/lib/utils";

export const SpecialText = ({ children, className, ...props }) => {
  return (
    <span
      className={cn(
        "text-[#8300FF] text-[36px] font-poppins font-semibold [line-height:normal] [text-edge:cap] [leading-trim:both]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
