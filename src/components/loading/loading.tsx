import { Loader } from 'lucide-react';
import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
}

export default function Loading({className }: LoadingProps) {
  return (
    <div className={cn("flex items-center justify-center h-60 text-muted-foreground", className)}>
      <Loader className="animate-spin" size={32} />
    </div>
  )
}