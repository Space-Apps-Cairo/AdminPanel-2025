import { Loader } from 'lucide-react';
import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
}

export default function Loading({className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground", className)}>
      <Loader className="animate-spin" size={32} />
   
    </div>
  )
}