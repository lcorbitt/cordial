import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-5",
  md: "size-8",
} as const;

type SpinnerSize = keyof typeof sizeClasses;

interface SpinnerProps extends Omit<ComponentProps<typeof Loader2>, "size"> {
  size?: SpinnerSize;
}

/**
 * Accessible loading spinner. Use inside a `role="status"` container when the
 * spinner is the sole loading indicator on screen.
 */
export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <Loader2
      aria-hidden
      className={cn("text-primary animate-spin", sizeClasses[size], className)}
      {...props}
    />
  );
}
