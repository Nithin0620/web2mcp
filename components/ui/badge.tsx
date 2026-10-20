import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./button";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-[#D6D9FC] bg-[#D6D9FC]/40 text-[#533AFD]",
        secondary:
          "border-[#E5EDF5] bg-[#F8FAFD] text-[#50617A]",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-700",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        outline:
          "border-[#E5EDF5] bg-white text-[#0A2540]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
