import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 32 }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center">
      <Loader2
        className={cn("animate-spin text-primary", className)}
        size={size}
        aria-label="Loading..."
      />
    </div>
  );
}
