import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5452FB]/40 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#533AFD] text-white hover:bg-[#5452FB] active:bg-[#4032C8] shadow-[0_2px_4px_rgba(50,50,93,0.12),0_1px_2px_rgba(0,0,0,0.08)]",
        destructive:
          "bg-[#DF1B41] text-white hover:bg-[#C91336] shadow-sm",
        outline:
          "border border-[#E5EDF5] bg-white text-[#0A2540] hover:bg-[#F8FAFD] hover:border-[#CFD8E3] active:bg-[#EEF2F6] shadow-[0_1px_2px_rgba(50,50,93,0.05)]",
        secondary:
          "bg-[#F8FAFD] text-[#0A2540] hover:bg-[#EEF2F6] border border-[#E5EDF5]",
        ghost:
          "text-[#3C4F69] hover:text-[#0A2540] hover:bg-[#F8FAFD]",
        link:
          "text-[#533AFD] underline-offset-4 hover:underline hover:text-[#5452FB]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded px-3 text-xs",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants, cn };
