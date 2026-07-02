import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800",
        className
      )}
      {...props}
    />
  );
}
