import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <div
      className={cn("aspect-square overflow-hidden text-primary", className)}
      {...props}
    >
      <Loader2 className="h-full w-full animate-spin" />
      <p className="sr-only">Loading</p>
    </div>
  );
}
