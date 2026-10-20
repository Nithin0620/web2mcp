import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./button";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-[#D6D9FC] dark:border-[#312E81] bg-[#D6D9FC]/40 dark:bg-[#312E81]/40 text-[#533AFD] dark:text-[#818CF8]",
        secondary:
          "border-[#E5EDF5] dark:border-[#1E293B] bg-[#F8FAFD] dark:bg-[#1E293B] text-[#50617A] dark:text-[#94A3B8]",
        destructive:
          "border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
        warning:
          "border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
        success:
          "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
        outline:
          "border-[#E5EDF5] dark:border-[#1E293B] bg-white dark:bg-[#111827] text-[#0A2540] dark:text-[#F8FAFC]",
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
