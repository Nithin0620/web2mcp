import * as React from "react";
import { cn } from "./button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[#E5EDF5] bg-white px-3.5 py-2 text-sm text-[#061B31] placeholder:text-[#94A3B8] shadow-[0_1px_2px_rgba(50,50,93,0.04)] transition-all focus-visible:border-[#533AFD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5452FB]/20 disabled:cursor-not-allowed disabled:bg-[#F8FAFD] disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
