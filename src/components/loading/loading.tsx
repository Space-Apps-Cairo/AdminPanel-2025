import { Loader, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div
      className={cn(" absolute left-1/2 top-1/2 -translate-1/2 ", className)}
    >
      <LoaderCircle className="animate-spin" size={50} />
    </div>
  );
}

import { Loader, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div
      className={cn(" absolute left-1/2 top-1/2 -translate-1/2 ", className)}
    >
      <LoaderCircle className="animate-spin" size={50} />
    </div>
  );
}
